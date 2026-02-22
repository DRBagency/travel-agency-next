import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getAuthUrl } from "@/lib/google-calendar";

export async function GET() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    const host = (await headers()).get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    return NextResponse.redirect(new URL("/admin/login", `${protocol}://${host}`));
  }

  // Use clienteId as state for CSRF protection (simple approach matching project patterns)
  const state = Buffer.from(JSON.stringify({ cliente_id: clienteId, ts: Date.now() })).toString("base64url");
  const authUrl = getAuthUrl(state);

  return NextResponse.redirect(authUrl);
}
