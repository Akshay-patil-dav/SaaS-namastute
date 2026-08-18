import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, EyeOff, Eye, ShieldCheck, User, Crown, ArrowRight, Activity, Zap, Server } from 'lucide-react';
import { API } from '../../../api/config';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, googleLogin } = useAuth();
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

        if (result.role === 'SUPER_ADMIN') {
            navigate('/dashboard/super-dashboard');
        } else {
            navigate('/dashboard');
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
        if (result.role === 'SUPER_ADMIN') {
            navigate('/dashboard/super-dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-v2-container">
            <div className="login-v2-mouse-glow"></div>
            
            {/* Left Panel: Form */}
            <div className="login-v2-left">
                <div className="login-v2-form-wrapper">
                    <Link to="/" className="login-v2-back">
                        ← Back to Website
                    </Link>

                    <div className="login-v2-header">
                        <div className="login-v2-logo">
                            <div className="logo-v2-icon-wrapper">
                                <Zap className="logo-v2-icon" size={24} />
                            </div>
                            <span>Namustute</span>
                        </div>
                        <h1 className="login-v2-title">Welcome Back</h1>
                        <p className="login-v2-subtitle">Log in to your workspace to continue.</p>
                    </div>

                    {error && (
                        <div className="login-v2-error">
                            <span className="error-icon">⚠</span>
                            <span className="error-text">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-v2-form">
                        <div className="input-v2-group">
                            <label>Email Address</label>
                            <div className="input-v2-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="input-v2-group">
                            <label>Password</label>
                            <div className="input-v2-wrapper">
                                <ShieldCheck className="input-icon" size={18} />
                                <input
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

                        <div className="login-v2-options">
                            <label className="checkbox-v2">
                                <input type="checkbox" />
                                <span className="checkbox-v2-custom"></span>
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-v2">Forgot Password?</a>
                        </div>

                        <button type="submit" className="btn-v2-submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loader-v2"></span>
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} className="submit-icon" />
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
                            onError={() => setError('Google Login was unsuccessful. Please try again.')}
                            theme="outline"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>
                    
                    <p className="login-v2-footer">© 2026 Namustute Inc. All rights reserved.</p>
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

                <div className="right-v2-content">
                    <div className="right-v2-badge">v2.0 Beta</div>
                    <h2>Powering Modern<br/>Businesses</h2>
                    <p>Join thousands of forward-thinking companies using Namustute to scale their operations, manage resources, and drive unprecedented growth.</p>

                </div>
            </div>
        </div>
    );
}
