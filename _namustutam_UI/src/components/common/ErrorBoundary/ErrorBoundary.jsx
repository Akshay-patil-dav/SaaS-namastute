import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[Namustutam ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#090d16',
                    color: '#ffffff',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    padding: '24px'
                }}>
                    <div style={{
                        maxWidth: '560px',
                        width: '100%',
                        background: '#111827',
                        border: '1px solid rgba(255, 91, 0, 0.35)',
                        borderRadius: '16px',
                        padding: '36px 32px',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            margin: '0 auto 20px',
                            borderRadius: '50%',
                            background: 'rgba(255, 91, 0, 0.12)',
                            color: '#ff5b00',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: 'bold'
                        }}>
                            !
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#f8fafc' }}>
                            Something went wrong loading this page
                        </h2>
                        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
                            We encountered a display issue while rendering. You can reload the page or return to the Namustutam homepage.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={this.handleReload}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #ff5b00 0%, #ea580c 100%)',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    background: 'transparent',
                                    color: '#e2e8f0',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

