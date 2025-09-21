import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
      image?: string;
    };
  }
}

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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Dynamic import to avoid Edge Runtime issues
          const mongoose = await import('mongoose');
          const { default: User } = await import('./models/User');

          // Connect to MongoDB
          if (!mongoose.connections[0].readyState) {
            await mongoose.connect(process.env.MONGODB_URI!);
          }

          const user = await User.findOne({ 
            email: (credentials.email as string).toLowerCase() 
          });

          if (!user) {
            console.log("User not found:", credentials.email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string, 
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.log("Invalid password for:", credentials.email);
            return null;
          }

          console.log("Authentication successful for:", credentials.email);
          return {
            id: (user as any)._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.role = user.role || 'user';
        token.userId = user.id;
        
        // For Google OAuth, find MongoDB user
        if (account.provider === 'google' && user.email) {
          try {
            const mongoose = await import('mongoose');
            const { default: User } = await import('./models/User');
            
            if (!mongoose.connections[0].readyState) {
              await mongoose.connect(process.env.MONGODB_URI!);
            }
            
            const mongoUser = await User.findOne({ 
              email: user.email.toLowerCase() 
            });
            
            if (mongoUser) {
              token.userId = (mongoUser as any)._id.toString();
              token.role = mongoUser.role || 'user';
            }
          } catch (error) {
            console.error('Error mapping Google user:', error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = (token.userId as string) || token.sub!;
        session.user.role = token.role as string || 'user';
        
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "credentials") {
        return true;
      }
      return false;
    },
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);