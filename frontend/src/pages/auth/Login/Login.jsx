import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, EyeOff, Eye, ShieldCheck, User, Crown, ArrowRight, Activity, Zap, Server } from 'lucide-react';
import { API } from '../../../api/config';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
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

    const handleGoogleLogin = () => {
        window.location.href = API.OAUTH_GOOGLE;
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

                    <button type="button" className="btn-v2-google" onClick={handleGoogleLogin}>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                    </button>
                    
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
