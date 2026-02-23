"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
  
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4"
  >
    <div className="w-full max-w-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-white/70 border border-neutral-200 shadow-xl rounded-3xl p-8 space-y-6"
      >
        {/* Title */}
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Connexion
          </h1>
          <p className="text-sm text-neutral-500">
            Accédez à l&apos;univers de FYSU
          </p>
        </div>
  
        {/* Inputs */}
        <div className="space-y-4">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition"
            placeholder="Mot de passe"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
  
        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
  
        {/* Login Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-black text-white py-3 text-sm font-medium transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              Connexion...
            </motion.span>
          ) : (
            "Se connecter"
          )}
        </motion.button>
  
        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-neutral-200" />
          <span className="mx-3 text-xs text-neutral-400">OU</span>
          <div className="flex-grow border-t border-neutral-200" />
        </div>
  
        {/* Google Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-medium shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.3 0 6.3 1.2 8.6 3.2l6.4-6.4C34.7 2.5 29.7 0 24 0 14.8 0 6.8 5.5 3 13.4l7.5 5.8C12.2 13.3 17.6 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.6-.1-2.7-.4-3.9H24v7.4h12.7c-.3 2-1.9 5-5.5 7l8.5 6.6C44.5 36.7 46.5 31 46.5 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.5 28.8c-.5-1.3-.8-2.7-.8-4.3s.3-3 .8-4.3L3 14.4C1.1 18 0 20.9 0 24.5s1.1 6.5 3 10.1l7.5-5.8z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.5-6.6c-2.3 1.6-5.3 2.6-7.4 2.6-6.4 0-11.8-3.8-13.5-9.7L3 34.6C6.8 42.5 14.8 48 24 48z"
            />
          </svg>
          Continuer avec Google
        </motion.button>

        <motion.div
          className="text-sm flex justify-center gap-2"
        >
          <p>Vous n&apos;avez pas encore de compte ?</p>
          <Link href="/auth/signup" className="text-blue-500 underline" >
            Créer un compte
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
  );
}
