import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export function generateTOTPSecret(username: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(username, 'SafeHandsNGO', secret);
  return { secret, otpauth };
}

export async function generateQRCodeDataURL(otpauthUrl: string): Promise<string> {
  return await QRCode.toDataURL(otpauthUrl);
}

export function verifyTOTPCode(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token: token.trim(), secret });
  } catch (err) {
    return false;
  }
}
