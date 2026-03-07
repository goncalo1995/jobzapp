// app/api/me/parse/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { parseCareerBio } from '@/lib/ai-parsing';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // const betaUsers = process.env.BETA_USERS?.split(",");
    // if (!betaUsers?.includes(user.email)) {
    //   return NextResponse.json({ error: 'Currently only available for beta users' }, { status: 401 });
    // }

    const { rawBio, customApiKey } = await request.json();

    if (!rawBio) {
      return NextResponse.json({ error: 'Missing bio content' }, { status: 400 });
    }

    const expectedCost = 2; // Fixed cost for claude-3-5-sonnet
    const isByok = !!customApiKey;

    // Secure decrement: atomic check and deduction BEFORE AI call (SKIP if BYOK)
    if (!isByok) {
      console.log('[AI Parse] Deducting AI credits for user:', user.id);
      const { data: success, error: deductError } = await supabase.rpc('deduct_ai_credits' as any, {
        target_user_id: user.id,
        amount: expectedCost
      });

      console.log('[AI Parse] Deduct AI credits result:', { success, deductError });

      if (deductError || !success) {
        console.warn('[AI Parse] Insufficient credits or deduct error:', deductError);
        return NextResponse.json({ error: `Not enough AI Credits. This action requires ${expectedCost} credits.` }, { status: 402 });
      }
    }

    try {
      const parsedData = await parseCareerBio(rawBio, user.id, customApiKey);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          parsed_data: parsedData as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      return NextResponse.json({ success: true, parsedData });
    } catch (aiError: any) {
      console.error('[AI Parse] Error processing or refining data, refunding credits:', aiError);
      
      // Refund credits using service role since user cannot call increment_ai_credits
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      await supabaseAdmin.rpc('increment_ai_credits' as any, {
        user_id: user.id,
        amount: expectedCost
      });
      
      throw aiError;
    }

  } catch (err: any) {
    console.error('[AI Parse] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
