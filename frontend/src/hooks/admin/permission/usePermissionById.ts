import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { PermissionResponse } from '../../../types'

export const usePermissionById = (id: number) => {
    return useQuery<PermissionResponse, Error>({
        queryKey: ['permission', id],
        queryFn: async () => {
            const response = await Api.get(`/api/admin/permissions/${id}`)
            return response.data.data
        },
        enabled: id > 0,
    });
};