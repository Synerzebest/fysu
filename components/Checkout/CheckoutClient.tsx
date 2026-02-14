"use client";

import { useCart } from "@/context/CartContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion, AnimatePresence } from "framer-motion";
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
      <div className="max-w-3xl mx-auto py-8 px-4 relative top-24 text-center">
        Chargement...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto py-8 px-4 relative top-24"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        Résumé de votre commande
      </h1>

      <AnimatePresence>
        {cart.length > 0 ? (
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="divide-y rounded-lg shadow-sm bg-white"
          >
            {cart.map((item) => (
              <motion.li
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="py-4 px-3 flex items-center justify-between gap-4"
              >
                <div className="relative w-16 h-20 flex-shrink-0 bg-neutral-100 rounded-md overflow-hidden">
                  <Image
                    src={item.product_images?.[0]?.url ?? "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-500">
                    Quantité : {item.quantity}
                  </p>
                </div>

                <span className="font-semibold whitespace-nowrap">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-neutral-600"
          >
            Votre panier est vide.
          </motion.p>
        )}
      </AnimatePresence>

      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-neutral-50 p-4 rounded-lg shadow-inner"
        >
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
            className="w-full bg-black text-white py-3 rounded-md text-sm font-medium tracking-wide hover:bg-neutral-800 transition disabled:opacity-60"
          >
            {loading
              ? "Redirection en cours..."
              : user
              ? "Procéder au paiement"
              : "Connexion requise"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
