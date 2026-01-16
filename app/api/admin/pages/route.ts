import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur GET pages" }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  try {
    const body = await req.json();

    const { title, slug, hero_image } = body;

    const { data, error } = await supabase
      .from("pages")
      .insert({
        title,
        slug,
        hero_image,
        visible: true,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur POST page" }), { status: 500 });
  }
}
