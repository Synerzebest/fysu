// /pages/api/checkout.ts
import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed")

  const { cart } = req.body

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

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/checkout`,
  })

  res.status(200).json({ url: session.url })
}
