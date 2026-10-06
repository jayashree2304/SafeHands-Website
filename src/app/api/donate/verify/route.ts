import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import crypto from 'crypto';
import { z } from 'zod';

const schema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().optional(),
  signature: z.string().optional(),
  mockSuccess: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = schema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors[0].message }, { status: 400 });
    }

    const { orderId, paymentId, signature, mockSuccess } = parse.data;

    const donation = await prisma.donation.findUnique({
      where: { orderId },
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation order record not found.' }, { status: 404 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mockSecretKey67890';

    // Verify signature if signature and paymentId are provided
    let isValid = false;

    if (signature && paymentId) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      isValid = generatedSignature === signature;
    } else if (mockSuccess || process.env.NODE_ENV === 'development') {
      // Allow fallback verification for test mode / mock checkout
      isValid = true;
    }

    if (!isValid) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json({ error: 'Invalid payment signature verification failed.' }, { status: 400 });
    }

    // Update status to SUCCESS
    const updatedDonation = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: 'SUCCESS',
        paymentId: paymentId || `pay_mock_${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Donation completed successfully! Thank you for supporting Safe Hands NGO.',
      donation: updatedDonation,
    });
  } catch (err) {
    console.error('Donate Verification Error:', err);
    return NextResponse.json({ error: 'Failed to verify payment signature.' }, { status: 500 });
  }
}
