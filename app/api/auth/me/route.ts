export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    // 環境変数チェック
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("[/api/auth/me] NEXTAUTH_SECRET is not set");
      return NextResponse.json({ ok: false, error: "AUTH_CONFIG_ERROR" }, { status: 500 });
    }
    
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("[/api/auth/me] Google OAuth credentials missing");
      return NextResponse.json({ ok: false, error: "OAUTH_CONFIG_ERROR" }, { status: 500 });
    }

    const session = await auth().catch((err) => {
      console.error("[/api/auth/me] auth() failed:", err);
      return null;
    });
    
    if (!session) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    
    return NextResponse.json({ ok: true, user: session.user }, { status: 200 });
  } catch (e: any) {
    console.error("[/api/auth/me] unexpected error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}