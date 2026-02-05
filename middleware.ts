import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";
  const normalizedHost = host
    .replace(/^https?:\/\//i, "")
    .split(":")[0]
    .toLowerCase();

  const OWNER_DOMAIN = "travel-agency-next-ten.vercel.app";

  if (normalizedHost === OWNER_DOMAIN && pathname.startsWith("/admin")) {
    if (
      pathname !== "/admin/clientes/login" &&
      pathname !== "/admin/login" &&
      pathname !== "/admin/logout"
    ) {
      const owner = req.cookies.get("owner")?.value;
      if (!owner) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }
  }

  if (pathname.startsWith("/admin/clientes")) {
    const clienteId = req.cookies.get("cliente_id")?.value;
    if (clienteId) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    if (pathname !== "/admin/clientes/login") {
      const owner = req.cookies.get("owner")?.value;
      if (!owner) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/clientes/login";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/clientes/:path*"],
};
