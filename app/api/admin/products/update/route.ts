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
      category,
      gender,
      colors,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id manquant" },
        { status: 400 }
      );
    }

    /* ------------------------------------------------ */
    /* 1️⃣ UPDATE PRODUIT                                */
    /* ------------------------------------------------ */
    const { error: productError } = await supabase
      .from("products")
      .update({
        name,
        description,
        details,
        size_fit,
        price,
        category,
        gender,
      })
      .eq("id", id);

    if (productError) {
      console.error("Erreur update produit:", productError);
      return NextResponse.json(
        { error: productError.message },
        { status: 500 }
      );
    }

    /* ------------------------------------------------ */
    /* 2️⃣ GESTION DES COULEURS (product_images)         */
    /* ------------------------------------------------ */
    if (Array.isArray(colors)) {
      const normalizedColors = colors
        .map((c: any) => ({
          id: c.id ?? null,
          color: c.color?.toLowerCase(),
        }))
        .filter((c) => !!c.color);

      // 🔍 Images existantes
    const { data, error: fetchError } = await supabase
        .from("product_images")
        .select("id, color")
        .eq("productId", id);

    if (fetchError) {
        console.error("Erreur récupération images:", fetchError);
        return NextResponse.json(
            { error: "Erreur récupération images" },
            { status: 500 }
        );
    }

    const existingImages = data ?? [];
    const existingIds = existingImages.map((img) => img.id);

      /* ---------- UPDATE / INSERT ---------- */
      for (const c of normalizedColors) {
        if (c.id && existingIds.includes(c.id)) {
          // UPDATE
          const { error } = await supabase
            .from("product_images")
            .update({ color: c.color })
            .eq("id", c.id)
            .eq("productId", id);

          if (error)
            console.error("Erreur update color:", error);
        } else {
          // INSERT
          const { error } = await supabase
            .from("product_images")
            .insert({
              productId: id,
              color: c.color,
              url: null,
            });

          if (error)
            console.error("Erreur insert color:", error);
        }
      }

      /* ---------- DELETE ---------- */
      const keptIds = normalizedColors
        .filter((c) => !!c.id)
        .map((c) => c.id);

      const toDelete = existingImages.filter(
        (img) => !keptIds.includes(img.id)
      );

      if (toDelete.length > 0) {
        const { error } = await supabase
          .from("product_images")
          .delete()
          .in(
            "id",
            toDelete.map((img) => img.id)
          )
          .eq("productId", id);

        if (error)
          console.error("Erreur delete color:", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erreur API update product:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
