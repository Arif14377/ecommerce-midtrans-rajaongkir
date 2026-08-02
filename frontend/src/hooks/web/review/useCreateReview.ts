import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, ReviewCreateRequest, ReviewResponse } from '../../../types';
import toast from 'react-hot-toast';
import { AxiosError } from "axios";

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation<SuccessResponse<ReviewResponse>, AxiosError<{ message: string }>, ReviewCreateRequest>({
        mutationFn: async (data) => {
            const response = await Api.post('/api/reviews', data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['web-reviews', variables.product_id] });
            toast.success(data.message, { position: 'top-center' });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data.message || 'Failed to create review', { position: 'top-center' });
        }
    });
};