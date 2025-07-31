"use client"
import { useCart } from "@/context/CartContext"

export default function CheckoutPage() {
  const { cart } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Résumé de votre commande</h1>
      <ul className="divide-y">
        {cart.map((item) => (
          <li key={item.id} className="py-2 flex justify-between">
            <span>{item.name} × {item.quantity}</span>
            <span>€{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-6 font-semibold text-lg">
        <span>Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>
      <button
        onClick={handleCheckout}
        className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-neutral-800 transition"
      >
        Procéder au paiement
      </button>
    </div>
  )
}
