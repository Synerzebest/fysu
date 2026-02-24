"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserOders from "@/components/Profile/UserOrders";
import UserWishlist from "@/components/Profile/UserWishlist";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
  }, [loading, user, router]);

  if (!user) {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        <h1 className="text-gray-500 text-4xl text-center">FYSU</h1>
      </div>
    )
  }

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.replace("/auth/signin");
  };

  return (
    <>
      <Navbar />

      <div className="w-11/12 max-w-7xl relative top-24 flex justify-between items-end mx-auto">
        <h1 className="text-3xl font-dior">
          Bonjour {user.user_metadata?.name ?? "👋"}
        </h1>

        <button
          onClick={handleLogout}
          className="w-fit text-foreground/40 rounded cursor-pointer underline underline-offset-1"
        >
          Se déconnecter
        </button>
      </div>

      <UserWishlist />
      <UserOders />

      <Footer />
    </>
  );
}