import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { validateHoneypot } from '@/lib/security/captcha';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().optional().nullable(),
  subject: z.string().trim().min(3, 'Subject is required'),
  message: z.string().trim().min(5, 'Message must be at least 5 characters'),
  honeypot: z.string().optional().nullable(),
  consent: z.boolean().refine((v) => v === true, 'Consent is required'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const rateCheck = checkRateLimit(`contact_${ip}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many contact submissions. Please wait a minute and try again.' }, { status: 429 });
    }

    const body = await req.json();
    if (!validateHoneypot(body.honeypot)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const parse = schema.safeParse(body);
    if (!parse.success) {
      const errorMessage = parse.error.errors.map((e) => e.message).join('. ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: parse.data.name,
        email: parse.data.email,
        phone: parse.data.phone || null,
        subject: parse.data.subject,
        message: parse.data.message,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! We have received your message and will respond promptly.',
      contactId: contact.id,
    });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}
