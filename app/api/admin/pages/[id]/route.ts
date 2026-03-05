import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = supabaseAdmin;
  const { id } = await context.params;

  try {
    const body = await req.json();
    const { title, hero_image, slug, visible } = body;

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updatePayload.title = title;
    if (hero_image !== undefined) updatePayload.hero_image = hero_image;
    if (slug !== undefined) updatePayload.slug = slug;
    if (visible !== undefined) updatePayload.visible = visible;

    const { data, error } = await supabase
      .from("pages")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Erreur modification page" }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = supabaseAdmin;
  const { id } = await context.params;

  try {
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Erreur suppression page" }),
      { status: 500 }
    );
  }
}