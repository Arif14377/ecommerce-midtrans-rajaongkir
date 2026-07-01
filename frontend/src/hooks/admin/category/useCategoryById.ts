import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api';
import type { CategoryResponse } from '../../../types/category';

export const useCategoryById = (id: number) => {
  return useQuery<CategoryResponse, Error>({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await Api.get(`/api/admin/categories/${id}`);
      return response.data.data;
    },
    enabled: id > 0,
  });
};
