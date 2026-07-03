import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import Cookies from "js-cookie";
import type { AdminOrder, PaginatedResponse } from "../../../types";

export const useOrders = (page: number = 1, search: string = '') => {
    return useQuery<PaginatedResponse<AdminOrder[]>>({
        queryKey: ['admin-orders', page, search],
        queryFn: async()=> {
            const token = Cookies.get('token');
            const response = await Api.get<PaginatedResponse<AdminOrder[]>>(
                `/api/admin/orders?page=${page}&search=${search}`,
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );
            
            return response.data
        },
    });
};