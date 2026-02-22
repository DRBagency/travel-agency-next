import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getAuthUrl, getOwnerRedirectUri } from "@/lib/google-calendar";

export async function GET() {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;

  if (!owner) {
    const host = (await headers()).get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    return NextResponse.redirect(new URL("/owner/login", `${protocol}://${host}`));
  }

  const state = Buffer.from(JSON.stringify({ role: "owner", ts: Date.now() })).toString("base64url");
  const authUrl = getAuthUrl(state, getOwnerRedirectUri());

  return NextResponse.redirect(authUrl);
}
