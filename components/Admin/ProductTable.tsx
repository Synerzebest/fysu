"use client";

import { useState } from "react";
import { Modal, Input, Button, Form, Divider } from "antd";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ProductType } from "@/types/product";

type ProductTableProps = {
  products: ProductType[];
  loading: boolean;
  editing: ProductType | null;
  setEditing: (p: ProductType | null) => void;
  handleDelete: (id: number) => void;
  handleUpdate: (product: any) => void;
};

export default function ProductTable({
  products,
  loading,
  editing,
  setEditing,
  handleDelete,
  handleUpdate,
}: ProductTableProps) {
  const [colors, setColors] = useState<{ id?: number; color: string }[]>([]);

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

  const addColor = () => setColors([...colors, { color: "#000000" }]);

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index].color = newColor;
    setColors(newColors);
  };

  const removeColor = (index: number) => {
    const newColors = [...colors];
    newColors.splice(index, 1);
    setColors(newColors);
  };

  const handleSubmit = (values: any) => {
    handleUpdate({
      ...editing,
      ...values,
      colors,
    });
    setEditing(null);
  };

  return (
    <div className="p-4 sm:p-6 relative top-24">
      <h1 className="text-2xl font-bold mb-6">Catalogue produits</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          {/* TABLE DESKTOP */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Nom</th>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">Prix (€)</th>
                  <th className="p-3">Ajouté le</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">
                      <img
                        src={p.product_images?.[0]?.url}
                        alt={p.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.gender}</td>
                    <td className="p-3">{p.price.toFixed(2)} €</td>
                    <td className="p-3">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      <Button
                        icon={<Pencil size={16} />}
                        onClick={() => handleOpenEdit(p)}
                      />
                      <Button
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDelete(p.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS MOBILE */}
          <div className="md:hidden space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg p-4 flex gap-4 items-center"
              >
                <img
                  src={p.product_images?.[0]?.url}
                  alt={p.name}
                  className="w-20 h-24 object-cover rounded"
                />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.category} • {p.gender}
                  </p>
                  <p className="text-sm font-medium">{p.price.toFixed(2)} €</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    icon={<Pencil size={16} />}
                    onClick={() => handleOpenEdit(p)}
                  />
                  <Button
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDelete(p.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ----------------------------------- */}
      {/* MODAL ANTD + ANIMATION FRAMER MOTION */}
      {/* ----------------------------------- */}
      <Modal
        title="Modifier un produit"
        open={!!editing}
        onCancel={() => setEditing(null)}
        footer={null}
        centered
      >
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Form
              layout="vertical"
              initialValues={{
                name: editing.name,
                description: editing.description,
                details: editing.details,
                size_fit: editing.size_fit,
                price: editing.price,
                category: editing.category,
                gender: editing.gender,
              }}
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

              <Form.Item label="Size Fit" name="size_fit">
                <Input />
              </Form.Item>

              <Form.Item label="Prix (€)" name="price">
                <Input type="number" />
              </Form.Item>

              <Form.Item label="Catégorie" name="category">
                <Input />
              </Form.Item>

              <Form.Item label="Genre" name="gender">
                <Input />
              </Form.Item>

              <Divider />

              {/* COULEURS */}
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
                        className="w-8 h-8 cursor-pointer"
                      />
                      <Button
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => removeColor(i)}
                      />
                    </div>
                  ))}

                  <Button icon={<Plus size={16} />} onClick={addColor}>
                    Ajouter
                  </Button>
                </div>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="mt-4"
              >
                Mettre à jour
              </Button>
            </Form>
          </motion.div>
        )}
      </Modal>
    </div>
  );
}
