import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET() {
  const { data: sections, error } = await supabaseAdmin
    .from("privacy_policy_sections")
    .select(`
      id,
      title,
      order_index,
      privacy_policy_paragraphs (
        id,
        content,
        order_index
      )
    `)
    .order("order_index", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(sections)
}