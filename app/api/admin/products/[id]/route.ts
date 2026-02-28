import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
  .from("products")
  .select(`
    *,
    product_images (*),
    product_sizes (*),
    product_suggestions!product_suggestions_product_id_fkey (
      suggested_product_id,
      display_order,
      suggested:products!product_suggestions_suggested_product_id_fkey (
        id,
        name,
        slug
      )
    )
  `)
  .eq("id", id)
  .single();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}