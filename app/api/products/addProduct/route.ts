import { supabaseServer } from "@/lib/supabaseServer";

async function generateUniqueSlug(baseName: string) {
  const supabase = await supabaseServer();

  const baseSlug = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) break;

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      gender,
      category_id,   // ✅ CHANGÉ
      colors,
      details,
      size_fit,
    } = body;

    // ✅ Validation mise à jour
    if (
      !name ||
      !price ||
      !gender ||
      !category_id ||
      !Array.isArray(colors) ||
      colors.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields or invalid colors" }),
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(name);

    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price: parseFloat(price),
        slug,
        gender,
        category_id,   // ✅ ICI
        details,
        size_fit,
        colors: colors.length,
      })
      .select()
      .single();

    if (insertError || !product) {
      console.error("Erreur insertion produit :", insertError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'insertion du produit." }),
        { status: 500 }
      );
    }

    const allImages: { productId: string; url: string; color: string }[] = [];

    for (const set of colors) {
      const { color, imageUrls } = set;
      if (!color || !Array.isArray(imageUrls)) continue;

      const images = imageUrls.map((url: string) => ({
        productId: product.id,
        url,
        color,
      }));

      allImages.push(...images);
    }

    if (allImages.length > 0) {
      const { error: imgError } = await supabase
        .from("product_images")
        .insert(allImages);

      if (imgError) {
        console.error("Erreur insertion images :", imgError);
        return new Response(
          JSON.stringify({ error: "Erreur lors de l'insertion des images." }),
          { status: 500 }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, product }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Erreur serveur :", err);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
}