import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// Vercel Edge Runtime対応
export const runtime = "nodejs";
export const dynamic = "force-dynamic";