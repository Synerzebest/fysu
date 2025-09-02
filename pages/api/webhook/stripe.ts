import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"
import { buffer } from "micro"
import { prisma } from "@/lib/prisma"

export const config = {
  api: {
    bodyParser: false, // Stripe nécessite le raw body
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed")

  const sig = req.headers["stripe-signature"] as string
  const buf = await buffer(req)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // On écoute l'événement checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "paid" },
        })
      } catch (err: any) {
        console.error("Erreur update order:", err.message)
      }
    }
  }

  res.json({ received: true })
}
