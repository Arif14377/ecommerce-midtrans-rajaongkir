import { useMutation } from '@tanstack/react-query';
import Api from '../../../services/api';

export const useCategoryDelete = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await Api.delete(
        `/api/admin/categories/${id}`
      );
      return response.data;
    }
  });
};
