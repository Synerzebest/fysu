"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

type Order = {
  id: string;
  status: string;
  total: number;
  items: any[];
  createdAt: string;
  userId: string;
};

type User = {
  id: string;
  name: string | null;
  email: string;
};

export default function AdminOrders() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    setLoading(true);

    // récupérer les commandes depuis ton API Prisma
    const res = await fetch("/api/admin/orders");
    const data: Order[] = await res.json();
    setOrders(data);

    // aller chercher les users liés dans Supabase
    const userIds = [...new Set(data.map((o) => o.userId))];
    if (userIds.length > 0) {
      const { data: usersData, error } = await supabase
        .from("User")
        .select("id, name, email")
        .in("id", userIds);

      if (!error && usersData) {
        const userMap: Record<string, User> = {};
        usersData.forEach((u) => {
          userMap[u.id] = u;
        });
        setUsers(userMap);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 relative top-24">
        <h1 className="text-2xl font-bold mb-6">Commandes</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : orders.length === 0 ? (
          <p>Aucune commande trouvée.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total (€)</th>
                <th className="p-3">Articles</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3">{o.id.slice(0, 8)}...</td>
                  <td className="p-3">
                    {users[o.userId]?.name ?? users[o.userId]?.email ?? "—"}
                  </td>
                  <td className="p-3">
                      <p className="bg-green-100 border border-green-500 text-green-600 rounded-lg w-fit px-4">
                        {o.status}
                      </p>
                  </td>
                  <td className="p-3 font-semibold">
                    {o.total.toFixed(2)} €
                  </td>
                  <td className="p-3">{o.items.length} produits</td>
                  <td className="p-3">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}
