"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  InputNumber,
  Button,
  Form,
  Divider,
  Select,
} from "antd";
import { ProductType } from "../../../types/product";

type Props = {
  open: boolean;
  product: ProductType | null;
  products: ProductType[];
  categories: { id: number; name: string }[];
  onClose: () => void;
  onSubmit: (data: any) => void;
};

export default function ProductEditModal({
  open,
  product,
  products,
  categories,
  onClose,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  const [colors, setColors] = useState<
    { id?: number; color: string }[]
  >([]);

  const [sizes, setSizes] = useState<
    { id?: string; size: string; stock: number; is_active: boolean }[]
  >([]);

  const [decorationImageUrl, setDecorationImageUrl] =
    useState<string | null>(null);

  const [suggestedProducts, setSuggestedProducts] =
    useState<number[]>([]);

  /* ================= INIT ================= */

  useEffect(() => {
    if (!product) return;

    form.setFieldsValue({
      ...product,
      price: Number(product.price),
      decoration_text: product.decoration_text,
    });

    setSizes(product.product_sizes || []);

    const uniqueColors = Array.from(
      new Map(
        (product.product_images || [])
          .filter((img) => !!img.color)
          .map((img) => [img.color, { id: img.id, color: img.color }])
      ).values()
    );

    setColors(uniqueColors);
    setDecorationImageUrl(product.decoration_image_url ?? null);

    setSuggestedProducts(
        Array.from(
          new Set(
            product.product_suggestions?.map(
              (p: any) => Number(p.suggested_product_id)
            ) ?? []
          )
        )
      );
  }, [product, form]);

  /* ================= IMAGE UPLOAD ================= */

  const [uploading, setUploading] = useState(false);

  const handleDecorationUpload = async (file: File) => {
    if (!product) return;
  
    if (!file.type.startsWith("image/")) {
      alert("Le fichier doit être une image");
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      alert("Image trop volumineuse (max 5MB)");
      return;
    }
  
    try {
      setUploading(true);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", product.id.toString());
  
      const res = await fetch(
        "/api/admin/products/upload-decoration",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.error || "Erreur upload");
        return;
      }
  
      setDecorationImageUrl(data.url);
  
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setUploading(false);
    }
  };

  /* ================= SUBMIT ================= */

  const handleFinish = (values: any) => {
    if (!product) return;

    onSubmit({
      ...product,
      ...values,
      price: Number(values.price),
      colors,
      sizes,
      decoration_image_url: decorationImageUrl,
      suggested_product_ids: suggestedProducts,
    });

    onClose();
    form.resetFields();
  };

  /* ========================================================= */

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      className="[&_.ant-modal-content]:rounded-2xl"
    >
      {product && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <h2 className="text-xl font-semibold mb-6">
            Modifier le produit
          </h2>

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
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              className="w-full"
            />
          </Form.Item>

          <Form.Item label="Catégorie" name="category_id">
            <Select
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Genre" name="gender">
            <Input />
          </Form.Item>

          <Divider />

          <Divider />

          <h3 className="text-lg font-medium mb-4">Tailles</h3>

          <div className="space-y-4">
            {sizes.map((s, index) => (
              <div
                key={s.id ?? index}
                className="flex items-center gap-4 border border-neutral-200 p-4 rounded-xl"
              >
                {/* SIZE NAME */}
                <Input
                  placeholder="Taille (ex: S, M, 42...)"
                  value={s.size}
                  onChange={(e) => {
                    const newSizes = [...sizes];
                    newSizes[index].size = e.target.value;
                    setSizes(newSizes);
                  }}
                  className="w-24"
                />

                {/* STOCK */}
                <InputNumber
                  min={0}
                  value={s.stock}
                  onChange={(value) => {
                    const newSizes = [...sizes];
                    newSizes[index].stock = Number(value ?? 0);
                    setSizes(newSizes);
                  }}
                />

                {/* ACTIVE */}
                <Select
                  value={s.is_active ? "active" : "inactive"}
                  onChange={(value) => {
                    const newSizes = [...sizes];
                    newSizes[index].is_active = value === "active";
                    setSizes(newSizes);
                  }}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  className="w-32"
                />

                {/* DELETE */}
                <Button
                  danger
                  onClick={() => {
                    setSizes(sizes.filter((_, i) => i !== index));
                  }}
                >
                  Supprimer
                </Button>
              </div>
            ))}

            {/* ADD NEW SIZE */}
            <Button
              type="dashed"
              block
              onClick={() =>
                setSizes([
                  ...sizes,
                  { size: "", stock: 0, is_active: true },
                ])
              }
            >
              + Ajouter une taille
            </Button>
          </div>

          {/* ================= DECORATION ================= */}

          <Form.Item label="Texte décoration" name="decoration_text">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Image décoration">
            <div className="flex flex-col gap-4">

                {/* IMAGE PREVIEW */}
                <div className="relative group w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50">

                {decorationImageUrl ? (
                    <>
                    <img
                        src={decorationImageUrl}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 flex items-center justify-center">

                        <button
                        type="button"
                        onClick={() => setDecorationImageUrl(null)}
                        className="opacity-0 group-hover:opacity-100 transition duration-300 bg-white text-black text-xs px-4 py-2 rounded-full shadow-lg"
                        >
                        Supprimer
                        </button>

                    </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-400 text-sm h-full">
                    Aucune image
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="animate-pulse text-sm text-neutral-600">
                        Upload en cours...
                    </div>
                    </div>
                )}

                </div>

                {/* UPLOAD BUTTON */}
                <label className="cursor-pointer inline-flex items-center justify-center px-5 py-3 rounded-full border border-neutral-300 text-sm font-medium hover:bg-neutral-100 transition">
                Changer l’image
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDecorationUpload(file);
                    }}
                />
                </label>

            </div>
            </Form.Item>

          <Divider />

          {/* ================= SUGGESTIONS ================= */}

            <Form.Item label="Produits recommandés">
            <Select
                mode="multiple"
                value={suggestedProducts}
                onChange={setSuggestedProducts}
                optionFilterProp="label"
                showSearch
                options={Array.from(
                new Map(products.map((p) => [p.id, p])).values()
                )
                .filter((p) => p.id !== product?.id)
                .map((p) => ({
                    value: p.id,
                    label: (
                    <div className="flex items-center gap-3">
                        <img
                        src={
                            p.product_images?.[0]?.url ||
                            "/placeholder.png"
                        }
                        className="w-8 h-10 object-cover rounded"
                        />
                        {p.name}
                    </div>
                    ),
                }))}
            />
            </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="mt-6 h-11 rounded-full"
          >
            Enregistrer
          </Button>
        </Form>
      )}
    </Modal>
  );
}