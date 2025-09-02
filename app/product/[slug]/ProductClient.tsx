"use client"

import { useParams, notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "@/context/CartContext"
import { ProductType } from "@/types/product"
import Image from "next/image"

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
      <div className="px-4 sm:px-8 py-12 max-w-6xl mx-auto animate-pulse relative top-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="h-[70vh] bg-neutral-200 rounded-3xl" />
          <div className="space-y-6 sticky top-24">
            <div className="h-8 w-2/3 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return notFound()

  const mainImage = product.product_images?.[0]?.url
  const otherImages = product.product_images?.slice(1) || []

  return (
    <div className="px-4 sm:px-8 py-12 max-w-6xl mx-auto relative top-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* IMAGES */}
        <div className="space-y-4">
          {/* Grande image principale */}
          {mainImage && (
            <div className="relative w-full max-h-[70vh] aspect-[3/4] bg-neutral-100 rounded-3xl overflow-hidden shadow-sm">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          )}

          {/* Autres images */}
          {otherImages.length > 0 && (
            <div>
              {/* Desktop : grid 2 colonnes */}
              <div className="hidden sm:grid grid-cols-2 gap-4">
                {otherImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden shadow-sm"
                  >
                    <Image
                      src={img.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile : stack vertical */}
              <div className="sm:hidden flex flex-col gap-3">
                {otherImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative h-40 w-full bg-neutral-100 rounded-xl overflow-hidden shadow-sm"
                  >
                    <Image
                      src={img.url}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
