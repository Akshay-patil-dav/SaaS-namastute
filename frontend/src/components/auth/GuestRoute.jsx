import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * GuestRoute — only accessible when NOT logged in.
 * If the user is already authenticated, redirect them to
 * their appropriate dashboard based on their role.
 */
export default function GuestRoute({ children }) {
    const { user, loading, isAuthenticated } = useAuth();

    // Wait for localStorage session to be restored before deciding
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
                Loading...
            </div>
        );
    }

    // Already logged in → send to the right dashboard
    if (isAuthenticated()) {
        if (user?.role === 'SUPER_ADMIN') {
            return <Navigate to="/dashboard/super-dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
