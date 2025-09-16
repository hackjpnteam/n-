export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();                 // 未ログインでも例外にしない
    if (!session) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.json({ ok: true, user: session.user }, { status: 200 });
  } catch (e: any) {
    console.error("[/api/auth/me] error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}