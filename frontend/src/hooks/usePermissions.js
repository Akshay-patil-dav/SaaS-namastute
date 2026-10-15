import { useAuth } from '../context/AuthContext';

export function usePermissions() {
    const { user } = useAuth();
    
    let permissions = {};
    if (user?.projectPermissions) {
        try {
            permissions = typeof user.projectPermissions === 'string'
                ? JSON.parse(user.projectPermissions)
                : user.projectPermissions;
            if (typeof permissions !== 'object' || permissions === null) {
                permissions = {};
            }
        } catch (e) {
            console.error("Failed to parse permissions", e);
        }
    }

    const hasFullAccess = user?.role === 'SUPER_ADMIN' || !user?.activeProjectId || user?.activeProjectId === user?.id;

    const canView = (module) => {
        if (hasFullAccess) return true;
        if (!module) return true;
        if (Array.isArray(module)) {
            return module.some(m => canView(m));
        }
        if (!permissions[module]) return false;
        return permissions[module].includes('VIEW') || permissions[module].includes('MANAGE');
    };

    const canManage = (module) => {
        if (hasFullAccess) return true;
        if (!module) return true;
        if (Array.isArray(module)) {
            return module.some(m => canManage(m));
        }
        if (!permissions[module]) return false;
        return permissions[module].includes('MANAGE') || 
               permissions[module].includes('CREATE') || 
               permissions[module].includes('EDIT') || 
               permissions[module].includes('DELETE');
    };

    return { canView, canManage, hasFullAccess, permissions };
}
