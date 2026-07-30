import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { RoleUpdateRequest, RoleResponse, SuccessResponse } from "../../../types";

interface UpdateRoleParams {
    id: number;
    data: RoleUpdateRequest;
}

export const useRoleUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateRoleParams) => {
            const response = await Api.put<SuccessResponse<RoleResponse>>(
                `/api/admin/roles/${id}`, data
            );
            return response.data
        },
        
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries( { queryKey: ['role', variables.id] });
            queryClient.invalidateQueries( { queryKey: ['roles'] });
            queryClient.invalidateQueries( { queryKey: ['rolesAll'] });
        }
    });
};