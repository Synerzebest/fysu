import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params
    const supabase = supabaseAdmin
    const body = await req.json()
  
    const { paragraphs } = body
  
    const { error } = await supabase
      .from("about_block_paragraphs")
      .insert(
        paragraphs.map((content: string, index: number) => ({
          block_id: id,
          content,
          order_index: index
        }))
      )
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  
    return NextResponse.json({ success: true })
  }

  export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    const { id } = await context.params
    const supabase = supabaseAdmin
    const body = await req.json()
  
    const { paragraphs } = body
  
    // delete old
    await supabase
      .from("about_block_paragraphs")
      .delete()
      .eq("block_id", id)
  
    // insert new
    const { error } = await supabase
      .from("about_block_paragraphs")
      .insert(
        paragraphs.map((content: string, index: number) => ({
          block_id: id,
          content,
          order_index: index
        }))
      )
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  
    return NextResponse.json({ success: true })
  }