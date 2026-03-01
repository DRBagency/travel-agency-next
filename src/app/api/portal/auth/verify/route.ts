import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/portal/login?error=invalid", req.url));
  }

  // Find valid, unused, non-expired token
  const { data: session } = await supabaseAdmin
    .from("traveler_sessions")
    .select("*")
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!session) {
    return NextResponse.redirect(new URL("/portal/login?error=expired", req.url));
  }

  // Mark as used
  await supabaseAdmin
    .from("traveler_sessions")
    .update({ used_at: new Date().toISOString() })
    .eq("id", session.id);

  // Set cookies (7 days)
  const cookieStore = await cookies();
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

  cookieStore.set("traveler_session", session.id, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });

  cookieStore.set("traveler_email", session.email, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });

  return NextResponse.redirect(new URL("/portal", req.url));
}
