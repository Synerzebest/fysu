import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "userId manquant" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from("Order")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false })

    if (error) {
      console.error("Erreur DB:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Erreur API orders:", err.message)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
