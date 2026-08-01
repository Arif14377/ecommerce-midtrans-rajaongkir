import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, SalesReport } from '../../../types';

export const useSalesReport = (startDate: string, endDate: string) => {
    return useQuery<SuccessResponse<SalesReport>>({
        queryKey: ['admin-reports-sales', startDate, endDate],
        queryFn: async () => {
            const response = await Api.get(`/api/admin/reports/sales?start_date=${startDate}&end_date=${endDate}`)
            return response.data;
        },
        enabled: !!startDate && !!endDate
    });
};