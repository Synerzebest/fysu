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
    let cancelled = false;

    const fetchProfile = async (userId: string) => {
      const { data } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!cancelled) setProfile((data as Profile) ?? null);
    };

    const init = async () => {
      const { data } = await supabaseClient.auth.getSession();
      const sessionUser = data.session?.user ?? null;

      if (cancelled) return;

      setUser(sessionUser);

      if (sessionUser) {
        await fetchProfile(sessionUser.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    init();

    const { data: sub } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        const nextUser = session?.user ?? null;
        setUser(nextUser);

        if (nextUser) {
          await fetchProfile(nextUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  console.log(user)

  return { user, profile, loading };
}
