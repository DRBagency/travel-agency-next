import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUrl, getOwnerRedirectUri } from "@/lib/google-calendar";

export async function GET() {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;

  if (!owner) {
    return NextResponse.redirect(new URL("/owner/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
  }

  const state = Buffer.from(JSON.stringify({ role: "owner", ts: Date.now() })).toString("base64url");
  const authUrl = getAuthUrl(state, getOwnerRedirectUri());

  return NextResponse.redirect(authUrl);
}
