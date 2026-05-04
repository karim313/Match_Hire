import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@domain.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a mock authorize function. 
        // In production, you would verify against a database.
        if (credentials?.email === "admin@matchhire.com" && credentials?.password === "password123") {
          return { id: "1", name: "Ahmed Al-Ali", email: "admin@matchhire.com" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
