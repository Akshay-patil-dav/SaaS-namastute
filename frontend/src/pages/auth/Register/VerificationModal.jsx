import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/config';
import './Modal.css';

export default function VerificationModal({ onComplete }) {
    const { user, setVerifiedContext } = useAuth();
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [phoneSent, setPhoneSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const sendOtp = async (type) => {
        try {
            const res = await apiClient.post('/api/verification/send', {
                email: user.email,
                type: type
            });
            // Show OTP in UI for testing since we don't have email/SMS service set up
            alert(`[TEST] OTP for ${type}: ` + res.data.otp);
            
            if (type === 'EMAIL') setEmailSent(true);
            if (type === 'PHONE') setPhoneSent(true);
        } catch (err) {
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
        } catch (err) {
            setError(`Invalid ${type} OTP`);
            return false;
        }
    };

    const handleVerifyAll = async () => {
        setError('');
        setLoading(true);
        
        // We simulate verifying if both are correct
        const isEmailValid = await verifyOtp('EMAIL', emailOtp);
        const isPhoneValid = await verifyOtp('PHONE', phoneOtp);

        if (isEmailValid && isPhoneValid) {
            setVerifiedContext(true, true);
            onComplete();
        }
        
        setLoading(false);
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
                    {!emailSent ? (
                        <button onClick={() => sendOtp('EMAIL')} className="btn-secondary">Send Email OTP</button>
                    ) : (
                        <input 
                            type="text" 
                            placeholder="Enter Email OTP" 
                            value={emailOtp} 
                            onChange={(e) => setEmailOtp(e.target.value)} 
                            className="login-input"
                        />
                    )}
                </div>

                <div className="verify-section" style={{ marginTop: '20px' }}>
                    <h4>Phone Verification</h4>
                    {!phoneSent ? (
                        <button onClick={() => sendOtp('PHONE')} className="btn-secondary">Send Phone OTP</button>
                    ) : (
                        <input 
                            type="text" 
                            placeholder="Enter Phone OTP" 
                            value={phoneOtp} 
                            onChange={(e) => setPhoneOtp(e.target.value)} 
                            className="login-input"
                        />
                    )}
                </div>

                <button 
                    onClick={handleVerifyAll} 
                    className="btn-signin" 
                    disabled={loading || !emailOtp || !phoneOtp}
                    style={{ marginTop: '24px' }}
                >
                    {loading ? 'Verifying...' : 'Complete Verification'}
                </button>
            </div>
        </div>
    );
}
