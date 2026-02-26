"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Select, Input, Button, Switch } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

type Product = {
    id: number;
    name: string;
    thumbnail_url?: string | null;
  };

type Page = {
  id: string;
  title: string;
  slug: string;
};

type Section = {
  id: string;
  title: string;
  slug: string;
  is_active: boolean;
  section_pages?: {
    pages: Page;
  }[];
};

export default function AdminSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    fetchSections();
    fetchProducts();
    fetchPages();
  }, []);

  async function fetchSections() {
    const res = await fetch("/api/admin/sections");
    const data = await res.json();
    setSections(data);
  }

  async function fetchProducts() {
    const res = await fetch("/api/fetchProducts");
    const data = await res.json();
    setProducts(data);
  }

  async function fetchPages() {
    const res = await fetch("/api/admin/pages");
    const data = await res.json();
    setPages(data);
  }

  /* ---------------- CREATE ---------------- */

  async function handleCreate() {
    if (!title) return toast.error("Titre requis");

    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        is_active: isActive,
        product_ids: selectedProducts,
        page_ids: selectedPages,
      }),
    });

    if (res.ok) {
      toast.success("Section créée");
      setTitle("");
      setSlug("");
      setSelectedProducts([]);
      setSelectedPages([]);
      fetchSections();
    } else {
      toast.error("Erreur création section");
    }
  }

  /* ---------------- DELETE ---------------- */

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette section ?")) return;

    await fetch("/api/admin/sections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    toast.success("Section supprimée");
    fetchSections();
  }

  /* ---------------- UI ---------------- */

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative top-24 w-[95%] max-w-6xl mx-auto"
    >
      <div className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-sm p-10">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <h2 className="text-2xl font-semibold">Sections</h2>
        </div>

        {/* CREATE FORM */}
        <div className="flex flex-col gap-4 mb-12">

          <Input
            placeholder="Titre section"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl"
          />

          <Input
            placeholder="Slug (optionnel)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-xl"
          />

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Active</span>
            <Switch checked={isActive} onChange={setIsActive} />
          </div>

          {/* PRODUCTS SELECT */}
          <Select
            mode="multiple"
            placeholder="Choisir produits"
            value={selectedProducts}
            onChange={setSelectedProducts}
            className="w-full"
            optionFilterProp="label" // important pour la recherche
            showSearch
          >
            {products.map((p) => (
                <Option
                    key={p.id}
                    value={p.id}
                    label={p.name} // pour la recherche
                    >
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        {p.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                            src={p.thumbnail_url}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                            —
                            </div>
                        )}
                        </div>

                        <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {p.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">#{p.id}</p>
                        </div>
                    </div>
                    </Option>
            ))}
            </Select>

          {/* PAGES SELECT */}
          <Select
            mode="multiple"
            placeholder="Choisir pages"
            value={selectedPages}
            onChange={setSelectedPages}
            className="w-full"
            optionFilterProp="children"
          >
            {pages.map((page) => (
              <Option key={page.id} value={page.id}>
                {page.title} ({page.slug})
              </Option>
            ))}
          </Select>

          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-5 py-3 text-sm font-medium hover:bg-gray-900 transition cursor-pointer text-center"
          >
            <Plus size={16} />
            Créer section
          </button>
        </div>

        {/* SECTIONS LIST */}
        <ul className="space-y-4">
          <AnimatePresence>
            {sections.map((section) => (
              <motion.li
                key={section.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{section.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pages:{" "}
                    {section.section_pages?.map((sp) => sp.pages.slug).join(", ") || "—"}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(section.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

      </div>
    </motion.div>
  );
}