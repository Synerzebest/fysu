"use client";

import { useEffect, useState } from "react";
import { Tag, Spin, Empty } from "antd";
import { motion } from "framer-motion";

type Order = {
  id: string;
  status: string;
  total: number;
  created_at?: string; // supabase default
  createdAt?: string;  // au cas où ton API renomme
  items: string | any[];
};

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders() {
    // Ton endpoint "sans paramètres" doit être un GET (comme l’API que tu as prise)
    const res = await fetch("/api/getUserOrders", { method: "GET" });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || "Erreur récupération commandes");
    }

    return res.json() as Promise<{ orders: Order[] }>;
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { orders } = await fetchOrders();
        if (!cancelled) setOrders(orders ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur inconnue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function statusTag(status: string) {
    const s = (status || "").toLowerCase();
    let color: "blue" | "green" | "orange" | "red" = "blue";
    if (s === "paid") color = "green";
    if (s === "pending") color = "orange";
    if (s === "cancelled") color = "red";
    return <Tag color={color}>{s.toUpperCase()}</Tag>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto py-10 relative top-36"
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Empty description={error} />
      ) : orders.length === 0 ? (
        <Empty description="Aucune commande trouvée" />
      ) : (
        <div className="flex sm:flex-row flex-col gap-4">
          {orders.map((order, idx) => {
            // items: string JSON ou array
            let items: any[] = [];
            try {
              if (typeof order.items === "string") items = JSON.parse(order.items);
              else if (Array.isArray(order.items)) items = order.items;
            } catch {
              items = [];
            }

            const created = order.created_at ?? order.createdAt ?? "";
            const createdLabel = created
              ? new Date(created).toLocaleDateString()
              : "";

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl bg-white shadow-md border border-gray-100 p-6 w-full sm:w-fit"
              >
                {/* Header commande */}
                <div className="flex flex-col items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400">
                      Commande #{order.id.slice(0, 8)}
                    </p>
                    {createdLabel && (
                      <p className="text-sm text-gray-500">{createdLabel}</p>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-base font-semibold">
                      €{Number(order.total ?? 0).toFixed(2)}
                    </p>
                    {statusTag(order.status)}
                  </div>
                </div>

                {/* Liste des items */}
                <div className="flex gap-4 overflow-x-auto py-2">
                  {items.map((item, i) => (
                    <motion.div
                      key={item?.id ?? `${order.id}-${i}`}
                      className="min-w-[180px] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm"
                    >
                      <img
                        src={item?.product_images?.[0]?.url ?? "/placeholder.png"}
                        alt={item?.name ?? "Produit"}
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="p-3 space-y-1">
                        <p className="font-medium text-sm truncate">
                          {item?.name ?? "Produit"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item?.category ?? "—"} • {item?.gender ?? "—"}
                        </p>
                        <p className="text-sm font-semibold">
                          €{Number(item?.price ?? 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qté: {item?.quantity ?? 1}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}