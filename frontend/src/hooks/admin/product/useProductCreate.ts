// import useMutation dari '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

// import service Api
import Api from '../../../services/api';

// import type
import type { ProductResponse } from '../../../types/product';
import type { SuccessResponse } from '../../../types/api';

export const useProductCreate = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await Api.post<SuccessResponse<ProductResponse>>(
        '/api/admin/products',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return response.data;
    }
  });
};
