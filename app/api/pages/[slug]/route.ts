import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

type Params = {
  params: {
    slug: string
  }
}

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params

  // 1️⃣ Charger la page
  const { data: pages, error: pageError } = await supabaseAdmin
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("visible", true)
    .limit(1)

  if (pageError || !pages || pages.length === 0) {
    return NextResponse.json(
      { error: "Page not found" },
      { status: 404 }
    )
  }

  const page = pages[0]

  // 2️⃣ Aucun produit
  if (!Array.isArray(page.products) || page.products.length === 0) {
    return NextResponse.json({ page, products: [] })
  }

  // 3️⃣ Produits + images
  const { data: products, error: productsError } = await supabaseAdmin
    .from("products")
    .select(`
      *,
      product_images (
        id,
        url,
        color,
        productId
      )
    `)
    .in("id", page.products)

  if (productsError) {
    console.error(productsError)
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    )
  }

  // 4️⃣ Respecter l’ordre + choisir une image principale
  const orderedProducts = page.products
    .map((id: number) => products.find(p => p.id === id))
    .filter(Boolean)
    .map((product: any) => ({
      ...product,
      main_image:
        product.product_images?.[0]?.url ?? null,
    }))

  return NextResponse.json({
    page,
    products: orderedProducts,
  })
}
