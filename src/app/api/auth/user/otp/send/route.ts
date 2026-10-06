import { NextRequest, NextResponse } from 'next/server';
import { generateAndSendOTP } from '@/lib/security/otp';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { z } from 'zod';

const schema = z.object({
  identifier: z.string().min(5, 'Invalid phone number or email address'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate limit per IP
    const rateCheck = checkRateLimit(`otp_send_${ip}`, 5, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many OTP requests. Please wait ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parse = schema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors[0].message }, { status: 400 });
    }

    const result = await generateAndSendOTP(parse.data.identifier, ip);
    if (!result.success) {
      return NextResponse.json({ error: result.message, cooldownSeconds: result.cooldownSeconds }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      cooldownSeconds: result.cooldownSeconds,
      devOtp: result.devOtp, // Returned only in development
    });
  } catch (err) {
    console.error('OTP Send Error:', err);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again later.' }, { status: 500 });
  }
}
