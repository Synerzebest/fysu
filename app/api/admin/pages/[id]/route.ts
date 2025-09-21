import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params

  const { error } = await supabaseServer.from("pages").delete().eq("id", id)

  if (error) {
    console.error("Erreur DB:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
