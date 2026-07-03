import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api';
import type { Customer, PaginatedResponse } from '../../../types';

export const useCustomers = (page: number, search: string) => {
  return useQuery<PaginatedResponse<Customer[]>>({
    queryKey: ['admin-customers', page, search],
    queryFn: async () => {
      const response = await Api.get(`/api/admin/customers?page=${page}&search=${search}`);
      return response.data;
    }
  });
};
