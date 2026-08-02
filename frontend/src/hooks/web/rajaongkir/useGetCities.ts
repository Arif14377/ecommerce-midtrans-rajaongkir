import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, City } from '../../../types';

export const useGetCities = (provinceId: number) => {
    return useQuery<SuccessResponse<City[]>, Error>({
        queryKey: ['cities', provinceId],
        queryFn: async () => {
            const response = await Api.get(`/api/cities/${provinceId}`);
            return response.data;
        },
        enabled: !!provinceId
    });
};