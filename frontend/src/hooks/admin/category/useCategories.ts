import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api';
import type { CategoriesResponse } from '../../../types/category';
import type { Params } from '../../../types';

export const useCategories = ({ page, search }: Params) => {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ['categories', page, search],
    queryFn: async () => {
      const response = await Api.get(
        `/api/admin/categories?page=${page}&search=${search}`
      );
      return response.data.data;
    },
  });
};
