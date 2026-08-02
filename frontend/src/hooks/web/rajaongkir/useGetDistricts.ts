import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, District } from '../../../types';

export const useGetDistricts = (cityId: number) => {
    return useQuery<SuccessResponse<District[]>, Error>({
        queryKey: ['districts', cityId],
        queryFn: async () => {
            const response = await Api.get(`/api/districts/${cityId}`);
            return response.data;
        },
        enabled: !!cityId
    });
};