import { useMutation } from '@tanstack/react-query'
import Api from '../../../services/api.ts';
import type { PermissionCreateRequest } from '../../../types';

export const usePermissionCreate = () => {
    return useMutation<PermissionCreateRequest, Error, PermissionCreateRequest>({
        mutationFn: async (permissionData) => {
            const response = await Api.post('/api/admin/permissions', permissionData);
            return response.data.data;
        }
    });
};