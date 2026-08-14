import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, OrderDetailResponse } from '../../../types';

export const useGetOrderDetail = (id: string) => {
    return useQuery<SuccessResponse<OrderDetailResponse>>({
        queryKey: ['order', id],
        queryFn: async () => {
            const response = await Api.get(`/api/orders/${id}`);
            return response.data;
        },
        enabled: !!id
    });
};