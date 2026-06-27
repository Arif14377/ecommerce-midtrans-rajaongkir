import type { PublicProduct } from './product';

export interface CartItem {
  id: number;
  product: PublicProduct;
  quantity: number;
  total_price: number;
}
