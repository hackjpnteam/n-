export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth();
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections().toArray();
    return NextResponse.json({
      ok: true,
      session: !!session,
      dbCollections: collections.map(c => c.name).slice(0, 10),
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "set" : "missing",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "missing",
        AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST ?? "unset",
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "INTERNAL_ERROR" }, { status: 500 });
  }
}