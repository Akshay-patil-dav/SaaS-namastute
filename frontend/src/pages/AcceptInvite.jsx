import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AcceptInvite() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { user, token: authToken } = useAuth();
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [message, setMessage] = useState('Securing your workspace access...');

    useEffect(() => {
        if (!authToken) return;

        axios.post(`http://localhost:3000/api/builder/invite/accept/${token}`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(() => {
            setStatus('success');
            setTimeout(() => {
                navigate('/page-builder');
            }, 2000);
        })
        .catch(err => {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Invalid or expired invitation link.');
        });
    }, [token, authToken, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full text-center">
                
                {status === 'processing' && (
                    <div className="flex flex-col items-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 flex items-center justify-center rounded-full mb-6">
                            <Loader2 size={32} className="animate-spin" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Accepting Invitation</h2>
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-full mb-6 relative">
                            <CheckCircle size={32} />
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to the Team!</h2>
                        <p className="text-sm text-gray-500">Folder successfully linked to your workspace. Redirecting to your builder...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full mb-6">
                            <XCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
                        <p className="text-sm text-gray-500 mb-6">{message}</p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg hover:bg-black transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
