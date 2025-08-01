'use client'

import React, { useEffect, useState } from 'react';
import { ProductType } from "@/types/product"
import Product from "../Product";
import ProductSkeleton from '../ProductSkeleton';
  

const NewIn = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewInProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        const filtered = data.filter((p: ProductType) => p.category === 'new-in')
        setProducts(filtered)
      } catch (err) {
        console.error('Erreur récupération produits :', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNewInProducts()
  }, [])

  return (
    <div className="py-8 max-w-6xl mx-auto">
        <h1 className="px-4 text-3xl font-bold mb-6 uppercase">New In</h1>
        <div className="overflow-x-scroll px-4 no-scrollbar">
            <div className="flex gap-2 w-max">
                {loading
                ? Array.from({ length: 6 }).map((_, idx) => <ProductSkeleton key={idx} />)
                : products.map((product) => (
                    <Product key={product.id} product={product} />
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default NewIn
