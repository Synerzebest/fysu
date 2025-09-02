import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '@/lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { data, error } = await supabaseServer
    .from('products')
    .select(`
      *,
      product_images ( id, url )
    `)

  if (error) {
    console.error('Erreur Supabase:', error)
    return res.status(500).json({ error: 'Erreur lors de la récupération des produits' })
  }

  return res.status(200).json(data)
}
