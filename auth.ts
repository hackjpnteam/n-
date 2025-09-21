import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User";

export const authConfig: NextAuthConfig = {
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
          // Connect to MongoDB
          if (!mongoose.connections[0].readyState) {
            await mongoose.connect(process.env.MONGODB_URI);
          }

          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            console.log("User not found in MongoDB:", credentials.email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.log("Invalid password for:", credentials.email);
            return null;
          }

          console.log("Authentication successful (MongoDB) for:", credentials.email);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
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
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.role = user.role;
        
        // For Google OAuth, find the actual user ID from MongoDB
        if (account.provider === 'google' && user.email) {
          try {
            const mongoose = require('mongoose');
            const User = require('./models/User').default;
            
            if (!mongoose.connections[0].readyState) {
              await mongoose.connect(process.env.MONGODB_URI);
            }
            
            const mongoUser = await User.findOne({ 
              email: user.email.toLowerCase() 
            });
            
            if (mongoUser) {
              token.mongoUserId = mongoUser._id.toString();
              token.role = mongoUser.role;
              console.log('Google user mapped to MongoDB ID:', mongoUser._id.toString());
            }
          } catch (error) {
            console.error('Error mapping Google user to MongoDB:', error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Use MongoDB user ID if available, otherwise fall back to token.sub
        session.user.id = token.mongoUserId || token.sub!;
        session.user.role = token.role as string;
        
        console.log('Session user ID set to:', session.user.id);
      }
      return session;
    },
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);