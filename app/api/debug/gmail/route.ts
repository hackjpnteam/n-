import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth().catch(() => null);
    
    return NextResponse.json({
      ok: true,
      session: !!session,
      user: session?.user || null,
      providers: {
        google: !!process.env.GOOGLE_CLIENT_ID,
        gmail: !!process.env.GOOGLE_CLIENT_ID,
      },
      scopes: {
        google: "openid email profile",
        gmail: "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send"
      }
    });
  } catch (e: any) {
    return NextResponse.json({ 
      ok: false, 
      error: String(e),
      stack: e.stack 
    }, { status: 500 });
  }
}
