export const runtime = "nodejs";

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
  
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }
  
    const supabase = supabaseAdmin;
  
    // 🔒 Anti-duplicate
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();
  
    if (existing) {
      return NextResponse.json({ received: true });
    }
  
    // 🔹 Parse cart metadata (avec tailles)
    let cartFromMetadata: Array<{
      productId: string;
      sizeId: string;
      sizeLabel: string;
      quantity: number;
    }> = [];
  
    try {
      if (session.metadata?.cart) {
        cartFromMetadata = JSON.parse(session.metadata.cart);
      }
    } catch (e) {
      console.error("Invalid metadata.cart JSON:", e);
    }
  
    // ⚠️ Sécurité : userId obligatoire
    if (!session.metadata?.userId) {
      console.error("Missing userId in metadata");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
  
    // 🔥 Décrémentation du stock par taille
    for (const item of cartFromMetadata) {
      const { data: sizeRow, error: fetchError } = await supabase
        .from("product_sizes")
        .select("stock")
        .eq("id", item.sizeId)
        .single();
  
      if (fetchError || !sizeRow) {
        console.error("Size not found:", item.sizeId);
        continue;
      }
  
      const newStock = sizeRow.stock - item.quantity;
  
      if (newStock < 0) {
        console.error("Stock négatif détecté pour size:", item.sizeId);
        continue;
      }
  
      await supabase
        .from("product_sizes")
        .update({ stock: newStock })
        .eq("id", item.sizeId);
    }
  
    const shipping = session.customer_details;
  
    const items = cartFromMetadata.map((i) => ({
      product_id: Number(i.productId),
      size_id: i.sizeId,
      size_label: i.sizeLabel,
      quantity: i.quantity,
    }));
  
    const { error } = await supabase.from("orders").insert({
      id: crypto.randomUUID(),
      user_id: session.metadata.userId,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      email: shipping?.email ?? session.customer_email,
      total: session.amount_total,
      currency: session.currency,
      status: "paid",
      shipping_data: shipping,
      items,
    });
  
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}