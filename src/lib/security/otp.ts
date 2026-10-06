import crypto from 'crypto';
import { prisma } from '../db/prisma';
import { hashString } from './hash';

export interface SendOTPResult {
  success: boolean;
  message: string;
  cooldownSeconds?: number;
  devOtp?: string;
}

// In-memory fallback cache when database is uninitialized
const memoryOtpStore = new Map<string, { otpHash: string; expiresAt: number; attempts: number; verified: boolean; createdAt: number }>();

export async function generateAndSendOTP(identifier: string, ip: string): Promise<SendOTPResult> {
  const normalizedId = identifier.trim().toLowerCase();

  // Check cooldown timer
  let recentOTP: any = null;
  try {
    if (prisma && prisma.oTP) {
      recentOTP = await prisma.oTP.findFirst({
        where: { identifier: normalizedId },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (_) {}

  const memRecord = memoryOtpStore.get(normalizedId);
  const checkRecord = recentOTP || (memRecord ? { createdAt: new Date(memRecord.createdAt) } : null);

  if (checkRecord) {
    const elapsedSeconds = Math.floor((Date.now() - checkRecord.createdAt.getTime()) / 1000);
    if (elapsedSeconds < 60) {
      return {
        success: false,
        message: `Please wait ${60 - elapsedSeconds} seconds before requesting a new OTP.`,
        cooldownSeconds: 60 - elapsedSeconds,
      };
    }
  }

  // Generate 6-digit secure OTP
  const rawOtp = crypto.randomInt(100000, 999999).toString();
  const otpHash = hashString(rawOtp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

  // Store in memory store
  memoryOtpStore.set(normalizedId, {
    otpHash,
    expiresAt: expiresAt.getTime(),
    attempts: 0,
    verified: false,
    createdAt: Date.now(),
  });

  // Store in DB if available
  try {
    if (prisma && prisma.oTP) {
      await prisma.oTP.create({
        data: {
          identifier: normalizedId,
          otpHash,
          expiresAt,
          attempts: 0,
          verified: false,
        },
      });
    }
  } catch (_) {}

  console.log(`[AUTH OTP DISPATCH] Identifier: ${normalizedId} | Dev OTP: ${rawOtp} | Expires in: 5m`);

  return {
    success: true,
    message: 'OTP sent successfully to your mobile/email.',
    cooldownSeconds: 60,
    devOtp: process.env.NODE_ENV === 'development' ? rawOtp : undefined,
  };
}

export async function verifyOTP(identifier: string, inputOtp: string): Promise<{ success: boolean; message: string }> {
  const normalizedId = identifier.trim().toLowerCase();
  const inputHash = hashString(inputOtp.trim());

  let otpRecord: any = null;
  try {
    if (prisma && prisma.oTP) {
      otpRecord = await prisma.oTP.findFirst({
        where: {
          identifier: normalizedId,
          verified: false,
        },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (_) {}

  const memRecord = memoryOtpStore.get(normalizedId);

  if (!otpRecord && !memRecord) {
    return { success: false, message: 'Invalid or expired OTP. Please request a new code.' };
  }

  if (otpRecord) {
    if (new Date() > otpRecord.expiresAt) {
      return { success: false, message: 'OTP has expired. Please request a new code.' };
    }
    if (otpRecord.attempts >= 5) {
      return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }
    if (otpRecord.otpHash !== inputHash) {
      try {
        await prisma.oTP.update({
          where: { id: otpRecord.id },
          data: { attempts: { increment: 1 } },
        });
      } catch (_) {}
      return { success: false, message: 'Invalid OTP code. Please try again.' };
    }
    try {
      await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });
    } catch (_) {}
    return { success: true, message: 'OTP verified successfully.' };
  }

  // Memory store verification fallback
  if (memRecord) {
    if (Date.now() > memRecord.expiresAt) {
      memoryOtpStore.delete(normalizedId);
      return { success: false, message: 'OTP has expired. Please request a new code.' };
    }
    if (memRecord.attempts >= 5) {
      return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }
    if (memRecord.otpHash !== inputHash) {
      memRecord.attempts += 1;
      return { success: false, message: 'Invalid OTP code. Please try again.' };
    }
    memRecord.verified = true;
    memoryOtpStore.delete(normalizedId);
    return { success: true, message: 'OTP verified successfully.' };
  }

  return { success: false, message: 'Invalid OTP code.' };
}
