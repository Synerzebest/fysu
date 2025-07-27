import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query

  if (typeof slug !== 'string') return res.status(400).json({ error: 'Invalid slug' })

  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) return res.status(404).json({ error: 'Not found' })

  return res.status(200).json(product)
}
