import { useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { SuccessResponse, PermissionUpdateRequest } from '../../../types';

interface UpdatePermissionParams {
    id: number;
    data: PermissionUpdateRequest;
}

export const usePermissionUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<SuccessResponse<PermissionUpdateRequest>, Error, UpdatePermissionParams>({
        mutationFn: async ({ id, data }) => {
            const response = await Api.put(`/api/admin/permissions/${id}`, data);
            return response.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['permission', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
            queryClient.invalidateQueries({ queryKey: ['permissionsAll'] });
        }
    });
};