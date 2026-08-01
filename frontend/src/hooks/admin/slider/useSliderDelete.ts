import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse } from '../../../types';

export const useSliderDelete = () => {
    const queryClient = useQueryClient()

    return useMutation<SuccessResponse<void>, Error, number>({
        mutationFn: async (id) => {
            const response = await Api.delete(`/api/admin/sliders/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
        }
    });
};