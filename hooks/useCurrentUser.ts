"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

type Profile = {
  id: string;
  name: string | null;
  role: string | null;
  created_at: string | null;
};

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        if (!mounted) return;

        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          const { data: profileData } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", sessionUser.id)
            .maybeSingle();

          if (!mounted) return;
          setProfile(profileData ?? null);
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    loadInitialSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        const nextUser = session?.user ?? null;
        setUser(nextUser);

        if (nextUser) {
          const { data: profileData } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", nextUser.id)
            .maybeSingle();

          if (!mounted) return;
          setProfile(profileData ?? null);
        } else {
          setProfile(null);
        }
      }
    );

    // Sécurité : si pour une raison X ça bloque, on débloque après 3s
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 1500);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return { user, profile, loading };
}