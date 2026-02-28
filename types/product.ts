export type ProductImage = {
  id: number;
  url: string;
  color: string;
};

export type ProductSize = {
  id: string;        
  product_id: number;
  size: string;
  stock: number;
  is_active: boolean;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string;          
  slug: string;
  gender: string;
  category: string;
  colors: number;
  details?: string | null;
  size_fit?: string | null;

  category_id: number | null;  

  // si tu fais un select avec jointure categories(...)
  categories?: Pick<Category, "id" | "name"> | null;

  product_images: ProductImage[];
  product_sizes?: ProductSize[];
};