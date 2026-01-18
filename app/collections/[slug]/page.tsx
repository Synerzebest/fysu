"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Product from "@/components/Product"
import ProductFilters from "@/components/ProductFilters"

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const isFlowersBloomCollection = slug === "when-the-flowers-bloom"
  const [page, setPage] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    gender: "all",
    sort: "default",
  })
  
  useEffect(() => {
    if (!slug) return
  
    const fetchData = async () => {
      try {
  
        const fetchPromise = fetch(`/api/collections/${slug}`).then(
          async (res) => {
            if (!res.ok) throw new Error("Collection not found")
            const data = await res.json()
            setPage(data.page)
            setProducts(data.products ?? [])
          }
        )
  
        if (isFlowersBloomCollection) {
          await Promise.all([
            fetchPromise,
            new Promise((resolve) => setTimeout(resolve, 2400)),
          ])
        } else {
          await fetchPromise
        }
      } catch (err) {
        console.error(err)
        router.replace("/404")
      } finally {
        setLoading(false)
      }
    }
  
    fetchData()
  }, [slug, router]) 

  const filteredProducts = products
  .filter((p) => {
    if (filters.gender !== "all" && p.gender !== filters.gender)
      return false
    return true
  })
  .sort((a, b) => {
    if (filters.sort === "price-asc") return a.price - b.price
    if (filters.sort === "price-desc") return b.price - a.price
    if (filters.sort === "newest") {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      )
    }
    return 0
  })


  if (loading) {
    return (
      <div className="min-h-[100vh] flex flex-col items-between">
        <Navbar />
  
        <div className="w-screen h-[100vh] relative sm:top-0 top-36 flex items-center justify-center">
          {isFlowersBloomCollection ? (
            <video
              src="/videos/flowers_bloom_loader.MOV"
              autoPlay
              muted
              playsInline
              preload="auto"
              className="w-full"
            />
          ) : (
            <div className="font-pagetitle text-neutral-500 text-4xl">
              Fysu
            </div>
          )}
        </div>
  
        <Footer />
      </div>
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
    <div>
      <Navbar />

      {isFlowersBloomCollection && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/flowers_bloom_bg.jpeg')",
            backgroundRepeat: "repeat",
            backgroundSize: "800px 800px",
            backgroundPosition: "top left",
          }}
        />
      )}

      {/* HERO */}
      {hasHero && (
        <div className="relative top-0 h-[90vh] min-h-[600px]">
          <Image
            src={page.hero_image}
            alt={page.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-lg font-pagetitle font-thin text-white text-center">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div
        className={`relative px-6 pb-44 ${
          hasHero ? "top-28" : "top-24"
        }`}
      >
        {products.length === 0 ? (
          <p className="text-neutral-500">
            Aucun produit dans cette collection.
          </p>
        ) : (
          <>
            <ProductFilters filters={filters} setFilters={setFilters} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {filteredProducts.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
