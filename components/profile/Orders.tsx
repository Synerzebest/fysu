"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Tag, Spin, Empty } from "antd"
import { motion } from "framer-motion"

type Order = {
  id: string
  status: string
  total: number
  createdAt: string
  items: string | any[]
}

export default function Orders() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchOrders(userId: string) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
    if (!res.ok) throw new Error("Erreur récupération commandes")
    return res.json()
  }

  useEffect(() => {
    if (!session?.user?.id) return
    setLoading(true)
    fetchOrders(session.user.id)
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  function statusTag(status: string) {
    let color = "blue"
    if (status === "paid") color = "green"
    if (status === "pending") color = "orange"
    if (status === "cancelled") color = "red"
    return <Tag color={color}>{status.toUpperCase()}</Tag>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto py-10"
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : orders.length === 0 ? (
        <Empty description="Aucune commande trouvée" />
      ) : (
        <div className="space-y-8">
          {orders.map((order, idx) => {
            let items: any[] = []
            try {
              if (typeof order.items === "string") {
                items = JSON.parse(order.items)
              } else if (Array.isArray(order.items)) {
                items = order.items
              }
            } catch {
              items = []
            }

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl bg-white shadow-md border border-gray-100 p-6 w-fit"
              >
                {/* Header commande */}
                <div className="flex flex-col items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Commande #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-3">
                    <p className="text-base font-semibold">€{order.total.toFixed(2)}</p>
                    {statusTag(order.status)}
                  </div>
                </div>

                {/* Liste des items */}
                <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-2">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="min-w-[180px] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm"
                    >
                      <img
                        src={item.product_images?.[0]?.url}
                        alt={item.name}
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-3 space-y-1">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category} • {item.gender}</p>
                        <p className="text-sm font-semibold">€{item.price}</p>
                        <p className="text-xs text-gray-400">Qté: {item.quantity}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
