import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { Slider } from '../../../types';

export const useSliders = () => {
    return useQuery<Slider[]>({
        queryKey: ['web-sliders'],
        queryFn: async () => {
            const response = await Api.get(`/api/public/sliders`);
            return response.data.data;
        }
    });
};