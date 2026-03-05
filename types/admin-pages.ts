export type AssignType = "page" | "collection";

export type PageRow = {
  id: string;
  title: string;
  slug: string;
  hero_image: string | null;
  products?: string[]; // ids
};

export type CollectionRow = {
  id: string;
  title: string;
  slug: string;
  hero_image: string | null;
  products?: string[]; // ids
};