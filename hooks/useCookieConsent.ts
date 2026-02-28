"use client";

import { useEffect, useState } from "react";
import { getConsent, CookieConsent } from "@/lib/cookieConsent";

export function useCookieConsent() {
  const [consent, setConsentState] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const sync = () => setConsentState(getConsent());
    sync();
    window.addEventListener("cookie-consent-changed", sync);
    return () => window.removeEventListener("cookie-consent-changed", sync);
  }, []);

  return consent;
}