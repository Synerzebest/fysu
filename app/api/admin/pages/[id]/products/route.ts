import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await supabaseServer();
  const { id } = await params;

  try {
    const body = await req.json();

    if (!Array.isArray(body.productIds)) {
      return new Response(
        JSON.stringify({ error: "productIds invalide" }),
        { status: 400 }
      );
    }

    const productIds = Array.from(
      new Set(
        body.productIds
          .map((id: any) => Number(id))
          .filter((id: number) => Number.isInteger(id))
      )
    );

    await supabase
      .from("pages")
      .update({
        products: productIds,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "Erreur update produits" }),
      { status: 500 }
    );
  }
}
