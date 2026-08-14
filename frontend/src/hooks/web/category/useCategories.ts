import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { PublicCategory } from '../../../types';

export const useCategories = () => {
    return useQuery<PublicCategory[]>({
        queryKey: ['web-categories'],
        queryFn: async () => {
            const response = await Api.get('/api/public/categories');
            return response.data.data;
        }
    });
}