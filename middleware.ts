import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/api/stripe/connect/webhook") {
    return NextResponse.next();
  }
  const owner = req.cookies.get("owner")?.value;
  const ownerEmail = (req.cookies.get("owner_email")?.value || "").toLowerCase();
  const allowedEmail = (process.env.OWNER_EMAIL || "").toLowerCase();
  const hasOwnerSession = Boolean(owner) && ownerEmail === allowedEmail;

  if (pathname.startsWith("/owner")) {
    if (pathname !== "/owner/login") {
      if (!hasOwnerSession) {
        const url = req.nextUrl.clone();
        url.pathname = "/owner/login";
        return NextResponse.redirect(url);
      }
    }
  }

  if (pathname.startsWith("/admin/clientes")) {
    const url = req.nextUrl.clone();
    url.pathname = hasOwnerSession ? "/owner/clientes" : "/owner/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/admin/clientes/:path*"],
};
