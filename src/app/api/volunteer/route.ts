import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserSession } from '@/lib/security/jwt';
import { validateHoneypot } from '@/lib/security/captcha';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required (at least 2 characters)'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().min(7, 'Valid mobile number required'),
  age: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined || Number.isNaN(Number(val))) return undefined;
      return Number(val);
    },
    z.number().min(16, 'Age must be at least 16 years').max(90, 'Age must be 90 or below').optional()
  ),
  occupation: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  motivation: z.string().trim().min(5, 'Please share your motivation for volunteering (at least 5 characters)'),
  availability: z.string().optional().nullable(),
  honeypot: z.string().optional().nullable(),
  consent: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const rateCheck = checkRateLimit(`volunteer_${ip}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    if (!validateHoneypot(body.honeypot)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const parse = schema.safeParse(body);
    if (!parse.success) {
      const errorMessage = parse.error.errors.map((e) => e.message).join('. ');
      console.warn('Volunteer API Validation Warning:', parse.error.format());
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const session = await getUserSession();

    const volunteer = await prisma.volunteer.create({
      data: {
        name: parse.data.name,
        email: parse.data.email,
        phone: parse.data.phone,
        age: parse.data.age || null,
        occupation: parse.data.occupation || null,
        address: parse.data.address || null,
        skills: parse.data.skills || null,
        motivation: parse.data.motivation,
        availability: parse.data.availability || null,
        userId: session?.userId || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for applying to volunteer! Our team will contact you shortly.',
      volunteerId: volunteer.id,
    });
  } catch (err) {
    console.error('Volunteer API Error:', err);
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 });
  }
}
