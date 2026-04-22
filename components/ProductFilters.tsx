"use client"

import { useState } from "react"
import { Select } from "antd"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, X } from "lucide-react"
import { useTranslations } from "next-intl"

const { Option } = Select

export default function ProductFilters({
  filters,
  setFilters,
}: {
  filters: any
  setFilters: (f: any) => void
}) {
  const t = useTranslations("Filters")
  const [open, setOpen] = useState(false)

  const resetFilters = () => {
    setFilters({
      price: [0, 1000],
      gender: "all",
      sort: "default",
    })
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setOpen(true)}
          className="
            flex items-center gap-2
            border border-neutral-300
            px-5 py-2
            text-xs uppercase tracking-[0.25em]
            bg-transparent cursor-pointer
            transition-all duration-300
          "
        >
          <SlidersHorizontal size={16} />
          {t("open")}
        </button>
      </div>

      {/* SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            {/* PANEL */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="
                fixed top-0 right-0
                h-full w-full sm:w-[420px]
                bg-background
                shadow-2xl
                z-50
                p-10
                flex flex-col
              "
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-sm text-foreground uppercase tracking-[0.3em]">
                  {t("title")}
                </h3>
                <button onClick={() => setOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-10">

                {/* GENDER */}
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-foreground mb-3">
                    {t("gender")}
                  </p>
                  <Select
                    value={filters.gender}
                    onChange={(value) =>
                      setFilters({ ...filters, gender: value })
                    }
                    variant="borderless"
                    className="w-full luxury-select"
                  >
                    <Option className="text-foreground" value="all">{t("all")}</Option>
                    <Option className="text-foreground" value="men">{t("men")}</Option>
                    <Option className="text-foreground" value="women">{t("women")}</Option>
                    <Option className="text-foreground" value="unisex">{t("unisex")}</Option>
                  </Select>
                </div>

                {/* SORT */}
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-foreground mb-3">
                    {t("sort")}
                  </p>
                  <Select
                    value={filters.sort}
                    onChange={(value) =>
                      setFilters({ ...filters, sort: value })
                    }
                    bordered={false}
                    className="w-full luxury-select"
                  >
                    <Option className="text-foreground" value="default">{t("default")}</Option>
                    <Option className="text-foreground" value="price-asc">{t("priceAsc")}</Option>
                    <Option className="text-foreground" value="price-desc">{t("priceDesc")}</Option>
                    <Option className="text-foreground" value="newest">{t("newest")}</Option>
                  </Select>
                </div>

                {/* RESET */}
                <button
                  onClick={resetFilters}
                  className="
                    text-xs uppercase tracking-[0.25em]
                    underline underline-offset-4
                    text-foreground
                    transition cursor-pointer
                    self-start
                  "
                >
                  {t("reset")}
                </button>
              </div>

              {/* APPLY BUTTON */}
              <div className="mt-auto">
                <button
                  onClick={() => setOpen(false)}
                  className="
                    w-full
                    bg-black
                    text-white
                    py-4 cursor-pointer
                    uppercase tracking-[0.3em]
                    text-xs
                    hover:bg-neutral-800
                    transition
                  "
                >
                  {t("apply")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
