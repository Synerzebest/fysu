"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserOders from "@/components/Profile/UserOrders";
import UserWishlist from "@/components/Profile/UserWishlist";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
      router.refresh();
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        return;
      }

      router.replace("/auth/signin");
      router.refresh();

      setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 150);
    } catch (err) {
      console.error("Unexpected logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        <h1 className="text-gray-500 text-4xl text-center">FYSU</h1>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="w-11/12 max-w-7xl relative top-24 flex justify-between items-end mx-auto">
        <h1 className="text-3xl font-dior">
          Hello {user.user_metadata?.name ?? "👋"}
        </h1>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-fit text-foreground/40 rounded cursor-pointer underline underline-offset-1 disabled:opacity-50"
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>

      <UserWishlist />
      <UserOders />

      <div className="relative top-36">
        <ThemeToggle />
      </div>
      <Footer />
    </>
  );
}