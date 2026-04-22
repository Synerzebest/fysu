import { defineRouting } from "next-intl/routing";

export const locales = ["en", "nl", "fr", "ja"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never",
});

export function isAppLocale(locale: string | undefined): locale is AppLocale {
  return !!locale && locales.includes(locale as AppLocale);
}
