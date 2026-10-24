import React from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';

export default function SectionVisibilityBanner({ sectionKey, sectionName, description }) {
    const { landingData, toggleSectionVisibility, updateSection } = useLandingPage();
    const visibility = landingData?.sectionVisibility || {};
    const isVisible = visibility[sectionKey] !== false;

    const handleToggle = () => {
        toggleSectionVisibility(sectionKey);
        // Special sync for announcement if needed
        if (sectionKey === 'announcement' && landingData?.announcement) {
            updateSection('announcement', {
                ...landingData.announcement,
                enabled: !isVisible
            });
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '16px 20px',
            borderRadius: '14px',
            background: isVisible 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)' 
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: `1px solid ${isVisible ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            marginBottom: '4px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isVisible ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: isVisible ? '#34d399' : '#f87171'
                }}>
                    {isVisible ? <Eye size={22} /> : <EyeOff size={22} />}
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                            {sectionName || 'Section'} Visibility
                        </span>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: isVisible ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: isVisible ? '#34d399' : '#f87171',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            {isVisible ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                            {isVisible ? 'VISIBLE ON WEBSITE' : 'HIDDEN FROM WEBSITE'}
                        </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.4 }}>
                        {description || (isVisible
                            ? `This section is currently active and rendered to visitors on the public landing page.`
                            : `This section is disabled. It is completely hidden from the public website.`)}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: isVisible ? '#cbd5e1' : '#64748b' }}>
                    {isVisible ? 'Enabled' : 'Disabled'}
                </span>
                <label className="admin-switch" style={{ margin: 0 }}>
                    <input 
                        type="checkbox" 
                        checked={isVisible} 
                        onChange={handleToggle}
                    />
                    <span className="admin-switch-slider" />
                </label>
            </div>
        </div>
    );
}
