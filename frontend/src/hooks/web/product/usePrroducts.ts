import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { PublicProduct, MetaPaginatedResponse } from '../../../types';

export const usePrroducts = (
    page: number,
    perPage: number,
    search?: string,
    categorySlug?: string
) => {
    return useQuery<MetaPaginatedResponse<PublicProduct[]>, Error>({
        queryKey: ['web-products', page, perPage, search, categorySlug],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('per_page', perPage.toString());
            if (search) {
                params.append('search', search);
            }
            if (categorySlug) {
                params.append('category', categorySlug);
            }

            const response = await Api.get(`/api/public/products?${params.toString()}`);
            return response.data;
        }
    })
};