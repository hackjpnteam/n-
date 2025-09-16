import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" as const },
  trustHost: true,                 // AUTH_TRUST_HOST=true と併用
  secret: process.env.NEXTAUTH_SECRET,
  // 必要なら callbacks でユーザー作成/DB同期など
  callbacks: {
    async jwt({ token, account, profile }: any) {
      // ここで必要なクレームを詰める
      return token;
    },
    async session({ session, token }: any) {
      // session.user.id = token.sub など
      return session;
    },
  },
  pages: {
    // カスタムログインページがある場合:
    // signIn: "/auth/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);