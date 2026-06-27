import type { OrderResponse } from './order';

export interface DashboardResponse {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  recent_orders: OrderResponse[];
  pending_orders: number;
  paid_orders: number;
}