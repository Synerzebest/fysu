import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.replace(/\s+/g, "_");
    const filePath = `hero-slider/${Date.now()}_${fileName}`;

    // Upload vers Supabase Storage avec service_role
    const { error: uploadError } = await supabaseServer.storage
      .from("hero-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Erreur upload:", uploadError);
      return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
    }

    // Enregistre le path dans la table hero_slider
    const { data, error: insertError } = await supabaseServer
      .from("hero_slider")
      .insert({
        image_path: filePath,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erreur DB:", insertError);
      return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
    }

    return NextResponse.json({ success: true, image: data });
  } catch (err: any) {
    console.error("Erreur API upload:", err.message);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
