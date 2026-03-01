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

  // Portal del Viajero: protect authenticated routes
  if (pathname.startsWith("/portal") && pathname !== "/portal/login" && !pathname.startsWith("/api/portal/")) {
    const hasTravelerSession =
      Boolean(req.cookies.get("traveler_session")?.value) &&
      Boolean(req.cookies.get("traveler_email")?.value);

    if (!hasTravelerSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/portal/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/admin/clientes/:path*", "/portal/:path*"],
};
