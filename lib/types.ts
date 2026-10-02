export type ProductCategory = "ca-phe" | "mat-ong" | "ho-tieu";
export type ProductArt = "coffee" | "honey" | "pepper-black" | "pepper-white";

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  art: ProductArt;
  short_description: string;
  description: string;
  specs: ProductSpec[];
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
  updated_at?: string;
};

export type SiteSettings = {
  full_name: string;
  short_name: string;
  tax_code: string;
  founded_on: string;
  legal_representative: string;
  address: string;
  phone: string;
  email: string;
  distribution: string;
  intro: string;
};

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  "ca-phe": "Cà phê",
  "mat-ong": "Mật ong",
  "ho-tieu": "Hồ tiêu",
};

export const ART_LABEL: Record<ProductArt, string> = {
  coffee: "Gói cà phê",
  honey: "Hũ mật ong",
  "pepper-black": "Tiêu đen",
  "pepper-white": "Tiêu sọ",
};
