import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, certificates: certificates || [] });
  } catch (_) {
    return NextResponse.json({ success: true, certificates: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, category, issuingBody, year, imageUrl, pdfUrl } = await req.json();

    const cert = await prisma.certificate.create({
      data: {
        name,
        category,
        issuingBody: issuingBody || null,
        year: year || null,
        imageUrl: imageUrl || null,
        pdfUrl: pdfUrl || null,
      },
    });

    return NextResponse.json({ success: true, certificate: cert });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
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

    await prisma.certificate.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true, message: 'Certificate deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
