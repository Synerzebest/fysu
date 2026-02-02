import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, path } = body;

    if (!id || !path) {
      return NextResponse.json(
        { error: "id ou path manquant" },
        { status: 400 }
      );
    }

    // --- SUPPRESSION STORAGE (service_role) ---
    const { error: storageError } = await supabaseAdmin
      .storage
      .from("hero-images")
      .remove([path]);

    if (storageError) {
      console.error("Erreur storage:", storageError);
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    // --- SUPPRESSION DB (service_role) ---
    const { error: dbError } = await supabaseAdmin
      .from("hero_slider")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Erreur DB:", dbError);
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur API delete:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
