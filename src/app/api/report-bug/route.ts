
import { reportBug } from '@/ai/flows/report-bug-flow';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const result = await reportBug(input);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
