import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"
import CredentialsProvider from "next-auth/providers/credentials"
import SequelizeAdapter from "@auth/sequelize-adapter"
import { sequelize } from "./src/lib/sequelize"
import { User, Account, Session, VerificationToken } from "./src/models"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SequelizeAdapter(sequelize, {
    models: {
      User: User as any,
      Account: Account as any,
      Session: Session as any,
      VerificationToken: VerificationToken as any,
    },
  }),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID as string,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Admin", email: "admin@example.com" }
        }
        return null
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        // @ts-ignore
        session.user.role = user.role
      }
      return session
    }
  }
})
