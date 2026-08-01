import { useMutation } from '@tanstack/react-query';
import Api from '../../../services/api.ts'

export const usePermissionDelete = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await Api.delete(`/api/admin/permissions/${id}`);
            return response.data;
        }
    });
};