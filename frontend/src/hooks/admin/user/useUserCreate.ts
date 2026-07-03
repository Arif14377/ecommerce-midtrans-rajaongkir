import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { UserCreateRequest } from "../../../types";

export const useUserCreate = () => {
    return useMutation({
        mutationFn: async (data: UserCreateRequest) => {
            const response = await Api.post('/api/admin/users', data);
            return response.data;
        }
    });
};