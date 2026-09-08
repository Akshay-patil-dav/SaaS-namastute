import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import apiClient, { API } from '../../../api/config';
import { Zap, LogOut, CheckCircle, Store, Factory, ShoppingCart, User, ArrowRight, ArrowLeft, Activity, ShieldCheck } from 'lucide-react';
import './Onboarding.css';

export default function Onboarding() {
    const { user, completeOnboarding, logout } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        businessType: user?.businessType || ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (!formData.username) {
            setUsernameStatus(null);
            setSuggestions([]);
            return;
        }

        setUsernameStatus('checking');
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await apiClient.get(`${API.AUTH}/check-username?username=${formData.username}`);
                if (res.data.available) {
                    setUsernameStatus('available');
                } else {
                    setUsernameStatus('taken');
                    setSuggestions(res.data.suggestions || []);
                }
            } catch (err) {
                setUsernameStatus(null);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [formData.username]);

    const handleNext = () => {
        if (!formData.firstName || !formData.lastName || !formData.username) {
            setError('Please fill in all fields to continue.');
            return;
        }
        setError('');
        setStep(2);
    };
    
    const handleBack = () => {
        setStep(1);
        setError('');
    };

    const handleSelectBusiness = async (type) => {
        setFormData({ ...formData, businessType: type });
        setLoading(true);
        setError('');

        const result = await completeOnboarding({ ...formData, businessType: type });
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };
    
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="onboarding-v2-container">
            <div className="onboarding-v2-mouse-glow"></div>

            {/* Left Panel: Form */}
            <div className="onboarding-v2-left">
                {/* Navbar within left panel */}
                <div className="onboarding-navbar">
                     <div className="onboarding-logo">
                         <Zap className="logo-v2-icon" size={24} />
                         <span>Namustute</span>
                     </div>
                     <button onClick={handleLogout} className="logout-btn">
                         <LogOut size={16} />
                         <span>Logout</span>
                     </button>
                </div>

                <div className="onboarding-v2-form-wrapper">
                    
                    <div className="onboarding-progress">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-circle">1</div>
                            <span>Profile</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-circle">2</div>
                            <span>Business</span>
                        </div>
                    </div>

                    <div className="onboarding-v2-header">
                        <h1 className="onboarding-v2-title">
                            {step === 1 ? 'Complete Profile' : 'Choose Business Type'}
                        </h1>
                        <p className="onboarding-v2-subtitle">
                            {step === 1 ? 'Let\'s set up your profile to get started.' : 'This will customize your dashboard experience.'}
                        </p>
                    </div>

                    {error && (
                        <div className="onboarding-v2-error">
                            <span className="error-icon">⚠</span>
                            <span className="error-text">{error}</span>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="onboarding-step-content animation-fade-in">
                            <div className="input-v2-group">
                                <label>First Name</label>
                                <div className="input-v2-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="e.g. John"
                                    />
                                </div>
                            </div>
                            <div className="input-v2-group">
                                <label>Last Name</label>
                                <div className="input-v2-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="e.g. Doe"
                                    />
                                </div>
                            </div>
                            <div className="input-v2-group">
                                <label>Username</label>
                                <div className="input-v2-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="e.g. johndoe123"
                                        style={{ borderColor: usernameStatus === 'taken' ? '#ef4444' : '' }}
                                    />
                                </div>
                                {usernameStatus === 'checking' && <small className="status-text text-muted" style={{ marginTop: '8px', display: 'block' }}>Checking availability...</small>}
                                {usernameStatus === 'available' && <small className="status-text text-success" style={{ color: '#10b981', marginTop: '8px', display: 'block' }}>Username is available!</small>}
                                {usernameStatus === 'taken' && (
                                    <div className="username-suggestions" style={{ marginTop: '8px' }}>
                                        <small className="status-text text-error" style={{ color: '#ef4444' }}>Username is already taken. Try one of these:</small>
                                        <div className="suggestion-tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                            {suggestions.map(s => (
                                                <span 
                                                    key={s} 
                                                    className="suggestion-tag" 
                                                    onClick={() => {
                                                        setFormData({ ...formData, username: s });
                                                        setUsernameStatus('available');
                                                        setSuggestions([]);
                                                    }}
                                                    style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                className="btn-v2-submit" 
                                onClick={handleNext} 
                                disabled={usernameStatus === 'taken' || usernameStatus === 'checking'}
                                style={{ marginTop: '24px' }}
                            >
                                Next Step <ArrowRight size={18} className="submit-icon" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="onboarding-step-content animation-fade-in">
                            <div className="business-options-v2">
                                <div className={`business-card-v2 ${formData.businessType === 'Store' ? 'selected' : ''}`} onClick={() => handleSelectBusiness('Store')}>
                                    <div className="card-icon"><Store size={24} /></div>
                                    <div className="card-content">
                                        <h3>Retail Store</h3>
                                        <p>Manage POS, inventory, categories, and offline sales.</p>
                                    </div>
                                </div>
                                <div className={`business-card-v2 ${formData.businessType === 'Manufacturing' ? 'selected' : ''}`} onClick={() => handleSelectBusiness('Manufacturing')}>
                                    <div className="card-icon"><Factory size={24} /></div>
                                    <div className="card-content">
                                        <h3>Manufacturing</h3>
                                        <p>Includes Bill of Materials, Work Orders, and Centers.</p>
                                    </div>
                                </div>
                                <div className={`business-card-v2 ${formData.businessType === 'E-comm' ? 'selected' : ''}`} onClick={() => handleSelectBusiness('E-comm')}>
                                    <div className="card-icon"><ShoppingCart size={24} /></div>
                                    <div className="card-content">
                                        <h3>E-Commerce</h3>
                                        <p>Optimized for online sales and multi-channel fulfillment.</p>
                                    </div>
                                </div>
                            </div>

                            {loading && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                                    <span className="loader-v2"></span>
                                    <span style={{ marginLeft: '12px', color: '#94a3b8' }}>Saving setup...</span>
                                </div>
                            )}

                            <button className="btn-v2-back" onClick={handleBack} disabled={loading}>
                                <ArrowLeft size={18} /> Back
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Showcase */}
            <div className="onboarding-v2-right">
                <div className="bg-v2-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>

                <div className="onboarding-v2-glass-panel">
                    <div className="floating-v2-element el-1">
                        <Activity size={20} className="el-icon" />
                        <div>
                            <h4>Smart Dashboard</h4>
                            <p>Data-driven insights</p>
                        </div>
                    </div>
                    <div className="floating-v2-element el-2">
                        <CheckCircle size={20} className="el-icon" />
                        <div>
                            <h4>Seamless Setup</h4>
                            <p>Ready in 2 minutes</p>
                        </div>
                    </div>
                    <div className="floating-v2-element el-3">
                        <ShieldCheck size={20} className="el-icon" />
                        <div>
                            <h4>Secure Data</h4>
                            <p>Enterprise grade</p>
                        </div>
                    </div>
                </div>

                <div className="right-v2-content">
                    <div className="right-v2-badge">Getting Started</div>
                    <h2>Tailored To Your<br />Business Needs</h2>
                    <p>Tell us a little bit about yourself and your business so we can customize your Namustute experience for maximum productivity.</p>
                </div>
            </div>
        </div>
    );
}
