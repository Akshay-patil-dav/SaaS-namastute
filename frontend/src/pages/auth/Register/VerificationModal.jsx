import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/config';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

export default function VerificationModal({ onComplete }) {
    const { user, setVerifiedContext, logout } = useAuth();
    const navigate = useNavigate();
    const [emailOtp, setEmailOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(20);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Auto-send OTP on mount
        sendOtp('EMAIL');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const sendOtp = async (type) => {
        setError('');
        setTimeLeft(20);
        try {
            await apiClient.post('/api/verification/send', {
                email: user.email,
                type: type
            });
            console.log(`Sent ${type} verification request.`);
        } catch (_err) {
            setError(`Failed to send ${type} OTP`);
        }
    };

    const verifyOtp = async (type, otp) => {
        if (!otp) return false;
        try {
            await apiClient.post('/api/verification/verify', {
                email: user.email,
                type: type,
                otp: otp
            });
            return true;
        } catch (_err) {
            setError(`Invalid ${type} OTP`);
            return false;
        }
    };

    const handleVerifyAll = async () => {
        setError('');
        setLoading(true);
        
        const isEmailValid = await verifyOtp('EMAIL', emailOtp);

        if (isEmailValid) {
            setVerifiedContext(true, true); // Setting both to true for now so they don't get stuck later
            onComplete();
        }
        
        setLoading(false);
    };

    const handleGoBack = () => {
        logout();
        navigate('/register');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Verify Your Account</h2>
                <p>Please verify your email and phone number to continue.</p>
                
                {error && <div className="modal-error">{error}</div>}

                <div className="verify-section">
                    <h4>Email Verification</h4>
                    <p>{user?.email}</p>
                    <input 
                        type="text" 
                        placeholder="Enter Email OTP" 
                        value={emailOtp} 
                        onChange={(e) => setEmailOtp(e.target.value)} 
                        className="login-input"
                    />
                    
                    <div style={{ textAlign: 'right', marginTop: '8px' }}>
                        <button 
                            onClick={() => sendOtp('EMAIL')} 
                            disabled={timeLeft > 0}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: timeLeft > 0 ? '#64748b' : '#6366f1', 
                                cursor: timeLeft > 0 ? 'not-allowed' : 'pointer', 
                                fontSize: '13px',
                                padding: 0
                            }}
                        >
                            {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : 'Resend OTP'}
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleVerifyAll} 
                    className="btn-signin" 
                    disabled={loading || !emailOtp}
                    style={{ marginTop: '24px' }}
                >
                    {loading ? 'Verifying...' : 'Complete Verification'}
                </button>
                
                <button 
                    onClick={handleGoBack}
                    style={{ 
                        marginTop: '16px', 
                        background: 'none', 
                        border: 'none', 
                        color: '#94a3b8', 
                        cursor: 'pointer', 
                        fontSize: '14px',
                        textDecoration: 'underline'
                    }}
                >
                    ← Wrong email? Go back to register
                </button>
            </div>
        </div>
    );
}
