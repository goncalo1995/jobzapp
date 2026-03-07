-- API Usage Tracking Table
CREATE TABLE IF NOT EXISTS public.api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  roast_id UUID, -- For backward compatibility or extra context
  
  platform TEXT NOT NULL, -- e.g., 'openrouter', 'openai', 'anthropic'
  model TEXT NOT NULL,    -- e.g., 'anthropic/claude-3.5-sonnet'
  
  tokens_input INT DEFAULT 0,
  tokens_output INT DEFAULT 0,
  cost_estimate NUMERIC(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API usage"
ON public.api_usage FOR SELECT
USING (auth.uid() = user_id);

GRANT SELECT ON public.api_usage TO authenticated;


-- Add ai_credits column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 0;

-- Create a function to safely increment AI credits
CREATE OR REPLACE FUNCTION increment_ai_credits(user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET ai_credits = COALESCE(ai_credits, 0) + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a table for tracking processed checkouts safely.
CREATE TABLE IF NOT EXISTS public.processed_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for the processed checkouts table (Optional, but safe)
ALTER TABLE public.processed_checkouts ENABLE ROW LEVEL SECURITY;

-- Allow read for users on their own processed checkouts (optional)
CREATE POLICY "Users can view their own checkouts"
ON public.processed_checkouts FOR SELECT
USING (auth.uid() = user_id);

-- Restrict `increment_ai_credits` to service_role ONLY to stop authenticated exploitation.
REVOKE EXECUTE ON FUNCTION public.increment_ai_credits(UUID, INTEGER) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_ai_credits(UUID, INTEGER) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.increment_ai_credits(UUID, INTEGER) TO service_role;

-- 1. Add a constraint to the profile table itself
ALTER TABLE public.user_profiles 
ALTER COLUMN ai_credits SET DEFAULT 0;

ALTER TABLE public.user_profiles 
ALTER COLUMN ai_credits SET NOT NULL;

ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS ai_credits_non_negative;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT ai_credits_non_negative CHECK (ai_credits >= 0);

-- 2. Secure Credit Deduction with Search Path
CREATE OR REPLACE FUNCTION public.deduct_ai_credits(target_user_id UUID, amount INTEGER)
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate amount
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Verify ownership
  IF auth.uid() IS NOT NULL AND auth.uid() <> target_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.user_profiles
  SET ai_credits = ai_credits - amount
  WHERE id = target_user_id AND ai_credits >= amount;

  RETURN FOUND; -- Returns true if a row was actually updated
END;
$$;

-- Grant execute permissions to public/authenticated so backend can call it with user token, or frontend directly
GRANT EXECUTE ON FUNCTION public.deduct_ai_credits(UUID, INTEGER) TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.deduct_ai_credits(UUID, INTEGER) TO authenticated;

-- 3. Atomic Webhook Handler (The "Missing Link")
-- Call this from your Stripe/LemonSqueezy webhook via service_role
CREATE OR REPLACE FUNCTION public.handle_successful_checkout(
  _checkout_id VARCHAR,
  _user_id UUID,
  _credit_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted boolean;
BEGIN
  -- This insert will fail if checkout_id already exists (Idempotency) but ignore the conflict to return success gracefully on webhooks retry
  INSERT INTO public.processed_checkouts (checkout_id, user_id, amount)
  VALUES (_checkout_id, _user_id, _credit_amount)
  ON CONFLICT (checkout_id) DO NOTHING;

  GET DIAGNOSTICS inserted = ROW_COUNT;

  -- If the above didn't error, and a row was ACTUALLY inserted, increment the credits
  IF inserted THEN
    UPDATE public.user_profiles
    SET ai_credits = ai_credits + _credit_amount
    WHERE id = _user_id;
  END IF;

END;
$$;

-- 4. Pro-Tip: Audit Logs
CREATE TABLE IF NOT EXISTS public.ai_credit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_credit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credit logs"
ON public.ai_credit_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.log_ai_credit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.ai_credits <> NEW.ai_credits THEN
    INSERT INTO public.ai_credit_logs (user_id, amount, action_type)
    VALUES (
      NEW.id,
      NEW.ai_credits - OLD.ai_credits,
      CASE WHEN NEW.ai_credits > OLD.ai_credits THEN 'increment' ELSE 'deduct' END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ai_credits_audit_trigger ON public.user_profiles;

CREATE TRIGGER ai_credits_audit_trigger
AFTER UPDATE OF ai_credits ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.log_ai_credit_changes();

-- Grant permissions to read logs
GRANT SELECT ON public.ai_credit_logs TO authenticated;