import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Autoriser tous les fichiers statiques et Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPasswordPage = pathname === "/password";
  const hasAccess = req.cookies.get("dev_access")?.value === "true";

  if (!hasAccess && !isPasswordPage) {
    return NextResponse.redirect(new URL("/password", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
