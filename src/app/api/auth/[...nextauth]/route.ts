import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null
        }

        const user =
          await prisma.user.findUnique({
            where: {
              email:
                credentials.email,
            },
          })

        if (
          !user ||
          !user.password
        ) {
          return null
        }

        const passwordMatch =
          await bcrypt.compare(
            credentials.password,
            user.password
          )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.role = user.role
      }

      return token
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.role =
          token.role as string
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
  },

  secret:
    process.env.NEXTAUTH_SECRET,
})

export {
  handler as GET,
  handler as POST,
}