"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Button, Upload, message, Spin } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

interface HeroImage {
  id: string;
  image_path: string;
  order: number;
}

const HeroSliderDashboard = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    const { data, error } = await supabaseClient
      .from("hero_slider")
      .select("id, image_path, order")
      .order("order")

    if (error) {
      message.error("Erreur de chargement des images")
    } else {
      setImages(data || [])
    }
    setLoading(false)
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch("/api/admin/hero-images/upload", {
      method: "POST",
      body: formData,
    });
  
    if (res.ok) {
      message.success("Image ajoutée");
      fetchImages();
    } else {
      message.error("Erreur lors de l'upload");
    }
  };  

  const handleDelete = async (image: HeroImage) => {
    const res = await fetch("/api/admin/hero-images/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({
        id: image.id,
        path: image.image_path,
      }),
    });
  
    if (res.ok) {
      message.success("Image supprimée");
      fetchImages();
    } else {
      message.error("Erreur lors de la suppression");
    }
  };
  
  

  return (
    <div className="max-w-3xl mx-auto p-6 relative top-24 pb-48">
      <h1 className="text-2xl font-bold mb-4">Gestion des images du Hero</h1>

      <Upload
        customRequest={({ file }) => handleUpload(file as File)}
        showUploadList={false}
        accept="image/*"
        disabled={uploading}
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          Ajouter une image
        </Button>
      </Upload>


      <div className="mt-6 space-y-4">
        {loading ? (
          <Spin />
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className="flex items-center gap-4 p-2 border rounded"
            >
              <img
                src={`https://mugpnlsqeqbojnzrfnjf.supabase.co/storage/v1/object/public/hero-images/${img.image_path}`}
                alt="hero"
                className="w-32 h-20 object-cover rounded"
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(img)}
              >
                Supprimer
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HeroSliderDashboard;