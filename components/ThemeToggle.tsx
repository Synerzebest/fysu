"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved === "dark";
    setIsOn(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const next = !isOn;
    setIsOn(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <div className="w-full relative top-24 flex flex-col items-center justify-center py-10">
      <button
        type="button"
        onClick={toggle}
        aria-label="Light switch"
        aria-pressed={isOn}
        className="relative w-28 h-44 cursor-pointer"
      >
        {/* Plaque (simple, blanche) */}
        <div
          className="
            absolute inset-0 rounded-2xl toggle-button-bg
            border border-black/20
            shadow-[0_8px_18px_rgba(0,0,0,0.18)]
          "
        />

        {/* Zone interne (pour éviter que le bouton dépasse) */}
        <div className="absolute inset-3 rounded-xl overflow-hidden">
          {/* Rail léger */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.03] to-black/[0.06]" />

          {/* Bouton basculant */}
          <motion.div
            initial={false}
            animate={{ y: isOn ? 0 : 70 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            whileTap={{ scale: 0.98 }}
            className="
              absolute left-0 right-0 top-0 h-20 rounded-xl toggle-button-btn
              border border-black/10
              shadow-[0_10px_16px_rgba(0,0,0,0.18)]
            "
          >
            {/* petit reflet */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white to-transparent opacity-30" />
          </motion.div>
        </div>
      </button>

      <p className="mt-5 text-sm tracking-widest uppercase text-foreground">
        light {isOn ? "off" : "on"}
      </p>
    </div>
  );
}
