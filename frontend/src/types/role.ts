import type { PermissionResponse } from './permission';

export interface RoleCreateRequest {
  name: string;
  permission_ids: number[];
}

export interface RoleUpdateRequest {
  name: string;
  permission_ids: number[];
}

export interface RoleResponse {
  id: number;
  name: string;
  permissions: PermissionResponse[];
}

export interface RolesResponse {
  current_page: number;
  data: RoleResponse[];
  last_page: number;
  per_page: number;
  total: number;
}
