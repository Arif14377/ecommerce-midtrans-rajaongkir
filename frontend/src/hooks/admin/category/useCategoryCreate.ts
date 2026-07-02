import { useMutation } from '@tanstack/react-query';
import Api from '../../../services/api';
import type { CategoryCreateRequest } from '../../../types/category';

export const useCategoryCreate = () => {
  return useMutation({
    mutationFn: async (data: CategoryCreateRequest) => {
      const response = await Api.post(
        '/api/admin/categories',
        data
      );
      return response.data;
    }
  });
};
