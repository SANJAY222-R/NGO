import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sequelize } from "./lib/sequelize"
import { User } from "./models"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ where: { email: credentials.email as string } });
        if (!user || !user.get("password")) return null;

        const bcrypt = require("bcryptjs");
        const isValid = await bcrypt.compare(credentials.password as string, user.get("password") as string);
        
        if (!isValid) return null;

        return {
          id: user.get("id") as string,
          name: user.get("name") as string,
          email: user.get("email") as string,
          role: user.get("role") as string,
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "DONOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
})
