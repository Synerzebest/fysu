import { supabaseClient } from '@/lib/supabaseClient'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (typeof slug !== 'string') return res.status(400).json({ error: 'Invalid slug' })

  const { data: product, error } = await supabaseClient
    .from('products')
    .select(`
      *,
      product_images ( id, url )
    `)
    .eq('slug', slug)
    .single()

  if (error || !product) {
    console.error(error)
    return res.status(404).json({ error: 'Product not found' })
  }

  return res.status(200).json(product)
}
