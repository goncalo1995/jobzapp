// app/api/me/parse/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseCareerBio } from '@/lib/ai-parsing';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rawBio } = await request.json();

    if (!rawBio) {
      return NextResponse.json({ error: 'Missing bio content' }, { status: 400 });
    }

    const parsedData = await parseCareerBio(rawBio, user.id);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        parsed_data: parsedData as any,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true, parsedData });
  } catch (err: any) {
    console.error('[AI Parse] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
