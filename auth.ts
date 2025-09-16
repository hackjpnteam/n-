import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,                 // AUTH_TRUST_HOST=true と併用
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,                     // 一時的に有効化（原因を可視化）
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);