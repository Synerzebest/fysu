export const runtime = "nodejs";

import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function POST(req: Request, { params }: any) {
  try {
    const { id } = params
    const { productIds } = await req.json()

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({ error: "productIds requis" }, { status: 400 })
    }

    // Supprimer les anciens liens
    await supabaseServer.from("page_products").delete().eq("page_id", id)

    // Insérer les nouveaux
    const { error } = await supabaseServer
      .from("page_products")
      .insert(productIds.map((pid) => ({ page_id: id, product_id: pid })))

    if (error) {
      console.error("Erreur insert page_products:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Crash API page_products:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
