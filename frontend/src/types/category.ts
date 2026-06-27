export interface CategoryCreateRequest {
  name: string;
}

export interface CategoryUpdateRequest {
  name: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface CategoriesResponse {
  current_page: number;
  data: CategoryResponse[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
}
