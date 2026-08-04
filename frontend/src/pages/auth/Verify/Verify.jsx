import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import VerificationModal from '../Register/VerificationModal';
import '../Login/Login.css'; // Re-use background styling

export default function Verify() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // If already verified, redirect to dashboard
    if (user?.emailVerified) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleComplete = () => {
        // Once verified, they can proceed to the dashboard. 
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <VerificationModal onComplete={handleComplete} />
        </div>
    );
}
