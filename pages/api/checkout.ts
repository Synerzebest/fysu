import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed")

  // Vérifier session
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Non authentifié" })
  }

  // Récupérer l'utilisateur dans Prisma
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!dbUser) {
    return res.status(404).json({ error: "Utilisateur non trouvé" })
  }

  const { cart } = req.body

  // Construire line_items Stripe
  const line_items = cart.map((item: any) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        images: [item.imageUrl],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  )

  // Enregistrer la commande en "pending"
  const order = await prisma.order.create({
    data: {
      userId: dbUser.id,
      status: "pending",
      total,
      items: cart,
    },
  })


  // Créer session Stripe avec metadata (orderId pour webhook)
  const sessionStripe = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/checkout`,
    metadata: {
      orderId: order.id,
    },
  })

  res.status(200).json({ url: sessionStripe.url })
}
