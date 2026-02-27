import { supabaseServer } from "@/lib/supabaseServer"

export type Paragraph = {
  id: string
  content: string
  order_index: number
}

export type AboutBlock = {
  id: string
  title: string
  image_url: string
  order_index: number
  about_block_paragraphs: Paragraph[]
}

export async function getAboutBlocks(): Promise<AboutBlock[]> {
  const supabase = await supabaseServer()

  const { data, error } = await supabase
    .from("about_blocks")
    .select(`
      *,
      about_block_paragraphs (*)
    `)
    .eq("is_active", true)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("About fetch error:", error)
    return []
  }

  return data as unknown as AboutBlock[]
}