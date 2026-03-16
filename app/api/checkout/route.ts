import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const ALL_STRIPE_ALLOWED_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] = [
  "AC","AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AT","AU","AW","AX","AZ",
  "BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ",
  "CA","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CV","CW","CY","CZ",
  "DE","DJ","DK","DM","DO","DZ",
  "EC","EE","EG","EH","ER","ES","ET",
  "FI","FJ","FK","FO","FR",
  "GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY",
  "HK","HN","HR","HT","HU",
  "ID","IE","IL","IM","IN","IO","IQ","IS","IT",
  "JE","JM","JO","JP",
  "KE","KG","KH","KI","KM","KN","KR","KW","KY","KZ",
  "LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY",
  "MA","MC","MD","ME","MF","MG","MK","ML","MM","MN","MO","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ",
  "NA","NC","NE","NG","NI","NL","NO","NP","NR","NU","NZ",
  "OM",
  "PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PY",
  "QA",
  "RE","RO","RS","RU","RW",
  "SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SZ",
  "TA","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ",
  "UA","UG","US","UY","UZ",
  "VA","VC","VE","VG","VN","VU",
  "WF","WS",
  "XK",
  "YE","YT",
  "ZA","ZM","ZW","ZZ",
];

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
        allowed_countries: ALL_STRIPE_ALLOWED_COUNTRIES,
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