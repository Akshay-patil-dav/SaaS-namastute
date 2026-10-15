import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '@/api/config';
import { useAuth } from '../../../context/AuthContext';
import { Loader2, CheckCircle2, XCircle, Users, ArrowRight, LogIn, UserPlus } from 'lucide-react';

export default function AcceptInvite() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { user, token: authToken, fetchSession } = useAuth();
    const [status, setStatus] = useState('initial'); // initial, processing, success, error, unauthenticated
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!authToken) {
            setStatus('unauthenticated');
            return;
        }

        setStatus('processing');
        setMessage('Connecting you to the workspace...');

        // Try primary project invite endpoint first, fallback to invitations endpoint
        apiClient.post(`/project/invite/accept/${token}`)
            .then(async () => {
                setStatus('success');
                if (fetchSession) {
                    try { await fetchSession(); } catch (e) { /* ignore */ }
                }
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1800);
            })
            .catch(err => {
                // Try fallback endpoint
                apiClient.post(`/invitations/${token}/accept`)
                    .then(async () => {
                        setStatus('success');
                        if (fetchSession) {
                            try { await fetchSession(); } catch (e) { /* ignore */ }
                        }
                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 1800);
                    })
                    .catch(err2 => {
                        setStatus('error');
                        const errMsg = err.response?.data?.error || err.response?.data?.message ||
                                       err2.response?.data?.error || err2.response?.data?.message ||
                                       'Invalid, expired, or unauthorized invitation link.';
                        setMessage(errMsg);
                    });
            });
    }, [token, authToken, navigate, fetchSession]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '24px',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                width: '100%',
                maxWidth: '440px',
                padding: '36px 32px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
            }}>
                {/* Unauthenticated State */}
                {status === 'unauthenticated' && (
                    <div>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <Users size={32} />
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                            Workspace Invitation
                        </h2>
                        <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, marginBottom: '24px' }}>
                            You have been invited to collaborate in a workspace. Please log in or create an account with the invited email address to accept.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link 
                                to={`/login?redirect=/invite/accept/${token}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    background: '#ea580c',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
                                }}
                            >
                                <LogIn size={16} /> Log In to Accept
                            </Link>
                            <Link 
                                to={`/register?redirect=/invite/accept/${token}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    background: '#f8fafc',
                                    color: '#334155',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid #cbd5e1'
                                }}
                            >
                                <UserPlus size={16} /> Create New Account
                            </Link>
                        </div>
                    </div>
                )}

                {/* Processing State */}
                {status === 'processing' && (
                    <div>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: '#fff7ed',
                            color: '#ea580c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <Loader2 size={32} className="spinner-border" style={{ borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                            Accepting Invitation
                        </h2>
                        <p style={{ fontSize: '13.5px', color: '#64748b' }}>{message}</p>
                    </div>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: '#f0fdf4',
                            color: '#16a34a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <CheckCircle2 size={36} />
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                            Welcome to the Team! 🎉
                        </h2>
                        <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '20px' }}>
                            Workspace connected successfully. Redirecting you to the dashboard...
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#16a34a',
                                color: '#ffffff',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '13.5px',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Open Dashboard <ArrowRight size={14} />
                        </button>
                    </div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <div>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: '#fef2f2',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <XCircle size={36} />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                            Unable to Join Workspace
                        </h2>
                        <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, marginBottom: '24px' }}>
                            {message}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    background: '#0f172a',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontWeight: 600,
                                    fontSize: '13.5px',
                                    padding: '11px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Go to My Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    background: '#f8fafc',
                                    color: '#475569',
                                    border: '1px solid #cbd5e1',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Switch Account / Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
