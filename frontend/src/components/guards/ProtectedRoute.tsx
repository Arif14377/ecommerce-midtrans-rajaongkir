import { Navigate } from 'react-router';
import Cookies from 'js-cookie';
import { type ComponentType } from 'react';
import { useAuthStore } from '../../stores/auth';

interface protectedRouteProps {
    component: ComponentType<object>;
    requiredPermission?: string;
    requiredRole?: 'admin' | 'user';
    redirectTo?: string;
}

export default function ProtectedRoute({
                                           component: Component,
                                           requiredPermission,
                                           requiredRole,
                                           redirectTo = '/login'
                                       }: protectedRouteProps) {
    const { token, user } = useAuthStore();
    const isAuthenticated = !!token;

    let userPermissions: Record<string, boolean> = {};
    try {
        const permissionsCookie = Cookies.get('permissions');
        if (permissionsCookie) {
            userPermissions = JSON.parse(permissionsCookie);
        }
    } catch {
        // silent fail
    }

    const hasPermission = !requiredPermission || userPermissions[requiredPermission];
    const userRoles = user?.roles || [];
    const hasRole = !requiredRole || userRoles.includes(requiredRole);

    const isCustomerOnly =
        userRoles.length === 0 ||
        (userRoles.length === 1 && userRoles.includes('user'));

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasPermission) {
        return <Navigate to={redirectTo} replace />;
    }

    if (!hasRole) {
        return (
            <Navigate
                to={isCustomerOnly ? '/dashboard' : '/admin/dashboard'}
                replace
            />
        );
    }

    return <Component />;
}