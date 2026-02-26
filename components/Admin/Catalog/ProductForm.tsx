'use client'

import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Upload, Button, message, Select, Space } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabaseClient } from '@/lib/supabaseClient';
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const { Option } = Select;

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function ProductForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: 0,
    gender: '',
    category_id: undefined as number | undefined,
    details: '',
    size_fit: ''
  });

  const [colorSets, setColorSets] = useState<
    { color: string; files: File[] }[]
  >([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        toast.error("Erreur chargement catégories");
      }
    }
  
    fetchCategories();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string, name: 'gender' | 'category') => {
    setFormState({ ...formState, [name]: value });
  };

  const addColor = () => {
    setColorSets([...colorSets, { color: '#000000', files: [] }]);
  };

  const removeColor = (index: number) => {
    const updated = [...colorSets];
    updated.splice(index, 1);
    setColorSets(updated);
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updated = [...colorSets];
    updated[index].color = newColor;
    setColorSets(updated);
  };

  const handleFileUpload = (index: number, info: any) => {
    const fileList = info.fileList.map((f: any) => f.originFileObj).filter(Boolean);
    const updated = [...colorSets];
    updated[index].files = fileList;
    setColorSets(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const colorData: { color: string; imageUrls: string[] }[] = [];

    for (const set of colorSets) {
      const imageUrls: string[] = [];

      for (const f of set.files) {
        const fileName = `${Date.now()}-${f.name}`;
        const { error: uploadError } = await supabaseClient.storage
          .from('products')
          .upload(fileName, f);

        if (uploadError) {
          message.error("Erreur lors de l'upload d'une image.");
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabaseClient.storage
          .from('products')
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          imageUrls.push(publicUrlData.publicUrl);
        }
      }

      colorData.push({ color: set.color, imageUrls });
    }

    const res = await fetch('/api/products/addProduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formState, colors: colorData }),
    });

    if (res.ok) {
      toast.success('Produit ajouté');
      setFormState({
        name: '',
        description: '',
        price: 0,
        gender: '',
        category_id: undefined,
        details: '',
        size_fit: ''
      });
      setColorSets([]);
    } else {
      toast.error("Erreur lors de l'ajout du produit.");
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative top-24 mx-auto w-[98%] max-w-6xl"
    >
      {/* MAIN CARD */}
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-sm p-10"
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Ajouter un produit
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Informations générales et variantes
          </p>
        </motion.div>

        <Form layout="vertical" onFinish={handleSubmit} className="space-y-8">

          {/* NOM */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Form.Item label="Nom" required>
              <Input
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Nom du produit"
                className="rounded-xl"
              />
            </Form.Item>
          </motion.div>

          {/* DESCRIPTION */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Form.Item label="Description">
              <Input.TextArea
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description du produit"
                className="rounded-xl"
              />
            </Form.Item>
          </motion.div>

          {/* PRIX + GENRE */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Form.Item label="Prix" required>
              <InputNumber
                value={formState.price}
                onChange={(value) =>
                  setFormState({ ...formState, price: value ?? 0 })
                }
                min={0}
                className="w-full rounded-xl"
              />
            </Form.Item>

            <Form.Item label="Genre" required>
              <Select
                placeholder="Choisir un genre"
                value={formState.gender || undefined}
                onChange={(value) => handleSelectChange(value, "gender")}
                className="rounded-xl"
              >
                <Option value="him">Homme</Option>
                <Option value="her">Femme</Option>
                <Option value="unisex">Unisexe</Option>
              </Select>
            </Form.Item>
          </motion.div>

          {/* CATÉGORIE */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Form.Item label="Catégorie">
              <Select
                placeholder="Choisir une catégorie"
                value={formState.category_id || undefined}
                onChange={(value) =>
                  setFormState({ ...formState, category_id: value })
                }
              >
                {categories
                  .map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </motion.div>

          {/* VARIANTES */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-gray-200 bg-white/60 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Variantes de couleur
              </p>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addColor}
                className="rounded-xl"
              >
                Ajouter une couleur
              </Button>
            </div>

            <AnimatePresence>
              {colorSets.map((set, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-gray-200 bg-white p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={set.color}
                        onChange={(e) =>
                          handleColorChange(index, e.target.value)
                        }
                        className="h-8 w-8 rounded-full border cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">
                        {set.color}
                      </span>
                    </div>

                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeColor(index)}
                    />
                  </div>

                  <Upload
                    multiple
                    beforeUpload={() => false}
                    showUploadList={{ showRemoveIcon: true }}
                    onChange={(info) => handleFileUpload(index, info)}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      className="rounded-xl"
                    >
                      Choisir des images
                    </Button>
                  </Upload>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Form.Item className="pt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-11 rounded-xl text-base"
              >
                Ajouter le produit
              </Button>
            </Form.Item>
          </motion.div>
        </Form>
      </motion.div>
    </motion.div>
  );
}
