import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api';
import type { ProductsResponse } from '../../../types/product';
import type { Params } from '../../../types'

export const useProducts = ({ page, search }: Params) => {
  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', page, search],
    queryFn: async () => {
      const response = await Api.get(
        `/api/admin/products?page=${page}&search=${search}`
      );
      return response.data.data;
    },
  });
};
