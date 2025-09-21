import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

// GET all pages
export async function GET() {
  const { data, error } = await supabaseServer.from("pages").select("*").order("created_at")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST create page
export async function POST(req: Request) {
    try {
      const body = await req.json()
      const { title, slug } = body
  
      const { data, error } = await supabaseServer
        .from("pages")
        .insert({ title, slug })
        .select()
        .single()
  
      if (error) {
        console.error("Supabase insert error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
  
      return NextResponse.json(data)
    } catch (err: any) {
      console.error("API route crashed:", err)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }
  