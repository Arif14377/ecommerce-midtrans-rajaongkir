import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../../services/api";

export const useProductImageDelete = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await Api.delete(
                `/api/admin/products/images/${id}`
            );
            return response.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product'] });
        },
    });
};