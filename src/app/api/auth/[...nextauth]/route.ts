import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const IDLE_TIMEOUT = 30 * 60; // 30 menit dalam detik
const SESSION_MAX_AGE = 8 * 60 * 60; // 8 jam dalam detik

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
    updateAge: 60, // update token setiap 60 detik jika ada aktivitas
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          nomorTelepon: user.nomorTelepon,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Saat pertama login, simpan lastActivity
      if (user) {
        token.role = user.role;
        token.nomorTelepon = user.nomorTelepon;
        token.lastActivity = Math.floor(Date.now() / 1000);
      }

      // Cek idle timeout di setiap JWT refresh
      if (token.lastActivity) {
        const now = Math.floor(Date.now() / 1000);
        const idleSeconds = now - (token.lastActivity as number);

        if (idleSeconds > IDLE_TIMEOUT) {
          // Return token dengan flag expired — akan di-handle di client
          return { ...token, expired: true };
        }
      }

      // Update lastActivity jika ada trigger "update" dari client
      if (trigger === "update") {
        token.lastActivity = Math.floor(Date.now() / 1000);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.nomorTelepon = token.nomorTelepon as string;
      }

      // Teruskan flag expired ke session agar bisa dibaca client
      session.expired = (token.expired as boolean) ?? false;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };