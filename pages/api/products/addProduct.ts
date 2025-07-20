import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, description, price, imageUrl } = req.body

  if (!name || !price) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
      },
    })

    return res.status(201).json(product)
  } catch (error) {
    console.error('Erreur ajout produit :', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
