import type { RoleResponse } from './role';

export interface UserCreateRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  role_ids: number[];
}

export interface UserUpdateRequest {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role_ids?: number[];
}

export interface UserDetailResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  roles: RoleResponse[];
}

export interface UsersResponse {
  current_page: number;
  data: UserDetailResponse[];
  last_page: number;
  per_page: number;
  total: number;
}
