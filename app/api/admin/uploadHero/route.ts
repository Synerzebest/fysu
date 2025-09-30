import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 })
    }

    const fileName = `heroes/${Date.now()}-${file.name}`

    const { error } = await supabaseServer.storage
      .from("pages")
      .upload(fileName, file, { upsert: true })

    if (error) {
      console.error("Erreur upload Supabase:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseServer.storage
      .from("pages")
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrlData?.publicUrl })
  } catch (err: any) {
    console.error("Crash API uploadHero:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
