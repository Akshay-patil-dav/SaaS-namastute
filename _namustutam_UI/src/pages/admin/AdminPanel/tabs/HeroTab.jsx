import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Eye, MoveRight, Layers, Image as ImageIcon } from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';

export default function HeroTab() {
    const { landingData, updateSection } = useLandingPage();
    const hero = landingData.hero || {};

    const [newWord, setNewWord] = useState('');
    const [previewWordIndex, setPreviewWordIndex] = useState(0);

    // Live cycling of rotating words in preview
    const rotatingWords = hero.rotatingWords || ['Excellence', 'Innovation', 'Experiences', 'Solutions'];

    useEffect(() => {
        if (!rotatingWords.length) return;
        const interval = setInterval(() => {
            setPreviewWordIndex(prev => (prev + 1) % rotatingWords.length);
        }, 2200);
        return () => clearInterval(interval);
    }, [rotatingWords]);

    const handleFieldChange = (field, value) => {
        updateSection('hero', { [field]: value });
    };

    const handleAddWord = (e) => {
        e.preventDefault();
        const trimmed = newWord.trim();
        if (!trimmed) return;
        if (rotatingWords.includes(trimmed)) {
            setNewWord('');
            return;
        }
        updateSection('hero', { rotatingWords: [...rotatingWords, trimmed] });
        setNewWord('');
    };

    const handleRemoveWord = (wordToRemove) => {
        if (rotatingWords.length <= 1) {
            alert('At least one rotating word is required.');
            return;
        }
        updateSection('hero', {
            rotatingWords: rotatingWords.filter(w => w !== wordToRemove)
        });
    };

    const handleFloatingImageChange = (index, newUrl) => {
        const nextImages = [...(hero.floatingImages || [])];
        nextImages[index] = newUrl;
        updateSection('hero', { floatingImages: nextImages });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <SectionVisibilityBanner 
                sectionKey="hero" 
                sectionName="Hero & Headlines" 
                description="The primary introductory section above the fold with dynamic rotating words, floating cards, and CTAs."
            />

            {/* Live Interactive Hero Preview Card */}
            <div className="admin-card" style={{
                background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), rgba(15, 23, 42, 0.8))',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                padding: '32px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="admin-status-pill">
                            <span className="admin-status-dot" />
                            Live Hero Visualizer
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            (Updates automatically as you edit fields below)
                        </span>
                    </div>
                </div>

                <div style={{
                    textAlign: 'center',
                    maxWidth: '800px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255, 140, 66, 0.12)',
                        border: '1px solid rgba(255, 140, 66, 0.3)',
                        color: '#ff8c42',
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '6px 16px',
                        borderRadius: '9999px'
                    }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff8c42' }} />
                        {hero.badge || 'Freelance Software Developer • IT Solutions'}
                    </div>

                    {/* Headline with animated word */}
                    <h1 style={{
                        fontSize: '34px',
                        fontWeight: '900',
                        color: '#ffffff',
                        lineHeight: 1.25,
                        margin: 0
                    }}>
                        {hero.titlePrefix || 'Building Digital'}{' '}
                        <span style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #ff8c42 0%, #ff620b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 30px rgba(255, 98, 11, 0.3)',
                            transition: 'all 0.3s ease'
                        }}>
                            {rotatingWords[previewWordIndex] || 'Excellence'}
                        </span>
                        <br />
                        {hero.titleSuffix || 'For Modern Businesses'}
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '15px',
                        color: '#94a3b8',
                        lineHeight: 1.6,
                        maxWidth: '650px',
                        margin: 0
                    }}>
                        {hero.subtitle}
                    </p>

                    {/* Action buttons preview */}
                    <div style={{ display: 'flex', gap: '14px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #ff620b 0%, #ea580c 100%)',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '14px',
                            boxShadow: '0 10px 20px rgba(255, 98, 11, 0.3)'
                        }}>
                            {hero.primaryBtnText || 'View Our Work'}
                        </div>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '14px'
                        }}>
                            {hero.secondaryBtnText || 'Discuss Your Project'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Form Editor */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <Sparkles size={18} color="#6366f1" />
                            Hero Copy & Headlines
                        </h3>
                        <div className="admin-card-subtitle">Refine the prominent text elements shown to incoming traffic</div>
                    </div>
                </div>

                <div className="admin-form-grid">
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">
                            Hero Badge Text
                            <span className="admin-label-hint">Shown in pill above the main title</span>
                        </label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={hero.badge || ''}
                            onChange={(e) => handleFieldChange('badge', e.target.value)}
                            placeholder="Freelance Software Developer • IT Solutions"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">
                            Title Prefix
                            <span className="admin-label-hint">Before the rotating animated words</span>
                        </label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={hero.titlePrefix || ''}
                            onChange={(e) => handleFieldChange('titlePrefix', e.target.value)}
                            placeholder="Building Digital"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">
                            Title Suffix
                            <span className="admin-label-hint">Following the rotating animated words</span>
                        </label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={hero.titleSuffix || ''}
                            onChange={(e) => handleFieldChange('titleSuffix', e.target.value)}
                            placeholder="For Modern Businesses"
                        />
                    </div>

                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">
                            Hero Subtitle / Value Proposition
                            <span className="admin-label-hint">Detailed pitch paragraph below headline</span>
                        </label>
                        <textarea
                            className="admin-control-textarea"
                            value={hero.subtitle || ''}
                            onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                            placeholder="I build custom software, POS solutions, business websites..."
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Rotating Words Manager */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <Layers size={18} color="#8b5cf6" />
                            Dynamic Rotating Words
                        </h3>
                        <div className="admin-card-subtitle">Words that dynamically animate in the center of the hero headline</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="admin-tags-container">
                        {rotatingWords.map((word, i) => (
                            <span key={i} className="admin-tag-pill">
                                <span>{word}</span>
                                <button
                                    type="button"
                                    className="admin-tag-remove"
                                    onClick={() => handleRemoveWord(word)}
                                    title={`Remove "${word}"`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    <form onSubmit={handleAddWord} className="admin-tag-add-wrap">
                        <input
                            type="text"
                            className="admin-control-input"
                            style={{ flex: 1 }}
                            placeholder="Enter new rotating word (e.g. Products, Growth, Platforms)..."
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                        />
                        <button type="submit" className="admin-btn admin-btn-primary">
                            <Plus size={16} />
                            <span>Add Word</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <MoveRight size={18} color="#10b981" />
                            Call-To-Action (CTA) Buttons
                        </h3>
                        <div className="admin-card-subtitle">Labels and target section anchors/links</div>
                    </div>
                </div>

                <div className="admin-form-grid">
                    <div className="admin-field">
                        <label className="admin-label">Primary Button Label</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={hero.primaryBtnText || ''}
                            onChange={(e) => handleFieldChange('primaryBtnText', e.target.value)}
                            placeholder="View Our Work"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Primary Button Link / Anchor</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={hero.primaryBtnLink || ''}
                            onChange={(e) => handleFieldChange('primaryBtnLink', e.target.value)}
                            placeholder="#portfolio"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Secondary Button Label</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={hero.secondaryBtnText || ''}
                            onChange={(e) => handleFieldChange('secondaryBtnText', e.target.value)}
                            placeholder="Discuss Your Project"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Secondary Button Link / Anchor</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={hero.secondaryBtnLink || ''}
                            onChange={(e) => handleFieldChange('secondaryBtnLink', e.target.value)}
                            placeholder="#contact"
                        />
                    </div>
                </div>
            </div>

            {/* Floating Background Images */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <ImageIcon size={18} color="#ff620b" />
                            Floating Background Mockup Cards
                        </h3>
                        <div className="admin-card-subtitle">Screenshots that float in the dynamic 3D hero background</div>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px'
                }}>
                    {(hero.floatingImages || []).map((imgUrl, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '12px',
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <div style={{
                                height: '110px',
                                borderRadius: '8px',
                                background: `url(${imgUrl}) center/cover no-repeat #000`,
                                border: '1px solid rgba(255,255,255,0.1)'
                            }} />
                            <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                                Card Slot #{idx + 1} Image URL
                            </label>
                            <input
                                type="text"
                                className="admin-control-input"
                                value={imgUrl}
                                onChange={(e) => handleFloatingImageChange(idx, e.target.value)}
                                placeholder="Image URL (e.g. /dashboard1.png or https://...)"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
