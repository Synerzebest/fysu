import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
    const supabase = supabaseAdmin;
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID requis" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
      console.error(error)
    return NextResponse.json(
      { error: error.message || "Erreur suppression catégorie" },
      { status: 500 }
    );
  }
}