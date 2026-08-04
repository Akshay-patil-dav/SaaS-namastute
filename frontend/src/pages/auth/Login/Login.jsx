import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, EyeOff, Eye, ShieldCheck, User, Crown } from 'lucide-react';
import { API } from '../../../api/config';
import './Login.css';
import './LoginNew.css';

export default function Login() {
    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError]               = useState('');
    const [isLoading, setIsLoading]       = useState(false);
    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login({ email, password });

        if (!result.success) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        // Role-based redirect
        if (result.role === 'SUPER_ADMIN') {
            navigate('/dashboard/super-dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = API.OAUTH_GOOGLE;
    };


    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-form-wrapper">
                    {/* Back to Home */}
                    <Link to="/" className="back-link">
                        ← Back to Home
                    </Link>

                    {/* Logo */}
                    <div className="login-logo">
                        <div className="logo-dots">
                            <div className="logo-dot" />
                            <div className="logo-dot" />
                            <div className="logo-dot" />
                            <div className="logo-dot" />
                            <div className="logo-dot" />
                            <div className="logo-dot" />
                        </div>
                        <div className="logo-text">Namustute</div>
                    </div>

                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to access your dashboard.</p>

                    {/* Error */}
                    {error && (
                        <div className="login-error-banner">
                            <span>⚠ {error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin}>
                        <div className="login-input-group">
                            <label className="login-label">Email <span>*</span></label>
                            <div className="login-input-wrapper">
                                <input
                                    id="login-email"
                                    type="email"
                                    className="login-input"
                                    placeholder="you@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Mail className="login-input-icon" size={16} />
                            </div>
                        </div>

                        <div className="login-input-group">
                            <label className="login-label">Password <span>*</span></label>
                            <div className="login-input-wrapper">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="login-input"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="login-input-icon"
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                >
                                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="login-options">
                            <label className="checkbox-wrapper">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-link">Forgot Password?</a>
                        </div>

                        <button
                            id="btn-signin"
                            type="submit"
                            className="btn-signin"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="btn-loading">
                                    <span className="btn-spinner" />
                                    Signing In...
                                </span>
                            ) : 'Sign In'}
                        </button>

                        <div className="login-divider divider">
                            <span>or</span>
                        </div>
                        <div className="social-login">
                            <button type="button" className="btn-social btn-social-google" onClick={handleGoogleLogin}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                Login with Google
                            </button>
                        </div>
                    </form>


                    <div className="login-footer">
                        Copyright © 2026 Namustute POS
                    </div>
                </div>
            </div>

            <div className="login-right">
                {/* Background image via CSS */}
                <div className="login-right-overlay">
                    <div className="login-right-content">
                        <h2>Manage Everything.<br />From One Place.</h2>
                        <p>Sales • Inventory • Orders • Analytics</p>
                        <div className="login-right-badges">
                            <span className="badge badge-superadmin"><Crown size={12} /> Super Admin</span>
                            <span className="badge badge-admin"><ShieldCheck size={12} /> Admin</span>
                            <span className="badge badge-client"><User size={12} /> Client</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
