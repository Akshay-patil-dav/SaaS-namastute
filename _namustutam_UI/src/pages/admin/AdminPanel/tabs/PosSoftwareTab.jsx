import React, { useState } from 'react';
import { 
    ShoppingBag, DollarSign, Check, Plus, Trash2, Edit3, 
    ExternalLink, Eye, RotateCcw, AlertCircle, Sparkles, 
    Zap, Users, Globe, Store, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import { DEFAULT_LANDING_DATA } from '../../../../data/landingPageDefaultData';

export default function PosSoftwareTab() {
    const { landingData, updateSection, updateVisibility } = useLandingPage();
    const posSoftware = landingData?.posSoftware || DEFAULT_LANDING_DATA.posSoftware;
    const isVisible = landingData?.sectionVisibility?.posSoftware !== false;

    const [activeSubTab, setActiveSubTab] = useState('pricing'); // 'pricing' | 'stats' | 'demo'
    const [statusMsg, setStatusMsg] = useState(null);

    // Editing modal for a plan
    const [editingPlanIdx, setEditingPlanIdx] = useState(null);
    const [planEditForm, setPlanEditForm] = useState(null);

    // Save helper
    const savePosConfig = (newPosConfig) => {
        updateSection('posSoftware', {
            ...posSoftware,
            ...newPosConfig
        });
        setStatusMsg({ type: 'success', text: 'POS Software settings saved successfully!' });
        setTimeout(() => setStatusMsg(null), 3000);
    };

    // ── Metric Stats Handlers ────────────────────────────────────────────────
    const statsList = posSoftware.stats || DEFAULT_LANDING_DATA.posSoftware.stats;

    const handleStatChange = (idx, field, val) => {
        const updated = [...statsList];
        updated[idx] = { ...updated[idx], [field]: val };
        savePosConfig({ stats: updated });
    };

    // ── Pricing Plans Handlers ───────────────────────────────────────────────
    const pricingPlans = posSoftware.pricingPlans || DEFAULT_LANDING_DATA.posSoftware.pricingPlans;

    const handleOpenEditPlan = (idx) => {
        setEditingPlanIdx(idx);
        setPlanEditForm({ ...pricingPlans[idx], featuresText: (pricingPlans[idx].features || []).join('\n') });
    };

    const handleSavePlan = () => {
        if (editingPlanIdx === null || !planEditForm) return;
        const featuresArray = planEditForm.featuresText
            .split('\n')
            .map(f => f.trim())
            .filter(Boolean);

        const updated = [...pricingPlans];
        updated[editingPlanIdx] = {
            ...planEditForm,
            features: featuresArray
        };
        delete updated[editingPlanIdx].featuresText;

        savePosConfig({ pricingPlans: updated });
        setEditingPlanIdx(null);
        setPlanEditForm(null);
    };

    // ── Demo Section Handlers ────────────────────────────────────────────────
    const demoInfo = posSoftware.demoInfo || DEFAULT_LANDING_DATA.posSoftware.demoInfo;

    const handleDemoFieldChange = (field, val) => {
        savePosConfig({
            demoInfo: {
                ...demoInfo,
                [field]: val
            }
        });
    };

    const handleBulletChange = (idx, val) => {
        const bullets = [...(demoInfo.bullets || [])];
        bullets[idx] = val;
        handleDemoFieldChange('bullets', bullets);
    };

    const handleResetToDefaults = () => {
        if (window.confirm('Reset all POS Software showcase configurations, stats, and pricing to default settings?')) {
            savePosConfig(DEFAULT_LANDING_DATA.posSoftware);
        }
    };

    return (
        <div className="admin-tab-content">
            {/* Header */}
            <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ 
                            background: 'rgba(255, 91, 0, 0.12)', 
                            color: '#ff5b00', 
                            padding: '4px 10px', 
                            borderRadius: '8px', 
                            fontSize: '12px', 
                            fontWeight: 700 
                        }}>
                            FLAGSHIP PRODUCT
                        </span>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                            Namustutam POS Software CMS
                        </h2>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                        Manage POS client metrics (15+ Total, 5+ Online, 10+ Offline), monthly pricing tiers, and the retail demo walkthrough card.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <a
                        href="/possoftware"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                    >
                        <Eye size={15} /> Preview Live Page <ExternalLink size={13} />
                    </a>
                    <button
                        type="button"
                        onClick={handleResetToDefaults}
                        className="btn-outline-danger"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                        <RotateCcw size={14} /> Reset Defaults
                    </button>
                </div>
            </div>

            {/* Visibility & Status Banner */}
            <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: isVisible ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: isVisible ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                            POS Showcase Section Status: {isVisible ? <span style={{ color: '#10b981' }}>Enabled</span> : <span style={{ color: '#ef4444' }}>Hidden</span>}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                            Controls visibility across the entire website navigation, footer, and homepage.
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13.5px' }}>
                        <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={(e) => updateVisibility('posSoftware', e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: '#ff5b00' }}
                        />
                        <span>Visible on Website</span>
                    </label>
                </div>
            </div>

            {/* Notification */}
            {statusMsg && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: statusMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${statusMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                    color: statusMsg.type === 'success' ? '#065f46' : '#991b1b',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Check size={16} /> {statusMsg.text}
                </div>
            )}

            {/* Sub Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <button
                    type="button"
                    onClick={() => setActiveSubTab('pricing')}
                    style={{
                        padding: '10px 18px',
                        fontWeight: 700,
                        fontSize: '14px',
                        border: 'none',
                        background: 'transparent',
                        color: activeSubTab === 'pricing' ? '#ff5b00' : '#64748b',
                        borderBottom: activeSubTab === 'pricing' ? '2px solid #ff5b00' : '2px solid transparent',
                        cursor: 'pointer'
                    }}
                >
                    Pricing Plans (3 Tiers)
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSubTab('stats')}
                    style={{
                        padding: '10px 18px',
                        fontWeight: 700,
                        fontSize: '14px',
                        border: 'none',
                        background: 'transparent',
                        color: activeSubTab === 'stats' ? '#ff5b00' : '#64748b',
                        borderBottom: activeSubTab === 'stats' ? '2px solid #ff5b00' : '2px solid transparent',
                        cursor: 'pointer'
                    }}
                >
                    Adoption Stats (15+ Clients)
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSubTab('demo')}
                    style={{
                        padding: '10px 18px',
                        fontWeight: 700,
                        fontSize: '14px',
                        border: 'none',
                        background: 'transparent',
                        color: activeSubTab === 'demo' ? '#ff5b00' : '#64748b',
                        borderBottom: activeSubTab === 'demo' ? '2px solid #ff5b00' : '2px solid transparent',
                        cursor: 'pointer'
                    }}
                >
                    Demo Walkthrough Card
                </button>
            </div>

            {/* ── SUB-TAB 1: PRICING PLANS ────────────────────────────────────── */}
            {activeSubTab === 'pricing' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {pricingPlans.map((plan, idx) => (
                            <div 
                                key={plan.id || idx}
                                style={{
                                    background: '#ffffff',
                                    border: plan.featured ? '2px solid #ff5b00' : '1px solid #e2e8f0',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    position: 'relative',
                                    boxShadow: plan.featured ? '0 10px 30px rgba(255, 91, 0, 0.1)' : '0 4px 15px rgba(0,0,0,0.03)'
                                }}
                            >
                                {plan.badge && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        right: '20px',
                                        background: '#ff5b00',
                                        color: '#ffffff',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        padding: '3px 10px',
                                        borderRadius: '999px',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {plan.badge}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                                            {plan.name}
                                        </h3>
                                        <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, minHeight: '36px' }}>
                                            {plan.sub}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEditPlan(idx)}
                                        className="btn-icon"
                                        title="Edit this plan"
                                        style={{ padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    >
                                        <Edit3 size={15} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '14px 0 6px' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>₹</span>
                                    <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{plan.monthly}</span>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>/ month</span>
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '16px' }}>
                                    {plan.billedNote || `₹${plan.monthly} billed monthly`}
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(plan.features || []).map((feat, fIdx) => (
                                        <li key={fIdx} style={{ fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Check size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div style={{
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    background: plan.featured ? '#ff5b00' : '#f8fafc',
                                    color: plan.featured ? '#ffffff' : '#334155',
                                    border: plan.featured ? 'none' : '1px solid #cbd5e1',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    fontWeight: 700
                                }}>
                                    {plan.ctaLabel}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Plan Edit Modal */}
                    {planEditForm && (
                        <div style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '20px'
                        }}>
                            <div style={{
                                background: '#ffffff',
                                borderRadius: '16px',
                                padding: '28px',
                                maxWidth: '540px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 16px', color: '#0f172a' }}>
                                    Edit Pricing Plan: {planEditForm.name}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Plan Name</label>
                                        <input
                                            type="text"
                                            value={planEditForm.name}
                                            onChange={(e) => setPlanEditForm({ ...planEditForm, name: e.target.value })}
                                            className="admin-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Monthly Price (₹)</label>
                                        <input
                                            type="text"
                                            value={planEditForm.monthly}
                                            onChange={(e) => setPlanEditForm({ ...planEditForm, monthly: e.target.value })}
                                            className="admin-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Subtitle / Target Store</label>
                                    <input
                                        type="text"
                                        value={planEditForm.sub}
                                        onChange={(e) => setPlanEditForm({ ...planEditForm, sub: e.target.value })}
                                        className="admin-input"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Badge (Optional, e.g. MOST POPULAR)</label>
                                        <input
                                            type="text"
                                            value={planEditForm.badge || ''}
                                            onChange={(e) => setPlanEditForm({ ...planEditForm, badge: e.target.value })}
                                            className="admin-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>CTA Button Label</label>
                                        <input
                                            type="text"
                                            value={planEditForm.ctaLabel}
                                            onChange={(e) => setPlanEditForm({ ...planEditForm, ctaLabel: e.target.value })}
                                            className="admin-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                        <input
                                            type="checkbox"
                                            checked={Boolean(planEditForm.featured)}
                                            onChange={(e) => setPlanEditForm({ ...planEditForm, featured: e.target.checked })}
                                            style={{ width: '16px', height: '16px', accentColor: '#ff5b00' }}
                                        />
                                        <span>Highlight as Featured Plan (Brand Orange Border)</span>
                                    </label>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                                        Features List (one feature per line)
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={planEditForm.featuresText}
                                        onChange={(e) => setPlanEditForm({ ...planEditForm, featuresText: e.target.value })}
                                        className="admin-input"
                                        style={{ width: '100%', fontFamily: 'inherit', fontSize: '13px', lineHeight: 1.5 }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => { setEditingPlanIdx(null); setPlanEditForm(null); }}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSavePlan}
                                        className="btn-primary"
                                        style={{ background: '#ff5b00', border: 'none' }}
                                    >
                                        Save Plan Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── SUB-TAB 2: ADOPTION STATS ───────────────────────────────────── */}
            {activeSubTab === 'stats' && (
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
                            POS Live Adoption Numbers
                        </h3>
                        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                            These figures are prominently shown in the full-width stats strip across retail counters and online customers.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        {statsList.map((stat, idx) => (
                            <div 
                                key={stat.id || idx}
                                style={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '18px',
                                    background: '#f8fafc'
                                }}
                            >
                                <div style={{ fontSize: '12px', fontWeight: 800, color: '#ff5b00', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Metric #{idx + 1} ({stat.id})
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Target Number</label>
                                    <input
                                        type="number"
                                        value={stat.target}
                                        onChange={(e) => handleStatChange(idx, 'target', Number(e.target.value) || 0)}
                                        className="admin-input"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Prefix (e.g. &lt; )</label>
                                        <input
                                            type="text"
                                            value={stat.prefix || ''}
                                            onChange={(e) => handleStatChange(idx, 'prefix', e.target.value)}
                                            className="admin-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Accent (e.g. + or s)</label>
                                        <input
                                            type="text"
                                            value={stat.accent || '+'}
                                            onChange={(e) => handleStatChange(idx, 'accent', e.target.value)}
                                            className="admin-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Title</label>
                                    <input
                                        type="text"
                                        value={stat.title}
                                        onChange={(e) => handleStatChange(idx, 'title', e.target.value)}
                                        className="admin-input"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Description</label>
                                    <textarea
                                        rows={2}
                                        value={stat.label}
                                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                                        className="admin-input"
                                        style={{ width: '100%', fontSize: '12px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── SUB-TAB 3: DEMO WALKTHROUGH CARD ────────────────────────────── */}
            {activeSubTab === 'demo' && (
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
                            Retail Walkthrough &amp; Demo Card Content
                        </h3>
                        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                            Configure the copy and checklist bullets displayed on the 2-column contact/demo form.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Category Badge</label>
                            <input
                                type="text"
                                value={demoInfo.tag || 'GET IN TOUCH'}
                                onChange={(e) => handleDemoFieldChange('tag', e.target.value)}
                                className="admin-input"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>WhatsApp CTA Button Text</label>
                            <input
                                type="text"
                                value={demoInfo.whatsappCta || 'Quick WhatsApp Chat with POS Expert →'}
                                onChange={(e) => handleDemoFieldChange('whatsappCta', e.target.value)}
                                className="admin-input"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Heading</label>
                        <input
                            type="text"
                            value={demoInfo.title || 'See Namustutam POS In Action With a Retail Specialist'}
                            onChange={(e) => handleDemoFieldChange('title', e.target.value)}
                            className="admin-input"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Walkthrough Description</label>
                        <textarea
                            rows={3}
                            value={demoInfo.description || ''}
                            onChange={(e) => handleDemoFieldChange('description', e.target.value)}
                            className="admin-input"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                            Checklist Bullets (Shown with green checkmarks)
                        </label>
                        {(demoInfo.bullets || []).map((bullet, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    value={bullet}
                                    onChange={(e) => handleBulletChange(idx, e.target.value)}
                                    className="admin-input"
                                    style={{ flex: 1 }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

