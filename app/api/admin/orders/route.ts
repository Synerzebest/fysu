import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED_STATUSES = ["pending", "paid", "shipped", "cancelled", "refunded"] as const;
type OrderStatus = (typeof ALLOWED_STATUSES)[number];

function isAllowedStatus(s: any): s is OrderStatus {
  return typeof s === "string" && (ALLOWED_STATUSES as readonly string[]).includes(s);
}

async function requireAdmin() {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, status: 401, error: userError?.message || "Not authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { ok: false as const, status: 500, error: profileError.message };
  }

  if (!profile || profile.role !== "admin") {
    return { ok: false as const, status: 403, error: "Forbidden" };
  }

  return { ok: true as const, userId: user.id };
}

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(5, Number(searchParams.get("pageSize") ?? 10)));
  const status = (searchParams.get("status") ?? "").toLowerCase();
  const q = (searchParams.get("q") ?? "").trim();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from("orders")
    .select("*", { count: "exact" })
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (status && isAllowedStatus(status)) {
    query = query.eq("status", status);
  }

  // Recherche simple sur email / id / stripe_session_id
  if (q) {
    const safe = q.replace(/[%_]/g, "\\$&");
    query = query.or(
      `email.ilike.%${safe}%,id.ilike.%${safe}%,stripe_session_id.ilike.%${safe}%`
    );
  }

  const { data: orders, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Enrichir items avec products + images
  const ordersSafe = orders ?? [];
  const idsSet = new Set<number>();

  for (const o of ordersSafe as any[]) {
    const items = Array.isArray(o.items) ? o.items : [];
    for (const it of items) {
      const pid = it?.product_id;
      const n = Number(pid);
      if (!Number.isNaN(n)) idsSet.add(n);
    }
  }

  const ids = Array.from(idsSet);
  let productsById: Record<number, any> = {};

  if (ids.length > 0) {
    const { data: products, error: prodErr } = await supabaseAdmin
      .from("products")
      .select(
        `
        id,
        name,
        price,
        slug,
        category_id,
        gender,
        product_images (
          id,
          url,
          color
        )
      `
      )
      .in("id", ids);

    if (!prodErr) {
      productsById = Object.fromEntries((products ?? []).map((p: any) => [Number(p.id), p]));
    }
  }

  const enriched = (ordersSafe as any[]).map((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    return {
      ...o,
      items: items.map((it: any) => {
        const pid = Number(it?.product_id);
        return {
          ...it,
          product: !Number.isNaN(pid) ? productsById[pid] ?? null : null,
        };
      }),
    };
  });

  return NextResponse.json(
    {
      orders: enriched,
      page,
      pageSize,
      totalCount: count ?? 0,
    },
    { status: 200 }
  );
}

export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const body = await req.json().catch(() => ({}));
  const orderId = body?.orderId as string | undefined;
  const status = (body?.status ?? "").toLowerCase();

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }
  if (!isAllowedStatus(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}