import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

// Fonction pour slugifier un nom
function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD") // accents
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // remplace tout par des -
    .replace(/^-+|-+$/g, ""); // retire les - en début/fin
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, description, price, imageUrls, gender, category, colors, details, size_fit } = req.body;

  if (!name || !price || !description || !imageUrls?.length || !gender || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Slug unique
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    // Vérifie si le slug existe déjà
    while (true) {
      const { data: existing, error } = await supabaseServer
        .from("products")
        .select("id")
        .eq("slug", slug)
        .single();

      if (error) break; // pas trouvé = slug dispo
      slug = `${baseSlug}-${counter++}`;
    }

    // 1️⃣ Créer le produit
    const { data: product, error: insertError } = await supabaseServer
      .from("products")
      .insert({
        name,
        description,
        price: parseFloat(price),
        slug,
        gender,
        category,
        colors: parseInt(colors),
        details,
        size_fit
      })
      .select()
      .single();

    if (insertError || !product) {
      console.error("Erreur ajout produit :", insertError);
      return res.status(500).json({ error: "Erreur insertion produit" });
    }

    // 2️⃣ Ajouter les images liées
    if (imageUrls.length > 0) {
      const { error: imagesError } = await supabaseServer
        .from("product_images")
        .insert(
          imageUrls.map((url: string) => ({
            productId: product.id,
            url,
          }))
        );

      if (imagesError) {
        console.error("Erreur ajout images:", imagesError);
        return res.status(500).json({ error: "Erreur insertion images" });
      }
    }

    // 3️⃣ Retourner le produit avec ses images
    return res.status(201).json({ ...product, images: imageUrls });
  } catch (error) {
    console.error("Erreur inconnue :", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
