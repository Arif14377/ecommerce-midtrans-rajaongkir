import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, CartItem } from '../../../types';

interface AddToCartParam {
    productId: number;
    quantity: number;
}

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation<SuccessResponse<CartItem>, Error, AddToCartParam>({
        mutationFn: async ({ productId, quantity }) => {
            const response = await Api.post('/api/carts', {
                product_id: productId,
                quantity
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['web-cart'] });
        }
    })
}