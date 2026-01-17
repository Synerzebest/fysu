"use client"

import { Select } from "antd"
import { motion } from "framer-motion"

const { Option } = Select

export default function ProductFilters({
  filters,
  setFilters,
}: {
  filters: any
  setFilters: (f: any) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="
        mb-8
        flex
        flex-col
        gap-6
        lg:flex-row
        lg:flex-wrap
        lg:items-start
      "
    >
      {/* GENDER */}
      <div className="w-full lg:w-40">
        <p className="text-xs uppercase text-neutral-500 mb-1">
          Genre
        </p>
        <Select
          value={filters.gender}
          onChange={(value) =>
            setFilters({ ...filters, gender: value })
          }
          className="w-full"
        >
          <Option value="all">Tous</Option>
          <Option value="men">Homme</Option>
          <Option value="women">Femme</Option>
          <Option value="unisex">Unisex</Option>
        </Select>
      </div>

      {/* SORT */}
      <div className="w-full lg:w-48 lg:ml-auto">
        <p className="text-xs uppercase text-neutral-500 mb-1">
          Trier par
        </p>
        <Select
          value={filters.sort}
          onChange={(value) =>
            setFilters({ ...filters, sort: value })
          }
          className="w-full"
        >
          <Option value="default">Par défaut</Option>
          <Option value="price-asc">Prix croissant</Option>
          <Option value="price-desc">Prix décroissant</Option>
          <Option value="newest">Nouveautés</Option>
        </Select>
      </div>

      {/* RESET */}
      <button
        onClick={() =>
          setFilters({
            price: [0, 1000],
            gender: "all",
            sort: "default",
          })
        }
        className="
          text-sm
          text-neutral-700
          underline
          cursor-pointer
          self-start
          lg:self-center
        "
      >
        Réinitialiser les filtres
      </button>
    </motion.div>
  )
}
