"use client"

import { useEffect, useState } from "react"
import { Table, Button, Modal, Form, Input, Popconfirm, message } from "antd"
import Link from 'next/link'

type Page = {
  id: string
  title: string
  slug: string
  visible: boolean
  created_at: string
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  // Charger les pages via ton API
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

  // Créer une nouvelle page
  const handleCreate = async (values: any) => {
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Erreur API création")
      message.success("Page créée !")
      setOpen(false)
      form.resetFields()
      loadPages()
    } catch (err: any) {
      message.error(err.message)
    }
  }

  // Supprimer une page
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
      })
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
      )
    }
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des pages</h1>
      <Button type="primary" onClick={() => setOpen(true)} className="mb-4">
        + Ajouter une page
      </Button>

      <Table
        rowKey="id"
        dataSource={pages}
        columns={columns}
        loading={loading}
      />

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
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
