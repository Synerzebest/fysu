import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function POST(req: Request) {
    const supabase = supabaseAdmin;
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Nom catégorie requis" },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, slug }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
      console.error(error)
    return NextResponse.json(
      { error: error.message || "Erreur création catégorie" },
      { status: 500 }
    );
  }
}