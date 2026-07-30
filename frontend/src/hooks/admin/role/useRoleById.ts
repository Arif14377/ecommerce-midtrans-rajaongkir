import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api';
import type { RoleResponse } from '../../../types';

export const useRoleById = (id: number) => {
    return useQuery<RoleResponse, Error>({
        queryKey: ['role', id],
        queryFn: async() => {
            const response = await Api.get(`/api/admin/roles/${id}`);
            return response.data.data
        },
        enabled: id > 0,
    });
};