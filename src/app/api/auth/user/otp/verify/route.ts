import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/security/otp';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { setUserSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const schema = z.object({
  identifier: z.string().min(5),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limit verification attempts
    const rateCheck = checkRateLimit(`otp_verify_${ip}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many verification attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parse = schema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors[0].message }, { status: 400 });
    }

    const { identifier, otp } = parse.data;
    const normalizedId = identifier.trim().toLowerCase();

    const result = await verifyOTP(normalizedId, otp);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Find or create User in Database
    let user = await prisma.user.findUnique({
      where: { identifier: normalizedId },
    });

    if (!user) {
      const isEmail = normalizedId.includes('@');
      user = await prisma.user.create({
        data: {
          identifier: normalizedId,
          email: isEmail ? normalizedId : null,
          phone: !isEmail ? normalizedId : null,
        },
      });
    }

    // Set User JWT Session Cookie
    await setUserSession({
      userId: user.id,
      identifier: user.identifier,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        identifier: user.identifier,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('OTP Verify Error:', err);
    return NextResponse.json({ error: 'Failed to verify OTP. Please try again.' }, { status: 500 });
  }
}
