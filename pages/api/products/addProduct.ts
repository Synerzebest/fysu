// /pages/api/products/addProduct.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

// Fonction pour slugifier un nom
function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD') // accents
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // remplace tout par des -
    .replace(/^-+|-+$/g, '')     // retire les - en début/fin
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, description, price, imageUrl, gender, category, colors } = req.body

  if (!name || !price || !description || !imageUrl || !gender || !category) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Slug unique
    let baseSlug = slugify(name)
    let slug = baseSlug
    let counter = 1

    // Vérifie si le slug existe déjà
    while (true) {
      const { data: existing, error } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single()

      if (error) break // pas trouvé = slug dispo
      slug = `${baseSlug}-${counter++}`
    }

    const { data, error: insertError } = await supabase
  .from('products')
  .insert({
    name,
    description,
    price: parseFloat(price),
    imageUrl,
    slug,
    gender,
    category,
    colors: parseInt(colors),
  })
  .select()
  .single()


    if (insertError) {
      console.error('Erreur ajout produit :', insertError)
      return res.status(500).json({ error: 'Erreur insertion' })
    }

    return res.status(201).json(data)
  } catch (error) {
    console.error('Erreur inconnue :', error)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
