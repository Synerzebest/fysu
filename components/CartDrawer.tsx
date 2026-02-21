import { useCart } from "../context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import ReactDOM from "react-dom"

export default function CartDrawer() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Le bouton panier reste à sa place
  const button = (
    <button onClick={() => setIsOpen(true)} className="relative cursor-pointer">
      <ShoppingCart size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  )

  // Si on est côté serveur (SSR), on n'affiche rien
  if (typeof window === "undefined") return button

  // Le contenu du drawer est déplacé dans le body
  const drawer = ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-neutral-800/60 backdrop-blur-sm z-[101] shadow-lg p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white font-dior">Mon panier</h2>
              <button className="text-white cursor-pointer" onClick={() => setIsOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-100 font-dior">Votre panier est vide.</p>
              ) : (
                cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 border-b border-gray-400 pb-4">
                      {/* Image + Infos */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-20 bg-neutral-100 rounded overflow-hidden shrink-0">
                          <Image
                            src={item.product_images?.[0]?.url}
                            alt={item.name}
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm text-white font-sans">{item.name}</p>
                          <p className="text-xs text-white mt-1 font-sans">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                  
                      {/* Actions */}
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="p-[3px] rounded-full bg-gray-100/30 text-white  cursor-pointer hover:bg-gray-100/50 text-sm duration-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-sans text-white">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="p-[3px] rounded-full bg-gray-100/30 text-white text-sm cursor-pointer hover:bg-gray-100/50 duration-300"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cursor-pointer text-gray-100/30 hover:text-gray-200 duration-300"
                          aria-label={`Supprimer ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                ))
                  
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-gray-400 mt-4 space-y-3">
                <div className="flex justify-between text-sm font-medium text-white font-sans">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="text-white text-center w-full bg-black/60 py-2 rounded-md cursor-pointer hover:bg-black/80 duration-300">
                    Passer au paiement
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )

  return (
    <>
      {button}
      {drawer}
    </>
  )
}