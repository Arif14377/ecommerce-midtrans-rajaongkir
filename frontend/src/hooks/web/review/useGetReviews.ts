import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, ReviewResponse } from '../../../types';

export const useGetReviews = (productId: number | string) => {
    return useQuery<SuccessResponse<ReviewResponse[]>>({
        queryKey: ['web-reviews', productId],
        queryFn: async () => {
            const response = await Api.get(`/api/public/reviews/product/${productId}`);
            return response.data;
        },
        enabled: !!productId,
    });
};