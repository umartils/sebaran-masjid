import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      nomorTelepon?: string | null;
    } & DefaultSession["user"];
    expired?: boolean; // flag dari server jika sesi idle timeout
  }

  interface User extends DefaultUser {
    role?: string;
    nomorTelepon?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string;
    nomorTelepon?: string | null;
    lastActivity?: number; // Unix timestamp (detik) aktivitas terakhir
    expired?: boolean; // flag idle timeout dari JWT callback
  }
}