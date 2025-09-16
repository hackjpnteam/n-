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
  trustHost: true,                         // AUTH_TRUST_HOST=true と併用
  secret: process.env.NEXTAUTH_SECRET,
  // 本番デバッグは必要なときだけ true
  // debug: process.env.NODE_ENV !== "production",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);