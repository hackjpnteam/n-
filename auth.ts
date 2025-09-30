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
          console.log("❌ Missing credentials");
          return null;
        }

        console.log("🔍 Attempting login for:", credentials.email);

        try {
          // Dynamic import to avoid Edge Runtime issues
          const mongoose = await import('mongoose');
          const { default: User } = await import('./models/User');

          // Connect to MongoDB
          if (!mongoose.connections[0].readyState) {
            console.log("🔌 Connecting to MongoDB...");
            await mongoose.connect(process.env.MONGODB_URI!);
            console.log("✅ Connected to MongoDB");
          }

          const user = await User.findOne({ 
            email: (credentials.email as string).toLowerCase() 
          });

          if (!user) {
            console.log("❌ User not found:", credentials.email);
            return null;
          }

          console.log("👤 User found:", user.email, "Role:", user.role);

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string, 
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.log("❌ Invalid password for:", credentials.email);
            return null;
          }

          console.log("✅ Authentication successful for:", credentials.email);
          return {
            id: (user as any)._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
          };
        } catch (error) {
          console.error("💥 Auth error:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      checks: ["pkce", "state"],
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signIn(message) {
      console.log('🔥 Event: signIn', message);
    },
    async session(message) {
      console.log('🔥 Event: session', message);
    }
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  basePath: "/api/auth",
  debug: process.env.NODE_ENV !== 'production',
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Remove domain restriction for Vercel - let browser handle it
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.callback-url' 
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Remove domain restriction
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Host-next-auth.csrf-token' 
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // Ensure session creation
  generateSessionToken: () => crypto.randomUUID(),
  callbacks: {
    async redirect({ url, baseUrl, token }) {
      console.log('🔄 Redirect callback - url:', url, 'baseUrl:', baseUrl);
      console.log('🔄 Redirect callback - token:', token ? JSON.stringify(token, null, 2) : 'not present');
      
      // Check for Google OAuth callback redirect to mypage
      if (url.includes('/mypage') && !url.includes('api/auth/callback')) {
        // This is the final redirect after Google OAuth - check the previous flow
        console.log('🔄 Final mypage redirect detected - possibly from Google OAuth');
        // We need to get actual user data - redirect to a generic handler
        return `${baseUrl}/api/auth/google-success`;
      }
      
      // Only redirect auth callbacks to /mypage to prevent unwanted admin redirects
      if (url.includes('/api/auth/callback')) {
        console.log('🔄 Auth callback redirect to /mypage');
        return `${baseUrl}/mypage`;
      }
      
      // Allow relative URLs for direct navigation
      if (url.startsWith('/')) {
        console.log('🔄 Relative URL redirect:', `${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      }
      
      // Allow URLs on the same origin  
      if (url.startsWith(baseUrl)) {
        console.log('🔄 Same origin redirect:', url);
        return url;
      }
      
      // For base URL or root, default to mypage
      if (url === baseUrl || url === `${baseUrl}/`) {
        console.log('🔄 Default redirect to /mypage');
        return `${baseUrl}/mypage`;
      }
      
      // Default fallback to the requested URL or mypage
      const finalUrl = url.startsWith(baseUrl) ? url : `${baseUrl}/mypage`;
      console.log('🔄 Fallback redirect:', finalUrl);
      return finalUrl;
    },
    async jwt({ token, account, user, trigger }) {
      console.log('🔥 JWT callback - trigger:', trigger);
      console.log('🔥 JWT callback - token:', JSON.stringify(token, null, 2));
      console.log('🔥 JWT callback - account:', JSON.stringify(account, null, 2));
      console.log('🔥 JWT callback - user:', JSON.stringify(user, null, 2));
      
      if (account && user) {
        console.log('🔥 JWT callback - Processing new login');
        // Store user info in token with complete data
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || 'user';
        token.picture = user.image;
        
        // For Google OAuth, find MongoDB user
        if (account.provider === 'google' && user.email) {
          console.log('🔥 JWT callback - Google OAuth user mapping');
          try {
            const mongoose = await import('mongoose');
            const { default: User } = await import('./models/User');
            
            if (!mongoose.connections[0].readyState) {
              console.log("🔌 JWT callback - Connecting to MongoDB...");
              await mongoose.connect(process.env.MONGODB_URI!);
              console.log("✅ JWT callback - Connected to MongoDB");
            }
            
            console.log('🔍 JWT callback - Searching for user:', user.email.toLowerCase());
            const mongoUser = await User.findOne({ 
              email: user.email.toLowerCase() 
            });
            
            if (mongoUser) {
              console.log('✅ JWT callback - Found MongoDB user:', mongoUser.email, 'Role:', mongoUser.role);
              token.userId = (mongoUser as any)._id.toString();
              token.role = mongoUser.role || 'user';
              token.name = mongoUser.name || user.name;
            } else {
              console.log('❌ JWT callback - MongoDB user not found for:', user.email);
            }
          } catch (error) {
            console.error('💥 JWT callback - Error mapping Google user:', error);
          }
        }
        
        console.log('✅ JWT callback - Token after processing:', JSON.stringify(token, null, 2));
        
        // 🔥 CRITICAL FIX: Create auth-simple session directly in JWT callback
        if (account?.provider === 'google' && token.email) {
          console.log('🔥 Creating auth-simple session in JWT callback for Google user');
          try {
            const { createSessionToken } = await import('./lib/auth-simple');
            const sessionToken = createSessionToken({
              id: token.userId as string,
              email: token.email as string,
              name: token.name as string,
              role: token.role as string || 'user'
            });
            console.log('✅ Auth-simple session token created in JWT:', sessionToken.substring(0, 20) + '...');
            
            // Store the token in a way that can be accessed later
            global.pendingGoogleSession = sessionToken;
          } catch (error) {
            console.error('💥 Error creating auth-simple session in JWT:', error);
          }
        }
      } else {
        console.log('🔥 JWT callback - Refreshing existing token');
      }
      
      return token;
    },
    async session({ session, token, newSession, trigger }) {
      console.log('🔥 Session callback - trigger:', trigger);
      console.log('🔥 Session callback - newSession:', newSession);
      console.log('🔥 Session callback - token:', JSON.stringify(token, null, 2));
      console.log('🔥 Session callback - session before:', JSON.stringify(session, null, 2));
      
      // Always ensure session object exists
      if (!session) {
        console.log('🔥 Session callback - Creating session object');
        session = {
          user: {
            id: '',
            email: '',
            name: '',
            role: 'user'
          },
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      }
      
      if (token) {
        console.log('🔥 Session callback - Processing token into session');
        
        // Ensure session.user exists
        if (!session.user) {
          console.log('🔥 Session callback - Creating user object');
          session.user = {
            id: '',
            email: '',
            name: '',
            role: 'user'
          };
        }
        
        // Map token to session with all available data
        session.user.id = (token.userId as string) || token.sub || '';
        session.user.email = (token.email as string) || '';
        session.user.name = (token.name as string) || '';
        session.user.role = (token.role as string) || 'user';
        
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        
        console.log('✅ Session callback - User mapped:', {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          image: session.user.image
        });
      } else {
        console.log('❌ Session callback - No token provided');
      }
      
      console.log('🔥 Session callback - session after:', JSON.stringify(session, null, 2));
      return session;
    },
    async signIn({ user, account }) {
      console.log('🔥 SignIn callback - user:', JSON.stringify(user, null, 2));
      console.log('🔥 SignIn callback - account:', JSON.stringify(account, null, 2));
      
      if (account?.provider === "google") {
        console.log('🔥 Google OAuth sign in attempt for email:', user?.email);
        
        if (!user || !user.email) {
          console.error('❌ Google user has no email');
          return false;
        }
        
        try {
          // Dynamic import to avoid Edge Runtime issues
          const mongoose = await import('mongoose');
          const { default: User } = await import('./models/User');

          // Connect to MongoDB
          if (!mongoose.connections[0].readyState) {
            console.log("🔌 Connecting to MongoDB for Google OAuth...");
            await mongoose.connect(process.env.MONGODB_URI!);
            console.log("✅ Connected to MongoDB");
          }

          console.log('🔍 Searching for Google user in MongoDB:', user.email.toLowerCase());

          // Check if user exists in MongoDB
          const mongoUser = await User.findOne({ 
            email: user.email.toLowerCase() 
          });

          console.log('🔍 MongoDB search result:', mongoUser ? 'FOUND' : 'NOT FOUND');

          if (!mongoUser) {
            console.error('❌ Google user not found in MongoDB:', user.email);
            console.log('📋 Creating new Google user in MongoDB...');
            
            // Create new user for Google OAuth
            const newUser = new User({
              email: user.email.toLowerCase(),
              name: user.name || 'Google User',
              role: 'user',
              passwordHash: 'GOOGLE_OAUTH_USER'
            });
            
            await newUser.save();
            console.log('✅ Created new Google user:', newUser.email);
            return true;
          }

          console.log('✅ Google user found in MongoDB:', mongoUser.email, 'Role:', mongoUser.role);
          return true;
          
        } catch (error) {
          console.error('💥 Error checking Google user in MongoDB:', error);
          return false;
        }
      }
      
      if (account?.provider === "credentials") {
        console.log('🔥 Credentials sign in');
        return true;
      }
      
      console.error('❌ Unsupported provider:', account?.provider);
      return false;
    },
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);