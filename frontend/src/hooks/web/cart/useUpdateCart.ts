import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, CartItem } from '../../../types';

export const useUpdateCart = () => {
    const queryClient = useQueryClient();

    return useMutation<SuccessResponse<CartItem>, Error, { cartItemId: number; quantity: number }>({
        mutationFn: async ({ cartItemId, quantity }) => {
            const response = await Api.put(`/api/carts/${cartItemId}`, { quantity });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['web-cart'] });
        }
    });
}