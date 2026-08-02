import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, CartItem } from '../../../types';
import Cookies from 'js-cookie';

export const useGetCart = <T = SuccessResponse<CartItem[]>>(
    select?: (data: SuccessResponse<CartItem[]>) => T
) => {
    const token = Cookies.get('token');

    return useQuery<SuccessResponse<CartItem[]>, Error, T>({
        queryKey: ['web-cart'],
        queryFn: async () => {
            if (!token) throw new Error("No token found");
            const response = await Api.get('/api/carts');
            return response.data;
        },
        enabled: !!token,
        retry: false,
        select
    });
};