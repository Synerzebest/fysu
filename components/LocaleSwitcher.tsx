"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition } from "react";
import { locales, type AppLocale } from "@/i18n/routing";

const localeNames: Record<AppLocale, string> = {
  en: "EN",
  nl: "NL",
  fr: "FR",
  ja: "JA",
};

export default function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");
  const [isPending, startTransition] = useTransition();

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as AppLocale;
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <label className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em]">
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={onChange}
        disabled={isPending}
        aria-label={t("label")}
        className="bg-transparent outline-none cursor-pointer disabled:opacity-50"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeNames[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
