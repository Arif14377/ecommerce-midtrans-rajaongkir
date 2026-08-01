import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { AddressUpdateRequest, SuccessResponse, AddressResponse } from '../../../types';

interface UpdateRequestParams {
    id: number;
    data: AddressUpdateRequest;
}

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation<SuccessResponse<AddressResponse>, Error, UpdateRequestParams>({
        mutationFn: async ({ id, data }) => {
            const response = await Api.put(`/api/address/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['addresses']});
        },
    })
}