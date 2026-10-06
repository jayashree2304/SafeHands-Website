import { NextResponse } from 'next/server';
import { clearAdminSession, getAdminSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';

export async function POST() {
  const session = await getAdminSession();
  if (session) {
    try {
      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: 'LOGOUT',
          targetType: 'Admin',
          details: 'Admin logged out',
        },
      });
    } catch (_) {}
  }
  await clearAdminSession();
  return NextResponse.json({ success: true, message: 'Admin logged out successfully.' });
}

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (session) {
    try {
      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: 'LOGOUT',
          targetType: 'Admin',
          details: 'Admin logged out',
        },
      });
    } catch (_) {}
  }
  await clearAdminSession();
  return NextResponse.redirect(new URL('/admin/login', req.url));
}
