import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";

export const useProductDelete = () => {
    return useMutation ({
        mutationFn: async (id: number) => {
            const response = await Api.delete(
                `/api/admin/products/${id}`
            );
            return response.data;
        }
    });
};