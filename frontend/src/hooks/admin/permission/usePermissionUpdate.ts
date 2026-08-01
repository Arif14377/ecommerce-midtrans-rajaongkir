import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { PermissionUpdateRequest } from '../../../types';

interface UpdatePermissionParams {
    id: number;
    data: UpdatePermissionParams;
}

export const usePermissionUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<PermissionUpdateRequest, Error, UpdatePermissionParams>({
        mutationFn: async ({ id, data }) => {
            const response = await Api.put(`/api/admin/permissions/${id}`, data);
            return response.data.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['permission', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
            queryClient.invalidateQueries({ queryKey: ['permissionsAll'] });
        }
    });
};