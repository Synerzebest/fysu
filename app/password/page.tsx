"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PasswordPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const submit = async () => {
    const res = await fetch("/api/check-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/")
    } else {
      setError("Mot de passe incorrect")
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-4xl font-bold">Coming soon</h1>

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-4 py-2 rounded"
      />

      <button
        onClick={submit}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Entrer
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </main>
  )
}
