import type { CategoryResponse } from './category';

export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  category: CategoryResponse;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  current_page: number;
  data: ProductResponse[];
  last_page: number;
  per_page: number;
  total: number;
}

// Public Product Types (Storefront)
export interface PublicProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: ProductImage[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
  can_review?: boolean;
}
