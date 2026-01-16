import { supabaseServer } from "@/lib/supabaseServer";
import { randomUUID } from "crypto";

export const runtime = "nodejs"; // 🔥 obligatoire (Buffer + service role)

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file" }), {
        status: 400,
      });
    }

    const ext = file.name.split(".").pop();
    const filePath = `hero/${randomUUID()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("hero-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("hero-images")
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({ url: data.publicUrl }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur upload" }), {
      status: 500,
    });
  }
}
