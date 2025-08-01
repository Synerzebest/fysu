"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc"
import { Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/profile",
    })

    if (!res || res.error) {
      setError("Email ou mot de passe incorrect")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen bg-neutral-100 px-4"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
        <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2 gap-2">
            <Mail size={18} className="text-neutral-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 gap-2">
            <Lock size={18} className="text-neutral-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-black text-white rounded-lg py-2 font-semibold transition"
          >
            Connexion
          </motion.button>
        </form>

        <div className="my-6 border-t text-center text-sm text-neutral-400 pt-4">
          ou
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-3 w-full px-4 py-2 text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-lg shadow hover:shadow-md transition"
        >
          <FcGoogle size={20} />
          Se connecter avec Google
          <ArrowRight size={16} className="ml-auto text-neutral-400" />
        </motion.button>
      </div>
    </motion.div>
  )
}
