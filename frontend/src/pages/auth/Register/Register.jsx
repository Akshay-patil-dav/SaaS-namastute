import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    User, Mail, ShieldCheck, EyeOff, Eye, Zap, Activity, Server, Crown, ArrowRight
} from 'lucide-react';
import { API } from '../../../api/config';
import { GoogleLogin } from '@react-oauth/google';
import '../Login/Login.css';

import PlanSelectionModal from './PlanSelectionModal';

export default function Register() {
    const [fullName, setFullName]         = useState('');
    const [phoneNumber, setPhoneNumber]   = useState('');
    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [confirmPassword, setConfirm]   = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);
    const [agreed, setAgreed]             = useState(false);
    const [error, setError]               = useState('');
    const [isLoading, setIsLoading]       = useState(false);
    
    // Modal states
    const [showPlanSelection, setShowPlanSelection] = useState(false);

    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    // Dynamic mouse glow effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

        try {
            const result = await register({ fullName, email, password, phoneNumber });
            if (!result.success) {
                setError(result.error);
                return;
            }
            // Registration successful, show plan selection directly instead of verification
            setShowPlanSelection(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setIsLoading(true);
        const result = await googleLogin(credentialResponse.credential);
        if (!result.success) {
            setError(result.error);
            setIsLoading(false);
            return;
        }
        setShowPlanSelection(true);
    };

    const handlePlanSelectionComplete = () => {
        setShowPlanSelection(false);
        navigate('/dashboard');
    };

    return (
        <div className="login-v2-container">
            <div className="login-v2-mouse-glow"></div>

            {showPlanSelection && <PlanSelectionModal onComplete={handlePlanSelectionComplete} />}
            
            {/* Left Panel: Form */}
            <div className="login-v2-left">
                <div className="login-v2-form-wrapper" style={{ padding: '2rem' }}>
                    <Link to="/" className="login-v2-back">
                        ← Back to Website
                    </Link>

                    <div className="login-v2-header">
                        <div className="login-v2-logo">
                            <div className="logo-v2-icon-wrapper">
                                <Zap className="logo-v2-icon" size={24} />
                            </div>
                            <span>Samrajya Software</span>
                        </div>
                        <h1 className="login-v2-title">Create Account</h1>
                        <p className="login-v2-subtitle">Join Samrajya Software and start managing your business smarter.</p>
                    </div>

                    {error && (
                        <div className="login-v2-error">
                            <span className="error-icon">⚠</span>
                            <span className="error-text">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="login-v2-form">
                        
                        <div className="input-v2-group">
                            <label>Full Name <span>*</span></label>
                            <div className="input-v2-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    id="register-fullname"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="input-v2-group">
                            <label>Phone Number <span>*</span></label>
                            <div className="input-v2-wrapper">
                                <span className="input-icon" style={{ fontSize: '14px', fontWeight: 'bold' }}>☎</span>
                                <input
                                    id="register-phone"
                                    type="text"
                                    placeholder="+91 9876543210"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="input-v2-group">
                            <label>Email Address <span>*</span></label>
                            <div className="input-v2-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    id="register-email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="input-v2-group" style={{ flex: 1 }}>
                                <label>Password <span>*</span></label>
                                <div className="input-v2-wrapper">
                                    <ShieldCheck className="input-icon" size={18} />
                                    <input
                                        id="register-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="input-v2-group" style={{ flex: 1 }}>
                                <label>Confirm Password <span>*</span></label>
                                <div className="input-v2-wrapper">
                                    <ShieldCheck className="input-icon" size={18} />
                                    <input
                                        id="register-confirm-password"
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="login-v2-options">
                            <label className="checkbox-v2">
                                <input
                                    type="checkbox"
                                    required
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <span className="checkbox-v2-custom"></span>
                                <span>I agree to the <a href="#" className="forgot-v2" style={{ marginLeft: 4 }}>Terms &amp; Conditions</a></span>
                            </label>
                        </div>

                        <button type="submit" className="btn-v2-submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loader-v2"></span>
                            ) : (
                                <>
                                    Create Account <ArrowRight size={18} className="submit-icon" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="divider-v2">
                        <span>Or continue with</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Registration was unsuccessful. Please try again.')}
                            theme="outline"
                            size="large"
                            text="signup_with"
                            shape="rectangular"
                        />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--v2-text-muted)', fontSize: '0.9rem' }}>Already have an account? </span>
                        <Link to="/login" style={{ color: 'var(--v2-primary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Sign in</Link>
                    </div>

                    <p className="login-v2-footer">© 2026 Samrajya Software Inc. All rights reserved.</p>
                </div>
            </div>

            {/* Right Panel: Showcase */}
            <div className="login-v2-right">
                <div className="bg-v2-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>

                <div className="login-v2-glass-panel">
                    <div className="floating-v2-element el-1">
                        <Activity size={20} className="el-icon" />
                        <div>
                            <h4>Real-time Analytics</h4>
                            <p>Monitor your growth</p>
                        </div>
                    </div>
                    <div className="floating-v2-element el-2">
                        <Server size={20} className="el-icon" />
                        <div>
                            <h4>Cloud Infrastructure</h4>
                            <p>99.99% Uptime SLA</p>
                        </div>
                    </div>
                    <div className="floating-v2-element el-3">
                        <ShieldCheck size={20} className="el-icon" />
                        <div>
                            <h4>Bank-grade Security</h4>
                            <p>End-to-end encryption</p>
                        </div>
                    </div>
                </div>

                <div className="login-v2-hero-text">
                    <h2>Everything You Need.<br />All in One Place.</h2>
                    <p>Join thousands of businesses managing their retail operations smarter, faster, and more securely.</p>
                    <div className="login-v2-badges">
                        <span className="badge-v2"><Crown size={14} /> Premium Features</span>
                        <span className="badge-v2"><ShieldCheck size={14} /> Enterprise Security</span>
                        <span className="badge-v2"><Zap size={14} /> 24/7 Support</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
