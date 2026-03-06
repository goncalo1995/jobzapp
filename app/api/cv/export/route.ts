// app/api/cv/export/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCVPDF } from '@/lib/pdf-generator';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cvId, styleConfig } = await request.json();

    if (!cvId) {
      return NextResponse.json({ error: 'Missing CV ID' }, { status: 400 });
    }

    const { data: cv, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', cvId)
      .eq('user_id', user.id)
      .single();

    if (error || !cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    let cvData: any;
    try {
      cvData = JSON.parse(cv.content || '{}');
      // Ensure basic fields if missing
      if (!cvData.full_name) cvData.full_name = cv.name;
      if (!cvData.current_role) cvData.current_role = cv.target_role;
    } catch (e) {
      // Fallback for legacy plain text CVs
      cvData = { 
        full_name: cv.name, 
        current_role: cv.target_role, 
        summary: cv.content 
      };
    }

    const pdfBuffer = await generateCVPDF(cvData, styleConfig);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cv.name.replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error('[CV Export] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
