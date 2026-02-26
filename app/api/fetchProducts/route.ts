import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();

  try {
    const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      product_images (
        id,
        url,
        color
      )
    `);

    if (error) {
      console.error("Erreur Supabase :", error);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la récupération des produits" }),
        { status: 500 }
      );
    }

    if (!data) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const formatted = data.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      thumbnail_url:
        product.product_images?.[0]?.url ?? null,
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });

  } catch (err) {
    console.error("Erreur serveur :", err);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
}