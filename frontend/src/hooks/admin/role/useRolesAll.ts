import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { RoleResponse } from "../../../types";

export const useRolesAll = () => {
    return useQuery<RoleResponse, Error>({
        queryKey: ['roles', 'all'],
        queryFn: async () => {
            const response = await Api.get('/api/admin/roles/all')
            return response.data.data;
        }
    });
};