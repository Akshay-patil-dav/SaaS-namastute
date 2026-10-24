import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';

export default function LivePreviewTab() {
    const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
    const [iframeKey, setIframeKey] = useState(Date.now());

    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '390px'
    };

    const handleRefresh = () => {
        setIframeKey(Date.now());
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-card" style={{ padding: '14px 20px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="admin-status-pill">
                            <span className="admin-status-dot" />
                            Live Simulator
                        </span>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                            Test responsive layouts and verified real-time landing page updates
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Device Selector */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '3px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <button
                                type="button"
                                onClick={() => setDevice('desktop')}
                                style={{
                                    background: device === 'desktop' ? '#6366f1' : 'transparent',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                <Monitor size={15} />
                                <span>Desktop</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDevice('tablet')}
                                style={{
                                    background: device === 'tablet' ? '#6366f1' : 'transparent',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                <Tablet size={15} />
                                <span>Tablet</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDevice('mobile')}
                                style={{
                                    background: device === 'mobile' ? '#6366f1' : 'transparent',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                <Smartphone size={15} />
                                <span>Mobile</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '7px 12px' }}
                            onClick={handleRefresh}
                            title="Reload preview"
                        >
                            <RefreshCw size={14} />
                            <span>Reload</span>
                        </button>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-primary"
                            style={{ padding: '7px 14px' }}
                        >
                            <ExternalLink size={14} />
                            <span>Open In Full Tab</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Simulated Device Frame */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                minHeight: '720px',
                padding: device === 'desktop' ? '0' : '20px 0',
                background: device === 'desktop' ? 'transparent' : 'rgba(3, 7, 18, 0.4)',
                borderRadius: '16px',
                transition: 'all 0.3s ease'
            }}>
                <div style={{
                    width: deviceWidths[device],
                    height: '800px',
                    borderRadius: device === 'desktop' ? '14px' : '24px',
                    overflow: 'hidden',
                    border: device === 'desktop' ? '1px solid rgba(255, 255, 255, 0.1)' : '8px solid #1e293b',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
                    background: '#0f172a',
                    transition: 'width 0.3s ease'
                }}>
                    <iframe
                        key={iframeKey}
                        src="/"
                        title="Live Landing Page Preview"
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
