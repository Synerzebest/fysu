"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductForm from "@/components/Admin/Catalog/ProductForm";
import ProductTable from "@/components/Admin/Catalog/ProductTable";
import AdminCategories from "@/components/Admin/Catalog/AdminCategories";
import { ProductType } from "@/types/product";
import toast from "react-hot-toast";

type CategoryOption = { id: number; name: string };
type ProductUpdatePayload = ProductType & {
  sizes?: unknown[];
  images?: unknown[];
  info_blocks?: unknown[];
  suggested_product_ids?: number[];
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function readApiError(res: Response, fallback: string) {
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  return data?.error || fallback;
}

export default function AdminCatalogue() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    const data = (await res.json()) as CategoryOption[];
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
      const data = (await res.json()) as ProductType[];
      setProducts(data);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erreur lors du chargement des produits"));
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
        throw new Error(await readApiError(res, "Erreur lors de la suppression"));
      }

      toast.success("Produit supprimé");
      fetchProducts();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erreur serveur"));
    }
  }

  async function handleDuplicate(id: number) {
    if (!confirm("Dupliquer ce produit ?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(await readApiError(res, "Erreur lors de la duplication"));
      }

      toast.success("Produit dupliqué");
      fetchProducts();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erreur serveur"));
    }
  }

  async function handleUpdate(payload: unknown) {
    if (!payload || typeof payload !== "object" || !("id" in payload)) return;
    const productPayload = payload as ProductUpdatePayload;
    console.log("BODY SENT:", payload);

  
    const cleanPayload = {
      ...productPayload,
      price: Number(productPayload.price),
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
        throw new Error(await readApiError(res, "Erreur lors de la mise à jour"));
      }
  
      toast.success("Produit mis à jour");
      fetchProducts();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erreur serveur"));
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
        handleDuplicate={handleDuplicate}
        handleUpdate={handleUpdate}
      />

      <Footer />
    </>
  );
}
