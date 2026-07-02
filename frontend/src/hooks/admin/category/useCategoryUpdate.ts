// import useMutation dari '@tanstack/react-query';
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

// import service API
import Api from '../../../services/api';

// import type
import type { CategoryUpdateRequest } from '../../../types/category';

interface UpdateCategoryParams {
  id: number;
  data: CategoryUpdateRequest;
}

export const useCategoryUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateCategoryParams) => {
      const response = await Api.put(
        `/api/admin/categories/${id}`,
        data
      );
      return response.data;
    },
    
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['category', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
      queryClient.invalidateQueries({
        queryKey: ['categoriesAll'],
      });
    },
  });
};
