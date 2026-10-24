import React from 'react';
import { Megaphone, Activity, Check, ExternalLink } from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';

export default function MarqueeTab() {
    const { landingData, updateSection, setSectionVisibility } = useLandingPage();
    const announcement = landingData.announcement || {};
    const marquee = landingData.marquee || {};

    const handleAnnouncementChange = (field, val) => {
        updateSection('announcement', { [field]: val });
        if (field === 'enabled') {
            setSectionVisibility('announcement', val);
        }
    };

    const handleMarqueeChange = (field, val) => {
        updateSection('marquee', { [field]: val });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <SectionVisibilityBanner 
                sectionKey="announcement" 
                sectionName="Top Announcement Bar" 
                description="Controls whether the floating alert bar is rendered at the very top of the website."
            />

            {/* Announcement Banner */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <Megaphone size={18} color="#ff620b" />
                            Top Global Announcement Bar
                        </h3>
                        <div className="admin-card-subtitle">
                            Fixed top announcement bar across all landing page views
                        </div>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: announcement.enabled ? '#34d399' : '#64748b' }}>
                            {announcement.enabled ? 'Enabled (Live)' : 'Disabled'}
                        </span>
                        <input
                            type="checkbox"
                            checked={announcement.enabled || false}
                            onChange={(e) => handleAnnouncementChange('enabled', e.target.checked)}
                            style={{ width: '20px', height: '20px', accentColor: '#ff620b' }}
                        />
                    </label>
                </div>

                {/* Banner Live Preview */}
                {announcement.enabled && (
                    <div style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: announcement.bgColor || 'linear-gradient(135deg, rgb(255 98 11) 0%, rgb(255, 150, 102) 100%)',
                        color: announcement.textColor || '#ffffff',
                        fontWeight: '600',
                        fontSize: '13px',
                        textAlign: 'center',
                        marginBottom: '20px',
                        boxShadow: '0 4px 12px rgba(255, 98, 11, 0.25)'
                    }}>
                        {announcement.text || 'Announcement Banner Preview'}
                    </div>
                )}

                <div className="admin-form-grid">
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">Announcement Message</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={announcement.text || ''}
                            onChange={(e) => handleAnnouncementChange('text', e.target.value)}
                            placeholder="⚠️ Special Announcement: Get 20% off on custom SaaS apps..."
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Background Color / Gradient</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={announcement.bgColor || '#ff620b'}
                            onChange={(e) => handleAnnouncementChange('bgColor', e.target.value)}
                            placeholder="#ff620b or linear-gradient(...)"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Text Color</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={announcement.textColor || '#ffffff'}
                            onChange={(e) => handleAnnouncementChange('textColor', e.target.value)}
                            placeholder="#ffffff"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Destination Link (optional)</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={announcement.link || ''}
                            onChange={(e) => handleAnnouncementChange('link', e.target.value)}
                            placeholder="/contact or https://..."
                        />
                    </div>
                </div>
            </div>

            <SectionVisibilityBanner 
                sectionKey="marquee" 
                sectionName="Infinite Growth Marquee Ribbon" 
                description="Controls whether the streaming tech keywords ticker is displayed across the screen."
            />

            {/* Progressive Growth Marquee Ticker */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <Activity size={18} color="#6366f1" />
                            Progressive Growth Bottom Marquee
                        </h3>
                        <div className="admin-card-subtitle">
                            Continuous infinite scrolling text ticker displayed above the footer
                        </div>
                    </div>
                </div>

                {/* Marquee Preview */}
                <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        display: 'inline-block',
                        color: '#a5b4fc',
                        fontWeight: '700',
                        fontSize: '15px',
                        letterSpacing: '0.04em'
                    }}>
                        {marquee.text || 'IT Services ✦ SaaS Development ✦ E-commerce Solutions ✦ Digital Transformation ✦'}
                    </div>
                </div>

                <div className="admin-form-grid">
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">
                            Marquee Ticker Text
                            <span className="admin-label-hint">Separate phrases with ✦ or • symbols</span>
                        </label>
                        <textarea
                            className="admin-control-textarea"
                            rows={3}
                            value={marquee.text || ''}
                            onChange={(e) => handleMarqueeChange('text', e.target.value)}
                            placeholder="IT Services ✦ SaaS Development ✦ E-commerce Solutions ✦ Digital Transformation ✦"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
