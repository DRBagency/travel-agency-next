import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTikTokAuthUrl } from "@/lib/social/tiktok";

export async function GET() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const statePayload = JSON.stringify({
    cliente_id: clienteId,
    ts: Date.now(),
  });
  const state = Buffer.from(statePayload).toString("base64url");

  const authUrl = getTikTokAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
