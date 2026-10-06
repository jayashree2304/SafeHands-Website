import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { isDeleted: false },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json({ success: true, events });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
