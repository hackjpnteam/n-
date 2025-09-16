export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth"; // NextAuth v5 推奨。無い場合はセッション取得ロジックに置換

export async function GET() {
  try {
    const session = await auth(); // 未ログインでも例外にせず判定だけ
    if (!session) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.json({ ok: true, user: session.user }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "INTERNAL_ERROR" }, { status: 500 });
  }
}