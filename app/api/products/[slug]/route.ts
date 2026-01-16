import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { NextResponse, NextRequest } from "next/server"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params  

  if (!slug) {
    return NextResponse.json(
      { error: "Invalid slug" },
      { status: 400 }
    )
  }

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select(`
      *,
      product_images (
        id,
        url,
        color
      )
    `)
    .eq("slug", slug)
    .single()

  if (error || !product) {
    console.error(error)
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(product, { status: 200 })
}
