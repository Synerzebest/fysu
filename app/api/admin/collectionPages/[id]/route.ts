import { supabaseServer } from "@/lib/supabaseServer";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await supabaseServer();
  try {
    const { error } = await supabase
      .from("collectionPages")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur suppression collectionPage" }), { status: 500 });
  }
}
