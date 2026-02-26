"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;

    const res = await fetch("/api/admin/categories/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      toast.error("Erreur création catégorie");
      return;
    }

    toast.success("Catégorie créée");
    setName("");
    fetchCategories();
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette catégorie ?")) return;

    await fetch("/api/admin/categories/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    toast.success("Catégorie supprimée");
    fetchCategories();
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative top-24 w-[95%] max-w-6xl mx-auto"
    >
        <div className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-sm p-10">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Catégories
                </h2>
            </div>

            {/* INPUT + BUTTON */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-3 mb-10"
            >
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom de la catégorie"
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                />

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-900 transition cursor-pointer"
                >
                    <Plus size={16} />
                    Créer catégorie
                </button>
            </motion.div>

            {/* LIST */}
            <ul className="space-y-3">
                <AnimatePresence>
                    {categories.map((cat) => (
                    <motion.li
                        key={cat.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 hover:shadow-md transition-all"
                    >
                        <span className="text-sm font-medium text-gray-800">
                            {cat.name}
                        </span>

                        <button
                            onClick={() => handleDelete(cat.id)}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition text-sm"
                        >
                        <Trash2 size={16} />
                        </button>
                    </motion.li>
                    ))}
                </AnimatePresence>
            </ul>

        </div>
    </motion.div>
  );
}