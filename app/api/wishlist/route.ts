import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

// Ajouter un produit à la wishlist
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session:", session)

    if (!session?.user?.email) {
      console.warn("POST wishlist: utilisateur non authentifié")
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    console.log("Body reçu:", body)

    const { productId } = body
    if (!productId) {
      console.warn("POST wishlist: productId manquant")
      return NextResponse.json({ error: "productId requis" }, { status: 400 })
    }

    const { error } = await supabaseServer
      .from("wishlist")
      .insert({ user_id: session.user.id, product_id: productId })

    if (error) {
      console.error("Erreur Supabase insert wishlist:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Produit ajouté à la wishlist:", productId)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Crash POST /api/wishlist:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Récupérer les produits likés
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session:", session)

    if (!session?.user?.email) {
      console.warn("GET wishlist: utilisateur non authentifié")
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { data, error } = await supabaseServer
      .from("wishlist")
      .select(`
        products (
          id,
          name,
          slug,
          price,
          product_images ( url )
        )
      `)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Erreur Supabase select wishlist:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Produits wishlist récupérés:", data?.length)
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Crash GET /api/wishlist:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
