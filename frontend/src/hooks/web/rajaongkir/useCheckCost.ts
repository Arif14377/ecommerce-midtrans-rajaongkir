import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api.ts";
import type { ShippingCostRequest } from '../../../types';

export const useCheckCost = (data: Partial<ShippingCostRequest>) => {
    return useQuery({
        queryKey: ['shipping-cost', data.destination, data.courier, data.weight],
        queryFn: async () => {
            // Implementation for checking shipping cost
            if (!data.destination || !data.courier || !data.weight) {
                return [];
            }

            const response = await Api.post('/api/check-cost', data);
            return response.data.data;
        },
        enabled: !!data.destination && !!data.courier && !!data.weight && data.weight > 0,
        staleTime: 5 * 60 * 1000,
        retry: false
    });
};