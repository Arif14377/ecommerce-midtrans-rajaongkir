export interface PermissionCreateRequest {
    name: string;
}

export interface PermissionUpdateRequest {
    name: string;
}

export interface PermissionResponse {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface PermissionsResponse {
    current_page: number;
    data: PermissionResponse[];
    last_page: number;
    per_page: number;
    total: number;
}