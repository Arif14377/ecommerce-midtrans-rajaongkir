import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import Cookies from "js-cookie";
import type { OrderDetailResponse, SuccessResponse } from "../../../types";

export const useOrderById = (id: string) => {
    return useQuery<SuccessResponse<OrderDetailResponse>>({
        queryKey: ['admin-order', id],

        queryFn: async () => {
            const token = Cookies.get('token');
            const response = await Api.get(`/api/admin/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}`}
            });

            return response.data;
        },

        enabled: !!id
    });
};