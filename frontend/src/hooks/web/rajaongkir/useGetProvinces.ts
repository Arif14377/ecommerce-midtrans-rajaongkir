import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, Province } from '../../../types';

export const useGetProvinces = () => {
    return useQuery<SuccessResponse<Province[]>, Error>({
        queryKey: ['provinces'],
        queryFn: async () => {
            const response = await Api.get('/api/provinces');
            return response.data;
        }
    });
};