"use client";

import { useCart } from "@/context/CartContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function CheckoutClient() {
  const { cart } = useCart();
  const { user, loading: userLoading } = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!user) {
      setError("Vous devez être connecté pour procéder au paiement.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          user: { id: user.id },
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de paiement introuvable");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <video
          src="/videos/fysu_loader.mov"
          autoPlay
          loop
          muted
          playsInline
          className="w-[70vw] max-w-[520px] h-auto object-contain"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-12 px-4 relative top-24"
    >
      {/* ORDER SUMMARY */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">
          Résumé de commande
        </h2>

        <div className="divide-y rounded-lg border bg-white">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedSizeId}`} className="flex items-center gap-4 p-4">
              <div className="relative w-16 h-20 bg-neutral-100 rounded-md overflow-hidden">
                <Image
                  src={item.product_images?.[0]?.url ?? "/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium">{item.name}</p>

                <p className="text-xs text-neutral-500 mt-1">
                  Taille : {item.selectedSizeLabel}
                </p>

                <p className="text-sm text-neutral-500 mt-1">
                  Quantité : {item.quantity}
                </p>
              </div>

              <span className="font-semibold">
                €{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading || !user}
            className="w-full bg-black text-white py-4 text-sm font-medium tracking-wide hover:bg-neutral-800 transition disabled:opacity-60"
          >
            {loading
              ? "Redirection..."
              : user
              ? "Procéder au paiement"
              : "Connexion requise"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}