import React from 'react';
import { Globe, Search, Share2, CheckCircle2 } from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';

export default function SeoTab() {
    const { landingData, updateSection } = useLandingPage();
    const seo = landingData.seo || {};

    const handleFieldChange = (field, value) => {
        updateSection('seo', { [field]: value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Google SERP Snippet Simulator */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <Search size={18} color="#6366f1" />
                            Google Search Result Simulator
                        </h3>
                        <div className="admin-card-subtitle">
                            Preview how the landing page appears in organic search engine results
                        </div>
                    </div>
                </div>

                <div style={{
                    background: '#1f2937',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    maxWidth: '680px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9ca3af' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ff620b' }} />
                        <span>{typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174'}</span>
                    </div>

                    <div style={{
                        fontSize: '19px',
                        color: '#60a5fa',
                        fontWeight: '500',
                        cursor: 'pointer',
                        lineHeight: 1.3
                    }}>
                        {seo.pageTitle || 'Namustutam | Software Dev & Freelancer'}
                    </div>

                    <div style={{ fontSize: '14px', color: '#d1d5db', lineHeight: 1.5, marginTop: '2px' }}>
                        {seo.metaDescription || 'I build custom software, POS solutions, business websites, and web applications tailored to your business needs — from idea to deployment.'}
                    </div>
                </div>
            </div>

            {/* Meta Tag Settings */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <Globe size={18} color="#10b981" />
                            Meta Tags & Global SEO Attributes
                        </h3>
                        <div className="admin-card-subtitle">
                            Title tags, descriptions, and keywords for search indexing
                        </div>
                    </div>
                </div>

                <div className="admin-form-grid">
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">
                            Page Browser Title Tag
                            <span className="admin-label-hint">Max ~60 characters</span>
                        </label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={seo.pageTitle || ''}
                            onChange={(e) => handleFieldChange('pageTitle', e.target.value)}
                            placeholder="Namustutam | Software Dev & Freelancer"
                        />
                    </div>

                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">
                            Meta Description
                            <span className="admin-label-hint">Max ~160 characters for optimal click-through</span>
                        </label>
                        <textarea
                            className="admin-control-textarea"
                            rows={3}
                            value={seo.metaDescription || ''}
                            onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                            placeholder="I build custom software, POS solutions, business websites..."
                        />
                    </div>

                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">
                            Meta Keywords
                            <span className="admin-label-hint">Comma separated phrases</span>
                        </label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={seo.keywords || ''}
                            onChange={(e) => handleFieldChange('keywords', e.target.value)}
                            placeholder="software development, react, saas, pos, spring boot"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Author / Organization Name</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={seo.author || 'Namustutam'}
                            onChange={(e) => handleFieldChange('author', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
