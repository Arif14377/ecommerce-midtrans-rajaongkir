import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, AddressResponse, AddressCreateRequest } from '../../../types';

export const useCreateAddress = () => {
    const queryClient = useQueryClient()

    return useMutation<SuccessResponse<AddressResponse>, Error, AddressCreateRequest>({
        mutationFn: async (data) => {
            const response = await Api.post('/api/addresses', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });
};