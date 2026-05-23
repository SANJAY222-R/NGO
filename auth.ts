import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import SequelizeAdapter from "@auth/sequelize-adapter"
import bcrypt from "bcryptjs"

import { sequelize } from "@/lib/sequelize"
import { User } from "@/models"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SequelizeAdapter(sequelize),

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        const user = await User.findOne({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          throw new Error("User not found")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.getDataValue("password")
        )

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.getDataValue("id"),
          email: user.getDataValue("email"),
          name: user.getDataValue("name"),
          image: user.getDataValue("image"),
          role: user.getDataValue("role"),
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.sub
        ;(session.user as any).role = token.role
      }

      return session
    },
  },

  secret: process.env.AUTH_SECRET,
})