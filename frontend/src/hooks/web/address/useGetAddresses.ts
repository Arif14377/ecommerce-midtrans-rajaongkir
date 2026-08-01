import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, AddressResponse } from '../../../types';

export const useGetAddresses = () => {
    return useQuery<SuccessResponse<AddressResponse[]>>({
        queryKey: ['addresses'],
        queryFn: async () => {
            const response = await Api.get('/api/addresses');
            return response.data;
        }
    });
};