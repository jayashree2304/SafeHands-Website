import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, reports: reports || [] });
  } catch (_) {
    return NextResponse.json({ success: true, reports: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, year, category, pdfUrl, fileSize } = await req.json();

    const report = await prisma.report.create({
      data: {
        title,
        year,
        category: category || 'Annual',
        pdfUrl,
        fileSize: fileSize || null,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: 'CREATE_REPORT',
          targetType: 'Report',
          targetId: report.id,
          details: `Added report: ${title}`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, report });
  } catch (err) {
    console.error('Reports POST API Error:', err);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.report.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
