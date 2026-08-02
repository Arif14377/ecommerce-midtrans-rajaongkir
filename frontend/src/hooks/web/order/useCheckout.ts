import { useMutation } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, CheckoutRequest,CheckoutResponse } from '../../../types';

export const useCheckout = () => {
    return useMutation<SuccessResponse<CheckoutResponse>, Error, CheckoutRequest>({
        mutationFn: async (data) => {
            const response = await Api.post('/api/orders/checkout', data);
            return response.data;
        }
    });
}