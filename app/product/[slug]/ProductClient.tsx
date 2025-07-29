"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { ProductType } from "@/types/product"

export default function ProductClient() {
  const { slug } = useParams() as { slug: string }
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`)
        if (!res.ok) throw new Error("Product not found")
        const data = await res.json()
        setProduct(data)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="px-4 sm:px-8 py-12 max-w-6xl mx-auto animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Skeleton image */}
          <div className="h-[80vh] overflow-y-auto flex flex-col gap-6 pr-2">
            <div className="w-full aspect-[3/4] bg-neutral-200 rounded-3xl" />
          </div>
  
          {/* Skeleton text */}
          <div className="space-y-6 sticky top-24">
            <div className="space-y-2">
              <div className="h-8 w-2/3 bg-neutral-200 rounded" />
              <div className="h-6 w-1/4 bg-neutral-200 rounded" />
            </div>
  
            <div className="space-y-2">
              <div className="h-4 w-full bg-neutral-200 rounded" />
              <div className="h-4 w-5/6 bg-neutral-200 rounded" />
              <div className="h-4 w-3/4 bg-neutral-200 rounded" />
            </div>
  
            <div className="pt-6">
              <div className="h-12 bg-neutral-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!product) return notFound()

  return (
    <div className="px-4 sm:px-8 py-12 max-w-6xl mx-auto relative top-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* IMAGES */}
        <div className="h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-y-auto flex flex-col gap-6 pr-2">
          <div className="relative w-full aspect-[3/4] bg-neutral-100 rounded-3xl overflow-hidden shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* INFOS */}
        <div className="space-y-6 sticky top-24">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              {product.name}
            </h1>
            <p className="text-xl text-neutral-700">€{product.price}</p>
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>
          )}

          <div className="pt-6">
            <button
              className="cursor-pointer w-full bg-black text-white rounded-full py-3 text-sm font-medium tracking-wide hover:bg-neutral-800 transition duration-300"
              onClick={() => addToCart(product)}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
