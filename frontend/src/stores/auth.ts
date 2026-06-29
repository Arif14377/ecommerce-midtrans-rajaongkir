import { create } from 'zustand';
import type { AuthState, Permissions, LoginResponse } from '../types/auth'; // import type
import Cookies from 'js-cookie' // import js cookies

export const useAuthStore = create<AuthState>((set) => ({
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null,
    token: Cookies.get('token') || '',
    permissions: Cookies.get('permissions')
        ? JSON.parse(Cookies.get('permissions') as string)
        : {},

    setAuth: (data: LoginResponse) => {
        const token: string  = data.token;

        const user = {
            id: data.user.id,
            name: data.user.name,
            username: data.user.username,
            email: data.user.email,
            roles: data.user.roles || [],
            created_at: '',
            updated_at: '',
        };

        const permissions: Permissions = data.user.permissions || {};

        set({ user, token, permissions });

        Cookies.set('user', JSON.stringify(user));
        Cookies.set('token', token);
        Cookies.set('permissions', JSON.stringify(permissions));
    },

    logout: () => {
        set({ user: null, token: '', permissions: {} })

        Cookies.remove('user');
        Cookies.remove('token');
        Cookies.remove('permissions');
    }
}))