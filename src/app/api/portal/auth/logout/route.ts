import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  cookieStore.set("traveler_session", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  cookieStore.set("traveler_email", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  return NextResponse.redirect(new URL("/portal/login", req.url));
}
