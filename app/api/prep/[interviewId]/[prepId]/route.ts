import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ interviewId: string; prepId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const awaitedParams = await params;
    const { interviewId, prepId } = awaitedParams;

    if (!interviewId || !prepId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fetch existing interview
    const { data: interviewData, error: fetchError } = await supabase
      .from('interviews')
      .select('ai_prep_data, job_applications!inner(user_id)')
      .eq('id', interviewId)
      .eq('job_applications.user_id', user.id)
      .maybeSingle();

    if (fetchError || !interviewData) {
      return NextResponse.json({ error: 'Interview not found or unauthorized' }, { status: 404 });
    }

    const currentPrepData: any[] = Array.isArray(interviewData.ai_prep_data) 
      ? interviewData.ai_prep_data 
      : [];

    // Filter out the specific prepId
    const newPrepData = currentPrepData.filter((prep) => prep.id !== prepId);

    // If the length didn't change, the ID wasn't found
    if (newPrepData.length === currentPrepData.length) {
      return NextResponse.json({ error: 'Preparation not found' }, { status: 404 });
    }

    // Update the database
    const { error: updateError } = await supabase
      .from('interviews')
      .update({ ai_prep_data: newPrepData })
      .eq('id', interviewId);

    if (updateError) {
      console.error('[AI Interview Prep] Error deleting preparation:', updateError);
      return NextResponse.json({ error: 'Failed to delete preparation' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Preparation deleted successfully' });
  } catch (error: any) {
    console.error('[AI Interview Prep] Delete error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
