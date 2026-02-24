"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useCart();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      setSession(data.session);
      setLoading(false);

      clearCart();
    };

    fetchSession();
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Vérification du paiement...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Paiement introuvable.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-24 px-4 text-center"
    >
      <div className="text-5xl mb-6">🎉</div>

      <h1 className="text-3xl font-bold mb-4">
        Merci pour votre commande !
      </h1>

      <p className="text-neutral-600 mb-6">
        Un email de confirmation a été envoyé à{" "}
        <strong>{session.customer_email}</strong>
      </p>

      <div className="border rounded-lg p-6 bg-neutral-50 text-left mb-8">
        <h2 className="font-semibold mb-4">Résumé</h2>

        {session.line_items?.data?.map((item: any) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.description} × {item.quantity}
            </span>
            <span>
              €{(item.amount_total / 100).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
          <span>Total payé</span>
          <span>
            €{(session.amount_total / 100).toFixed(2)}
          </span>
        </div>
      </div>

      <a
        href="/"
        className="inline-block bg-black text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-neutral-800 transition"
      >
        Retour à la boutique
      </a>
    </motion.div>
  );
}