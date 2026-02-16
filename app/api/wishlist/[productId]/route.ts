import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;

  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ liked: false });
    }

    const { data, error } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (error) {
      console.error("Erreur fetch wishlist:", error);
      return NextResponse.json({ liked: false });
    }

    return NextResponse.json({ liked: !!data });
  } catch (err) {
    console.error("Crash liked API:", err);
    return NextResponse.json({ liked: false });
  }
}
