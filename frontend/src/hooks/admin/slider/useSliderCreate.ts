import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { Slider, SuccessResponse } from '../../../types';

export const useSliderCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<SuccessResponse<Slider>, Error, FormData>({
        mutationFn: async (formData) => {
            const response = await Api.post(
                '/api/admin/sliders',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
        }
    });
};