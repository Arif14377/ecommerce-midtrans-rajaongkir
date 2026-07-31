import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { PermissionsResponse, Params } from "../../../types";

export const usePermissions = ({ page, search }: Params) => {
    return useQuery<PermissionsResponse, Error>({
        queryKey: ['Permissions', page, search],
        queryFn: async () => {
            const response = await Api.get(`/api/admin/permissions?page=${page}&search=${search}`)
            return response.data.data
        }
    });
};