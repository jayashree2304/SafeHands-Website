import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = (await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })) || [];

    return NextResponse.json({ success: true, messages });
  } catch (_) {
    return NextResponse.json({ success: true, messages: [] });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 });
  }
}
