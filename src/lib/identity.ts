import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // sesuaikan path
import type { Identity } from "@/lib/ai/quota";

const ANON_COOKIE_NAME = "seiman_anon_id";

export type IdentityResult = {
  identity: Identity;
  isNewAnonId: boolean;
};

export async function resolveIdentity(req: NextRequest): Promise<IdentityResult> {
  const session = await getServerSession(authOptions);

  // Anggap TIDAK login kalau session tidak ada, tidak punya id,
  // ATAU sudah expired karena idle timeout (session.expired dari callback kamu)
  const isValidLogin = session?.user?.id && !session.expired;

  if (isValidLogin) {
    return {
      identity: { mode: "user", userId: session.user.id },
      isNewAnonId: false,
    };
  }

  const existingAnonId = req.cookies.get(ANON_COOKIE_NAME)?.value;
  const anonId = existingAnonId ?? randomUUID();
  const isNewAnonId = !existingAnonId;

  const ipAddress = getClientIp(req);

  return {
    identity: { mode: "anon", anonId, ipAddress },
    isNewAnonId,
  };
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}