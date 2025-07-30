"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { ProductType } from "@/types/product"
import toast from "react-hot-toast"

type CartItem = ProductType & { quantity: number }

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: ProductType) => void
  removeFromCart: (productId: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: ProductType) => {  
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  
    // toast après le rendu
    toast.success(`${product.name} ajouté au panier`)
  }
  

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
