import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { ProductResponse, SuccessResponse } from "../../../types";

interface UpdateProductParams {
    id: number;
    formData: FormData;
}

export const useProductUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formData }: UpdateProductParams) => {
            const response = await Api.put<SuccessResponse<ProductResponse>>(
                `/api/admin/products/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            return response.data
        },

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['product', variables.id],
            });

            queryClient.invalidateQueries({
                queryKey: ['products']
            });
        },
    });
};