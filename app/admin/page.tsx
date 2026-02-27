"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, Row, Col } from "antd";
import {
  Shirt,
  Package,
  ShoppingCart,
  Users,
  Images,
  Layers,
  Clapperboard,
  ScrollText
} from "lucide-react";

export default function AdminHome() {
  const sections = [
    {
      title: "Catalogue",
      description: "Gérez les vêtements (ajout, édition, suppression).",
      href: "/admin/catalog",
      icon: <Shirt className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Bundles",
      description: "Créez et gérez des packs de vêtements.",
      href: "/admin/bundles",
      icon: <Package className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Commandes",
      description: "Consultez et gérez toutes les commandes.",
      href: "/admin/orders",
      icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Utilisateurs",
      description: "Liste des clients et gestion des réductions.",
      href: "/admin/users",
      icon: <Users className="w-6 h-6 text-orange-500" />,
    },
    {
      title: "Photos Home",
      description: "Modifiez les images affichées sur la page d’accueil.",
      href: "/admin/home-images",
      icon: <Images className="w-6 h-6 text-pink-500" />,
    },
    {
      title: "Pages",
      description: "Gérez les pages du site.",
      href: "/admin/pages",
      icon: <Layers className="w-6 h-6 text-gray-800" />
    },
    {
      title: "Story",
      description: "Gérez les stories du site.",
      href: "/admin/stories",
      icon: <Clapperboard className="w-6 h-6 text-blue-800" />
    },
    {
      title: "About content",
      description: "Gérez les blocs d'informations de la page About",
      href: "/admin/about",
      icon: <ScrollText className="w-6 h-6 text-orange-600" />
    }
  ];

  return (
    <>
      <Navbar />

      <div className="p-6 relative top-24">
        <h1 className="text-3xl font-bold mb-8">Panneau d’administration</h1>
        <Row gutter={[24, 24]}>
          {sections.map((s) => (
            <Col key={s.title} xs={24} sm={12} lg={8}>
              <Link href={s.href}>
                <Card
                  hoverable
                  className="shadow-md rounded-xl h-full"
                  style={{ height: "100%" }}
                >
                  <div className="flex flex-col items-start space-y-3">
                    {s.icon}
                    <h2 className="text-xl font-semibold">{s.title}</h2>
                    <p className="text-gray-500">{s.description}</p>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <Footer />
    </>
  );
}
