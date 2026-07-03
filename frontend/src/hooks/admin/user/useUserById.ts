import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { UserDetailResponse } from "../../../types";

export const useUserById = (id: number) => {
    return useQuery<UserDetailResponse>({
        queryKey: ['user', id],

        queryFn: async () => {
            const response = await Api.get(`/api/admin/users/${id}`);
            return response.data.data;
        },

        enabled: id > 0,
    });
};