"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 🔥 Créer le profile métier
    if (data.user) {
      await supabaseClient.from("profiles").insert({
        id: data.user.id,
        name: email.split("@")[0],
      });
    }

    router.push("/");
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Créer un compte</h1>

      <input
        className="w-full border px-3 py-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border px-3 py-2"
        placeholder="Mot de passe"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-black text-white py-2"
      >
        {loading ? "Création..." : "Créer un compte"}
      </button>
    </div>
  );
}
