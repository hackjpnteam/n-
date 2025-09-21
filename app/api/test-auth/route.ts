import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Import NextAuth handlers directly
    const { handlers } = await import("../../../auth");
    
    return NextResponse.json({
      status: "Auth handlers imported successfully",
      handlersExists: !!handlers,
      handlersKeys: handlers ? Object.keys(handlers) : [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: "Error importing auth handlers",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}