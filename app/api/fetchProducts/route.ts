import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images ( id, url, color )
      `);

    if (error) {
      console.error("Erreur Supabase :", error);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la récupération des produits" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (err) {
    console.error("Erreur serveur :", err);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
}
