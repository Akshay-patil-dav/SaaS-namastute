import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, EyeOff, Eye, ShieldCheck, User, Crown } from 'lucide-react';
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


    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-form-wrapper">
                    {/* Back to Home */}
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#888',
                            fontSize: '13px',
                            textDecoration: 'none',
                            marginBottom: '28px',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ff902f'}
                        onMouseLeave={e => e.currentTarget.style.color = '#888'}
                    >
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

                        <div className="register-link" style={{ textAlign: 'center' }}>
                            Don't have an account?{' '}
                            <Link to="/register">Sign Up</Link>
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
