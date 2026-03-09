import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminSupabase } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { referrerId } = await request.json();

    if (!referrerId) {
      return NextResponse.json({ error: 'Missing referrer ID' }, { status: 400 });
    }

    // Basic Bot/Abuse Protection: Hash the IP + User Agent
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // We use a salt to prevent easy rainbow table attacks on the IP hash
    const salt = process.env.JWT_SECRET || 'jobzapp-salt'; 
    const hashInput = `${ip}-${userAgent}-${salt}`;
    const ipHash = crypto.createHash('sha256').update(hashInput).digest('hex');

    // Reward amount
    const rewardCredits = 5;

    // Call the secure RPC function to process the referral
    const { data, error } = await adminSupabase.rpc('process_referral', {
      p_referrer_id: referrerId,
      p_ip_hash: ipHash,
      p_reward_amount: rewardCredits
    });

    if (error) {
      console.error('[Referral] RPC error:', error);
      return NextResponse.json({ error: 'Failed to process referral' }, { status: 500 });
    }

    const result = data as { success: boolean; message: string };
    console.log('[Referral] Result:', result);
    if (!result.success) {
      // e.g., IP already used
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message, credits: rewardCredits });
    
  } catch (err: any) {
    console.error('[Referral] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
