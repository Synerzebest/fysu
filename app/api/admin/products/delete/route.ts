import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id manquant" }, { status: 400 });
    }

    // On supprime le produit
    const { error } = await supabaseServer
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur DB:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erreur API delete product:", err.message);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
