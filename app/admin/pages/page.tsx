"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Typography,
  Space,
  message,
  Popconfirm,
  Checkbox,
} from "antd";
import { PictureOutlined } from "@ant-design/icons";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const { Title, Text } = Typography;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminPages() {
  // ---- STATE ----
  const [pages, setPages] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [assignTarget, setAssignTarget] = useState<{
    type: "page" | "collection"
    id: string
  } | null>(null);
  

  const [loadingPages, setLoadingPages] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  // Modals
  const [openPageModal, setOpenPageModal] = useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [openProductsModal, setOpenProductsModal] = useState(false);

  const [currentCollectionId, setCurrentCollectionId] = useState<string | null>(
    null
  );

  const [formPage] = Form.useForm();
  const [formCollection] = Form.useForm();

  // ---- LOADERS ----

  const loadPages = async () => {
    setLoadingPages(true);
  
    const res = await fetch("/api/admin/pages");
    const data = await res.json();
  
    console.log("RAW PAGES DATA:", data);
  
    setPages(Array.isArray(data) ? data : []);
    setLoadingPages(false);
  };
  

  const loadCollections = async () => {
    setLoadingCollections(true);
  
    const res = await fetch("/api/admin/collectionPages");
    const data = await res.json();
  
    console.log("RAW COLLECTIONS DATA:", data);
  
    // Toujours sécuriser data, AntD Table exige un array
    setCollections(Array.isArray(data) ? data : []);
  
    setLoadingCollections(false);
  };
  

  const loadProducts = async () => {
    const res = await fetch("/api/fetchProducts");
    setProducts(await res.json());
  };

  useEffect(() => {
    loadPages();
    loadCollections();
  }, []);

  // ---- CREATION PAGE SIMPLE ----
  const handleCreatePage = async (values: any) => {
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

      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, slug, hero_image: heroUrl }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      message.success("Page créée !");
      setOpenPageModal(false);
      formPage.resetFields();
      setFile(null);
      loadPages();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // ---- CREATION PAGE COLLECTION ----
  const handleCreateCollectionPage = async (values: any) => {
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

      const res = await fetch("/api/admin/collectionPages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, slug, hero_image: heroUrl }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      message.success("Page collection créée !");
      setOpenCollectionModal(false);
      formCollection.resetFields();
      setFile(null);
      loadCollections();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  // ---- DELETE ----
  const handleDeletePage = async (id: string) => {
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    loadPages();
  };

  const handleDeleteCollection = async (id: string) => {
    await fetch(`/api/admin/collectionPages/${id}`, { method: "DELETE" });
    loadCollections();
  };

  // ---- PRODUCTS ASSIGNMENT ----
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
      body: JSON.stringify({ productIds: selectedProducts }),
    });
  
    message.success("Produits assignés !");
    setOpenProductsModal(false);
    setAssignTarget(null);
  };
  

  // ---- TABLE COLUMNS ----

  const pageColumns = [
    { title: "Titre", dataIndex: "title" },
    {
      title: "Image",
      dataIndex: "hero_image",
      render: (url: string) =>
        url ? <img src={url} className="h-12" /> : "-",
    },
    {
      title: "Lien",
      render: (_: any, rec: any) => (
        <Link href={`/${rec.slug}`}>{rec.slug}</Link>
      ),
    },
    {
      title: "Produits",
      render: (_: any, rec: any) => (
        <Button onClick={() => openAssignProducts("page", rec)}>
          Assigner
        </Button>
      ),
    },
    {
      title: "Actions",
      render: (_: any, rec: any) => (
        <Popconfirm
          title="Supprimer ?"
          onConfirm={() => handleDeletePage(rec.id)}
        >
          <Button danger>Supprimer</Button>
        </Popconfirm>
      ),
    },
  ];

  const collectionColumns = [
    { title: "Titre", dataIndex: "title" },
    {
      title: "Image",
      dataIndex: "hero_image",
      render: (url: string) =>
        url ? <img src={url} className="h-12" /> : "-",
    },
    {
      title: "Produits",
      render: (_: any, rec: any) => (
        <Button onClick={() => openAssignProducts("collection", rec)}>Assigner</Button>
      ),
    },
    {
      title: "Lien",
      render: (_: any, rec: any) => (
        <Link href={`/collections/${rec.slug}`}>{rec.slug}</Link>
      ),
    },
    {
      title: "Actions",
      render: (_: any, rec: any) => (
        <Popconfirm
          title="Supprimer ?"
          onConfirm={() => handleDeleteCollection(rec.id)}
        >
          <Button danger>Supprimer</Button>
        </Popconfirm>
      ),
    },
  ];

  // ---- RENDER ----
  return (
    <>
    <Navbar />
    <div className="p-6 flex flex-col gap-10 relative top-20">
      {/* --------------------- */}
      {/* PAGES NORMALES */}
      {/* --------------------- */}

      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Pages</h1>

          <button 
            className="w-fit h-fit bg-gray-800 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-700 duration-300 cursor-pointer" 
            onClick={() => setOpenPageModal(true)}
          >
            + Ajouter une page
          </button>
        </div>
        <Table
          className="mt-4"
          rowKey="id"
          dataSource={pages}
          columns={pageColumns}
          loading={loadingPages}
        />
      </div>

      {/* --------------------- */}
      {/* PAGES COLLECTION */}
      {/* --------------------- */}

      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Pages collections</h1>

          <button 
            className="w-fit h-fit bg-gray-800 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-700 duration-300 cursor-pointer" 
            onClick={() => setOpenCollectionModal(true)}
          >
            + Ajouter une page collection
          </button>
        </div>

        <Table
          className="mt-4"
          rowKey="id"
          dataSource={collections}
          columns={collectionColumns}
          loading={loadingCollections}
        />
      </div>

      {/* --------------------- */}
      {/* MODAL PAGE SIMPLE */}
      {/* --------------------- */}
      <Modal
        open={openPageModal}
        onCancel={() => setOpenPageModal(false)}
        footer={null}
        width={520}
        centered
      >
        {/* -------- HEADER -------- */}
        <Space orientation="vertical" size={4} style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            📝 Créer une page
          </Title>
          <Text type="secondary">
            Cette page pourra être liée à une catégorie ou affichée
            directement dans la navigation.
          </Text>
        </Space>

        {/* -------- FORM -------- */}
        <Form
          form={formPage}
          layout="vertical"
          onFinish={handleCreatePage}
        >
          <Form.Item
            name="title"
            label="Titre de la page"
            rules={[{ required: true, message: "Le titre est obligatoire" }]}
          >
            <Input
              size="large"
              placeholder="page name"
            />
          </Form.Item>

          <Form.Item label="Image hero (optionnelle)">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture-card"
              onChange={(info) =>
                setFile(info.fileList[0]?.originFileObj || null)
              }
            >
              <div style={{ textAlign: "center" }}>
                <PictureOutlined
                  style={{ fontSize: 24, color: "#cccccc" }}
                />
                <div style={{ marginTop: 8 }}>Ajouter une image</div>
              </div>
            </Upload>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Image affichée en haut de la page
            </Text>
          </Form.Item>

          {/* -------- FOOTER -------- */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 32,
            }}
          >
            <button 
              className="border border-gray-200 rounded-lg px-2 text-gray-700 cursor-pointer hover:shadow duration-300"
              onClick={() => setOpenPageModal(false)}
            >
              Annuler
            </button>
            <button
              className="w-fit h-fit bg-gray-800 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-700 duration-300 cursor-pointer" 
              type="submit"
            >
              Créer la page
            </button>
          </div>
        </Form>
      </Modal>

      {/* --------------------- */}
      {/* MODAL COLLECTION PAGE */}
      {/* --------------------- */}
      <Modal
        open={openCollectionModal}
        onCancel={() => setOpenCollectionModal(false)}
        onOk={() => formCollection.submit()}
        footer={null}
        width={520}
        centered
      >
        {/* -------- HEADER -------- */}
        <Space orientation="vertical" size={4} style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            📦 Créer une page collection
          </Title>
          <Text type="secondary">
            Cette page sera visible sur le site et utilisée pour organiser vos produits.
          </Text>
        </Space>

        {/* -------- FORM -------- */}
        <Form
          form={formCollection}
          layout="vertical"
          onFinish={handleCreateCollectionPage}
        >
          <Form.Item
            name="title"
            label="Nom de la collection"
            rules={[{ required: true, message: "Le titre est obligatoire" }]}
          >
            <Input
              placeholder="collection name"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Image hero (optionnelle)">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture-card"
              onChange={(info) =>
                setFile(info.fileList[0]?.originFileObj || null)
              }
            >
              <div style={{ textAlign: "center" }}>
                <PictureOutlined style={{ fontSize: 24, color: "#cccccc" }} />
                <div style={{ marginTop: 8 }}>Ajouter une image</div>
              </div>
            </Upload>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Image utilisée en haut de la page collection
            </Text>
          </Form.Item>

          {/* -------- FOOTER -------- */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 32,
            }}
          >
            <button 
              className="border border-gray-200 rounded-lg px-2 text-gray-700 cursor-pointer hover:shadow duration-300"
              onClick={() => setOpenCollectionModal(false)}
            >
              Annuler
            </button>
            <button
              className="w-fit h-fit bg-gray-800 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-700 duration-300 cursor-pointer" 
              type="submit"
            >
              Créer la collection
            </button>
          </div>
        </Form>
      </Modal>
      {/* --------------------- */}
      {/* MODAL ASSIGN PRODUCTS */}
      {/* --------------------- */}
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
              {p.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
    </div>
    </>
  );
}
