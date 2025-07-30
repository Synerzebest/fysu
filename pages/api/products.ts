import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { data, error } = await supabase.from('products').select('*')

  if (error) {
    console.error('Erreur Supabase:', error)
    return res.status(500).json({ error: 'Erreur lors de la récupération des produits' })
  }

  return res.status(200).json(data)
}
