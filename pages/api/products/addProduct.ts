import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

// Fonction utilitaire pour transformer un nom en slug
function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD') // remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // remplace tout par des -
    .replace(/^-+|-+$/g, '')     // supprime les - en début/fin
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
    // 1. Générer un slug de base
    let baseSlug = slugify(name)
    let slug = baseSlug
    let counter = 1

    // 2. Vérifier l’unicité
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    // 3. Création du produit avec le slug
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        slug,
        gender,
        category,
        colors
      },
    })

    return res.status(201).json(product)
  } catch (error) {
    console.error('Erreur ajout produit :', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
