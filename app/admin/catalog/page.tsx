"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";
import { ProductType } from "@/types/product";
import toast from "react-hot-toast";

export default function AdminCatalogue() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductType | null>(null);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Erreur récupération produits");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce produit ?")) return;

    try {
      const res = await fetch("/api/admin/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Erreur lors de la suppression");
      }

      toast.success("Produit supprimé");
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Erreur serveur");
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData);

    try {
      const res = await fetch(`/api/admin/products/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          ...values,
          price: Number(values.price),
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Erreur lors de la mise à jour");
      }

      toast.success("Produit mis à jour");
      setEditing(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Erreur serveur");
    }
  }

  return (
    <>
      <Navbar />

      <div className="w-screen flex flex-col gap-4 relative">
        <ProductForm />
      </div>

      <ProductTable
        products={products}
        loading={loading}
        editing={editing}
        setEditing={setEditing}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />

      <Footer />
    </>
  );
}
