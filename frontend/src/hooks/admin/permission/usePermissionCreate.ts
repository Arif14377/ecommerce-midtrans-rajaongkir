import { useMutation } from '@tanstack/react-query'
import Api from '../../../services/api.ts';
import type { SuccessResponse, PermissionCreateRequest, PermissionResponse } from '../../../types';

export const usePermissionCreate = () => {
    return useMutation<SuccessResponse<PermissionResponse>, Error, PermissionCreateRequest>({
        mutationFn: async (permissionData) => {
            const response = await Api.post('/api/admin/permissions', permissionData);
            return response.data;
        }
    });
};