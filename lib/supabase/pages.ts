import { supabaseClient } from "@/lib/supabaseClient"

// Récupérer toutes les pages
export async function getPages() {
  const { data, error } = await supabaseClient.from("pages").select("*").order("created_at")
  if (error) throw error
  return data ?? []
}

const {
    data: { session },
  } = await supabaseClient.auth.getSession()
  
  console.log("User role:", session ? "authenticated" : "anon")
  

// Créer une page
export async function createPage(page: { title: string; slug: string }) {
  const { data, error } = await supabaseClient.from("pages").insert(page).select().single()
  if (error) throw error
  return data
}

// Mettre à jour une page
export async function updatePage(id: string, updates: Partial<{ title: string; slug: string; visible: boolean }>) {
  const { data, error } = await supabaseClient.from("pages").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data
}

// Supprimer une page
export async function deletePage(id: string) {
  const { error } = await supabaseClient.from("pages").delete().eq("id", id)
  if (error) throw error
}
