"use client"

import { useState } from "react"
import { Select } from "antd"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, X } from "lucide-react"

const { Option } = Select

export default function ProductFilters({
  filters,
  setFilters,
}: {
  filters: any
  setFilters: (f: any) => void
}) {
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
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg tracking-[0.2em] uppercase font-light">
          Collection
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="
            flex items-center gap-2
            border border-neutral-300
            px-5 py-2
            text-xs uppercase tracking-[0.25em]
            bg-background hover:bg-background/90 cursor-pointer
            transition-all duration-300
          "
        >
          <SlidersHorizontal size={16} />
          Filtrer
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
                  Filtres
                </h3>
                <button onClick={() => setOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-10">

                {/* GENDER */}
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-foreground mb-3">
                    Genre
                  </p>
                  <Select
                    value={filters.gender}
                    onChange={(value) =>
                      setFilters({ ...filters, gender: value })
                    }
                    bordered={false}
                    className="w-full luxury-select"
                  >
                    <Option className="text-foreground" value="all">Tous</Option>
                    <Option className="text-foreground" value="men">Homme</Option>
                    <Option className="text-foreground" value="women">Femme</Option>
                    <Option className="text-foreground" value="unisex">Unisex</Option>
                  </Select>
                </div>

                {/* SORT */}
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-foreground mb-3">
                    Trier par
                  </p>
                  <Select
                    value={filters.sort}
                    onChange={(value) =>
                      setFilters({ ...filters, sort: value })
                    }
                    bordered={false}
                    className="w-full luxury-select"
                  >
                    <Option className="text-foreground" value="default">Par défaut</Option>
                    <Option className="text-foreground" value="price-asc">Prix croissant</Option>
                    <Option className="text-foreground" value="price-desc">Prix décroissant</Option>
                    <Option className="text-foreground" value="newest">Nouveautés</Option>
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
                  Réinitialiser
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
                  Appliquer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
