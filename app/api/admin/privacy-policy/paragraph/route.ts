import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function PUT(req: Request) {
  const body = await req.json()

  const { id, content } = body

  const { error } = await supabaseAdmin
    .from("privacy_policy_paragraphs")
    .update({ content })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
  
    const { error } = await supabaseAdmin
      .from("privacy_policy_paragraphs")
      .delete()
      .eq("id", id)
  
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 })
  
    return NextResponse.json({ success: true })
  }