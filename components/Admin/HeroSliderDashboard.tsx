"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Button, Upload, message, Spin } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

interface HeroMedia {
  id: string;
  media_path: string;
  media_type?: "image" | "video";
  order: number;
}

const HeroSliderDashboard = () => {
  const [images, setImages] = useState<HeroMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);

    const { data, error } = await supabaseClient
      .from("hero_slider")
      .select("id, media_path, media_type, order")
      .order("order");

    if (error) {
      message.error("Erreur de chargement des médias");
    } else {
      setImages(data || []);
    }

    setLoading(false);
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const type = file.type.startsWith("video") ? "video" : "image";
    formData.append("type", type);

    const res = await fetch("/api/admin/hero-images/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      message.success("Media ajouté");
      fetchImages();
    } else {
      message.error("Erreur lors de l'upload");
    }
  };

  const handleDelete = async (image: HeroMedia) => {
    const res = await fetch("/api/admin/hero-images/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: image.id,
        path: image.media_path,
      }),
    });

    if (res.ok) {
      message.success("Media supprimé");
      fetchImages();
    } else {
      message.error("Erreur lors de la suppression");
    }
  };

  const getUrl = (path: string) =>
    `https://mugpnlsqeqbojnzrfnjf.supabase.co/storage/v1/object/public/hero-images/${path}`;

  return (
    <div className="max-w-3xl mx-auto p-6 relative top-24 pb-48">
      <h1 className="text-2xl font-bold mb-4">Gestion du Hero</h1>

      <Upload
        customRequest={({ file }) => handleUpload(file as File)}
        showUploadList={false}
        accept="image/*,video/*"
        disabled={uploading}
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          Ajouter un media
        </Button>
      </Upload>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Spin />
        ) : (
          images.map((img) => {
            const url = getUrl(img.media_path);

            const isVideo =
              img.media_type === "video" ||
              /\.(mp4|webm|mov)$/i.test(img.media_path);

            return (
              <div
                key={img.id}
                className="flex items-center gap-4 p-2 border rounded"
              >
                {isVideo ? (
                  <video
                    src={url}
                    className="w-32 h-20 object-cover rounded"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={url}
                    alt="hero"
                    className="w-32 h-20 object-cover rounded"
                  />
                )}

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(img)}
                >
                  Supprimer
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HeroSliderDashboard;