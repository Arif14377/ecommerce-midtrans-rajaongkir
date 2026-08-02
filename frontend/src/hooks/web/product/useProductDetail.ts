import { useQuery } from "@tanstack/react-query";
import Api from '../../../services/api.ts';
import type { SuccessResponse, PublicProduct } from '../../../types';

export const useProductDetail = (slug: string) => {
    return useQuery<SuccessResponse<PublicProduct>, Error>({
        queryKey: ['web-product-detail', slug],
        queryFn: async () => {
            const response = await Api.get(`/api/public/products/${slug}`);
            return response.data;
        },
        enabled: !!slug
    });
};