export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db(); // 既定DB or 環境変数で指定
    const members = await db.collection("members").find({}).limit(1000).toArray();
    return NextResponse.json({ ok: true, items: members }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "INTERNAL_ERROR" }, { status: 500 });
  }
}