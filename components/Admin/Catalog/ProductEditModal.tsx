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

  const [infoBlocks, setInfoBlocks] = useState<
    {
      id?: string;
      image_url: string | null;
      title: string;
      subtitle: string;
      content: string;
    }[]
  >([]);

  const [colors, setColors] = useState<
    { id?: number; color: string }[]
  >([]);

  const [sizes, setSizes] = useState<
    { id?: string; size: string; stock: number; is_active: boolean; display_order: number }[]
  >([]);

  const [sizeGuideImageUrl, setSizeGuideImageUrl] = useState<string | null>(null);

  const [suggestedProducts, setSuggestedProducts] =
    useState<number[]>([]);

  /* ================= INIT ================= */

  useEffect(() => {
    if (!product) return;

    form.setFieldsValue({
      ...product,
      price: Number(product.price),
    });

    setSizes(
      (product.product_sizes || []).map((s: any, index: number) => ({
        ...s,
        display_order: s.display_order ?? index
      }))
    );

    const uniqueColors = Array.from(
      new Map(
        (product.product_images || [])
          .filter((img) => !!img.color)
          .map((img) => [img.color, { id: img.id, color: img.color }])
      ).values()
    );

    setColors(uniqueColors);
    setInfoBlocks(
      (product.product_info_blocks || []).map((b: any) => ({
        id: b.id,
        image_url: b.image_url,
        title: b.title,
        subtitle: b.subtitle,
        content: b.content,
      }))
    );
    setSizeGuideImageUrl(product.size_guide_image_url ?? null)

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

  // Size guide image upload
  const handleSizeGuideUpload = async (file: File) => {
    if (!product) return;
  
    if (!file.type.startsWith("image/")) {
      alert("File must be an image");
      return;
    }
  
    try {
      setUploading(true);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", product.id.toString());
  
      const res = await fetch(
        "/api/admin/products/upload-size-guide",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.error || "Upload error");
        return;
      }
  
      setSizeGuideImageUrl(data.url);
  
    } catch (err) {
      console.error(err);
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
      info_blocks: infoBlocks,
      size_guide_image_url: sizeGuideImageUrl,
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

          <Form.Item label="Size guide image">
            <div className="flex flex-col gap-4">

              {sizeGuideImageUrl && (
                <img
                  src={sizeGuideImageUrl}
                  className="w-48 rounded-lg border"
                />
              )}

              <label className="cursor-pointer px-4 py-2 border rounded-md w-fit">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSizeGuideUpload(file);
                  }}
                />
              </label>

            </div>
          </Form.Item>

          <Form.Item label="Care instructions" name="care_instructions">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Shipping" name="shipping">
            <Input.TextArea rows={4} />
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

                <InputNumber
                  min={0}
                  value={s.display_order}
                  onChange={(value) => {
                    const newSizes = [...sizes];
                    newSizes[index].display_order = Number(value ?? 0);
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
                  {
                    size: "",
                    stock: 0,
                    is_active: true,
                    display_order: sizes.length
                  }
                ])
              }
            >
              + Ajouter une taille
            </Button>
          </div>

          <Divider />

          <h3 className="text-lg font-medium mb-4">
            Blocs d'information
          </h3>

          <div className="space-y-6">

          {infoBlocks.map((block, index) => (
            <div
              key={block.id ?? index}
              className="border border-neutral-200 rounded-2xl p-6 space-y-4"
            >

              <Input
                placeholder="Titre"
                value={block.title}
                onChange={(e) => {
                  const newBlocks = [...infoBlocks];
                  newBlocks[index].title = e.target.value;
                  setInfoBlocks(newBlocks);
                }}
              />

              <Input
                placeholder="Sous titre"
                value={block.subtitle}
                onChange={(e) => {
                  const newBlocks = [...infoBlocks];
                  newBlocks[index].subtitle = e.target.value;
                  setInfoBlocks(newBlocks);
                }}
              />

              <Input.TextArea
                rows={4}
                placeholder="Texte"
                value={block.content}
                onChange={(e) => {
                  const newBlocks = [...infoBlocks];
                  newBlocks[index].content = e.target.value;
                  setInfoBlocks(newBlocks);
                }}
              />

              {/* IMAGE */}
              <div className="flex flex-col gap-4">

                {block.image_url && (
                  <img
                    src={block.image_url}
                    className="w-48 rounded-lg border"
                  />
                )}

                <label className="cursor-pointer px-4 py-2 border rounded-md w-fit">
                  Upload image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("productId", product!.id.toString());

                      const res = await fetch(
                        "/api/admin/products/upload-info-block",
                        {
                          method: "POST",
                          body: formData,
                        }
                      );

                      const data = await res.json();

                      if (!res.ok) {
                        alert(data.error || "Upload error");
                        return;
                      }
                      
                      const newBlocks = [...infoBlocks];
                      newBlocks[index].image_url = data.url;
                      setInfoBlocks(newBlocks);
                    }}
                  />
                </label>

              </div>

              <Button
                danger
                onClick={() =>
                  setInfoBlocks(infoBlocks.filter((_, i) => i !== index))
                }
              >
                Supprimer ce bloc
              </Button>

            </div>
          ))}

          <Button
            type="dashed"
            block
            onClick={() =>
              setInfoBlocks([
                ...infoBlocks,
                {
                  image_url: null,
                  title: "",
                  subtitle: "",
                  content: "",
                },
              ])
            }
          >
            + Ajouter un bloc
          </Button>

          </div>

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