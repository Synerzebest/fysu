import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Laisser passer fichiers statiques et internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const isAdminPage = pathname.startsWith("/admin")
  const isAuthPage = pathname.startsWith("/auth")

  // Si la route n'est ni admin ni auth, on laisse passer
  if (!isAdminPage && !isAuthPage) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          res.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Empêcher l'accès aux pages /auth si connecté
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Protéger /admin si pas connecté
  if (isAdminPage && !user) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Vérifier le rôle admin uniquement pour /admin
  if (isAdminPage && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}