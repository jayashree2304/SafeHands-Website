import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const exportCsv = searchParams.get('export') === 'true';

    const whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { skills: { contains: search } },
      ];
    }

    const volunteers = (await prisma.volunteer.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })) || [];

    if (exportCsv) {
      let csv = 'ID,Name,Email,Phone,Age,Occupation,Skills,Status,SubmittedAt\n';
      volunteers.forEach((v: any) => {
        csv += `"${v.id}","${v.name}","${v.email}","${v.phone}","${v.age || ''}","${v.occupation || ''}","${v.skills || ''}","${v.status}","${v.createdAt ? new Date(v.createdAt).toISOString() : ''}"\n`;
      });

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="volunteers_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, volunteers });
  } catch (_) {
    return NextResponse.json({ success: true, volunteers: [] });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await prisma.volunteer.update({
      where: { id },
      data: { status },
    });

    try {
      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: 'UPDATE_VOLUNTEER_STATUS',
          targetType: 'Volunteer',
          targetId: id,
          details: `Changed status to ${status}`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, volunteer: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update volunteer status' }, { status: 500 });
  }
}
