import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        enrolments: { include: { event: true } },
        volunteers: true,
        donations: true,
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
