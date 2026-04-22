"use client";

import { useTranslations } from "next-intl";

const NewSelectionIntro = () => {
  const t = useTranslations("Home");

  return (
    <section className="relative top-56 w-full bg-transparent px-6 py-8 md:px-10 md:py-10 mb-36">
      <div className="mx-auto grid max-w-md grid-cols-1 gap-y-6 md:w-fit md:max-w-none md:grid-cols-[140px_1px_360px] md:gap-x-10 md:gap-y-0">
        
        {/* LEFT */}
        <div>
          <h2 className="whitespace-nowrap font-dior text-[1.3rem] leading-none text-foreground md:text-[1.45rem]">
            {t("newSelection")}
          </h2>
        </div>

        {/* VERTICAL LINE (hidden mobile) */}
        <div className="hidden md:block h-[92px] bg-foreground/20" />

        {/* RIGHT */}
        <div className="pt-0 md:pt-3">
          <div className="mb-4 h-px w-full max-w-[360px] bg-foreground/35" />
          <p className="w-full max-w-[360px] text-[0.95rem] leading-[1.15] text-foreground/70">
            {t("newSelectionText")}
          </p>
        </div>

      </div>
    </section>
  );
};

export default NewSelectionIntro;
