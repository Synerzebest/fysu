import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { password } = await req.json()

  if (password !== process.env.DEV_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set("dev_access", "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  return response
}
