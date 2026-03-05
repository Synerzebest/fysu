"use client";

import { Modal, Form, Input, Upload, Typography, Space } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any, file: File | null) => Promise<void>;
  title: string;
  description: string;
  initialValues?: { title?: string; hero_image?: string | null } | null;
};

export default function PageModal({
  open,
  onClose,
  onSubmit,
  title,
  description,
  initialValues,
}: Props) {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);

  const handleFinish = async (values: any) => {
    await onSubmit(values, file);
    form.resetFields();
    setFile(null);
  };

  useEffect(() => {
    // Quand on ouvre le modal en EDIT -> on pré-remplit
    if (open && initialValues) {
      form.setFieldsValue({
        title: initialValues.title ?? "",
      });
      return;
    }

    // Quand on ouvre en CREATE (ou on passe de edit -> create) -> reset
    if (open && !initialValues) {
      form.resetFields();
      setFile(null);
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
        setFile(null);
      }}
      footer={null}
      width={520}
      centered
      destroyOnHidden
    >
      <Space orientation="vertical" size={4} style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        <Text type="secondary">{description}</Text>
      </Space>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="title"
          label="Titre"
          rules={[{ required: true, message: "Le titre est obligatoire" }]}
        >
          <Input size="large" placeholder="Titre de la page" />
        </Form.Item>

        {/* Preview image actuelle (optionnel mais super utile) */}
        {initialValues?.hero_image ? (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Image actuelle</div>
            <img
              src={initialValues.hero_image}
              alt=""
              className="h-20 rounded"
            />
          </div>
        ) : null}

        <Form.Item label="Image hero (optionnelle)">
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture-card"
            onChange={(info) =>
              setFile((info.fileList[0]?.originFileObj as File) || null)
            }
          >
            <div style={{ textAlign: "center" }}>
              <PictureOutlined style={{ fontSize: 24, color: "#ccc" }} />
              <div style={{ marginTop: 8 }}>
                {initialValues ? "Remplacer" : "Ajouter"}
              </div>
            </div>
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              form.resetFields();
              setFile(null);
            }}
            className="border border-gray-200 rounded-lg px-3 py-1"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-700"
          >
            Enregistrer
          </button>
        </div>
      </Form>
    </Modal>
  );
}