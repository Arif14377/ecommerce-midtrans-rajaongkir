import { Navigate, Outlet } from "react-router";
import Cookies from "js-cookie";
import { useMemo } from "react";
import { useAuthStore } from "../../stores/auth";

interface PermissionGuardProps {
    requiredPermission?: string;
    redirectTo?: string;
}

export default function PermissionGuard({
                                            requiredPermission,
                                            redirectTo = '/admin/forbidden'}: PermissionGuardProps) {
    const { token } = useAuthStore();
    const isAuthenticated = !!token;

    const userPermissions = useMemo(() => {
        const permissionCookie = Cookies.get('permissions');

        try {
            if (permissionCookie) {
                return JSON.parse(permissionCookie) as Record<string, boolean>;
            }
        } catch (error) {
            console.error("Failed to parse permissions cookie:", error);
        }

        return {};
    }, [])

    const hasPermission = useMemo(() => {
        if (!requiredPermission) return true;

        return userPermissions[requiredPermission];
    }, [requiredPermission, userPermissions]);

    if (!isAuthenticated) {
        return <Navigate to='/login' replace/>
    }

    if (!hasPermission) {
        return <Navigate to={redirectTo} replace/>
    }

    return <Outlet/>


}