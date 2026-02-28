import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;

  // 1️⃣ Récupérer section
  const { data: section, error: sectionError } = await supabaseAdmin
    .from("sections")
    .select("id, title")
    .eq("slug", slug)
    .single();

  if (sectionError || !section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  // 2️⃣ Récupérer les product_ids
  const { data: links, error: linksError } = await supabaseAdmin
    .from("section_products")
    .select("product_id")
    .eq("section_id", section.id)
    .order("display_order", { ascending: true });

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

  const productIds = links?.map((l) => l.product_id) ?? [];

  if (productIds.length === 0) {
    return NextResponse.json({
      title: section.title,
      products: [],
    });
  }

  // 3️⃣ Récupérer produits
  const { data: products, error: productsError } = await supabaseAdmin
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      product_images (
        url
      )
    `)
    .in("id", productIds);

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }

  return NextResponse.json({
    title: section.title,
    products,
  });
}