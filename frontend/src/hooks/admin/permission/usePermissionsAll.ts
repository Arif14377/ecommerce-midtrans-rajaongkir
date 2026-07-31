import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { PermissionResponse } from "../../../types";

export const usePermissionsAll = () => {
    return useQuery<PermissionResponse[], Error>({
        queryKey: ['permissions', 'all'],
        queryFn: async () => {
            const response = await Api.get('api/admin/permissions/all')
            return response.data.data;
        }
    });
};