"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Product from "@/components/Product"
import ProductFilters from "@/components/ProductFilters"
import StoryBar from "@/components/Stories/StoryBar"
import { ProductType } from "@/types/product"
import ThemeToggle from "@/components/ThemeToggle"

type SectionType = {
  id: string
  title: string
  display_order: number
  section_products: {
    display_order: number
    product: ProductType
  }[]
}

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [page, setPage] = useState<any>(null)
  const [sections, setSections] = useState<SectionType[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    gender: "all",
    sort: "default",
  })

  /* FETCH DATA */

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pages/${slug}`)

        if (!res.ok) throw new Error("Page not found")

        const data = await res.json()

        setPage(data.page)
        setSections(data.sections ?? [])
      } catch (err) {
        console.error(err)
        router.replace("/404")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, router])

  /* FILTER + SORT */

  const applyFilters = (products: ProductType[]) => {
    return products
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
  }

  /* LOADING */

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-[100vh] w-[100vw] font-pagetitle flex items-center justify-center text-neutral-500 text-4xl">
          Fysu
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
        <div className="relative w-full h-[90vh] min-h-[600px]">
          <Image
            src={page.hero_image}
            alt={page.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-lg font-pagetitle font-thin text-white">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {/* STORIES */}
      <StoryBar pageSlug={slug} />

      {/* CONTENT */}
      <div
        className={`relative p-6 pb-44 ${
          hasHero ? "top-28" : "top-24"
        }`}
      >
        {sections.length === 0 ? (
          <p className="text-neutral-500">
            Aucun contenu dans cette page.
          </p>
        ) : (
          <>
            <ProductFilters filters={filters} setFilters={setFilters} />

            {sections
              .sort((a, b) => a.display_order - b.display_order)
              .map((section) => {
                const products = section.section_products
                  ?.sort(
                    (a, b) =>
                      a.display_order - b.display_order
                  )
                  .map((sp) => sp.product)

                const filteredProducts = applyFilters(
                  products ?? []
                )

                if (filteredProducts.length === 0) return null

                return (
                  <div key={section.id} className="mb-20">

                    {/* SECTION TITLE */}
                    <h2 className="text-xl font-pagetitle mb-6">
                      {section.title}
                    </h2>

                    {/* PRODUCTS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                      {filteredProducts.map((product) => (
                        <Product
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
          </>
        )}
      </div>

      <ThemeToggle />
      <Footer />
    </>
  )
}