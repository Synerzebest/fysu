import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type Params = { productId: string };

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json({ liked: false });
    }

    const supabase = await supabaseServer();

    // récupérer user connecté via session Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ liked: false });
    }

    const { data, error } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", Number(productId))
      .maybeSingle();

    if (error) {
      console.error("Erreur fetch wishlist:", error);
      return NextResponse.json({ liked: false });
    }

    return NextResponse.json({ liked: !!data });
  } catch (err) {
    console.error("Crash GET /api/wishlist/[productId]:", err);
    return NextResponse.json({ liked: false });
  }
}