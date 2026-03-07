"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import Link from "next/link";

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
      <div className="min-h-screen flex items-center justify-center text-neutral-500 text-sm tracking-wide">
        Vérification du paiement…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500 text-sm">
        Paiement introuvable.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="max-w-2xl w-full text-center">

        {/* Header */}
        <h1 className="text-4xl font-semibold tracking-tight mb-4">
          Paiement confirmé
        </h1>

        {/* <p className="text-neutral-500 text-sm mb-12">
          Un email de confirmation a été envoyé à{" "}
          <span className="text-neutral-900 font-medium">
            {session.customer_email}
          </span>
        </p> */}

        {/* Order card */}
        <div className="border border-neutral-200 rounded-2xl p-8 text-left bg-white">

          <div className="space-y-4">
            {session.line_items?.data?.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-neutral-700"
              >
                <span>
                  {item.description} × {item.quantity}
                </span>
                <span className="font-medium text-neutral-900">
                  €{(item.amount_total / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 mt-6 pt-6 flex justify-between text-sm font-medium">
            <span>Total payé</span>
            <span className="text-neutral-900">
              €{(session.amount_total / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-block mt-10 text-sm font-medium text-neutral-900 hover:opacity-60 transition"
        >
          Continuer mes achats
        </Link>
      </div>
    </motion.div>
  );
}