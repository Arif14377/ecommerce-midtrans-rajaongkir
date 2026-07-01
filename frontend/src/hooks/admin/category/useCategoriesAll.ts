import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api';
import type { CategoryResponse } from '../../../types/category';

export const useCategoriesAll = () => {
  return useQuery<CategoryResponse[], Error>({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const response = await Api.get('/api/admin/categories/all');
      return response.data.data;
    },
  });
};
