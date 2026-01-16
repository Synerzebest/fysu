import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await supabaseServer();
  const { id } = await context.params;

  try {
    console.log("CollectionPage ID:", id);

    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.productIds)) {
      return new Response(
        JSON.stringify({ error: "productIds manquant ou invalide" }),
        { status: 400 }
      );
    }

    // ✅ CAST + VALIDATION
    const productIds = body.productIds
      .map((id: any) => Number(id))
      .filter((id: number) => Number.isInteger(id));

    if (productIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucun productId valide" }),
        { status: 400 }
      );
    }

    console.log("New products (int[]):", productIds);

    const { error } = await supabase
      .from("collectionPages")
      .update({
        products: productIds, // 🟢 int[]
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("POST /collectionPages/products failed:", err);
    return new Response(
      JSON.stringify({ error: "Erreur mise à jour produits" }),
      { status: 500 }
    );
  }
}
