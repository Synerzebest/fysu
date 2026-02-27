"use client"

import { useEffect, useState } from "react"
import {
  Card,
  Button,
  Form,
  Input,
  Modal,
  Space,
  Upload,
  message,
  Typography,
  Divider,
  InputNumber,
} from "antd"
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons"
import { supabaseClient } from "@/lib/supabaseClient"

const { Title } = Typography
const { TextArea } = Input

type Paragraph = {
  id?: string
  content: string
  order_index: number
}

type AboutBlock = {
  id: string
  title: string
  image_url: string
  order_index: number
  about_block_paragraphs: Paragraph[]
}

export default function AdminAboutBlocs() {
  const [blocks, setBlocks] = useState<AboutBlock[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<AboutBlock | null>(null)

  const [form] = Form.useForm()

  // ---------------- FETCH ----------------
  const fetchBlocks = async () => {
    setLoading(true)
    const res = await fetch("/api/about")
    const data = await res.json()
    setBlocks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchBlocks()
  }, [])

  // ---------------- OPEN MODAL ----------------
  const openCreateModal = () => {
    setEditingBlock(null)
    form.resetFields()
    form.setFieldsValue({
      paragraphs: [{ content: "" }],
      order_index: blocks.length,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (block: AboutBlock) => {
    setEditingBlock(block)
    form.setFieldsValue({
      title: block.title,
      image_url: block.image_url,
      order_index: block.order_index,
      paragraphs: block.about_block_paragraphs
        .sort((a, b) => a.order_index - b.order_index)
        .map((p) => ({ content: p.content })),
    })
    setIsModalOpen(true)
  }

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    const values = await form.validateFields()

    const payload = {
      title: values.title,
      image_url: values.image_url,
      order_index: values.order_index,
      paragraphs: values.paragraphs.map((p: any) => p.content),
    }

    if (editingBlock) {
      await fetch(`/api/about/${editingBlock.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      await fetch(`/api/about/${editingBlock.id}/paragraphs`, {
        method: "PUT",
        body: JSON.stringify({
          paragraphs: payload.paragraphs,
        }),
      })

      message.success("Bloc mis à jour")
    } else {
      await fetch("/api/about", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      message.success("Bloc créé")
    }

    setIsModalOpen(false)
    fetchBlocks()
  }

  // ---------------- DELETE ----------------
  const handleDelete = async (id: string) => {
    await fetch(`/api/about/${id}`, { method: "DELETE" })
    message.success("Bloc supprimé")
    fetchBlocks()
  }

  return (
    <div className="relative top-32">
      <Space style={{ marginBottom: 20 }}>
        <Title level={3}>Gestion de la page About</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Ajouter un bloc
        </Button>
      </Space>

      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        {blocks.map((block) => (
          <Card
            key={block.id}
            title={block.title}
            extra={
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(block)}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(block.id)}
                />
              </Space>
            }
          >
            <img
              src={block.image_url}
              alt=""
              style={{ width: 200, marginBottom: 15 }}
            />

            {block.about_block_paragraphs
              .sort((a, b) => a.order_index - b.order_index)
              .map((p) => (
                <p key={p.id}>{p.content}</p>
              ))}
          </Card>
        ))}
      </Space>

      {/* ---------------- MODAL ---------------- */}

      <Modal
        title={editingBlock ? "Modifier bloc" : "Créer bloc"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Titre"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image"
            required
          >
            <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={async (file) => {
                const fileExt = file.name.split(".").pop()
                const fileName = `${Date.now()}.${fileExt}`

                const { error } = await supabaseClient.storage
                    .from("about")
                    .upload(fileName, file)

                if (error) {
                    message.error("Erreur upload")
                    return false
                }

                const { data } = supabaseClient.storage
                    .from("about")
                    .getPublicUrl(fileName)

                form.setFieldsValue({
                    image_url: data.publicUrl,
                })

                message.success("Image uploadée")

                return false // empêche upload auto antd
                }}
            >
                <Button icon={<UploadOutlined />}>
                Upload image
                </Button>
            </Upload>

            {/* Champ caché pour stocker l’URL */}
            <Form.Item name="image_url" hidden rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            </Form.Item>

          <Form.Item
            label="Ordre"
            name="order_index"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Divider />

          <Title level={5}>Paragraphes</Title>

          <Form.List name="paragraphs">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                const { key, ...restField } = field

                return (
                    <Space
                    key={key}
                    align="baseline"
                    style={{ display: "flex", marginBottom: 8 }}
                    >
                    <Form.Item
                        {...restField}
                        name={[restField.name, "content"]}
                        rules={[{ required: true }]}
                        style={{ flex: 1 }}
                    >
                        <TextArea
                        rows={3}
                        placeholder={`Paragraphe ${index + 1}`}
                        />
                    </Form.Item>

                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(restField.name)}
                    />
                    </Space>
                )
                })}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Ajouter un paragraphe
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  )
}