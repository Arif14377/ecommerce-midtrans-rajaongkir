import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, CategoryResponse } from '../../../types';

export const useCategoryDetail = (slug: string) => {
    return useQuery<SuccessResponse<CategoryResponse>>({
        queryKey: ['web-category-detail', slug],
        queryFn: async () => {
            const response = await Api.get(`/api/public/categories/${slug}`);
            return response.data;
        },
        enabled: !!slug
    });
};