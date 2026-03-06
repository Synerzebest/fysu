import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST() {
  const { data, error } = await supabaseAdmin
    .from("privacy_policy_sections")
    .insert({
      title: "New section",
      order_index: 0
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}