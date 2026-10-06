import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserSession } from '@/lib/security/jwt';
import { z } from 'zod';
import crypto from 'crypto';

const schema = z.object({
  amount: z.number().min(10, 'Minimum donation amount is ₹10'),
  donorName: z.string().min(2, 'Name is required'),
  donorEmail: z.string().email('Valid email required'),
  donorPhone: z.string().min(10, 'Valid mobile number required'),
  panNumber: z.string().optional(),
  address: z.string().optional(),
  taxReceiptRequested: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = schema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.errors[0].message }, { status: 400 });
    }

    const { amount, donorName, donorEmail, donorPhone, panNumber, address, taxReceiptRequested } = parse.data;

    const session = await getUserSession();

    // Create unique internal order ID
    const orderId = `ORDER_SH_${Date.now()}_${crypto.randomInt(1000, 9999)}`;
    const receiptNo = `SH-80G-${new Date().getFullYear()}-${crypto.randomInt(10000, 99999)}`;

    // Create donation record in Database with PENDING status
    const donation = await prisma.donation.create({
      data: {
        orderId,
        amount,
        currency: 'INR',
        donorName,
        donorEmail,
        donorPhone,
        panNumber: panNumber ? panNumber.toUpperCase() : null,
        address: address || null,
        taxReceiptRequested,
        status: 'PENDING',
        receiptNo,
        userId: session?.userId || null,
      },
    });

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey12345';

    return NextResponse.json({
      success: true,
      orderId: donation.orderId,
      amount: donation.amount,
      currency: donation.currency,
      keyId,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      donorPhone: donation.donorPhone,
      receiptNo: donation.receiptNo,
    });
  } catch (err) {
    console.error('Donate Order Creation Error:', err);
    return NextResponse.json({ error: 'Failed to initiate donation order.' }, { status: 500 });
  }
}
