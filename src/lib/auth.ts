// import NextAuth from "next-auth";

// import Credentials from "next-auth/providers/credentials";

// import { PrismaAdapter } from "@next-auth/prisma-adapter";

// import bcrypt from "bcryptjs";

// import { prisma } from "@/lib/prisma";

// export const {
//   handlers,
//   signIn,
//   signOut,
//   auth,
// } = NextAuth({
//   adapter: PrismaAdapter(prisma),

//   session: {
//     strategy: "jwt",
//   },

//   pages: {
//     signIn: "/login",
//   },

//   providers: [
//     Credentials({
//       name: "credentials",

//       credentials: {
//         email: {
//           label: "Email",
//           type: "email",
//         },

//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },

//       async authorize(credentials) {
//         if (
//           !credentials?.email ||
//           !credentials?.password
//         ) {
//           throw new Error(
//             "Email dan password wajib diisi"
//           );
//         }

//         const user =
//           await prisma.user.findUnique({
//             where: {
//               email:
//                 credentials.email as string,
//             },
//           });

//         if (!user) {
//           throw new Error(
//             "User tidak ditemukan"
//           );
//         }

//         if (!user.password) {
//           throw new Error(
//             "Password user tidak valid"
//           );
//         }

//         const isValidPassword =
//           await bcrypt.compare(
//             credentials.password as string,
//             user.password
//           );

//         if (!isValidPassword) {
//           throw new Error(
//             "Password salah"
//           );
//         }

//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,

//           // role optional
//           role:
//             (user as any).role ??
//             "RELAWAN",
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({
//       token,
//       user,
//     }) {
//       if (user) {
//         token.id = user.id;

//         token.role =
//           (user as any).role ??
//           "RELAWAN";
//       }

//       return token;
//     },

//     async session({
//       session,
//       token,
//     }) {
//       if (session.user) {
//         session.user.id =
//           token.id as string;

//         session.user.role =
//           token.role as string;
//       }

//       return session;
//     },
//   },

//   secret:
//     process.env.NEXTAUTH_SECRET,
// });

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const IDLE_TIMEOUT = 30 * 60; // 30 menit dalam detik
const SESSION_MAX_AGE = 8 * 60 * 60; // 8 jam dalam detik

export const authOptions: NextAuthOptions = {
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
        token.id = user.id;
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
        session.user.id = token.id as string;
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
};
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
