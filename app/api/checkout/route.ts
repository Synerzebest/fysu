import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    const { cart, user } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // 🔹 Stripe line items (prix en cents)
    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.name} - size ${item.selectedSizeLabel}`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // 🔹 Cart simplifié pour metadata (pour webhook)
    const simplifiedCart = cart.map((item: any) => ({
      productId: item.id,
      sizeId: item.selectedSizeId,
      sizeLabel: item.selectedSizeLabel,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      customer_email: user?.email ?? undefined,

      line_items,

      shipping_address_collection: {
        allowed_countries: ["BE", "FR", "NL", "DE"],
      },

      phone_number_collection: {
        enabled: true,
      },

      billing_address_collection: "auto",

      metadata: {
        userId: user?.id || "",
        cart: JSON.stringify(simplifiedCart),
      },

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}