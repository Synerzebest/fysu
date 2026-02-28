"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductForm from "@/components/Admin/Catalog/ProductForm";
import ProductTable from "@/components/Admin/Catalog/ProductTable";
import AdminCategories from "@/components/Admin/Catalog/AdminCategories";
import { ProductType } from "@/types/product";
import toast from "react-hot-toast";

export default function AdminCatalogue() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductType | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  }
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/fetchProducts");
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

  async function handleUpdate(payload: any) {
    if (!payload?.id) return;
    console.log("BODY SENT:", payload);

  
    // 🧼 Sécurité : normalisation
    const cleanPayload = {
      ...payload,
      price: Number(payload.price),
    };

  
    if (Number.isNaN(cleanPayload.price)) {
      toast.error("Prix invalide");
      return;
    }
  
    try {
      const res = await fetch("/api/admin/products/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
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
        <AdminCategories />
        <ProductForm />
      </div>

      <ProductTable
        products={products}
        categories={categories}
        loading={loading}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />

      <Footer />
    </>
  );
}
