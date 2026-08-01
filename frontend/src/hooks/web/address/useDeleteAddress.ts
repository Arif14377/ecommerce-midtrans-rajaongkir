import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, AddressResponse } from '../../../types';

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();

    return useMutation<SuccessResponse<AddressResponse>, Error, number>({
        mutationFn: async (id) => {
            const response = await Api.delete(`/api/addresses/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });
};