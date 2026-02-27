"use client";

import { useEffect, useState } from "react";
import { Modal, Input, InputNumber, Button, Form, Divider, Select } from "antd";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ProductType } from "@/types/product";

type ProductTableProps = {
  products: ProductType[];
  categories: { id: number; name: string }[];
  loading: boolean;
  editing: ProductType | null;
  setEditing: (p: ProductType | null) => void;
  handleDelete: (id: number) => void;
  handleUpdate: (product: any) => void;
};

export default function ProductTable({
  products,
  categories,
  loading,
  editing,
  setEditing,
  handleDelete,
  handleUpdate,
}: ProductTableProps) {
  const [colors, setColors] = useState<{ id?: number; color: string }[]>([]);
  const [form] = Form.useForm();

  /* ================= EDIT OPEN ================= */

  const handleOpenEdit = (product: ProductType) => {
    setEditing(product);

    const existingColors = Array.from(
      new Map(
        (product.product_images || [])
          .filter((img) => !!img.color)
          .map((img) => [img.color, { id: img.id, color: img.color }])
      ).values()
    );

    setColors(existingColors);
  };

  /* ================= FORM SYNC ================= */

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        ...editing,
        category_id: editing.category_id,
        price: Number(editing.price),
      });
    }
  }, [editing, form]);

  /* ================= COLORS ================= */

  const addColor = () => setColors([...colors, { color: "#000000" }]);

  const updateColor = (i: number, color: string) =>
    setColors(colors.map((c, idx) => (idx === i ? { ...c, color } : c)));

  const removeColor = (i: number) =>
    setColors(colors.filter((_, idx) => idx !== i));

  /* ================= SUBMIT ================= */

  const handleSubmit = (values: any) => {
    if (!editing) return;

    handleUpdate({
      ...editing,
      ...values,
      price: Number(values.price),
      colors,
    });

    setEditing(null);
    form.resetFields();
  };


  /* ========================================================= */

  return (
    <div className="relative top-36 px-4 sm:px-6 pb-24 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Catalogue produits
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Gérer les produits visibles sur le site
        </p>
      </div>

      {loading ? (
        <p className="text-neutral-500">Chargement…</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block">
            <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-500">
                  <tr>
                    <th className="px-5 py-4 font-medium text-start">Produit</th>
                    <th className="px-5 py-4 font-medium text-start">Description</th>
                    <th className="px-5 py-4 font-medium text-start">Prix</th>
                    <th className="px-5 py-4 font-medium text-start">Ajouté le</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 transition">
                      {/* PRODUCT */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              p.product_images?.[0]?.url ||
                              "/placeholder.png"
                            }
                            alt={p.name}
                            className="w-12 h-16 object-cover rounded-lg bg-neutral-100"
                          />
                          <div>
                            <p className="font-medium leading-tight">
                              {p.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              #{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-5 py-4 text-right font-medium">
                        {p.description}
                      </td>

                      {/* PRICE */}
                      <td className="px-5 py-4 text-right font-medium">
                        {Number(p.price).toFixed(2)} €
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4 text-neutral-500">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2 opacity-60 hover:opacity-100 transition">
                          <Button
                            type="text"
                            icon={<Pencil size={16} />}
                            onClick={() => handleOpenEdit(p)}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<Trash2 size={16} />}
                            onClick={() => handleDelete(p.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-4">
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-neutral-200/70 bg-white p-4 flex gap-4 shadow-sm"
              >
                <img
                  src={
                    p.product_images?.[0]?.url || "/placeholder.png"
                  }
                  alt={p.name}
                  className="w-16 h-20 object-cover rounded-lg bg-neutral-100"
                />

                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {p.category || "—"} • {p.gender || "—"}
                  </p>
                  <p className="mt-2 font-medium">
                    {Number(p.price).toFixed(2)} €
                  </p>
                </div>

                <div className="flex flex-col justify-center gap-2 opacity-70">
                  <Button
                    type="text"
                    icon={<Pencil size={16} />}
                    onClick={() => handleOpenEdit(p)}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDelete(p.id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ================= MODAL ================= */}
      <Modal
        open={!!editing}
        onCancel={() => {
          setEditing(null);
          form.resetFields();
        }}
        footer={null}
        centered
        className="[&_.ant-modal-content]:rounded-2xl"
      >
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Modifier le produit
              </h2>
              <p className="text-sm text-neutral-500">
                Mettre à jour les informations
              </p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item label="Nom" name="name">
                <Input />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input />
              </Form.Item>

              <Form.Item label="Détails" name="details">
                <Input />
              </Form.Item>

              <Form.Item label="Size fit" name="size_fit">
                <Input />
              </Form.Item>

              <Form.Item
                label="Prix (€)"
                name="price"
                rules={[
                  { required: true, message: "Le prix est obligatoire" },
                ]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  className="w-full"
                  controls={false}
                />
              </Form.Item>

              <Form.Item
                label="Catégorie"
                name="category_id"
                rules={[{ required: true, message: "Catégorie obligatoire" }]}
              >
                <Select
                  placeholder="Choisir une catégorie"
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Genre" name="gender">
                <Input />
              </Form.Item>

              <Divider />

              <Form.Item label="Couleurs">
                <div className="flex flex-wrap gap-3 items-center">
                  {colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c.color}
                        onChange={(e) =>
                          updateColor(i, e.target.value)
                        }
                        className="w-8 h-8 cursor-pointer rounded"
                      />
                      <Button
                        type="text"
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => removeColor(i)}
                      />
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    icon={<Plus size={16} />}
                    onClick={addColor}
                  >
                    Ajouter
                  </Button>
                </div>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="mt-6 h-11 rounded-full text-sm"
              >
                Enregistrer les modifications
              </Button>
            </Form>
          </motion.div>
        )}
      </Modal>
    </div>
  );
}