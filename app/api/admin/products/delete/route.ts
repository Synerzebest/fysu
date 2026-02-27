import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const supabase = supabaseAdmin;
    const body = await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id manquant" },
        { status: 400 }
      );
    }

    /* DELETE product_images                        */

    const { error: imagesError } = await supabase
      .from("product_images")
      .delete()
      .eq("productId", id);

    if (imagesError) {
      console.error("Erreur suppression images :", imagesError);
      return NextResponse.json(
        { error: imagesError.message },
        { status: 500 }
      );
    }

    /* DELETE product                               */

    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (productError) {
      console.error("Erreur suppression produit :", productError);
      return NextResponse.json(
        { error: productError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Erreur API delete product :", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}