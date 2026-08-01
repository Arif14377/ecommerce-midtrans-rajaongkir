import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { Slider, SuccessResponse } from '../../../types';

export const useSliders = () => {
    return useQuery<SuccessResponse<Slider[]>, Error>({
        queryKey: ['admin-sliders'],
        queryFn: async () => {
            const response = await Api.get('/api/admin/sliders');
            return response.data;
        }
    });
};