import { useState, useEffect } from "react";
import type { CollectionRow } from "@/types/admin-pages";


export function useAdminCollections() {
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  const loadCollections = async () => {
    setLoadingCollections(true);

    const res = await fetch("/api/admin/collectionPages");
    const data = await res.json();

    setCollections(Array.isArray(data) ? data : []);
    setLoadingCollections(false);
  };

  const deleteCollection = async (id: string) => {
    await fetch(`/api/admin/collectionPages/${id}`, { method: "DELETE" });
    loadCollections();
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return {
    collections,
    loadingCollections,
    loadCollections,
    deleteCollection,
  };
}