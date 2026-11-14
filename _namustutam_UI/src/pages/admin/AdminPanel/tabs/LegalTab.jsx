import React, { useState } from 'react';
import { 
    ShieldCheck, FileText, Plus, Trash2, Edit3, ArrowUp, ArrowDown, 
    RotateCcw, ExternalLink, Check, AlertCircle, HelpCircle, Layers,
    ChevronDown, ChevronUp, Sparkles, BookOpen, Clock, MapPin
} from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import { DEFAULT_LANDING_DATA } from '../../../../data/landingPageDefaultData';

const POLICY_TABS = [
    { key: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, path: '/privacy-policy' },
    { key: 'terms', label: 'Terms of Service', icon: FileText, path: '/terms-of-service' },
    { key: 'cookies', label: 'Cookie Policy', icon: Layers, path: '/cookie-policy' },
    { key: 'refunds', label: 'Refund Policy', icon: RotateCcw, path: '/refund-policy' }
];

export default function LegalTab() {
    const { landingData, updateSection } = useLandingPage();
    const [activePolicy, setActivePolicy] = useState('privacy');

    // Section Editor Modal State
    const [editingSection, setEditingSection] = useState(null); // null or { index, data, isNew }
    const [modalError, setModalError] = useState('');
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const legal = landingData?.legal || DEFAULT_LANDING_DATA.legal;
    const currentPolicyData = legal[activePolicy] || DEFAULT_LANDING_DATA.legal[activePolicy] || { sections: [] };
    const currentSections = currentPolicyData.sections || [];

    // ── Update helper for legal metadata & active policy ──────────────────────
    const handleUpdateLegal = (partialLegal) => {
        updateSection('legal', {
            ...legal,
            ...partialLegal
        });
    };

    const handleUpdateCurrentPolicy = (partialPolicy) => {
        handleUpdateLegal({
            [activePolicy]: {
                ...currentPolicyData,
                ...partialPolicy
            }
        });
    };

    // ── Reorder Sections ──────────────────────────────────────────────────────
    const handleMoveSection = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= currentSections.length) return;

        const updated = [...currentSections];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);

        handleUpdateCurrentPolicy({ sections: updated });
    };

    // ── Delete Section ────────────────────────────────────────────────────────
    const handleDeleteSection = (index) => {
        const updated = currentSections.filter((_, i) => i !== index);
        handleUpdateCurrentPolicy({ sections: updated });
    };

    // ── Open Editor for Add / Edit ────────────────────────────────────────────
    const handleOpenAdd = () => {
        setModalError('');
        const nextNum = currentSections.length + 1;
        setEditingSection({
            isNew: true,
            index: currentSections.length,
            data: {
                id: `section-${Date.now()}`,
                shortTitle: `${nextNum}. New Section`,
                heading: `${nextNum}. Section Heading`,
                paragraphs: ['Add your section text description here.'],
                bullets: [],
                note: ''
            }
        });
    };

    const handleOpenEdit = (index) => {
        setModalError('');
        const sec = currentSections[index];
        setEditingSection({
            isNew: false,
            index,
            data: {
                id: sec.id || `section-${index + 1}`,
                shortTitle: sec.shortTitle || '',
                heading: sec.heading || '',
                paragraphs: Array.isArray(sec.paragraphs) ? [...sec.paragraphs] : [sec.paragraphs || ''],
                bullets: Array.isArray(sec.bullets) ? JSON.parse(JSON.stringify(sec.bullets)) : [],
                note: sec.note || ''
            }
        });
    };

    // ── Save Section Modal ────────────────────────────────────────────────────
    const handleSaveSection = (e) => {
        e.preventDefault();
        if (!editingSection?.data?.heading?.trim()) {
            setModalError('Please provide a section heading.');
            return;
        }

        const cleanedData = {
            ...editingSection.data,
            id: editingSection.data.id.trim() || `section-${Date.now()}`,
            shortTitle: (editingSection.data.shortTitle || editingSection.data.heading).trim(),
            heading: editingSection.data.heading.trim(),
            paragraphs: editingSection.data.paragraphs
                .filter(p => typeof p === 'string' && p.trim().length > 0)
                .map(p => p.trim()),
            bullets: (editingSection.data.bullets || []).filter(b => {
                if (typeof b === 'string') return b.trim().length > 0;
                return Boolean(b?.title?.trim() || b?.text?.trim());
            }),
            note: (editingSection.data.note || '').trim()
        };

        if (cleanedData.paragraphs.length === 0) {
            cleanedData.paragraphs = [''];
        }

        let updatedSections = [...currentSections];
        if (editingSection.isNew) {
            updatedSections.push(cleanedData);
        } else {
            updatedSections[editingSection.index] = cleanedData;
        }

        handleUpdateCurrentPolicy({ sections: updatedSections });
        setEditingSection(null);
    };

    // ── Reset to Defaults ─────────────────────────────────────────────────────
    const handleRestoreDefaultPolicy = () => {
        const defaultPolicy = DEFAULT_LANDING_DATA.legal[activePolicy];
        if (defaultPolicy) {
            handleUpdateCurrentPolicy(JSON.parse(JSON.stringify(defaultPolicy)));
        }
        setShowResetConfirm(false);
    };

    const activeMeta = POLICY_TABS.find(t => t.key === activePolicy) || POLICY_TABS[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Top Navigation & Status Card */}
            <div className="admin-card" style={{
                background: 'linear-gradient(135deg, rgba(255, 91, 0, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)',
                borderColor: 'rgba(255, 91, 0, 0.25)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '20px'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span className="admin-status-pill">
                                <span className="admin-status-dot" />
                                Legal Policy CMS Active
                            </span>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}>
                                4 Live Public Documents
                            </span>
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px', color: '#ffffff' }}>
                            Legal Policies &amp; Compliance CMS
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', maxWidth: '720px', lineHeight: 1.5 }}>
                            Customize policy headings, structured paragraphs, bullet points, and jurisdictional terms. All edits immediately update your public legal pages and navigation table-of-contents.
                        </p>
                    </div>

                    <a
                        href={activeMeta.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                    >
                        <ExternalLink size={14} />
                        <span>View {activeMeta.label} Live ↗</span>
                    </a>
                </div>

                {/* Policy Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                    {POLICY_TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activePolicy === tab.key;
                        const count = (legal[tab.key]?.sections || DEFAULT_LANDING_DATA.legal[tab.key]?.sections || []).length;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActivePolicy(tab.key)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid',
                                    borderColor: isActive ? '#ff5b00' : 'rgba(255, 255, 255, 0.08)',
                                    background: isActive ? 'rgba(255, 91, 0, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                                    color: isActive ? '#ffffff' : '#94a3b8',
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: '13.5px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <Icon size={16} color={isActive ? '#ff8c42' : '#94a3b8'} />
                                <span>{tab.label}</span>
                                <span style={{
                                    fontSize: '11px',
                                    padding: '2px 7px',
                                    borderRadius: '9999px',
                                    background: isActive ? '#ff5b00' : 'rgba(255, 255, 255, 0.08)',
                                    color: '#ffffff'
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Policy Metadata Settings Card */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <BookOpen size={18} color="#ff5b00" />
                            {activeMeta.label} - Header &amp; Metadata
                        </h3>
                        <div className="admin-card-subtitle">
                            Configure document title, subtitle banner, and jurisdictional dates
                        </div>
                    </div>

                    <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => setShowResetConfirm(true)}
                        style={{ fontSize: '12px', padding: '6px 12px', color: '#f87171' }}
                    >
                        <RotateCcw size={13} />
                        <span>Restore Defaults</span>
                    </button>
                </div>

                <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    <div className="admin-field">
                        <label className="admin-label">Page Main Heading</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={currentPolicyData.title || ''}
                            onChange={(e) => handleUpdateCurrentPolicy({ title: e.target.value })}
                            placeholder="e.g. Privacy Policy"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Effective Last Updated Date</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={legal.lastUpdated || ''}
                            onChange={(e) => handleUpdateLegal({ lastUpdated: e.target.value })}
                            placeholder="e.g. November 12, 2026"
                        />
                    </div>

                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">Page Subtitle / Mission Statement</label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={currentPolicyData.subtitle || ''}
                            onChange={(e) => handleUpdateCurrentPolicy({ subtitle: e.target.value })}
                            placeholder="e.g. How Namustutam collects, protects, and handles your personal, store, and business data."
                        />
                    </div>

                    {(activePolicy === 'privacy' || activePolicy === 'terms') && (
                        <div className="admin-field">
                            <label className="admin-label">Legal Jurisdiction &amp; Courts</label>
                            <input
                                type="text"
                                className="admin-control-input"
                                value={legal.jurisdiction || ''}
                                onChange={(e) => handleUpdateLegal({ jurisdiction: e.target.value })}
                                placeholder="e.g. Maharashtra, India"
                            />
                        </div>
                    )}

                    {activePolicy === 'refunds' && (
                        <>
                            <div className="admin-field">
                                <label className="admin-label">First-Time Review Window (Days)</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={legal.refundReviewDays || ''}
                                    onChange={(e) => handleUpdateLegal({ refundReviewDays: e.target.value })}
                                    placeholder="e.g. 7"
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-label">Banking Disbursement Timeline</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={legal.refundProcessingDays || ''}
                                    onChange={(e) => handleUpdateLegal({ refundProcessingDays: e.target.value })}
                                    placeholder="e.g. 5–7 business days"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Sections List Card */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3 className="admin-card-title">
                            <Layers size={18} color="#ff5b00" />
                            {activeMeta.label} Sections ({currentSections.length})
                        </h3>
                        <div className="admin-card-subtitle">
                            Organized sections rendered sequentially on the public page with sidebar navigation
                        </div>
                    </div>

                    <button
                        type="button"
                        className="admin-btn admin-btn-orange"
                        onClick={handleOpenAdd}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Plus size={15} />
                        <span>Add Section</span>
                    </button>
                </div>

                {currentSections.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                        <p style={{ margin: 0, fontSize: '15px' }}>No sections defined for this policy.</p>
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={handleOpenAdd}
                            style={{ marginTop: '12px' }}
                        >
                            + Add First Section
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {currentSections.map((sec, idx) => (
                            <div
                                key={sec.id || idx}
                                style={{
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '16px',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <div style={{ flex: '1 1 360px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            background: 'rgba(255, 91, 0, 0.15)',
                                            color: '#ff8c42',
                                            border: '1px solid rgba(255, 91, 0, 0.3)'
                                        }}>
                                            #{idx + 1}
                                        </span>
                                        <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '700', color: '#ffffff' }}>
                                            {sec.heading}
                                        </h4>
                                    </div>

                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                                        <strong>TOC Link Label:</strong> {sec.shortTitle || sec.heading}
                                    </div>

                                    {Array.isArray(sec.paragraphs) && sec.paragraphs.length > 0 && (
                                        <p style={{
                                            margin: '0 0 6px',
                                            fontSize: '13px',
                                            color: '#cbd5e1',
                                            lineHeight: 1.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {sec.paragraphs[0]}
                                        </p>
                                    )}

                                    {Array.isArray(sec.bullets) && sec.bullets.length > 0 && (
                                        <div style={{ fontSize: '11.5px', color: '#38bdf8' }}>
                                            ✦ Includes {sec.bullets.length} structured bullet item{sec.bullets.length > 1 ? 's' : ''}
                                        </div>
                                    )}

                                    {sec.note && (
                                        <div style={{ fontSize: '11.5px', color: '#fbbf24', marginTop: '4px' }}>
                                            💡 Note box configured
                                        </div>
                                    )}
                                </div>

                                {/* Reorder & Action Buttons */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        onClick={() => handleMoveSection(idx, -1)}
                                        disabled={idx === 0}
                                        title="Move Up"
                                        style={{ padding: '6px 10px' }}
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        onClick={() => handleMoveSection(idx, 1)}
                                        disabled={idx === currentSections.length - 1}
                                        title="Move Down"
                                        style={{ padding: '6px 10px' }}
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        onClick={() => handleOpenEdit(idx)}
                                        title="Edit Section"
                                        style={{ padding: '6px 12px', color: '#ff8c42' }}
                                    >
                                        <Edit3 size={14} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-danger"
                                        onClick={() => handleDeleteSection(idx)}
                                        title="Delete Section"
                                        style={{ padding: '6px 10px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add / Edit Section Modal */}
            {editingSection && (
                <div className="admin-modal-overlay" onClick={() => setEditingSection(null)}>
                    <div
                        className="admin-modal-content"
                        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">
                                {editingSection.isNew ? 'Add New Section' : `Edit Section #${editingSection.index + 1}`}
                            </h3>
                        </div>

                        {modalError && (
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                fontSize: '13px',
                                marginBottom: '16px'
                            }}>
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleSaveSection} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="admin-field">
                                <label className="admin-label">Section Heading *</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={editingSection.data.heading}
                                    onChange={(e) => setEditingSection({
                                        ...editingSection,
                                        data: { ...editingSection.data, heading: e.target.value }
                                    })}
                                    placeholder="e.g. 1. Introduction & Scope"
                                    required
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-label">Short Title (for Sidebar Navigation)</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={editingSection.data.shortTitle}
                                    onChange={(e) => setEditingSection({
                                        ...editingSection,
                                        data: { ...editingSection.data, shortTitle: e.target.value }
                                    })}
                                    placeholder="e.g. 1. Introduction"
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-label">
                                    Paragraph Content (Separate multiple paragraphs by pressing Enter twice)
                                </label>
                                <textarea
                                    className="admin-control-input"
                                    rows={5}
                                    value={editingSection.data.paragraphs.join('\n\n')}
                                    onChange={(e) => {
                                        const paras = e.target.value.split('\n\n');
                                        setEditingSection({
                                            ...editingSection,
                                            data: { ...editingSection.data, paragraphs: paras }
                                        });
                                    }}
                                    placeholder="Enter section description here..."
                                />
                                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                    Tip: You can use {"{brandName}"}, {"{jurisdiction}"}, {"{lastUpdated}"} placeholders.
                                </span>
                            </div>

                            {/* Bullets Manager */}
                            <div className="admin-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label className="admin-label" style={{ margin: 0 }}>Structured Bullet Points (Optional)</label>
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        onClick={() => {
                                            const updated = [...(editingSection.data.bullets || [])];
                                            updated.push({ title: '', text: '' });
                                            setEditingSection({
                                                ...editingSection,
                                                data: { ...editingSection.data, bullets: updated }
                                            });
                                        }}
                                        style={{ fontSize: '11px', padding: '4px 10px' }}
                                    >
                                        + Add Bullet
                                    </button>
                                </div>

                                {(editingSection.data.bullets || []).map((b, bIdx) => {
                                    const isObj = typeof b === 'object';
                                    const bTitle = isObj ? b.title : '';
                                    const bText = isObj ? b.text : b;

                                    return (
                                        <div
                                            key={bIdx}
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                                marginBottom: '8px',
                                                background: 'rgba(15, 23, 42, 0.4)',
                                                padding: '8px 10px',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                style={{ flex: '1 1 120px' }}
                                                placeholder="Title (Optional)"
                                                value={bTitle}
                                                onChange={(e) => {
                                                    const updated = [...editingSection.data.bullets];
                                                    updated[bIdx] = { title: e.target.value, text: bText };
                                                    setEditingSection({
                                                        ...editingSection,
                                                        data: { ...editingSection.data, bullets: updated }
                                                    });
                                                }}
                                            />
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                style={{ flex: '2 1 200px' }}
                                                placeholder="Bullet details..."
                                                value={bText}
                                                onChange={(e) => {
                                                    const updated = [...editingSection.data.bullets];
                                                    updated[bIdx] = { title: bTitle, text: e.target.value };
                                                    setEditingSection({
                                                        ...editingSection,
                                                        data: { ...editingSection.data, bullets: updated }
                                                    });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="admin-btn admin-btn-danger"
                                                style={{ padding: '6px 8px' }}
                                                onClick={() => {
                                                    const updated = editingSection.data.bullets.filter((_, i) => i !== bIdx);
                                                    setEditingSection({
                                                        ...editingSection,
                                                        data: { ...editingSection.data, bullets: updated }
                                                    });
                                                }}
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Note Box */}
                            <div className="admin-field">
                                <label className="admin-label">Callout Banner / Important Note (Optional)</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={editingSection.data.note}
                                    onChange={(e) => setEditingSection({
                                        ...editingSection,
                                        data: { ...editingSection.data, note: e.target.value }
                                    })}
                                    placeholder="e.g. Effective Date: November 12, 2026. We never sell your personal contact details."
                                />
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setEditingSection(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn-orange"
                                >
                                    {editingSection.isNew ? 'Add Section' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="admin-modal-overlay" onClick={() => setShowResetConfirm(false)}>
                    <div className="admin-modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title" style={{ color: '#f87171' }}>
                                Restore Default {activeMeta.label}?
                            </h3>
                        </div>
                        <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px' }}>
                            This will overwrite current custom sections of <strong>{activeMeta.label}</strong> with the original standard legal text.
                        </p>
                        <div className="admin-modal-footer">
                            <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                onClick={() => setShowResetConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="admin-btn admin-btn-danger"
                                onClick={handleRestoreDefaultPolicy}
                            >
                                Yes, Restore Defaults
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

