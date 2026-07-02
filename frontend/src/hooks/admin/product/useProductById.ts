import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { ProductResponse } from "../../../types";

export const useProductById = (id: number) => {
    return useQuery<ProductResponse, Error>({
        queryKey: ['product', id],
        queryFn: async () => {
        const response = await Api.get(
            `/api/admin/products/${id}`
        );
        return response.data.data;
        },
        enabled: id > 0,
    });
};