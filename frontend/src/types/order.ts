import type { UserResponse } from './auth';
import type { ProductResponse } from './product';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderDetailResponse {
  id: string;
  user: UserResponse;
  total_price: number;
  status: OrderStatus;
  snap_token: string;
  items: OrderItemResponse[];
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_cost: number;
  courier: string;
  service: string;
  payment_status?: string;
  created_at: string;
}

export interface OrderItemResponse {
  id: number;
  product_id: number;
  product: ProductResponse;
  quantity: number;
  price: number;
  sub_total: number;
}

export interface OrderResponse {
  id: string;
  customer: string;
  total?: number;
  total_price?: number;
  status: string;
  created_at: string;
  items: OrderItemResponse[];
}

export interface CheckoutRequest {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_cost: number;
  courier: string;
  service: string;
}

export interface CheckoutResponse {
  snap_token: string;
  redirect_url: string;
  order_id: string;
}

export interface AdminOrder {
  id: string;
  invoice: string;
  customer: string;
  total: number;
  status: string;
  created_at: string;
  payment_type: string;
}
