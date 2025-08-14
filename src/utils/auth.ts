// 인증 관련 유틸리티

import { sign, verify } from 'hono/jwt';
import type { JWTPayload } from '../types';

const JWT_SECRET = 'silvertown-secret-key'; // 실제 프로덕션에서는 환경변수 사용

export async function hashPassword(password: string): Promise<string> {
  // Cloudflare Workers 환경에서 사용 가능한 Web Crypto API 활용
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

export async function generateJWT(payload: JWTPayload): Promise<string> {
  return sign(
    { 
      ...payload, 
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24시간 유효
    }, 
    JWT_SECRET
  );
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function requireAuth(token: string | null): Promise<JWTPayload | null> {
  if (!token) return null;
  return await verifyJWT(token);
}

export function requireAdmin(user: JWTPayload | null): boolean {
  return user?.role === 'admin' || user?.role === 'manager';
}

export function generateActivationCode(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}