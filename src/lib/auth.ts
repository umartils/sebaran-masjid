import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          throw new Error(
            "Email dan password wajib diisi"
          );
        }

        const user =
          await prisma.user.findUnique({
            where: {
              email:
                credentials.email as string,
            },
          });

        if (!user) {
          throw new Error(
            "User tidak ditemukan"
          );
        }

        if (!user.password) {
          throw new Error(
            "Password user tidak valid"
          );
        }

        const isValidPassword =
          await bcrypt.compare(
            credentials.password as string,
            user.password
          );

        if (!isValidPassword) {
          throw new Error(
            "Password salah"
          );
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,

          // role optional
          role:
            (user as any).role ??
            "RELAWAN",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id = user.id;

        token.role =
          (user as any).role ??
          "RELAWAN";
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.role =
          token.role as string;
      }

      return session;
    },
  },

  secret:
    process.env.NEXTAUTH_SECRET,
});