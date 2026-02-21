import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getInstagramAuthUrl } from "@/lib/social/instagram";

export async function GET() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Encode state as base64url with cliente_id + timestamp for CSRF protection
  const statePayload = JSON.stringify({
    cliente_id: clienteId,
    ts: Date.now(),
  });
  const state = Buffer.from(statePayload).toString("base64url");

  const authUrl = getInstagramAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
