"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, Tag, Select, Input, Button, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { motion } from "framer-motion";

type ProductImage = { id: number; url: string; color: string };

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  gender: string;
  product_images?: ProductImage[];
};

type OrderItem = {
  product_id?: number;
  quantity?: number;
  product?: Product | null;
};

type ShippingData = {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string | null;
    city?: string;
    postal_code?: string;
    country?: string;
  };
};

type Order = {
  id: string;
  status: "pending" | "paid" | "shipped" | "cancelled" | "refunded";
  total: number;
  currency?: string | null;
  email?: string | null;
  createdAt?: string;
  stripe_session_id?: string | null;
  shipping_data?: ShippingData | null;
  items: OrderItem[];
};

const STATUS_COLORS: Record<Order["status"], "blue" | "green" | "orange" | "red"> = {
  pending: "orange",
  paid: "green",
  shipped: "blue",
  cancelled: "red",
  refunded: "red",
};

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [status, setStatus] = useState<string>("");
  const [q, setQ] = useState<string>("");

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (status) params.set("status", status);
      if (q.trim()) params.set("q", q.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");

      setOrders(data.orders ?? []);
      setTotalCount(data.totalCount ?? 0);
    } catch (e: any) {
      message.error(e?.message ?? "Erreur chargement commandes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, pageSize, status]);

  async function updateStatus(orderId: string, nextStatus: Order["status"]) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur update");

      message.success("Statut mis à jour");
      load();
    } catch (e: any) {
      message.error(e?.message ?? "Erreur update statut");
    }
  }

  const columns: ColumnsType<Order> = useMemo(
    () => [
      {
        title: "Commande",
        dataIndex: "id",
        render: (id: string) => (
          <div>
            <div className="text-xs text-neutral-500">#{id.slice(0, 8)}</div>
            <div className="text-xs text-neutral-400">{id}</div>
          </div>
        ),
      },
      {
        title: "Client",
        dataIndex: "email",
        render: (email?: string) => <span>{email ?? "—"}</span>,
      },
      {
        title: "Total",
        dataIndex: "total",
        render: (t: number) => (
          <span className="font-semibold">
            €{((t ?? 0) / 100).toFixed(2)}
          </span>
        ),
      },
      {
        title: "Statut",
        dataIndex: "status",
        render: (s: Order["status"]) => (
          <Tag color={STATUS_COLORS[s]}>{s.toUpperCase()}</Tag>
        ),
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        render: (d?: string) => (d ? new Date(d).toLocaleString() : "—"),
      },
      {
        title: "Actions",
        render: (_, row) => (
          <Select
            value={row.status}
            style={{ width: 160 }}
            onChange={(v) => updateStatus(row.id, v as Order["status"])}
            options={[
              { value: "pending", label: "Pending" },
              { value: "paid", label: "Paid" },
              { value: "shipped", label: "Shipped" },
              { value: "cancelled", label: "Cancelled" },
              { value: "refunded", label: "Refunded" },
            ]}
          />
        ),
      },
    ],
    []
  );

  function formatAddress(order: Order) {
    const s = order.shipping_data;
    if (!s?.address) return "Adresse indisponible";

    return `${s.name ?? ""}
${s.address.line1 ?? ""}
${s.address.line2 ?? ""}
${s.address.postal_code ?? ""} ${s.address.city ?? ""}
${s.address.country ?? ""}
${s.phone ? `Tel: ${s.phone}` : ""}`;
  }

  function copyAddress(order: Order) {
    const text = formatAddress(order);
    navigator.clipboard.writeText(text);
    message.success("Adresse copiée");
  }

  function printLabel(order: Order) {
    const text = formatAddress(order);
    const printWindow = window.open("", "", "width=600,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Étiquette</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            .label { border: 2px solid black; padding: 20px; width: 300px; }
          </style>
        </head>
        <body>
          <div class="label">
            <pre>${text}</pre>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-11/12 max-w-7xl mx-auto py-10 relative top-24"
    >
      <h1 className="text-2xl font-dior mb-6">Commandes</h1>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          pagination={{
            current: page,
            pageSize,
            total: totalCount,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          expandable={{
            expandedRowRender: (order) => (
              <div className="space-y-6">
                {/* SHIPPING */}
                <div className="border rounded-xl p-4 bg-neutral-50">
                  <h3 className="font-semibold mb-2">
                    Adresse de livraison
                  </h3>

                  <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
                    {formatAddress(order)}
                  </pre>

                  <div className="flex gap-3 mt-4">
                    <Button onClick={() => copyAddress(order)}>
                      Copier adresse
                    </Button>

                    <Button onClick={() => printLabel(order)}>
                      Imprimer étiquette
                    </Button>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="flex gap-4 overflow-x-auto">
                  {order.items?.map((it, i) => {
                    const p = it.product;
                    const img = p?.product_images?.[0]?.url ?? "/placeholder.png";

                    return (
                      <div
                        key={`${order.id}-${i}`}
                        className="min-w-[200px] border rounded-xl overflow-hidden bg-white"
                      >
                        <img
                          src={img}
                          className="h-40 w-full object-cover"
                        />
                        <div className="p-3 text-sm">
                          <div className="font-medium">
                            {p?.name ?? "Produit"}
                          </div>
                          <div className="text-neutral-500">
                            Qté: {it.quantity}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          }}
        />
      )}
    </motion.div>
  );
}