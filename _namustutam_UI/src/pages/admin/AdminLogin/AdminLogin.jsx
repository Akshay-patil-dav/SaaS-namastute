import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, demoAdminLogin, isAuthenticated } = useAuth();

    const [email, setEmail] = useState('admin@namustutam.com');
    const [password, setPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // If already authenticated, redirect to /admin
    useEffect(() => {
        if (isAuthenticated && isAuthenticated()) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password) {
            setError('Please enter both your email address and password.');
            return;
        }

        setLoading(true);
        try {
            const res = await login({ email: email.trim(), password });
            if (res.success) {
                const target = location.state?.from?.pathname || '/admin';
                navigate(target, { replace: true });
            } else {
                setError(res.error || 'Authentication failed. Please check credentials.');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAdmin = () => {
        setError(null);
        const res = demoAdminLogin();
        if (res.success) {
            navigate('/admin', { replace: true });
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-grid" />

            <div className="admin-login-card">
                <div className="admin-login-brand">
                    <div className="admin-login-badge">
                        <span className="admin-badge-pulse" />
                        Admin Command Center
                    </div>
                    <h1 className="admin-login-title">
                        Namus<span>tutam</span>
                    </h1>
                    <p className="admin-login-subtitle">
                        Sign in to manage and customize the Namustutam landing page in real-time.
                    </p>
                </div>

                {error && (
                    <div className="admin-login-error">
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="admin-input-group">
                        <label className="admin-input-label">Email Address</label>
                        <div className="admin-input-wrap">
                            <Mail size={18} className="admin-input-icon" />
                            <input
                                type="email"
                                className="admin-input"
                                placeholder="admin@namustutam.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-input-group">
                        <label className="admin-input-label">
                            <span>Password</span>
                        </label>
                        <div className="admin-input-wrap">
                            <Lock size={18} className="admin-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="admin-input"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="admin-pw-toggle"
                                onClick={() => setShowPassword(p => !p)}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="admin-spinner" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Access Admin Panel</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="admin-demo-box">
                    <button
                        type="button"
                        className="admin-demo-btn"
                        onClick={handleQuickAdmin}
                    >
                        <Sparkles size={16} />
                        <span>One-Click Quick Admin Access (Demo)</span>
                    </button>

                    <Link to="/" className="admin-back-link">
                        <ArrowLeft size={14} />
                        <span>Back to Public Website</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
