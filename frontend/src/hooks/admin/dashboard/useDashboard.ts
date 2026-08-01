import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { DashboardResponse } from '../../../types';

export const useDashboard = () => {
    return useQuery<DashboardResponse>({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await Api.get('/api/admin/dashboard');
            return response.data.data;
        }
    });
};