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
    let active = true;

    const fetchProfile = async (userId: string) => {
      // maybeSingle évite de throw si rien
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("fetchProfile error:", error);
        setProfile(null);
        return;
      }

      setProfile((data as Profile) ?? null);
    };

    const init = async () => {
      setLoading(true);

      try {
        // plus fiable que getSession côté client
        const { data, error } = await supabaseClient.auth.getUser();

        if (!active) return;

        if (error) {
          console.error("getUser error:", error);
          setUser(null);
          setProfile(null);
          return;
        }

        const sessionUser = data.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          await fetchProfile(sessionUser.id);
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error("useCurrentUser init crash:", e);
        if (!active) return;
        setUser(null);
        setProfile(null);
      } finally {
        if (!active) return;
        setLoading(false); 
      }
    };

    init();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;

      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (nextUser) {
        await fetchProfile(nextUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}