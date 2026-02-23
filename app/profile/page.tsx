"use client";

import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import UserOders from "@/components/Profile/UserOrders";

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
    router.push("/auth/signin");
    return null;
  }

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/auth/signin");
  };

  return (
    <>
    <Navbar />
    <div className="w-full max-w-7xl relative top-24 flex justify-between items-end mx-auto">
      <h1 className="text-3xl font-dior">Bonjour {user.user_metadata.name}</h1>

      <button
        onClick={handleLogout}
        className="w-fit text-foreground/40 rounded cursor-pointer underline underline-offset-1"
      >
        Se déconnecter
      </button>
    </div>

    <UserOders />

    <Footer />
    </>
  );
}
