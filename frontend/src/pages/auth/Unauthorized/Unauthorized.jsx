import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ShieldX, Home, LogOut, ArrowRight } from 'lucide-react';
import './Unauthorized.css';

export default function Unauthorized() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(4);

    const getSafeTarget = () => {
        if (!user) return '/login';
        if (user.role === 'SUPER_ADMIN') return '/dashboard/super-dashboard';
        const lastPage = sessionStorage.getItem('namustutam_last_working_page');
        return (lastPage && !lastPage.includes('/unauthorized') && !lastPage.includes('/login')) ? lastPage : '/dashboard';
    };

    const handleGoHome = () => {
        navigate(getSafeTarget(), { replace: true });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    navigate(getSafeTarget(), { replace: true });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [user, navigate]);

    return (
        <div className="unauth-container">
            {/* Animated background orbs */}
            <div className="unauth-orb orb-1" />
            <div className="unauth-orb orb-2" />
            <div className="unauth-orb orb-3" />

            <div className="unauth-card">
                <div className="unauth-icon-wrap">
                    <ShieldX size={48} strokeWidth={1.5} />
                </div>

                <h1 className="unauth-code">403</h1>
                <h2 className="unauth-title">Access Denied</h2>
                <p className="unauth-description">
                    You don't have permission to view this section.
                    {user && (
                        <span> Your role is <strong>{user.roleTitle || user.role.replace('_', ' ')}</strong>.</span>
                    )}
                </p>

                <div className="unauth-role-badge">
                    {user?.name || 'Guest'}
                </div>

                {user && (
                    <div style={{
                        marginTop: '12px',
                        fontSize: '12.5px',
                        color: '#64748b',
                        background: '#f8fafc',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                    }}>
                        <span>Redirecting to dashboard in <strong>{countdown}s</strong>...</span>
                    </div>
                )}

                <div className="unauth-actions">
                    <button className="unauth-btn primary" onClick={handleGoHome}>
                        <Home size={16} />
                        Go to Dashboard
                    </button>
                    <button className="unauth-btn secondary" onClick={handleLogout}>
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
