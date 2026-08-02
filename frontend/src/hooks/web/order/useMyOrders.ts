import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, OrderResponse } from "../../../types";

export const useMyOrders = <T = SuccessResponse<OrderResponse[]>>(
    select?: (data: SuccessResponse<OrderResponse[]>) => T
) => {
    return useQuery<SuccessResponse<OrderResponse[]>, Error, T>({
        queryKey: ['my-orders'],
        queryFn: async () => {
            const response = await Api.get('/api/public/orders');
            return response.data;
        },
        select
    });
};