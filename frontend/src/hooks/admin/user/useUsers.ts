import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { UsersResponse } from "../../../types";
import type { Params } from "../../../types";

export const useUsers = ({page, search}: Params) => {
    return useQuery<UsersResponse, Error>({
        queryKey: ['users', page, search],
        queryFn: async () => {
            const response = await Api.get(`/api/admin/users?page=${page}&search=${search}`);
            return response.data.data;
        },
    });
};
