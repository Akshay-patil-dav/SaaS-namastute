import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { usePermissions } from '../../../hooks/usePermissions';

const MODULE_NAMES = {
    pos: 'POS Terminal',
    sales: 'Sales & Invoices',
    products: 'Products Catalog',
    inventory: 'Inventory & Stocks',
    purchases: 'Purchases',
    khata: 'Finance & Khata Book',
    reports: 'Financial Reports',
    crm: 'Customers & CRM',
    manufacturing: 'Manufacturing',
    settings: 'Settings',
    users: 'Team & Staff'
};

function formatModuleName(mod) {
    if (!mod) return 'Requested Page';
    if (Array.isArray(mod)) {
        return mod.map(m => MODULE_NAMES[m] || m).join(' / ');
    }
    return MODULE_NAMES[mod] || mod;
}

/**
 * ModuleGuard
 * 
 * Verifies if the authenticated user has permission for a specific module/action.
 * If permission is denied, redirects to the user's last working page or /dashboard.
 */
export default function ModuleGuard({ module, requireManage = false, children }) {
    const { user } = useAuth();
    const { canView, canManage, hasFullAccess } = usePermissions();
    const location = useLocation();

    const isCurrentPageForbidden = () => {
        if (!module || hasFullAccess) return false;
        return requireManage ? !canManage(module) : !canView(module);
    };

    const isForbidden = isCurrentPageForbidden();

    useEffect(() => {
        // Only record as a working page if it's currently allowed and not an auth/unauthorized page
        if (!isForbidden) {
            const currentPath = location.pathname;
            const isExcluded = 
                currentPath.startsWith('/login') ||
                currentPath.startsWith('/register') ||
                currentPath.startsWith('/unauthorized') ||
                currentPath.startsWith('/onboarding') ||
                currentPath.startsWith('/invite');

            if (!isExcluded) {
                sessionStorage.setItem('namustutam_last_working_page', location.pathname + location.search);
            }
        }
    }, [location.pathname, location.search, isForbidden]);

    if (isForbidden) {
        const lastPage = sessionStorage.getItem('namustutam_last_working_page');
        const currentPath = location.pathname;

        // Use last working page if it exists and is different from the currently forbidden path
        const isValidLastPage = 
            lastPage && 
            !lastPage.startsWith(currentPath) && 
            !lastPage.includes('/unauthorized') && 
            !lastPage.includes('/login') &&
            !lastPage.includes('/register');

        const targetPage = isValidLastPage ? lastPage : '/dashboard';
        const moduleLabel = formatModuleName(module);
        const actionLabel = requireManage ? 'manage' : 'access';

        return (
            <Navigate
                to={targetPage}
                replace
                state={{
                    permissionDenied: true,
                    moduleName: moduleLabel,
                    attemptedPath: location.pathname,
                    message: `Access Restricted: You don't have permission to ${actionLabel} the ${moduleLabel} section. Redirected to ${targetPage === '/dashboard' ? 'Dashboard' : 'your last working page'}.`,
                    timestamp: Date.now()
                }}
            />
        );
    }

    return children;
}
