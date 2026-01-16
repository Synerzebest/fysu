import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("collectionPages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const normalized = (data ?? []).map((c) => ({
    ...c,
    products: c.products ?? [],
  }));

  return new Response(
    JSON.stringify(normalized),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, slug, hero_image } = body;

  const { data, error } = await supabaseAdmin
    .from("collectionPages")
    .insert({
      title,
      slug,
      hero_image,
      visible: true,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify(data),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}
