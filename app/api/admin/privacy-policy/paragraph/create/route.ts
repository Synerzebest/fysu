import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req: Request) {
  const { section_id } = await req.json()

  const { data, error } = await supabaseAdmin
    .from("privacy_policy_paragraphs")
    .insert({
      section_id,
      content: "",
      order_index: 0
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}