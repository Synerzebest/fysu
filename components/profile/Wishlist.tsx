"use client"

import { useEffect, useState } from "react"
import Product from "../Product"

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([])

  useEffect(() => {
    const loadWishlist = async () => {
      const res = await fetch("/api/wishlist")
      if (res.ok) {
        const data = await res.json()
        setWishlist(data)
      }
    }
    loadWishlist()
  }, [])

  return (
    <div className="pt-8">
      <h1 className="text-2xl font-bold mb-6">Ma liste de souhaits</h1>
      {wishlist.length === 0 && <p>Aucun produit liké.</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((w, idx) => (
          <Product key={idx} product={w.products} />
        ))}
      </div>
    </div>
  )
}
