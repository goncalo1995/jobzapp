import { NextResponse } from 'next/server';
import { checkInterviewLimit } from '@/lib/tier-limits';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const limits = await checkInterviewLimit();
    return NextResponse.json(limits);
  } catch (error) {
    console.error("Error in limits API:", error);
    return NextResponse.json({ error: "Failed to fetch limits" }, { status: 500 });
  }
}
