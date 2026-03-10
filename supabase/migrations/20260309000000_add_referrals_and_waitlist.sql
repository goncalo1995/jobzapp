-- Waitlist Table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'elite',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow insert from anywhere (public endpoint)
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
FOR INSERT WITH CHECK (true);

-- Allow admins to read (requires a separate admin policy or service role)

-- Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_ip_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed', -- Can be expanded later for 'pending' -> 'converted' status
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent the same IP from being referred by the same person multiple times
  -- Or even better, prevent the same IP from generating rewards more than once across the platform:
  CONSTRAINT unique_referred_ip UNIQUE (referred_ip_hash)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can see their own successful referrals
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referrals;
CREATE POLICY "Users can view their own referrals" ON public.referrals
FOR SELECT USING (auth.uid() = referrer_id);


-- Function to grant referral credit securely
-- This avoids needing to expose INSERTS to public.referrals
CREATE OR REPLACE FUNCTION process_referral(
  p_referrer_id UUID,
  p_ip_hash TEXT,
  p_reward_amount INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_inserted boolean;
  v_result JSON;
BEGIN
  -- Attempt to insert the referral record
  -- If p_ip_hash already exists, it will throw a unique constraint violation and fail
  -- Let's catch it manually to return a nice message,, or just rely on ON CONFLICT
  
  INSERT INTO public.referrals (referrer_id, referred_ip_hash, status)
  VALUES (p_referrer_id, p_ip_hash, 'completed')
  ON CONFLICT (referred_ip_hash) DO NOTHING;
  
  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  
  IF v_inserted THEN
    -- Reward the referrer
    UPDATE public.user_profiles
    SET ai_credits = ai_credits + p_reward_amount
    WHERE id = p_referrer_id;
    
    v_result := json_build_object('success', true, 'message', 'Referral processed successfully.');
  ELSE
    v_result := json_build_object('success', false, 'message', 'This IP has already been used for a referral.');
  END IF;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- We don't grant execute to public because we want this called through an API route 
-- using the service role to ensure the IP hash is generated server-side.
REVOKE EXECUTE ON FUNCTION process_referral(UUID, TEXT, INTEGER) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION process_referral(UUID, TEXT, INTEGER) FROM authenticated;
GRANT EXECUTE ON FUNCTION process_referral(UUID, TEXT, INTEGER) TO service_role;
