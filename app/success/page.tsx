"use client"

import { useEffect } from "react"
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function SuccessPage() {
  const { cart, clearCart } = useCart()

  useEffect(() => {
    clearCart()
    // Optionnel : ajoute un effet sonore ou un déclencheur de confettis ici
  }, [])

  // On garde le dernier produit en mémoire pour l’afficher
  const lastProduct = cart.length > 0 ? cart[cart.length - 1] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        className="mb-6"
      >
        <CheckCircle size={72} className="text-green-500" />
      </motion.div>

      <motion.h1
        className="text-3xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Paiement confirmé
      </motion.h1>

      <p className="text-gray-600 max-w-md mb-6">
        Merci pour votre achat ! Une confirmation vous a été envoyée par email.
      </p>

      {lastProduct && (
        <motion.div
          className="bg-neutral-100 p-4 rounded-xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative w-40 h-56 mx-auto mb-4">
            <Image
              src={lastProduct.product_images?.[0]?.url}
              alt={lastProduct.name}
              fill
              className="object-contain rounded-xl"
            />
          </div>
          <p className="font-semibold">{lastProduct.name}</p>
          <p className="text-sm text-gray-500">€{lastProduct.price.toFixed(2)}</p>
        </motion.div>
      )}

      <Link
        href="/"
        className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-neutral-800 transition"
      >
        Retour à l'accueil
      </Link>
    </motion.div>
  )
}
