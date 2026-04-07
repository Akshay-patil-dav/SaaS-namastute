import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, EyeOff, Eye, Facebook, Apple } from 'lucide-react';
import './Login.css';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.endsWith('@gmail.com')) {
            setError('Account creation is restricted to @gmail.com addresses only');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/register`, { fullName, email, password });
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Failed to register account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-form-wrapper">
                    {/* Logo Section */}
                    <div className="login-logo">
                        <div className="logo-dots">
                            <div className="logo-dot"></div>
                            <div className="logo-dot"></div>
                            <div className="logo-dot"></div>
                            <div className="logo-dot"></div>
                            <div className="logo-dot"></div>
                            <div className="logo-dot"></div>
                        </div>
                        <div className="logo-text">Namustute</div>
                    </div>

                    <h1 className="login-title">Sign Up</h1>
                    <p className="login-subtitle">Join the Dreamspos panel by creating your secure account.</p>

                    {error && (
                        <div style={{color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px'}}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="login-input-group">
                            <label className="login-label">Full Name <span>*</span></label>
                            <div className="login-input-wrapper">
                                <input 
                                    type="text" 
                                    className="login-input" 
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <User className="login-input-icon" size={16} />
                            </div>
                        </div>

                        <div className="login-input-group">
                            <label className="login-label">Email <span>*</span></label>
                            <div className="login-input-wrapper">
                                <input 
                                    type="email" 
                                    className="login-input" 
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
                                    type={showPassword ? 'text' : 'password'} 
                                    className="login-input" 
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
                                <input type="checkbox" required /> I agree to Terms & Conditions
                            </label>
                        </div>

                        <button type="submit" className="btn-signin" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>

                        <div className="register-link">
                            Already have an account? <Link to="/">Log in here</Link>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <div className="social-login" style={{ marginBottom: '30px' }}>
                        <button 
                            className="btn-social btn-social-fb" 
                            onClick={() => window.location.href = 'http://localhost:3000/oauth2/authorization/facebook'}
                            type="button"
                        >
                            <Facebook size={18} fill="currentColor" />
                        </button>
                        <button 
                            className="btn-social btn-social-google" 
                            onClick={() => window.location.href = 'http://localhost:3000/oauth2/authorization/google'}
                            type="button"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{width: '18px', height: '18px'}} />
                        </button>
                        <button 
                            className="btn-social btn-social-apple" 
                            onClick={() => window.location.href = '#'}
                            type="button"
                        >
                            <Apple size={18} fill="currentColor" />
                        </button>
                    </div>

                    <div className="login-footer">
                        Copyright © 2026 DreamsPOS
                    </div>
                </div>
            </div>
            
            <div className="login-right">
                {/* Background image loaded via Login.css */}
            </div>
        </div>
    );
}
