import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    User, Mail, Lock, EyeOff, Eye,
    Facebook, Apple, Sparkles, ShieldCheck, Zap,
} from 'lucide-react';
import './Login.css';
import './LoginNew.css';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export default function Register() {
    const [fullName, setFullName]         = useState('');
    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [confirmPassword, setConfirm]   = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);
    const [agreed, setAgreed]             = useState(false);
    const [error, setError]               = useState('');
    const [isLoading, setIsLoading]       = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 600));

        try {
            await axios.post(`${API_URL}/register`, { fullName, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* ── Left Panel ──────────────────────────────────────── */}
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

                    <h1 className="login-title">Create Account</h1>
                    <p className="login-subtitle">Join Namustute POS and start managing your business smarter.</p>

                    {/* Error Banner */}
                    {error && (
                        <div className="login-error-banner">
                            <span>⚠ {error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleRegister}>
                        {/* Full Name */}
                        <div className="login-input-group">
                            <label className="login-label">Full Name <span>*</span></label>
                            <div className="login-input-wrapper">
                                <input
                                    id="register-fullname"
                                    type="text"
                                    className="login-input"
                                    placeholder="John Doe"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <User className="login-input-icon" size={16} />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="login-input-group">
                            <label className="login-label">Email <span>*</span></label>
                            <div className="login-input-wrapper">
                                <input
                                    id="register-email"
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

                        {/* Password */}
                        <div className="login-input-group">
                            <label className="login-label">Password <span>*</span></label>
                            <div className="login-input-wrapper">
                                <input
                                    id="register-password"
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

                        {/* Confirm Password */}
                        <div className="login-input-group">
                            <label className="login-label">Confirm Password <span>*</span></label>
                            <div className="login-input-wrapper">
                                <input
                                    id="register-confirm-password"
                                    type={showConfirm ? 'text' : 'password'}
                                    className="login-input"
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="login-input-icon"
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                >
                                    {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms checkbox */}
                        <div className="login-options" style={{ justifyContent: 'flex-start' }}>
                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    required
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                I agree to the{' '}
                                <a href="#" className="forgot-link" style={{ marginLeft: 4 }}>
                                    Terms &amp; Conditions
                                </a>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            id="btn-signup"
                            type="submit"
                            className="btn-signin"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="btn-loading">
                                    <span className="btn-spinner" />
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>

                        {/* Already have account */}
                        <div className="register-link" style={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <Link to="/login">Sign in here</Link>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="divider">OR CONTINUE WITH</div>

                    {/* Social buttons */}
                    <div className="social-login" style={{ marginBottom: '30px' }}>
                        <button
                            id="register-btn-facebook"
                            className="btn-social btn-social-fb"
                            onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/oauth2/authorization/facebook`}
                            type="button"
                        >
                            <Facebook size={18} fill="currentColor" />
                        </button>
                        <button
                            id="register-btn-google"
                            className="btn-social btn-social-google"
                            onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/oauth2/authorization/google`}
                            type="button"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                        </button>
                        <button
                            id="register-btn-apple"
                            className="btn-social btn-social-apple"
                            onClick={() => window.location.href = '#'}
                            type="button"
                        >
                            <Apple size={18} fill="currentColor" />
                        </button>
                    </div>

                    <div className="login-footer">
                        Copyright &copy; 2026 Namustute POS
                    </div>
                </div>
            </div>

            {/* ── Right Panel ─────────────────────────────────────── */}
            <div className="login-right">
                <div className="login-right-overlay">
                    <div className="login-right-content">
                        <h2>Everything You Need.<br />All in One Place.</h2>
                        <p>Inventory • Sales • Analytics • Orders</p>
                        <div className="login-right-badges">
                            <span className="badge badge-superadmin"><Sparkles size={12} /> Fast Setup</span>
                            <span className="badge badge-admin"><ShieldCheck size={12} /> Secure</span>
                            <span className="badge badge-client"><Zap size={12} /> Always On</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
