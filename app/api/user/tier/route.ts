import { NextResponse } from 'next/server';
import { getUserTier } from '@/lib/tier-limits';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tierInfo = await getUserTier();
    return NextResponse.json(tierInfo);
  } catch (error) {
    console.error("Error in tier API:", error);
    return NextResponse.json({ tier: "free", current_period_end: null }, { status: 500 });
  }
}
