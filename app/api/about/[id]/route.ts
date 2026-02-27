import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }

) {
  const supabase = supabaseAdmin
  const body = await req.json()
  const { id } = await context.params

  const { title, image_url, order_index } = body

  const { error } = await supabase
    .from("about_blocks")
    .update({
      title,
      image_url,
      order_index,
      updated_at: new Date()
    })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    const supabase = supabaseAdmin
    const { id } = await context.params 
  
    const { error } = await supabase
      .from("about_blocks")
      .delete()
      .eq("id", id)
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  
    return NextResponse.json({ success: true })
  }