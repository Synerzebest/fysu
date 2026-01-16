export type ProductType = {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
    slug: string;
    gender: string;
    category: string;
    colors: number;
    product_images: { id: number; url: string, color: string }[];
    details: string;
    size_fit: string;
  };
  