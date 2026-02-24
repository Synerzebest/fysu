import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type OrderRow = {
  id: string;
  user_id: string;
  status: string;
  total: number; // cents (bigint en DB, number côté JS)
  currency?: string | null;
  items: any; // jsonb
  createdAt?: string;
  stripe_session_id?: string | null;
};

export async function GET() {
  try {
    const supabase = await supabaseServer();

    // 1) User via cookies
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2) Orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const safeOrders = (orders ?? []) as OrderRow[];

    // 3) Extraire tous les product_id (nouveau format items: [{product_id, quantity}])
    const idsSet = new Set<number>();

    for (const o of safeOrders) {
      const items = Array.isArray(o.items)
        ? o.items
        : typeof o.items === "string"
          ? (() => {
              try {
                return JSON.parse(o.items);
              } catch {
                return [];
              }
            })()
          : o.items ?? [];

      if (Array.isArray(items)) {
        for (const it of items) {
          const pid = it?.product_id;
          if (pid !== undefined && pid !== null) {
            const asNumber = Number(pid);
            if (!Number.isNaN(asNumber)) idsSet.add(asNumber);
          }
        }
      }
    }

    const ids = Array.from(idsSet);

    // 4) Fetch products + images (relation via FK product_images.productId -> products.id)
    let productsById: Record<number, any> = {};

    if (ids.length > 0) {
      const { data: products, error: prodError } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          price,
          slug,
          category,
          gender,
          product_images (
            id,
            url,
            color
          )
        `
        )
        .in("id", ids);

      if (prodError) {
        console.error("getUserOrders products fetch error:", prodError);
      } else {
        productsById = Object.fromEntries(
          (products ?? []).map((p: any) => [Number(p.id), p])
        );
      }
    }

    // 5) Enrich items
    const enrichedOrders = safeOrders.map((o) => {
      const rawItems = Array.isArray(o.items)
        ? o.items
        : typeof o.items === "string"
          ? (() => {
              try {
                return JSON.parse(o.items);
              } catch {
                return [];
              }
            })()
          : o.items ?? [];

      // Si ancienne commande (items Stripe line_items), on renvoie tel quel
      const hasProductIds =
        Array.isArray(rawItems) && rawItems.some((it) => it?.product_id != null);

      const items = hasProductIds
        ? rawItems.map((it: any) => {
            const pid = Number(it.product_id);
            return {
              ...it,
              product: !Number.isNaN(pid) ? productsById[pid] ?? null : null,
            };
          })
        : rawItems;

      return { ...o, items };
    });

    return NextResponse.json({ orders: enrichedOrders }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}