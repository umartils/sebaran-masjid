import { prisma } from "@/lib/prisma"; // sesuaikan dengan cara kamu export prisma client

// ===== Konfigurasi limit harian =====
export const DAILY_LIMITS = {
  user: 5_000, // token/hari untuk user login
  anon: 1_000, // token/hari per anonId (per browser)
  ip: 3_000,   // token/hari per IP (agregat, mencegah abuse ganti cookie)
};

// ===== Tipe identitas request =====
export type Identity =
  | { mode: "user"; userId: string }
  | { mode: "anon"; anonId: string; ipAddress: string };

export type QuotaCheckResult =
  | { allowed: true }
  | { allowed: false; reason: "quota_exceeded_user" | "quota_exceeded_anon" };

// ===== Helper: tanggal hari ini dalam WIB (UTC+7), format "YYYY-MM-DD" =====
export function getTodayWIB(): string {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000); // shift ke UTC+7
  return wib.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// ===== Cek kuota SEBELUM panggil AI =====
export async function checkQuota(identity: Identity): Promise<QuotaCheckResult> {
  const date = getTodayWIB();

  if (identity.mode === "user") {
    const usage = await prisma.tokenUsage.findUnique({
      where: { userId_date: { userId: identity.userId, date } },
      select: { totalTokens: true },
    });

    const used = usage?.totalTokens ?? 0;
    if (used >= DAILY_LIMITS.user) {
      return { allowed: false, reason: "quota_exceeded_user" };
    }
    return { allowed: true };
  }

  // mode "anon" — cek DUA batas: anonId dan ipAddress
  const [anonUsage, ipUsage] = await Promise.all([
    prisma.tokenUsage.findUnique({
      where: { anonId_date: { anonId: identity.anonId, date } },
      select: { totalTokens: true },
    }),
    prisma.tokenUsage.findUnique({
      where: { ipAddress_date: { ipAddress: identity.ipAddress, date } },
      select: { totalTokens: true },
    }),
  ]);

  const anonUsed = anonUsage?.totalTokens ?? 0;
  const ipUsed = ipUsage?.totalTokens ?? 0;

  if (anonUsed >= DAILY_LIMITS.anon || ipUsed >= DAILY_LIMITS.ip) {
    return { allowed: false, reason: "quota_exceeded_anon" };
  }

  return { allowed: true };
}

// ===== Increment kuota SETELAH dapat result.usage dari AI =====
export async function incrementUsage(
  identity: Identity,
  usage: { inputTokens: number; outputTokens: number; totalTokens: number }
): Promise<void> {
  const date = getTodayWIB();

  if (identity.mode === "user") {
    await prisma.tokenUsage.upsert({
      where: { userId_date: { userId: identity.userId, date } },
      create: {
        userId: identity.userId,
        date,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      },
      update: {
        inputTokens: { increment: usage.inputTokens },
        outputTokens: { increment: usage.outputTokens },
        totalTokens: { increment: usage.totalTokens },
      },
    });
    return;
  }

  // mode "anon" — increment DUA baris sekaligus: anonId dan ipAddress
  await Promise.all([
    prisma.tokenUsage.upsert({
      where: { anonId_date: { anonId: identity.anonId, date } },
      create: {
        anonId: identity.anonId,
        date,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      },
      update: {
        inputTokens: { increment: usage.inputTokens },
        outputTokens: { increment: usage.outputTokens },
        totalTokens: { increment: usage.totalTokens },
      },
    }),
    prisma.tokenUsage.upsert({
      where: { ipAddress_date: { ipAddress: identity.ipAddress, date } },
      create: {
        ipAddress: identity.ipAddress,
        date,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      },
      update: {
        inputTokens: { increment: usage.inputTokens },
        outputTokens: { increment: usage.outputTokens },
        totalTokens: { increment: usage.totalTokens },
      },
    }),
  ]);
}