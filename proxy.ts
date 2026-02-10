// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin altındaki Next asset'lerine dokunma (gereksiz yere tetiklenmesin)
  if (pathname.startsWith("/admin/_next")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token && pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname); // login sonrası geri dönmek için
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
