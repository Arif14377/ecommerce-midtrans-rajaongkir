import { useMutation } from "@tanstack/react-query"
import Api from "../../../services/api"
import type { RoleCreateRequest } from "../../../types"

export const useRoleCreate = () => {
    return useMutation({
        mutationFn: async(data: RoleCreateRequest) => {
            const response = await Api.post('/api/admin/roles', data);
            return response.data;
        }
    });
};