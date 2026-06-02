import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_DURATION_HOURS = 8;      // Durasi maksimal sesi
const IDLE_TIMEOUT_MINUTES = 30;       // Timeout jika idle

export function generateSessionToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

export async function createSession(userId: string, request: Request) {
  const token = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken: token,
      ipAddress: request.headers.get('x-forwarded-for') ?? 
                 request.headers.get('x-real-ip') ?? 'unknown',
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      lastActivity: now,
      expiresAt,
    },
  });

  return session;
}

export async function getSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  });

  if (!session) return null;

  const now = new Date();

  // Cek apakah sesi sudah expired
  if (session.expiresAt < now) {
    await deleteSession(token);
    return null;
  }

  // Cek idle timeout
  const idleLimit = new Date(now.getTime() - IDLE_TIMEOUT_MINUTES * 60 * 1000);
  if (session.lastActivity < idleLimit) {
    await deleteSession(token);
    return null;
  }

  return session;
}

export async function updateSessionActivity(token: string) {
  const now = new Date();
  const newExpiresAt = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  await prisma.session.update({
    where: { sessionToken:token },
    data: {
      lastActivity: now,
      expiresAt: newExpiresAt,
    },
  });
}

export async function deleteSession(token: string) {
  await prisma.session.delete({ where: { sessionToken: token } }).catch(() => {});
}

export async function deleteAllUserSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

// Hapus semua sesi yang sudah expired (untuk cleanup/cron job)
export async function cleanupExpiredSessions() {
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}