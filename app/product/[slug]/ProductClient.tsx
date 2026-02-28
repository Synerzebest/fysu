"use client"

import { useParams, notFound, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import type { ProductType, ProductSize } from "@/types/product"
import Product from "@/components/Product"
import Image from "next/image"
import { Collapse } from "antd"
import type { CollapseProps } from "antd"
import AddToCartButton from "@/components/ui/AddToCartButton"
import ProductDecorationSection from "@/components/Product/ProductDecorationSection"

export default function ProductClient() {
  const { slug } = useParams() as { slug: string }
  const searchParams = useSearchParams()
  const router = useRouter()

  const [product, setProduct] = useState<ProductType | null>(null)
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null)
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const selectedColor: string | null = searchParams?.get("color")

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`)
        if (!res.ok) throw new Error("Product not found")
        const data: ProductType = await res.json()
        setProduct(data)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  /* ================= DERIVED DATA ================= */

  const filteredImages = useMemo(() => {
    if (!product) return []

    if (!selectedColor) return product.product_images

    return product.product_images.filter(
      (img) =>
        img.color &&
        img.color.toLowerCase() === selectedColor.toLowerCase()
    )
  }, [product, selectedColor])

  const availableColors: string[] = useMemo(() => {
    if (!product) return []

    return Array.from(
      new Set(
        product.product_images
          .map((img) => img.color)
          .filter(Boolean)
      )
    )
  }, [product])

  const availableSizes: ProductSize[] = useMemo(() => {
    if (!product?.product_sizes) return []

    return product.product_sizes
      .filter((s) => s.is_active && s.stock > 0)
      .sort((a, b) => a.size.localeCompare(b.size))
  }, [product])

  /* ================= HANDLERS ================= */

  const handleColorClick = (color: string) => {
    const params = new URLSearchParams(window.location.search)

    if (selectedColor === color) {
      params.delete("color")
    } else {
      params.set("color", color)
    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  /* ================= STATES ================= */

  if (loading) return <div className="p-20">Loading...</div>
  if (!product) return notFound()

  const mainImage = filteredImages[0]?.url
  const otherImages = filteredImages.slice(1)

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Product details",
      children: <p>{product.details ?? "No details available."}</p>,
    },
    {
      key: "2",
      label: "Size & fit",
      children: <p>{product.size_fit ?? "No info available."}</p>,
    },
  ]

  /* ================= RENDER ================= */

  return (
    <div className="max-w-6xl mx-auto py-12 relative top-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
  
        {/* ================= IMAGES ================= */}
        <div className="space-y-6 sm:space-y-8">
  
          {/* Grande image principale */}
          {mainImage && (
            <div
              className="
                relative w-full h-auto aspect-[3/4] overflow-hidden
                rounded-3xl sm:rounded-none
              "
            >
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
              {/* DESKTOP */}
              <div className="hidden sm:grid grid-cols-2 gap-4">
                {otherImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-[3/4] overflow-hidden"
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
  
              {/* MOBILE */}
              <div className="sm:hidden flex flex-col gap-3">
                {otherImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-[3/4] overflow-hidden"
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
  
        {/* ================= INFO ================= */}
        <div className="space-y-6 sticky top-24 self-start">
  
          <h1 className="text-4xl font-medium">
            {product.name}
          </h1>
  
          <p className="text-lg font-bold">
            {new Intl.NumberFormat("fr-BE", {
              style: "currency",
              currency: "EUR",
            }).format(product.price)}
          </p>
  
          {/* COLORS */}
          {availableColors.length > 0 && (
            <div className="flex gap-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  className={`w-7 h-7 rounded-full border ${
                    selectedColor === color
                      ? "ring-2 ring-black"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
  
          {/* SIZES */}
          {availableSizes.length > 0 && (
            <div className="space-y-3">

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Size</p>

                <button
                  type="button"
                  className="text-sm underline text-gray-600 hover:text-black"
                >
                  Size guide
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {availableSizes.map((s) => {
                  const isSelected = selectedSizeId === s.id

                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSizeId(s.id)
                        setSelectedSizeLabel(s.size)
                      }}
                      className={`
                        min-w-[48px]
                        px-4 py-2
                        text-sm tracking-wide
                        border rounded-md
                        transition-all duration-200
                        ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 text-foreground hover:border-black"
                        }
                      `}
                    >
                      {s.size}
                    </button>
                  )
                })}
              </div>

            </div>
          )}
  
          <AddToCartButton
            product={product}
            selectedSizeId={selectedSizeId}
            selectedSizeLabel={selectedSizeLabel}
          />
  
          <Collapse items={items} bordered={false} ghost />
  
        </div>
      </div>

      <ProductDecorationSection
        decorationText={product.decoration_text}
        decorationImageUrl={product.decoration_image_url}
      />
  
      {/* ================= SUGGESTIONS ================= */}
  
      {product.product_suggestions?.length > 0 && (
        <section className="mt-24 w-full">
          <h2 className="text-2xl font-dior text-start mb-12">
            You may also like
          </h2>
  
          <div className="flex gap-8 overflow-x-auto">
            {product.product_suggestions.map((p) => (
              <Product key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}