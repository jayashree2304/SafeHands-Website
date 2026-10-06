import { cookies } from 'next/headers';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-safe-hands-2026';
const USER_COOKIE_NAME = 'sh_user_session';
const ADMIN_COOKIE_NAME = 'sh_admin_session';

export interface UserSessionPayload {
  userId: string;
  identifier: string;
  role: 'USER';
}

export interface AdminSessionPayload {
  adminId: string;
  username: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

function signToken(payload: object, expiresInMinutes: number = 60 * 24): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  const fullPayload = { ...payload, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken<T>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }

    return payload as T;
  } catch (err) {
    return null;
  }
}

// User Cookie Management
export async function setUserSession(payload: Omit<UserSessionPayload, 'role'>) {
  const token = signToken({ ...payload, role: 'USER' }, 60 * 24 * 7); // 7 days
  const cookieStore = cookies();
  cookieStore.set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getUserSession(): Promise<UserSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken<UserSessionPayload>(token);
  if (!payload || payload.role !== 'USER') return null;
  return payload;
}

export async function clearUserSession() {
  const cookieStore = cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}

// Admin Cookie Management
export async function setAdminSession(payload: Omit<AdminSessionPayload, 'role'> & { role: 'SUPER_ADMIN' | 'EDITOR' }) {
  const token = signToken(payload, 60 * 8); // 8 hours session for admin
  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken<AdminSessionPayload>(token);
  if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'EDITOR')) return null;
  return payload;
}

export async function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
