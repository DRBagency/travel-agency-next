import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// Simple in-memory rate limiter: 30s cooldown per sessionId
const recentSessions = new Map<string, number>();
const COOLDOWN_MS = 30_000;

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of recentSessions) {
    if (now - ts > COOLDOWN_MS) recentSessions.delete(key);
  }
}, 300_000);

export async function POST(req: NextRequest) {
  try {
    const { clienteId, sessionId, pagePath, referrer } = await req.json();

    if (!clienteId || !sessionId) {
      return new NextResponse(null, { status: 400 });
    }

    // Rate limit check
    const key = `${clienteId}:${sessionId}`;
    const last = recentSessions.get(key);
    if (last && Date.now() - last < COOLDOWN_MS) {
      return new NextResponse(null, { status: 204 });
    }
    recentSessions.set(key, Date.now());

    await supabaseAdmin.from("page_visits").insert({
      cliente_id: clienteId,
      session_id: sessionId,
      page_path: pagePath || "/",
      referrer: referrer || null,
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
