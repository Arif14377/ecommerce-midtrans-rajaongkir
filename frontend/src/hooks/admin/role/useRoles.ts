import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Params, RolesResponse } from "../../../types";

export const useRoles = ({ page, search }: Params) => {
    return useQuery<RolesResponse, Error>({
        queryKey: ['roles', page, search],
        queryFn: async () => {
            const response = await Api.get(`/api/admin/roles?page=${page}&search=${search}`);
            return response.data.data;
        }
    })
}