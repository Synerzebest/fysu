import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
    try {
      const { id, path } = await req.json();
  
      if (!id || !path) {
        return NextResponse.json(
          { error: "id ou path manquant" },
          { status: 400 }
        );
      }
  
      const { error: storageError } = await supabaseServer
        .storage
        .from("hero-images")
        .remove([path]);
  
      if (storageError) {
        console.error("Erreur storage:", storageError);
        return NextResponse.json({ error: storageError }, { status: 400 });
      }
  
      const { error: dbError } = await supabaseServer
        .from("hero_slider")
        .delete()
        .eq("id", Number(id));
  
      if (dbError) {
        console.error("Erreur DB:", dbError);
        return NextResponse.json({ error: dbError }, { status: 400 });
      }
  
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error("Erreur API delete:", err.message);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
  