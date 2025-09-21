import { auth } from "../../../../auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json(session?.user || null);
  } catch (error) {
    console.error("Me endpoint error:", error);
    return NextResponse.json(null);
  }
}