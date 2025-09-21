export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { handlers } = await import("../../../../auth");
    return handlers.GET(request);
  } catch (error) {
    return new Response(`Auth error: ${error}`, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { handlers } = await import("../../../../auth");
    return handlers.POST(request);
  } catch (error) {
    return new Response(`Auth error: ${error}`, { status: 500 });
  }
}