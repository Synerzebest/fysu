"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Product from "@/components/Product"

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [page, setPage] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pages/${slug}`)

        if (!res.ok) {
          throw new Error("Collection not found")
        }

        const data = await res.json()
        setPage(data.page)
        console.log(data.products)
        setProducts(data.products ?? [])
      } catch (err) {
        console.error(err)
        router.replace("/404")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-20 text-center text-neutral-500">
          Chargement…
        </div>
        <Footer />
      </>
    )
  }

  if (!page) {
    return (
      <>
        <Navbar />
        <div className="p-20 text-center text-neutral-500">
          Page introuvable.
        </div>
        <Footer />
      </>
    )
  }

  const hasHero = Boolean(page.hero_image)

  return (
    <>
      <Navbar />

      {/* HERO */}
      {hasHero && (
        <div className="relative top-24 w-full h-[300px] md:h-[500px]">
          <Image
            src={page.hero_image}
            alt={page.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div
        className={`relative p-6 pb-44 ${
          hasHero ? "top-36" : "top-24"
        }`}
      >
        {products.length === 0 ? (
          <p className="text-neutral-500">
            Aucun produit dans cette collection.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
