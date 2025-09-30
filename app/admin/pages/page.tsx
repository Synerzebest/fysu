"use client"

import { useEffect, useState } from "react"
import { Table, Button, Modal, Form, Input, Popconfirm, message, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import Link from "next/link"
import { Checkbox } from "antd"

// Fonction utilitaire pour transformer un titre en slug
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // espaces -> tirets
    .replace(/[^\w\-]+/g, "")    // supprime caractères spéciaux
    .replace(/\-\-+/g, "-")      // remplace double tirets
    .replace(/^-+/, "")          // supprime tirets début
    .replace(/-+$/, "")          // supprime tirets fin

type Page = {
  id: string
  title: string
  slug: string
  hero_image?: string
  visible: boolean
  created_at: string
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [file, setFile] = useState<File | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [openProductsModal, setOpenProductsModal] = useState(false)
  const [currentPageId, setCurrentPageId] = useState<string | null>(null)

  const loadProducts = async () => {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
  }

  const openAssignProducts = (pageId: string) => {
    setCurrentPageId(pageId)
    loadProducts()
    setOpenProductsModal(true)
  }

  const handleSaveProducts = async () => {
    if (!currentPageId) return
    await fetch(`/api/admin/pages/${currentPageId}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: selectedProducts }),
    })
    message.success("Produits assignés !")
    setOpenProductsModal(false)
  }

  const loadPages = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/pages")
      if (!res.ok) throw new Error("Erreur API loadPages")
      const data = await res.json()
      setPages(data ?? [])
    } catch (err: any) {
      message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPages()
  }, [])

  const handleCreate = async (values: any) => {
    try {
      let heroUrl: string | null = null
      console.log("File à uploader :", file)

      if (file) {
        const formData = new FormData()
        formData.append("file", file)
      
        const uploadRes = await fetch("/api/admin/uploadHero", {
          method: "POST",
          body: formData,
        })
      
        if (!uploadRes.ok) {
          throw new Error("Erreur API uploadHero")
        }
      
        const { url } = await uploadRes.json()
        heroUrl = url
      }      
      

      const slug = slugify(values.title)

      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, slug, hero_image: heroUrl }),
      })

      if (!res.ok) throw new Error("Erreur API création")
      message.success("Page créée !")
      setOpen(false)
      form.resetFields()
      setFile(null)
      loadPages()
    } catch (err: any) {
      message.error(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur API suppression")
      message.success("Page supprimée")
      loadPages()
    } catch (err: any) {
      message.error(err.message)
    }
  }

  const columns = [
    { title: "Titre", dataIndex: "title" },
    { title: "Slug", dataIndex: "slug" },
    {
      title: "Image Hero",
      dataIndex: "hero_image",
      render: (url: string) =>
        url ? <img src={url} alt="hero" className="h-12 w-auto" /> : "-",
    },
    {
      title: "Produits",
      render: (_: any, record: Page) => (
        <Button onClick={() => openAssignProducts(record.id)}>
          Gérer produits
        </Button>
      )
    },
    {
      title: "Actions",
      render: (_: any, record: Page) => (
        <Popconfirm
          title="Supprimer cette page ?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>Supprimer</Button>
        </Popconfirm>
      ),
    },
    {
      title: "Lien",
      render: (_: any, record: Page) => (
        <Link href={`/collections/${record.slug}`}>
          {record.slug}
        </Link>
      ),
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des pages</h1>
      <Button type="primary" onClick={() => setOpen(true)} className="mb-4">
        + Ajouter une page
      </Button>

      <Table rowKey="id" dataSource={pages} columns={columns} loading={loading} />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title="Nouvelle page"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Image Hero">
            <Upload
              beforeUpload={() => false}
              showUploadList
              maxCount={1}
              onChange={(info) => {
                const f = info.fileList[0]?.originFileObj as File
                setFile(f || null)
              }}
            >
              <Button icon={<UploadOutlined />}>Choisir une image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={openProductsModal}
        onCancel={() => setOpenProductsModal(false)}
        onOk={handleSaveProducts}
        title="Assigner des produits"
      >
        <Checkbox.Group
          value={selectedProducts}
          onChange={(values) => setSelectedProducts(values as string[])}
          className="flex flex-col gap-2"
        >
          {products.map((prod) => (
            <Checkbox key={prod.id} value={prod.id}>
              {prod.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
    </div>
  )
}
