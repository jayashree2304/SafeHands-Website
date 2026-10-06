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
    const eventId = searchParams.get('eventId');
    const exportEnrolments = searchParams.get('exportEnrolments') === 'true';

    if (eventId && exportEnrolments) {
      const enrolments = (await prisma.eventEnrolment.findMany({
        where: { eventId },
        include: { event: true },
      })) || [];

      let csv = 'EnrolmentID,EventTitle,Name,Email,Phone,Status,EnrolledAt\n';
      enrolments.forEach((e: any) => {
        csv += `"${e.id}","${e.event?.title || ''}","${e.name}","${e.email}","${e.phone}","${e.status}","${e.createdAt ? new Date(e.createdAt).toISOString() : ''}"\n`;
      });

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="event_enrolments_${eventId}.csv"`,
        },
      });
    }

    const events = (await prisma.event.findMany({
      where: { isDeleted: false },
      include: {
        enrolments: true,
        _count: { select: { enrolments: true } },
      },
      orderBy: { date: 'desc' },
    })) || [];

    return NextResponse.json({ success: true, events });
  } catch (_) {
    return NextResponse.json({ success: true, events: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, date, venue, category, capacity, imageUrl, status } = body;

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        venue,
        category: category || 'Community',
        capacity: capacity ? parseInt(capacity) : 100,
        imageUrl: imageUrl || null,
        status: status || 'UPCOMING',
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: 'CREATE_EVENT',
          targetType: 'Event',
          targetId: newEvent?.id || 'evt_id',
          details: `Created event: ${title}`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, event: newEvent });
  } catch (err) {
    console.error('Admin events POST Error:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, date, venue, category, capacity, imageUrl, status } = body;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        venue,
        category,
        capacity: capacity ? parseInt(capacity) : 100,
        imageUrl,
        status,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: 'UPDATE_EVENT',
          targetType: 'Event',
          targetId: id,
          details: `Updated event: ${title}`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
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

    await prisma.event.update({
      where: { id },
      data: { isDeleted: true },
    });

    try {
      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: 'DELETE_EVENT',
          targetType: 'Event',
          targetId: id,
          details: `Soft deleted event ID: ${id}`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
