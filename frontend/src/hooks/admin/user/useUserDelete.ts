import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";

export const useUserDelete = () => {
    return useMutation({
        mutationFn: async (id) => {
            const response = await Api.delete(`/api/admin/users/${id}`);
            return response.data;
        }
    })
}