import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { NextResponse } from "next/server"

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
      ),
      product_sizes (
        id,
        size,
        stock,
        is_active
      ),
      product_suggestions!product_suggestions_product_id_fkey (
        display_order,
        suggested:products!product_suggestions_suggested_product_id_fkey (
          id,
          name,
          slug,
          price,
          decoration_image_url,
          decoration_text,
          product_images (
            id,
            url,
            color
          )
        )
      )
    `)
    .eq("slug", slug)
    .single()

  if (error || !product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }

  /* ================= FORMAT SUGGESTIONS ================= */

  const suggested_products =
    product.product_suggestions
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      .map((s: any) => s.suggested) ?? []

  /* ================= RESPONSE ================= */

  return NextResponse.json(
    {
      ...product,
      product_suggestions: suggested_products
    },
    { status: 200 }
  )
}