import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";

export const useRoleDelete = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await Api.delete(`/api/admin/roles/${id}`);
            return response.data;
        }
    });
};