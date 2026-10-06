import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const schema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().min(7, 'Invalid phone number'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Login required. Please login using OTP to enroll in this event.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parse = schema.safeParse(body);
    if (!parse.success) {
      const errorMessage = parse.error.errors.map((e) => e.message).join('. ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { eventId, name, email, phone } = parse.data;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { enrolments: true } } },
    });

    if (!event || event.isDeleted) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event._count.enrolments >= event.capacity) {
      return NextResponse.json({ error: 'This event has reached full capacity.' }, { status: 400 });
    }

    // Check existing enrolment
    const existing = await prisma.eventEnrolment.findFirst({
      where: { eventId, userId: session.userId },
    });

    if (existing) {
      return NextResponse.json({ error: 'You are already enrolled in this event.' }, { status: 400 });
    }

    const enrolment = await prisma.eventEnrolment.create({
      data: {
        eventId,
        userId: session.userId,
        name,
        email,
        phone,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Event enrolment confirmed!',
      enrolment,
    });
  } catch (err) {
    console.error('Event Enrollment Error:', err);
    return NextResponse.json({ error: 'Failed to complete event enrolment.' }, { status: 500 });
  }
}
