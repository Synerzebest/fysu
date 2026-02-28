import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { sectionSlug, productIds } = await req.json();

    if (!sectionSlug || !Array.isArray(productIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Récupérer la section
    const { data: section, error: sectionError } = await supabaseAdmin
      .from("sections")
      .select("id")
      .eq("slug", sectionSlug)
      .single();

    if (sectionError || !section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Supprimer anciens liens
    await supabaseAdmin
      .from("section_products")
      .delete()
      .eq("section_id", section.id);

    // 3️⃣ Insérer nouveaux produits
    const insertData = productIds.map((id: number, index: number) => ({
      section_id: section.id,
      product_id: id,
      display_order: index,
    }));

    if (insertData.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from("section_products")
        .insert(insertData);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}