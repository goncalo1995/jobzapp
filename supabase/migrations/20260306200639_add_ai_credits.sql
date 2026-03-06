-- Add ai_credits column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 0;
