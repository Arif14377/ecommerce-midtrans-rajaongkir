import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await Api.delete(`/api/carts/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['web-cart'] });
        }
    });
}