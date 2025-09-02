import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🟢 Requête reçue /api/admin/hero-images/delete :", body);

    const { id, path } = body;

    if (!id || !path) {
      console.warn("⚠️ id ou path manquant :", { id, path });
      return NextResponse.json({ error: "id ou path manquant" }, { status: 400 });
    }

    console.log("➡️ Suppression du fichier storage :", path);
    const { error: storageError } = await supabaseServer
      .storage
      .from("hero-images")
      .remove([path]);

    if (storageError) {
      console.error("❌ Erreur storage:", storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }
    console.log("✅ Fichier supprimé du storage :", path);

    console.log("➡️ Suppression de la ligne DB hero_slider id:", id);
    const { error: dbError } = await supabaseServer
      .from("hero_slider")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("❌ Erreur DB:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    console.log("✅ Ligne supprimée dans hero_slider pour id:", id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("💥 Erreur API delete:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
