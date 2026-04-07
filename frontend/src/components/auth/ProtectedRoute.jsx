import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute
 * 
 * @param {string[]} allowedRoles - Roles that can access this route.
 *   e.g. ['SUPER_ADMIN', 'ADMIN']
 *   Pass empty array or omit to allow any authenticated user.
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Wait for localStorage session to be restored
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#0f172a',
                color: '#94a3b8',
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                gap: '12px',
            }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid #334155',
                    borderTopColor: '#6366f1',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Authenticating...
            </div>
        );
    }

    // Not logged in → go to login
    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but wrong role → go to unauthorized
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
