import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const body = await req.json();

    const {
      id,
      name,
      description,
      details,
      size_fit,
      price,
      category_id,
      gender,
      colors,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id manquant" },
        { status: 400 }
      );
    }


    // Update produit
    const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      details,
      size_fit,
      price: Number(price),
      category_id: category_id ? Number(category_id) : null,
      gender,
    })
    .eq("id", id)
    .select();
  

    if (error) {
      console.error("Erreur update produit:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Gestion des couleurs
    if (Array.isArray(colors)) {
      const normalizedColors = colors
        .map((c: any) => ({
          id: c.id ?? null,
          color: c.color?.toLowerCase(),
        }))
        .filter((c) => !!c.color);

      const { data: existingImages, error: fetchError } =
        await supabase
          .from("product_images")
          .select("id, color")
          .eq("productId", id);

      if (fetchError) {
        return NextResponse.json(
          { error: "Erreur récupération images" },
          { status: 500 }
        );
      }

      const existingIds =
        existingImages?.map((img) => img.id) ?? [];

      /* ---------- UPDATE / INSERT ---------- */

      for (const c of normalizedColors) {
        if (c.id && existingIds.includes(c.id)) {
          await supabase
            .from("product_images")
            .update({ color: c.color })
            .eq("id", c.id)
            .eq("productId", id);
        } else {
          await supabase
            .from("product_images")
            .insert({
              productId: id,
              color: c.color,
              url: "",
            });
        }
      }

      /* ---------- DELETE ---------- */

      const keptIds = normalizedColors
        .filter((c) => !!c.id)
        .map((c) => c.id);

      const toDelete =
        existingImages?.filter(
          (img) => !keptIds.includes(img.id)
        ) ?? [];

      if (toDelete.length > 0) {
        await supabase
          .from("product_images")
          .delete()
          .in(
            "id",
            toDelete.map((img) => img.id)
          )
          .eq("productId", id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur API update product:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}