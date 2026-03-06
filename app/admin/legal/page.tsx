"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, Typography, Input, Button, Spin, message, Empty, Space } from "antd"
import { motion } from "framer-motion"

const { Title, Text } = Typography
const { TextArea } = Input

type Paragraph = {
  id: string
  content: string
}

type Section = {
  id: string
  title: string
  privacy_policy_paragraphs: Paragraph[]
}

export default function Page() {
  const [sections, setSections] = useState<Section[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/admin/privacy-policy")
      const data = await res.json()

      const normalized =
        data?.map((s: any) => ({
          ...s,
          privacy_policy_paragraphs: s.privacy_policy_paragraphs || []
        })) || []

      setSections(normalized)
    } catch {
      message.error("Failed to load privacy policy")
    } finally {
      setLoading(false)
    }
  }

  /*
  ========================
  SECTION CRUD
  ========================
  */

  const createSection = async () => {
    try {
      const res = await fetch("/api/admin/privacy-policy/section/create", {
        method: "POST"
      })

      const newSection = await res.json()

      setSections([
        ...sections,
        { ...newSection, privacy_policy_paragraphs: [] }
      ])

      message.success("Section created")
    } catch {
      message.error("Could not create section")
    }
  }

  const updateSectionTitle = async (id: string, title: string) => {
    try {
      await fetch("/api/admin/privacy-policy/section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title })
      })

      message.success("Section updated")
    } catch {
      message.error("Update failed")
    }
  }

  const deleteSection = async (id: string) => {
    try {
      await fetch(`/api/admin/privacy-policy/section?id=${id}`, {
        method: "DELETE"
      })

      setSections(sections.filter((s) => s.id !== id))

      message.success("Section deleted")
    } catch {
      message.error("Delete failed")
    }
  }

  /*
  ========================
  PARAGRAPH CRUD
  ========================
  */

  const addParagraph = async (sectionId: string, sectionIndex: number) => {
    try {
      const res = await fetch("/api/admin/privacy-policy/paragraph/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_id: sectionId })
      })

      const newParagraph = await res.json()

      const copy = [...sections]

      copy[sectionIndex].privacy_policy_paragraphs.push({
        id: newParagraph.id,
        content: ""
      })

      setSections(copy)

      message.success("Paragraph created")
    } catch {
      message.error("Could not create paragraph")
    }
  }

  const deleteParagraph = async (
    id: string,
    sectionIndex: number,
    paragraphIndex: number
  ) => {
    try {
      await fetch(`/api/admin/privacy-policy/paragraph?id=${id}`, {
        method: "DELETE"
      })

      const copy = [...sections]

      copy[sectionIndex].privacy_policy_paragraphs.splice(paragraphIndex, 1)

      setSections(copy)

      message.success("Paragraph deleted")
    } catch {
      message.error("Delete failed")
    }
  }

  const updateParagraph = async (id: string, content: string) => {
    setSaving(id)

    try {
      await fetch("/api/admin/privacy-policy/paragraph", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content })
      })

      message.success("Saved")
    } catch {
      message.error("Save failed")
    }

    setSaving(null)
  }

  const handleChange = (
    sectionIndex: number,
    paragraphIndex: number,
    value: string
  ) => {
    const copy = [...sections]

    copy[sectionIndex].privacy_policy_paragraphs[paragraphIndex].content = value

    setSections(copy)
  }

  /*
  ========================
  UI
  ========================
  */

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="max-w-5xl mx-auto py-24 w-full px-6">
        <Title level={2} style={{ marginBottom: 40 }}>
          Privacy Policy Editor
        </Title>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20">
            <Empty description="No sections yet" />

            <Button type="primary" onClick={createSection}>
              Create first section
            </Button>
          </div>
        ) : (
          <>
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card style={{ marginBottom: 32 }} styles={{ body: { padding: 28 }}}>
                  <Space orientation="vertical" style={{ width: "100%" }}>
                    
                    {/* SECTION TITLE */}
                    <Input
                      value={section.title}
                      onChange={(e) => {
                        const copy = [...sections]
                        copy[sectionIndex].title = e.target.value
                        setSections(copy)
                      }}
                      onBlur={() =>
                        updateSectionTitle(section.id, section.title)
                      }
                      placeholder="Section title"
                    />

                    {/* PARAGRAPHS */}
                    {section.privacy_policy_paragraphs.map(
                      (p, paragraphIndex) => (
                        <div key={p.id}>
                          <Text type="secondary">Paragraph</Text>

                          <TextArea
                            rows={6}
                            value={p.content}
                            style={{ marginTop: 8 }}
                            onChange={(e) =>
                              handleChange(
                                sectionIndex,
                                paragraphIndex,
                                e.target.value
                              )
                            }
                          />

                          <Space style={{ marginTop: 10 }}>
                            <Button
                              type="primary"
                              loading={saving === p.id}
                              onClick={() =>
                                updateParagraph(p.id, p.content)
                              }
                            >
                              Save
                            </Button>

                            <Button
                              danger
                              onClick={() =>
                                deleteParagraph(
                                  p.id,
                                  sectionIndex,
                                  paragraphIndex
                                )
                              }
                            >
                              Delete
                            </Button>
                          </Space>
                        </div>
                      )
                    )}

                    <Button
                      type="dashed"
                      onClick={() =>
                        addParagraph(section.id, sectionIndex)
                      }
                    >
                      Add paragraph
                    </Button>

                    <Button
                      danger
                      onClick={() => deleteSection(section.id)}
                    >
                      Delete section
                    </Button>
                  </Space>
                </Card>
              </motion.div>
            ))}

            <Button type="primary" onClick={createSection}>
              Add new section
            </Button>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}