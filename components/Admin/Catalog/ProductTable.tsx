"use client";

import { Button } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ProductType } from "@/types/product";
import ProductEditModal from "./ProductEditModal";
import { useState } from "react";

type ProductTableProps = {
  products: ProductType[];
  categories: { id: number; name: string }[];
  loading: boolean;
  handleDelete: (id: number) => void;
  handleUpdate: (product: any) => void;
};

export default function ProductTable({
  products,
  categories,
  loading,
  handleDelete,
  handleUpdate,
}: ProductTableProps) {

  const [editing, setEditing] = useState<ProductType | null>(null);

  const handleOpenEdit = async (product: ProductType) => {
    const res = await fetch(`/api/admin/products/${product.id}`);
    const fullProduct = await res.json();
  
    setEditing(fullProduct);
  };

  return (
    <div className="relative top-36 px-4 sm:px-6 pb-24 max-w-7xl mx-auto">

      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Catalogue produits
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Gérer les produits visibles sur le site
        </p>
      </div>

      {loading ? (
        <p className="text-neutral-500">Chargement…</p>
      ) : (
        <>
          {/* ================= DESKTOP ================= */}
          <div className="hidden md:block">
            <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-500">
                  <tr>
                    <th className="px-5 py-4 text-start">Produit</th>
                    <th className="px-5 py-4 text-start">Description</th>
                    <th className="px-5 py-4 text-start">Prix</th>
                    <th className="px-5 py-4 text-start">Ajouté le</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={p.product_images?.[0]?.url || "/placeholder.png"}
                            className="w-12 h-16 object-cover rounded-lg bg-neutral-100"
                          />
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-neutral-500">
                              #{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {p.description}
                      </td>

                      <td className="px-5 py-4">
                        {Number(p.price).toFixed(2)} €
                      </td>

                      <td className="px-5 py-4 text-neutral-500">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="text"
                            icon={<Pencil size={16} />}
                            onClick={() => handleOpenEdit(p)}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<Trash2 size={16} />}
                            onClick={() => handleDelete(p.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-4">
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border bg-white p-4 flex gap-4 shadow-sm"
              >
                <img
                  src={p.product_images?.[0]?.url || "/placeholder.png"}
                  className="w-16 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="mt-2 font-medium">
                    {Number(p.price).toFixed(2)} €
                  </p>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <Button
                    type="text"
                    icon={<Pencil size={16} />}
                    onClick={() => handleOpenEdit(p)}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDelete(p.id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ================= MODAL ================= */}
      <ProductEditModal
        open={!!editing}
        product={editing}
        products={products}
        categories={categories}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />
    </div>
  );
}