"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ProductType } from "@/types/product"

const Product = ({ product }: { product: ProductType }) => {
  const [liked, setLiked] = useState(false)

  // Vérifie si ce produit est déjà dans la wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist/${product.id}`)
        const data = await res.json()
        setLiked(data.liked)
      } catch (err) {
        console.error("Erreur check wishlist:", err)
      }
    }
    checkWishlist()
  }, [product.id])

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      const res = await fetch("/api/wishlist", {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      })

      if (res.ok) {
        setLiked(!liked)
      } else {
        console.error("Erreur ajout/suppression wishlist")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="relative text-center max-w-[350px] group">
      {/* Catégorie */}
      <div className="absolute left-2 top-2 bg-white/70 rounded-md px-2 py-0.5">
        <p className="uppercase tracking-wide text-xs text-gray-600">
          {product.category}
        </p>
      </div>

      {/* Bouton like */}
      <button
        onClick={toggleLike}
        className="absolute top-2 right-2 rounded-full p-1.5 hover:bg-gray-200 cursor-pointer transition z-10"
      >
        <Heart
          size={22}
          className={`transition-colors ${
            liked ? "fill-gray-700 text-gray-700" : "text-gray-700"
          }`}
          strokeWidth={1.5}
        />
      </button>

      {/* Image + infos */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
          <Image
            src={product.product_images?.[0]?.url ?? "/placeholder.png"}
            alt={product.name}
            width={400}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="space-y-0.5 mt-2">
          <p className="text-sm font-semibold uppercase tracking-wide group-hover:underline transition">
            {product.name}
          </p>
          <p className="text-sm font-light">€{product.price}</p>
          <p className="text-xs text-neutral-500">
            {product.colors} COLOR{product.colors > 1 ? "S" : ""}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default Product
