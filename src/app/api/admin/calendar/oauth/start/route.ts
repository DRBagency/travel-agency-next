import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUrl } from "@/lib/google-calendar";

export async function GET() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
  }

  // Use clienteId as state for CSRF protection (simple approach matching project patterns)
  const state = Buffer.from(JSON.stringify({ cliente_id: clienteId, ts: Date.now() })).toString("base64url");
  const authUrl = getAuthUrl(state);

  return NextResponse.redirect(authUrl);
}
