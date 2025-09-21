"use client"

import { useParams, notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "@/context/CartContext"
import { ProductType } from "@/types/product"
import Image from "next/image"
import { Button, Select, Collapse, Row, Col } from "antd"
import type { CollapseProps } from "antd"
import Link from "next/link";
const { Option } = Select

export default function ProductClient() {
  const { slug } = useParams() as { slug: string }
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

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
    <div className="px-0 sm:px-8 py-0 sm:py-12 max-w-6xl mx-auto relative sm:top-12 top-0">
      <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-12 items-start">
        {/* IMAGES */}
        <div className="space-y-6 sm:h-auto h-[66vh] overflow-y-scroll">
          {/* Grande image principale */}
          {mainImage && (
            <div className="relative w-full max-h-[70vh] aspect-[3/4] bg-neutral-100 sm:rounded-3xl overflow-hidden sm:shadow-sm">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
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
                    className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden sm:shadow-sm"
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
                    className="relative h-92 w-full bg-neutral-100 overflow-hidden shadow-sm"
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
            </div>
          )}
        </div>

        {/* INFOS */}
        <div className="space-y-6 sticky top-24 p-4 sm:p-0">
          <div className="sm:space-y-2 space-y-0">
            <h1 className="text-md sm:text-4xl font-medium tracking-wide text-neutral-900">
              {product.name}
            </h1>
            <p className="text-lg text-neutral-700 font-extrabold">{product.price} EUR</p>
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>
          )}

          <div className="pt-6">
            <div className="bg-gray-100 rounded-xl p-6 space-y-4">
              {/* Top row: Select size + size guide */}
              <Row justify="space-between" align="middle">
                <Col>
                  <Select placeholder="Please select a size" className="w-40">
                    <Option value="s">S</Option>
                    <Option value="m">M</Option>
                    <Option value="l">L</Option>
                    <Option value="xl">XL</Option>
                  </Select>
                </Col>
                <Col>
                  <Link href="#" className="text-sm underline !text-gray-600 !hover:text-black">
                    Size guide
                  </Link>
                </Col>
              </Row>

              {/* Add to bag button */}
              <Button
                type="primary"
                block
                size="large"
                onClick={() => addToCart(product)}
                className="!bg-black !rounded-none !py-5 text-sm font-medium tracking-wide hover:!bg-neutral-800 transition"
              >
                Add to bag
              </Button>

              {/* Collapse panels */}
              <Collapse items={items} bordered={false} ghost expandIconPosition="end" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
