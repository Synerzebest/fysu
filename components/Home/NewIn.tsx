'use client'

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from 'antd';
import Link from "next/link";

type ProductType = {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  gender: string
  category: string
  colors: number
  slug: string
}

const Product = ({ product }: { product: ProductType }) => {
    return (
      <div className="relative text-center">
        <div className="absolute left-2 top-2">
          <p className="uppercase tracking-wide text-sm text-gray-500">{product.category}</p>
        </div>
  
        {/* Bouton like indépendant */}
        <div
          className="absolute top-1 right-1 duration-300 cursor-pointer rounded-full p-1 hover:bg-gray-200 z-10"
          onClick={(e) => {
            e.stopPropagation()
            console.log('Liked', product.id)
          }}
        >
          <Heart size={24} strokeWidth={0.75} />
        </div>
  
        {/* Bloc cliquable = image + infos */}
        <Link href={`/product/${product.slug}`} className="group block">
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={600}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-0.5 mt-2">
            <p className="text-sm font-semibold uppercase tracking-wide group-hover:underline transition">
              {product.name}
            </p>
            <p className="text-sm font-light">€{product.price}</p>
            <p className="text-xs text-neutral-500">
              {product.colors} COLOR{product.colors > 1 ? 'S' : ''}
            </p>
          </div>
        </Link>
      </div>
    )
  }

const ProductSkeleton = () => {
    return (
      <div className="relative text-center">
        <div className="absolute left-2 top-2">
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        </div>
        <div className="absolute top-1 right-1 rounded-full p-1">
          <Skeleton.Avatar active size="small" shape="circle" />
        </div>
        <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
          <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="space-y-2 mt-2">
          <Skeleton.Input active size="small" style={{ width: '60%' }} />
          <Skeleton.Input active size="small" style={{ width: '40%' }} />
          <Skeleton.Input active size="small" style={{ width: '50%' }} />
        </div>
      </div>
    )
  }  

const NewIn = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewInProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        console.log(data)
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
    <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">New In</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading
                ? Array.from({ length: 6 }).map((_, idx) => <ProductSkeleton key={idx} />)
                : products.map((product) => (
                    <Product key={product.id} product={product} />
                )
            )}
        </div>
    </div>
  )
}

export default NewIn
