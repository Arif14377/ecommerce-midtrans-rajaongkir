export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    roles: string[];
    created_at: string;
    updated_at: string;
}

export type UserResponse = User;

export type Permissions = Record<string, boolean>;

export interface UserLoginResponse {
    id: number;
    name: string;
    username: string;
    email: string;
    roles: string[];
    permissions: Permissions;
}

export interface LoginResponse {
  token: string;
  user: UserLoginResponse;
}

export interface AuthState {
  user: User | null;
  token: string;
  permissions: Permissions;
  setAuth: (data: LoginResponse) => void;

  logout: () => void;
}