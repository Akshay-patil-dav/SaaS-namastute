import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX, Home, LogOut } from 'lucide-react';
import './Unauthorized.css';

export default function Unauthorized() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleGoHome = () => {
        if (!user) {
            navigate('/login');
        } else if (user.role === 'CLIENT') {
            navigate('/dashboard');
        } else if (user.role === 'ADMIN') {
            navigate('/dashboard');
        } else {
            navigate('/dashboard/super-dashboard');
        }
    };

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
                    You don't have permission to view this page.
                    {user && (
                        <span> Your current role is <strong>{user.role.replace('_', ' ')}</strong>.</span>
                    )}
                </p>

                <div className="unauth-role-badge">
                    {user?.name || 'Guest'}
                </div>

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
