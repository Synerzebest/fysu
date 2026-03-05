"use client";

import { useState } from "react";
import { message, Modal, Checkbox } from "antd";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminSections from "@/components/Admin/Pages/AdminSections";
import PageModal from "@/components/Admin/Pages/PageModal";

import { useAdminPages } from "@/hooks/useAdminPages";
import { useAdminCollections } from "@/hooks/useAdminCollections";

import PagesTable from "@/components/Admin/Pages/PagesTable";
import CollectionsTable from "@/components/Admin/Pages/CollectionsTable";

import type { PageRow, CollectionRow } from "@/types/admin-pages";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminPages() {
  const { pages, loadingPages, deletePage, loadPages } = useAdminPages();
  const {
    collections,
    loadingCollections,
    deleteCollection,
    loadCollections,
  } = useAdminCollections();

  const [openPageModal, setOpenPageModal] = useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);

  const [editingPage, setEditingPage] = useState<PageRow | null>(null);
  const [editingCollection, setEditingCollection] =
    useState<CollectionRow | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [openProductsModal, setOpenProductsModal] = useState(false);
  
  const [assignTarget, setAssignTarget] = useState<{
    type: "page" | "collection";
    id: string;
  } | null>(null);

  // Products
  const loadProducts = async () => {
    const res = await fetch("/api/fetchProducts");
    const data = await res.json();
    setProducts(data);
  };

  const openAssignProducts = (
    type: "page" | "collection",
    entity: any
  ) => {
    setAssignTarget({ type, id: entity.id });
    setSelectedProducts(entity.products ?? []);
    loadProducts();
    setOpenProductsModal(true);
  };

  const saveAssignedProducts = async () => {
    if (!assignTarget) return;
  
    const base =
      assignTarget.type === "collection"
        ? "/api/admin/collectionPages"
        : "/api/admin/pages";
  
    await fetch(`${base}/${assignTarget.id}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productIds: selectedProducts,
      }),
    });
  
    message.success("Produits assignés !");
    setOpenProductsModal(false);
    setAssignTarget(null);
  
    loadPages();
    loadCollections();
  };

  /* ----------------------------- */
  /* CREATE PAGE                   */
  /* ----------------------------- */

  const handleCreatePage = async (values: any, file: File | null) => {
    try {
      let heroUrl = null;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const up = await fetch("/api/admin/uploadHero", {
          method: "POST",
          body: fd,
        });

        const { url } = await up.json();
        heroUrl = url;
      }

      const slug = slugify(values.title);

      await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          slug,
          hero_image: heroUrl,
        }),
      });

      message.success("Page créée !");
      setOpenPageModal(false);
      loadPages();
    } catch {
      message.error("Erreur lors de la création");
    }
  };

  /* ----------------------------- */
  /* UPDATE PAGE                   */
  /* ----------------------------- */

  const handleUpdatePage = async (values: any, file: File | null) => {
    if (!editingPage) return;

    try {
      let heroUrl = editingPage.hero_image;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const up = await fetch("/api/admin/uploadHero", {
          method: "POST",
          body: fd,
        });

        const { url } = await up.json();
        heroUrl = url;
      }

      await fetch(`/api/admin/pages/${editingPage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          hero_image: heroUrl,
        }),
      });

      message.success("Page modifiée !");
      setEditingPage(null);
      setOpenPageModal(false);
      loadPages();
    } catch {
      message.error("Erreur lors de la modification");
    }
  };

  // Update collection
  const handleUpdateCollection = async (values: any, file: File | null) => {
    if (!editingCollection) return;

    try {
      let heroUrl = editingCollection.hero_image;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const up = await fetch("/api/admin/uploadHero", {
          method: "POST",
          body: fd,
        });

        const { url } = await up.json();
        heroUrl = url;
      }

      await fetch(`/api/admin/collectionPages/${editingCollection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          hero_image: heroUrl,
        }),
      });

      message.success("Collection modifiée !");
      setEditingCollection(null);
      setOpenCollectionModal(false);
      loadCollections();
    } catch {
      message.error("Erreur lors de la modification");
    }
  };

  /* ----------------------------- */
  /* CREATE COLLECTION             */
  /* ----------------------------- */

  const handleCreateCollection = async (values: any, file: File | null) => {
    try {
      let heroUrl = null;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const up = await fetch("/api/admin/uploadHero", {
          method: "POST",
          body: fd,
        });

        const { url } = await up.json();
        heroUrl = url;
      }

      const slug = slugify(values.title);

      await fetch("/api/admin/collectionPages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          slug,
          hero_image: heroUrl,
        }),
      });

      message.success("Collection créée !");
      setOpenCollectionModal(false);
      loadCollections();
    } catch {
      message.error("Erreur lors de la création");
    }
  };

  /* ----------------------------- */
  /* EDIT HANDLERS                 */
  /* ----------------------------- */

  const handleEditPage = (page: PageRow) => {
    setEditingPage(page);
    setOpenPageModal(true);
  };

  const handleEditCollection = (collection: CollectionRow) => {
    setEditingCollection(collection);
    setOpenCollectionModal(true);
  };

  return (
    <>
      <Navbar />

      <div className="p-6 flex flex-col gap-10 relative top-20">
        <AdminSections />

        <div className="relative top-36">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Pages</h1>

            <button
              className="bg-gray-800 text-white px-4 py-2 text-sm rounded-lg"
              onClick={() => {
                setEditingPage(null);
                setOpenPageModal(true);
              }}
            >
              + Ajouter une page
            </button>
          </div>

          <PagesTable
            pages={pages}
            loading={loadingPages}
            onDelete={deletePage}
            onEdit={handleEditPage}
            onAssign={(page) => openAssignProducts("page", page)}
          />
        </div>

        <div className="relative top-36">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Pages collections</h1>

            <button
              className="bg-gray-800 text-white px-4 py-2 text-sm rounded-lg"
              onClick={() => {
                setEditingCollection(null);
                setOpenCollectionModal(true);
              }}
            >
              + Ajouter une page collection
            </button>
          </div>

          <CollectionsTable
            collections={collections}
            loading={loadingCollections}
            onDelete={deleteCollection}
            onEdit={handleEditCollection}
            onAssign={(collection) => openAssignProducts("collection", collection)}
          />
        </div>
      </div>

      <PageModal
        open={openPageModal}
        onClose={() => setOpenPageModal(false)}
        onSubmit={editingPage ? handleUpdatePage : handleCreatePage}
        initialValues={editingPage}
        title={editingPage ? "Modifier la page" : "Créer une page"}
        description="Cette page pourra être affichée dans la navigation."
      />

      <PageModal
        open={openCollectionModal}
        onClose={() => setOpenCollectionModal(false)}
        onSubmit={editingCollection ? handleUpdateCollection : handleCreateCollection}
        initialValues={editingCollection}
        title={editingCollection ? "Modifier la page collection" : "📦 Créer une page collection"}
        description="Cette page servira à organiser vos produits."
      />

      <Modal
        open={openProductsModal}
        onCancel={() => setOpenProductsModal(false)}
        onOk={saveAssignedProducts}
        title="Assigner des produits"
      >
        <Checkbox.Group
          className="flex flex-col gap-2"
          value={selectedProducts}
          onChange={(v) => setSelectedProducts(v as string[])}
        >
          {products.map((p) => (
            <Checkbox key={p.id} value={p.id}>
              <div className="flex items-center gap-3">
                {p.thumbnail_url && (
                  <img
                    src={p.thumbnail_url}
                    alt={p.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                )}
                <span>{p.name}</span>
              </div>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
      <Footer />
    </>
  );
}