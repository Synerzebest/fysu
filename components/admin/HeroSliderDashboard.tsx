"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input, Button, Upload, message, Spin } from "antd";
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
    const { data, error } = await supabase
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
    setUploading(true);
    const fileName = file.name.replace(/\s+/g, "_");
    const filePath = `hero-slider/${Date.now()}_${fileName}`;
  
    const { error: uploadError } = await supabase.storage
      .from("hero-images")
      .upload(filePath, file);
  
    if (uploadError) {
      message.error("Erreur lors de l'upload");
      setUploading(false);
      return false;
    }
  
    const { data: existingOrders, error: orderError } = await supabase
      .from("hero_slider")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);
  
    const newOrder =
      !orderError && existingOrders && existingOrders.length > 0
        ? existingOrders[0].order + 1
        : 1;
  
    const { error: insertError } = await supabase
      .from("hero_slider")
      .insert({
        image_path: filePath,
        order: newOrder,
      });
  
    if (insertError) {
      message.error("Image uploadée mais non enregistrée");
    } else {
      message.success("Image ajoutée");
      fetchImages();
    }
  
    setUploading(false);
    return false;
  };
  
  

  const handleDelete = async (image: HeroImage) => {
    const { error: storageError } = await supabase.storage
      .from("hero-images")
      .remove([image.image_path])

    const { error: dbError } = await supabase
      .from("hero_slider")
      .delete()
      .eq("id", image.id)

    if (storageError || dbError) {
      message.error("Erreur lors de la suppression")
    } else {
      message.success("Image supprimée")
      fetchImages()
    }
  }

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
