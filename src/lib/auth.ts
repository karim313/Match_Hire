import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://cvanalysisapp.runasp.net/api"}/Auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { "Content-Type": "application/json" }
          });

          if (!res.ok) {
            console.error(`Auth backend failed with status: ${res.status}`);
            return null;
          }

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.error("Auth backend did not return JSON");
            return null;
          }

          const data = await res.json();

          if (data.token) {
            let extractedName = data.fullName;
            
            try {
              if (!extractedName) {
                const payloadBase64 = data.token.split('.')[1];
                const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
                const decoded = JSON.parse(decodedJson);
                const tokenName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
                if (tokenName) {
                  extractedName = tokenName;
                }
              }
            } catch (e) {
              console.error("Failed to decode token", e);
            }

            // Fallback to email username if still empty
            if (!extractedName && data.email) {
              extractedName = data.email.split('@')[0];
            }

            return {
              id: data.email,
              name: extractedName,
              email: data.email,
              role: data.role,
              accessToken: data.token
            };
          }
          return null;
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
        token.fullName = (user as any).name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).role = token.role;
        (session.user as any).fullName = token.fullName;
        (session.user as any).name = token.fullName;
      }
      return session;
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
