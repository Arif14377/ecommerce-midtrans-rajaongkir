import type { UserResponse } from './auth';

export interface ReviewCreateRequest {
  product_id: number;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  user: UserResponse;
  product_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}