import { useState, useEffect } from "react";
import type { PageRow } from "@/types/admin-pages";

export function useAdminPages() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const loadPages = async () => {
    setLoadingPages(true);

    const res = await fetch("/api/admin/pages");
    const data = await res.json();

    setPages(Array.isArray(data) ? data : []);
    setLoadingPages(false);
  };

  const deletePage = async (id: string) => {
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    loadPages();
  };

  useEffect(() => {
    loadPages();
  }, []);

  return {
    pages,
    loadingPages,
    loadPages,
    deletePage,
  };
}