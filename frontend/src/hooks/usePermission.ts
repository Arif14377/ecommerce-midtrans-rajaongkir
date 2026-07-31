import { useAuthStore } from "../stores/auth";

// todo: ubah if (!false) return true menjadi return false.
export const usePermission = () => {
    const { permissions } = useAuthStore();

    const hasPermission = (permissionName: string): boolean => {
        if (!permissionName) {
            return true
        }

        return !!permissions[permissionName]
    };

    const hasAnyPermission = (permissionNames: string[]): boolean => {
        if (!permissionNames || permissionNames.length === 0) return true;

        return permissionNames.some((name) => !!permissions[name])
    };

    const hasAllPermissions = (permissionNames:string[]): boolean => {
        if (!permissionNames || permissionNames.length === 0) return true;

        return permissionNames.every((name)=> !!permissions[name]);
    };

    return { permissions, hasPermission, hasAnyPermission, hasAllPermissions };
};