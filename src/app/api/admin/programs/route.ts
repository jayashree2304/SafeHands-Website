import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const programs = await prisma.program.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, programs });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, category, imageUrl } = await req.json();

  const program = await prisma.program.create({
    data: {
      title,
      description,
      category,
      imageUrl: imageUrl || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.adminId,
      action: 'CREATE_PROGRAM',
      targetType: 'Program',
      targetId: program.id,
      details: `Created program: ${title}`,
    },
  });

  return NextResponse.json({ success: true, program });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, description, category, imageUrl } = await req.json();

  const program = await prisma.program.update({
    where: { id },
    data: {
      title,
      description,
      category,
      imageUrl,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.adminId,
      action: 'UPDATE_PROGRAM',
      targetType: 'Program',
      targetId: id,
      details: `Updated program: ${title}`,
    },
  });

  return NextResponse.json({ success: true, program });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.program.update({
    where: { id },
    data: { isDeleted: true },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.adminId,
      action: 'DELETE_PROGRAM',
      targetType: 'Program',
      targetId: id,
      details: `Soft deleted program ID: ${id}`,
    },
  });

  return NextResponse.json({ success: true, message: 'Program deleted' });
}
