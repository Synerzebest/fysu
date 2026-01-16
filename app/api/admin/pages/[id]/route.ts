import { supabaseServer } from "@/lib/supabaseServer";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await supabaseServer();
  const { id } = await context.params;
  try {
    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur suppression page" }), { status: 500 });
  }
}
