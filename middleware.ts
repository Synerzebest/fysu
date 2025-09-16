import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET, 
    secureCookie: process.env.NODE_ENV === "production",
  })


  const { pathname } = req.nextUrl

  if (!token && pathname.startsWith("/checkout")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/checkout", "/login", "/signup"],
}
