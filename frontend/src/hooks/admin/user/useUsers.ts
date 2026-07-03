import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { UserResponse } from "../../../types";
import type { Params } from "../../../types";

export const useUser = ({page, search}: Params) => {
    return useQuery<UserResponse, Error>({
        queryKey: ['users', page, search],
        queryFn: async () => {
            const response = await Api.get(`/api/admin/users?page=${page}&search=${search}`);
            return response.data.data;
        },
    });
};