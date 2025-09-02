'use client'

import { useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { supabaseClient } from '@/lib/supabaseClient';
import toast from "react-hot-toast";

const { Option } = Select;

export const categories = [
  { value: "new-in", label: "New In" },
  { value: "coats-and-jackets", label: "Coats and Jackets", sex: "her" },
  { value: "dresses-and-suits", label: "Dresses and Suits", sex: "her" },
  { value: "trousers-and-skirts", label: "Trousers and Skirts", sex: "her" },
  { value: "tops-her", label: "Tops", sex: "her" },
  { value: "shoes-her", label: "Shoes", sex: "her" },
  { value: "accessories-her", label: "Accessories", sex: "her" },
  { value: "coats", label: "Coats", sex: "him" },
  { value: "jackets", label: "Jackets", sex: "him" },
  { value: "trousers", label: "Trousers", sex: "him" },
  { value: "tops-him", label: "Tops", sex: "him" },
  { value: "shoes-him", label: "Shoes", sex: "him" },
  { value: "accessories-him", label: "Accessories", sex: "him" },
]

export default function ProductForm() {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: 0,
    gender: '',
    category: '',
    colors: 0
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string, name: 'gender' | 'category') => {
    setFormState({ ...formState, [name]: value });
  };

  const handleFileUpload = (info: any) => {
    const fileList = info.fileList.map((f: any) => f.originFileObj).filter(Boolean);
    setFiles(fileList);
  };

  const handleSubmit = async () => {
    setLoading(true);

    let imageUrls: string[] = [];

    for (const f of files) {
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

    const res = await fetch('/api/products/addProduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formState, imageUrls }),
    });

    if (res.ok) {
      toast.success('Produit ajouté');
      setFormState({ name: '', description: '', price: 0, gender: '', category: '', colors: 0 });
      setFiles([]);
    } else {
      toast.error("Erreur lors de l'ajout du produit.");
    }

    setLoading(false);
  };

  const filteredCategories = categories.filter((cat) => {
    return !cat.sex || cat.sex === formState.gender
  });  

  return (
    <div className="relative top-24 w-[98%] max-w-8xl mx-auto flex flex-col items-center p-8 my-4 rounded-lg shadow-[0px_0px_3px_0px_rgba(100,_100,_111,_0.2)]">
      <p className="text-2xl text-gray-800 mb-4">Ajouter un produit</p>
      <Form layout="vertical" onFinish={handleSubmit} className="w-full">
        <Form.Item label="Nom" required>
          <Input name="name" value={formState.name} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea
            name="description"
            value={formState.description}
            onChange={handleChange}
            rows={4}
          />
        </Form.Item>

        <div className="flex items-center w-full gap-2">
          <Form.Item label="Prix" required className="w-1/2">
            <InputNumber
              value={formState.price}
              onChange={(value) =>
                setFormState({ ...formState, price: value ?? 0 })
              }
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
          <Form.Item label="Couleurs" required className="w-1/2">
            <InputNumber
              value={formState.colors}
              onChange={(value) =>
                setFormState({ ...formState, colors: value ?? 0})
              }
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </div>

        <Form.Item label="Genre" required>
          <Select
            placeholder="Choisir un genre"
            value={formState.gender || undefined}
            onChange={(value) => handleSelectChange(value, 'gender')}
          >
            <Option value="him">Homme</Option>
            <Option value="her">Femme</Option>
            <Option value="unisex">Unisexe</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Catégorie" required>
          <Select
            placeholder="Choisir une catégorie"
            value={formState.category || undefined}
            onChange={(value) => handleSelectChange(value, 'category')}
            disabled={!formState.gender}
          >
            {filteredCategories.map((cat) => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Images">
          <Upload
            multiple
            beforeUpload={() => false}
            showUploadList={{ showRemoveIcon: true }}
            onChange={handleFileUpload}
            onRemove={() => setFiles([])}
          >
            <Button icon={<UploadOutlined />}>Choisir des images</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Ajouter le produit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
