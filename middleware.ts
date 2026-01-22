import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isPasswordPage = req.nextUrl.pathname === "/password"

  const hasAccess = req.cookies.get("dev_access")?.value === "true"

  if (!hasAccess && !isPasswordPage) {
    return NextResponse.redirect(new URL("/password", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
}
