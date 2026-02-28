"use client"

import { useParams, notFound, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { ProductType } from "@/types/product"
import Image from "next/image"
import { Select, Collapse, Row, Col } from "antd"
import type { CollapseProps } from "antd"
import Link from "next/link"
const { Option } = Select;
import AddToCartButton from "@/components/ui/AddToCartButton";

export default function ProductClient() {
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null)
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);

  const selectedColor = searchParams?.get("color")

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <span className="font-medium">Product details</span>,
      children: <p>{product?.details ?? "No details available."}</p>,
    },
    {
      key: "2",
      label: <span className="font-medium">Size & fit</span>,
      children: <p>{product?.size_fit ?? "No info available."}</p>,
    },
  ]

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


  const filteredImages = useMemo(() => {
    if (!product?.product_images) return []
    if (!selectedColor) return product.product_images // aucune couleur → toutes les images
    return product.product_images.filter(
      (img) => img.color && img.color.toLowerCase() === selectedColor.toLowerCase()
    )
  }, [product, selectedColor])

  const availableColors = useMemo(() => {
    if (!product?.product_images) return []
    const uniqueColors = Array.from(
      new Set(product.product_images.map((img) => img.color).filter(Boolean))
    )
    return uniqueColors
  }, [product])

  const availableSizes = useMemo(() => {
    if (!product?.product_sizes) return []
  
    return product.product_sizes
      .filter((s) => s.is_active && s.stock > 0)
      .sort((a, b) => a.size.localeCompare(b.size))
  }, [product])

  const handleColorClick = (color: string) => {
    // Si on reclique sur la même couleur → on retire le filtre
    const params = new URLSearchParams(window.location.search)
    if (selectedColor === color) {
      params.delete("color")
    } else {
      params.set("color", color)
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }

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

  const mainImage = filteredImages[0]?.url
  const otherImages = filteredImages.slice(1)

  return (
    <div className="px-0 sm:px-8 py-0 sm:py-12 max-w-6xl mx-auto relative sm:top-12 top-0">
      <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-12 items-start">
        {/* IMAGES */}
        <div className="space-y-6 sm:space-y-8 sm:h-auto h-[66vh] overflow-y-scroll sm:overflow-visible">
          {/* Grande image principale */}
          {mainImage && (
            <div
              className="
                relative w-full h-auto aspect-[3/4] overflow-hidden
                rounded-3xl sm:rounded-none
                sm:shadow-none sm:bg-transparent
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
              <div className="hidden sm:grid grid-cols-2 gap-4">
                {otherImages.map((img) => (
                  <div
                    key={img.id}
                    className="
                      relative aspect-[3/4] overflow-hidden
                      sm:rounded-none sm:shadow-none sm:bg-transparent
                    "
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
  
        {/* INFOS PRODUIT */}
        <div className="space-y-6 sticky top-24 p-4 sm:p-0">
          <div className="sm:space-y-2 space-y-0">
            <h1 className="text-md sm:text-4xl font-medium tracking-wide text-foreground">
              {product.name}
            </h1>
            <p className="text-lg text-foreground/90 font-extrabold">
              {product.price} EUR
            </p>
          </div>
  
          {product.description && (
            <p className="text-sm leading-relaxed text-foreground">
              {product.description}
            </p>
          )}
  
          {/* 🟣 Boules de couleur */}
          {availableColors.length > 0 && (
            <div className="flex items-center gap-3 py-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color!)}
                  className={`w-7 h-7 rounded-full border transition ${
                    selectedColor === color
                      ? "ring-2 ring-black scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color || "#ccc" }}
                  title={color}
                />
              ))}
            </div>
          )}

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <div className="space-y-3">
              <Row justify="space-between" align="middle">
                <Col>
                  <p className="text-sm font-medium">Size</p>
                </Col>
                <Col>
                  <Link
                    href="#"
                    className="text-sm underline !text-gray-600 hover:!text-black"
                  >
                    Size guide
                  </Link>
                </Col>
              </Row>

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
  
          <div className="pt-6">
            <div className="bg-gray-100 rounded-xl p-6 space-y-4">
              <AddToCartButton
                product={product}
                selectedSizeId={selectedSizeId}
                selectedSizeLabel={selectedSizeLabel}
              />
  
              <Collapse items={items} bordered={false} ghost expandIconPlacement="end" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
