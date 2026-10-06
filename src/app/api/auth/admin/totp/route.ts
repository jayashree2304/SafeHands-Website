import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/jwt';
import { prisma } from '@/lib/db/prisma';
import { generateTOTPSecret, generateQRCodeDataURL, verifyTOTPCode } from '@/lib/security/totp';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { secret, otpauth } = generateTOTPSecret(session.username);
  const qrCodeUrl = await generateQRCodeDataURL(otpauth);

  return NextResponse.json({ secret, qrCodeUrl });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { secret, token, action } = await req.json();

    if (action === 'disable') {
      await prisma.admin.update({
        where: { id: session.adminId },
        data: { totpEnabled: false, totpSecret: null },
      });

      await prisma.auditLog.create({
        data: {
          adminId: session.adminId,
          action: '2FA_DISABLED',
          targetType: 'Admin',
          details: 'Disabled 2FA TOTP',
        },
      });

      return NextResponse.json({ success: true, message: '2FA TOTP disabled.' });
    }

    // Verify and enable
    const isValid = verifyTOTPCode(token, secret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification token.' }, { status: 400 });
    }

    await prisma.admin.update({
      where: { id: session.adminId },
      data: { totpEnabled: true, totpSecret: secret },
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.adminId,
        action: '2FA_ENABLED',
        targetType: 'Admin',
        details: 'Enabled 2FA TOTP successfully',
      },
    });

    return NextResponse.json({ success: true, message: '2FA TOTP enabled successfully!' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update 2FA status.' }, { status: 500 });
  }
}
