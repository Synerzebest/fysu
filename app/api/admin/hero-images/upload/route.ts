import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const fileName = file.name.replace(/\s+/g, "_");
    const filePath = `hero-slider/${Date.now()}_${fileName}`;

    const mediaType = file.type.startsWith("video") ? "video" : "image";

    // STORAGE — service_role
    const { error: uploadError } = await supabaseAdmin.storage
      .from("hero-images")
      .upload(filePath, file, { contentType: file.type });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // DB — service_role
    const { data, error: insertError } = await supabaseAdmin
      .from("hero_slider")
      .insert({
        media_path: filePath,
        media_type: mediaType,
      })
      .select()
      .single();

    if (insertError) {
      console.error(insertError);

      // rollback storage
      await supabaseAdmin.storage.from("hero-images").remove([filePath]);

      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, media: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}