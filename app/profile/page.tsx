"use client";

import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        Chargement...
      </div>
    );
  }

  // 🔐 Protection côté client
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="max-w-xl mx-auto mt-20 space-y-6">
      <h1 className="text-3xl font-bold">Mon profil</h1>

      <div className="border rounded-lg p-4 space-y-2">
        <p>
          <strong>Email :</strong> {user.email}
        </p>

        <p>
          <strong>ID :</strong> {user.id}
        </p>

        <p>
          <strong>Nom :</strong> {profile?.name ?? "—"}
        </p>

        <p>
          <strong>Rôle :</strong> {profile?.role ?? "user"}
        </p>

        <p>
          <strong>Créé le :</strong>{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-black text-white py-2 rounded"
      >
        Se déconnecter
      </button>
    </div>
  );
}
