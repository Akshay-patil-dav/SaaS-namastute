import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login({ email, password });

        if (!result.success) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        if (result.role === 'SUPER_ADMIN' || result.role === 'ADMIN') {
            navigate('/admin');
        } else {
            setError('Unauthorized access. Only administrators are allowed here.');
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <Link to="/" className="admin-back-btn">
                        <ArrowLeft size={16} /> Back to Site
                    </Link>
                    <div className="admin-logo-mark">
                        <ShieldCheck size={32} />
                    </div>
                    <h1>Admin Portal</h1>
                    <p>Secure authentication for system administrators</p>
                </div>

                {error && (
                    <div className="admin-login-error">
                        <span>{error}</span>
                    </div>
                )}

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Administrator Email</label>
                        <div className="admin-input-wrap">
                            <Mail className="input-icon" size={18} />
                            <input 
                                type="email" 
                                placeholder="admin@namastute.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>Secure Password</label>
                        <div className="admin-input-wrap">
                            <Lock className="input-icon" size={18} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="admin-form-options">
                        <label className="admin-checkbox">
                            <input type="checkbox" /> Remember session
                        </label>
                        <a href="#">Security Help?</a>
                    </div>

                    <button 
                        type="submit" 
                        className="admin-login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Access Portal'}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>© 2026 Namastute Platform Security</p>
                    <div className="admin-footer-links">
                        <Link to="/login">Store Login</Link>
                        <span>•</span>
                        <a href="#">Support</a>
                    </div>
                </div>
            </div>
            
            <div className="admin-login-bg">
                <div className="admin-bg-pattern"></div>
                <div className="admin-bg-gradient"></div>
            </div>
        </div>
    );
}
