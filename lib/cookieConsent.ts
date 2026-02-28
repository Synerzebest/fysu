export type CookieConsent = {
    necessary: true;        // toujours true
    analytics: boolean;
    marketing: boolean;
    personalization: boolean;
    updatedAt: string;      // ISO
    version: number;        // pour migrer plus tard
  };
  
  const KEY = "cookie_consent_v1";
  const DEFAULT: CookieConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
    updatedAt: new Date(0).toISOString(),
    version: 1,
  };
  
  export function getConsent(): CookieConsent | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CookieConsent;
      // garde-fous
      return {
        ...DEFAULT,
        ...parsed,
        necessary: true,
        version: 1,
      };
    } catch {
      return null;
    }
  }
  
  export function setConsent(consent: Omit<CookieConsent, "necessary" | "updatedAt" | "version">) {
    if (typeof window === "undefined") return;
    const payload: CookieConsent = {
      necessary: true,
      ...consent,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
    // broadcast pour que d'autres composants réagissent
    window.dispatchEvent(new Event("cookie-consent-changed"));
  }
  
  export function acceptAll() {
    setConsent({ analytics: true, marketing: true, personalization: true });
  }
  
  export function rejectAll() {
    setConsent({ analytics: false, marketing: false, personalization: false });
  }
  
  export const CONSENT_KEY = KEY;