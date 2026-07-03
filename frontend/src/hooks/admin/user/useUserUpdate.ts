import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { UserUpdateRequest } from "../../../types";

interface UpdateUserParams {
    id: number,
    data: UserUpdateRequest
};

export const useUserUpdate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({id, data}: UpdateUserParams) => {
            const response = await Api.put(`/api/admin/users/${id}`, data);
            return response.data.data;
        },

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [`user`, variables.id] })
            queryClient.invalidateQueries({ queryKey: [`users`] })
        }
    });
}