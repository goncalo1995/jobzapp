import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
// import crypto from 'crypto';

// Use service role client to bypass RLS and allow inserting without being authenticated
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // TODO: protect against bots or temporarily emails
    // const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    // const userAgent = request.headers.get('user-agent') || 'unknown';
    // const salt = process.env.JWT_SECRET || 'jobzapp-salt';
    // const hashInput = `${ip}-${userAgent}-${salt}`;
    // const ipHash = crypto.createHash('sha256').update(hashInput).digest('hex');

    // Attempt to insert into waitlist
    const { error } = await supabaseAdmin
      .from('waitlist')
      .insert({
        email,
        tier: 'elite'
      });

    if (error) {
      // Handle unique constraint violation gracefully
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: "You're already on the waitlist!" });
      }
      console.error('[Waitlist] Insert error:', error);
      return NextResponse.json({ error: 'Failed to join waitlist. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Successfully joined the waitlist!" });
    
  } catch (err: any) {
    console.error('[Waitlist] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
