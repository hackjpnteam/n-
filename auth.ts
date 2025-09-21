import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  experimental: {
    enableWebAuthn: false,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Temporarily disable credentials auth for Vercel deployment
        console.log("Credentials authentication temporarily disabled for deployment");
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Google({
      id: "gmail",
      name: "Gmail",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send"
        }
      }
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  basePath: "/api/auth",
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
  // Vercel用の設定
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production"
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.role = 'user'; // Default role
        
        // Log for debugging
        console.log("JWT callback - account:", account?.provider, "user:", user?.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string || 'user';
        
        // Log for debugging
        console.log("Session callback - user:", session.user?.email);
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        console.log("SignIn callback - provider:", account?.provider, "user:", user?.email);
        
        // Allow all Google sign-ins for now
        if (account?.provider === "google" || account?.provider === "gmail") {
          return true;
        }
        
        return false;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);