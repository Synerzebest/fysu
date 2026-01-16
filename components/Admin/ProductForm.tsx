'use client'

import { useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, message, Select, Space } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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
];

export default function ProductForm() {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: 0,
    gender: '',
    category: '',
    details: '',
    size_fit: ''
  });

  const [colorSets, setColorSets] = useState<
    { color: string; files: File[] }[]
  >([]);

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
      setFormState({ name: '', description: '', price: 0, gender: '', category: '', details: '', size_fit: '' });
      setColorSets([]);
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
            rows={3}
          />
        </Form.Item>

        <div className="flex items-center gap-4">
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

          <Form.Item label="Genre" required className="w-1/2">
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
        </div>

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

        <div className="border p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium text-gray-700">Variantes de couleur</p>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addColor}
            >
              Ajouter une couleur
            </Button>
          </div>

          {colorSets.map((set, index) => (
            <div
              key={index}
              className="border rounded-md p-3 mb-3 bg-gray-50 flex flex-col gap-2"
            >
              <Space align="center" className="flex justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={set.color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-8 h-8 cursor-pointer"
                  />
                  <span className="text-gray-600">{set.color}</span>
                </div>

                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeColor(index)}
                />
              </Space>

              <Upload
                multiple
                beforeUpload={() => false}
                showUploadList={{ showRemoveIcon: true }}
                onChange={(info) => handleFileUpload(index, info)}
              >
                <Button icon={<UploadOutlined />}>Choisir des images</Button>
              </Upload>
            </div>
          ))}
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Ajouter le produit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
