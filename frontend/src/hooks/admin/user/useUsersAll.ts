import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api';
import type { UserDetailResponse } from '../../../types/user';

export const useUsersAll = () => {
  return useQuery<UserDetailResponse[], Error>({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const response = await Api.get('/api/admin/users/all');
      return response.data.data;
    },
  });
};
