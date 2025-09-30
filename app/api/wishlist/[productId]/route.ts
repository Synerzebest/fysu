import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET(_: Request, { params }: any) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ liked: false })
  }

  const { data, error } = await supabaseServer
    .from("wishlist")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("product_id", params.productId)
    .maybeSingle()

  if (error) {
    console.error("Erreur fetch wishlist:", error)
    return NextResponse.json({ liked: false })
  }

  return NextResponse.json({ liked: !!data })
}
