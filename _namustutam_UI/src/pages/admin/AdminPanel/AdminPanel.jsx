import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Sparkles, FolderGit2, Wrench, RefreshCw, 
    Users, Star, Megaphone, PhoneCall, Globe, Eye, 
    Save, RotateCcw, Download, Upload, LogOut, CheckCircle2, 
    AlertCircle, Info, ExternalLink, Database, BookOpen, Layers, Bot
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useLandingPage } from '../../../context/LandingPageContext';
import './AdminPanel.css';

// Tabs
import OverviewTab from './tabs/OverviewTab';
import HeroTab from './tabs/HeroTab';
import ProjectsTab from './tabs/ProjectsTab';
import ServicesTab from './tabs/ServicesTab';
import SdlcTab from './tabs/SdlcTab';
import TeamTab from './tabs/TeamTab';
import TestimonialsTab from './tabs/TestimonialsTab';
import MarqueeTab from './tabs/MarqueeTab';
import ContactTab from './tabs/ContactTab';
import SeoTab from './tabs/SeoTab';
import LivePreviewTab from './tabs/LivePreviewTab';
import BlogTab from './tabs/BlogTab';
import SectionsTab from './tabs/SectionsTab';
import ChatbotTab from './tabs/ChatbotTab';

export default function AdminPanel() {
    const navigate = useNavigate();
    const { section } = useParams();
    const activeTab = section || 'overview';
    const { user, logout } = useAuth();
    const { 
        landingData, 
        hasUnsavedChanges, 
        isSaving, 
        saveMessage, 
        saveAndPublish, 
        resetToDefaults, 
        exportConfigJson, 
        importConfigJson,
        backendStatus,
        checkBackendStatus,
        reconnectDatabase
    } = useLandingPage();

    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const fileInputRef = useRef(null);

    // Grouped Navigation Sections
    const navSections = [
        {
            category: 'Core Dashboard',
            items: [
                { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
                { id: 'sections', label: 'Section Visibility', icon: Layers, badge: '10' },
                { id: 'preview', label: 'Live Simulator', icon: Eye }
            ]
        },
        {
            category: 'Services & Automation',
            items: [
                { id: 'services', label: 'Services Catalog', icon: Wrench, badge: landingData.services?.length },
                { id: 'chatbot', label: 'AI Chatbot Assistant', icon: Bot, badge: landingData.chatbot?.apiKey ? 'Active' : 'Setup' }
            ]
        },
        {
            category: 'Website Sections',
            items: [
                { id: 'hero', label: 'Hero & Headlines', icon: Sparkles },
                { id: 'projects', label: 'Showcase Projects', icon: FolderGit2, badge: landingData.projects?.length },
                { id: 'sdlc', label: 'SDLC Process Roadmap', icon: RefreshCw },
                { id: 'team', label: 'Team & Leadership', icon: Users, badge: landingData.team?.length },
                { id: 'testimonials', label: 'Client Reviews', icon: Star, badge: landingData.testimonials?.length },
                { id: 'marquee', label: 'Marquee & Banners', icon: Megaphone },
                { id: 'contact', label: 'Contact & Inquiries', icon: PhoneCall },
                { id: 'seo', label: 'SEO & Meta Tags', icon: Globe }
            ]
        },
        {
            category: 'Publications & Blog',
            items: [
                { id: 'blogs', label: 'Blog Articles CMS', icon: BookOpen }
            ]
        }
    ];

    const currentTabMeta = {
        overview: { title: 'Dashboard Overview', desc: 'Summary metrics, quick stats, and direct landing page control' },
        sections: { title: 'Website Section Visibility & Layout Manager', desc: 'Enable or disable sections on the public website with real-time toggle switches' },
        services: { title: 'Services & Capabilities Catalog', desc: 'Configure software, SaaS, automation & development service offerings' },
        chatbot: { title: 'AI Chatbot & Intelligent Assistant', desc: 'Configure AI provider (Groq, Gemini, OpenAI), API keys, models, system prompt, and floating bot behavior' },
        hero: { title: 'Hero Section & Dynamic Copy', desc: 'Badge, main titles, rotating dynamic words, and hero CTAs' },
        projects: { title: 'Showcase Projects', desc: 'Manage your portfolio items displayed in the Bento Grid' },
        sdlc: { title: 'SDLC Process Roadmap', desc: 'Customize the 8-phase software delivery journey' },
        team: { title: 'Team Members & Leadership', desc: 'Manage engineering profiles, roles, and social media handles' },
        testimonials: { title: 'Client Reviews & Social Proof', desc: 'Highlight customer feedback and satisfaction ratings' },
        marquee: { title: 'Marquee & Announcement Banner', desc: 'Manage top alert bar and infinite growth ticker' },
        blogs: { title: 'Blog Publications & Articles CMS', desc: 'Create, edit, toggle visibility, and manage software articles' },
        contact: { title: 'Contact Inquiries & Details', desc: 'Manage client lead submissions table, official emails, phones, and channels' },
        seo: { title: 'SEO & Search Engine Optimization', desc: 'Meta tags, page title, and SERP simulation preview' },
        preview: { title: 'Live Responsive Simulator', desc: 'Test landing page layouts across Desktop, Tablet, and Mobile' }
    }[activeTab] || { title: 'Admin Studio', desc: '' };

    useEffect(() => {
        document.title = `${currentTabMeta.title} | Namustutam Admin Studio`;
    }, [activeTab, currentTabMeta.title]);

    const handleTabChange = (tabId) => {
        if (tabId === 'overview') {
            navigate('/admin');
        } else {
            navigate(`/admin/${tabId}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login', { replace: true });
    };

    const handleSave = async () => {
        await saveAndPublish();
    };

    const handleImportFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            if (typeof content === 'string') {
                importConfigJson(content);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div className="admin-layout">
            {/* ── Sidebar ── */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <Link to="/admin" className="admin-sidebar-brand">
                        <div className="admin-sidebar-logo">N</div>
                        <div>
                            <div className="admin-sidebar-title">
                                Namus<span>tutam</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                                Admin Studio CMS
                            </span>
                        </div>
                    </Link>

                    <div style={{ marginTop: '8px' }}>
                        <span className="admin-status-pill">
                            <span className="admin-status-dot" />
                            Live on Public Web
                        </span>
                    </div>
                </div>

                <div className="admin-sidebar-nav">
                    {navSections.map((sec, secIdx) => (
                        <div key={secIdx} className="admin-nav-group" style={{ marginBottom: '12px' }}>
                            <div className="admin-nav-section-title">{sec.category}</div>
                            {sec.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`admin-nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => handleTabChange(item.id)}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        <div className="admin-nav-item-left">
                                            <Icon size={18} />
                                            <span>{item.label}</span>
                                        </div>
                                        {item.badge !== undefined && (
                                            <span className="admin-nav-badge">{item.badge}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Bottom User Card */}
                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-user-avatar">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="admin-user-details">
                            <span className="admin-user-name">
                                {user?.name || 'Akshay Patil'}
                            </span>
                            <span className="admin-user-role">
                                {user?.role || 'SUPER_ADMIN'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="admin-logout-btn"
                        onClick={handleLogout}
                        title="Sign Out of Admin"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* ── Main Panel View ── */}
            <div className="admin-main">
                {/* Topbar */}
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <h1 className="admin-topbar-title">
                            {currentTabMeta.title}
                            {hasUnsavedChanges && (
                                <span className="unsaved-pill">
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24' }} />
                                    Unsaved Changes
                                </span>
                            )}
                        </h1>
                        <p className="admin-topbar-desc">{currentTabMeta.desc}</p>
                    </div>

                    <div className="admin-topbar-actions">
                        {/* Live Database Connection Badge */}
                        <button
                            type="button"
                            onClick={reconnectDatabase}
                            className="admin-btn admin-btn-secondary"
                            disabled={backendStatus?.checking}
                            style={{
                                borderColor: backendStatus?.checking
                                    ? 'rgba(251, 191, 36, 0.4)'
                                    : backendStatus?.connected
                                        ? 'rgba(16, 185, 129, 0.4)'
                                        : 'rgba(239, 68, 68, 0.4)',
                                background: backendStatus?.checking
                                    ? 'rgba(251, 191, 36, 0.08)'
                                    : backendStatus?.connected
                                        ? 'rgba(16, 185, 129, 0.08)'
                                        : 'rgba(239, 68, 68, 0.08)',
                                color: backendStatus?.checking
                                    ? '#fbbf24'
                                    : backendStatus?.connected
                                        ? '#34d399'
                                        : '#f87171',
                                minWidth: '200px',
                                cursor: backendStatus?.checking ? 'wait' : 'pointer'
                            }}
                            title={
                                backendStatus?.checking
                                    ? 'Connecting to database... auto-creating if needed.'
                                    : backendStatus?.connected
                                        ? `Database Active: ${backendStatus.databaseProductName || 'PostgreSQL'} • ${backendStatus.catalog || 'namustute_db_pos'} (${backendStatus.tableCount || 0} tables). Click to re-verify.`
                                        : `Database offline. Click to trigger auto-provisioning. Error: ${backendStatus?.error || 'Connection refused'}`
                            }
                        >
                            {backendStatus?.checking ? (
                                <span className="admin-spinner" style={{ width: '14px', height: '14px' }} />
                            ) : (
                                <Database size={14} style={{ color: backendStatus?.connected ? '#10b981' : '#ef4444' }} />
                            )}
                            <span>
                                {backendStatus?.checking
                                    ? 'DB: Connecting...'
                                    : backendStatus?.connected
                                        ? `DB: ${backendStatus.catalog || 'namustute_db_pos'} ✓`
                                        : 'DB: Offline — Click to Retry'}
                            </span>
                            <span
                                style={{
                                    fontSize: '9px',
                                    padding: '2px 5px',
                                    borderRadius: '4px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#cbd5e1'
                                }}
                            >
                                {backendStatus?.checking ? '...' : backendStatus?.tableCount !== undefined ? `${backendStatus.tableCount} tbls` : 'Postgres'}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setShowResetConfirm(true)}
                            title="Reset all sections to original defaults"
                        >
                            <RotateCcw size={14} />
                            <span>Defaults</span>
                        </button>

                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={exportConfigJson}
                            title="Export whole site configuration as JSON backup"
                        >
                            <Download size={14} />
                            <span>Export</span>
                        </button>

                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => fileInputRef.current?.click()}
                            title="Import site configuration from JSON backup"
                        >
                            <Upload size={14} />
                            <span>Import</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            style={{ display: 'none' }}
                            onChange={handleImportFile}
                        />

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-secondary"
                        >
                            <ExternalLink size={14} />
                            <span>Public View</span>
                        </a>

                        <button
                            type="button"
                            className="admin-btn admin-btn-orange"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <span className="admin-spinner" style={{ width: '14px', height: '14px' }} />
                                    <span>Publishing...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={15} />
                                    <span>Save & Publish</span>
                                </>
                            )}
                        </button>
                    </div>
                </header>

                {/* Content View Container */}
                <main className="admin-content">
                    {activeTab === 'overview' && <OverviewTab setActiveTab={handleTabChange} />}
                    {activeTab === 'sections' && <SectionsTab setActiveTab={handleTabChange} />}
                    {activeTab === 'services' && <ServicesTab />}
                    {activeTab === 'chatbot' && <ChatbotTab />}
                    {activeTab === 'hero' && <HeroTab />}
                    {activeTab === 'projects' && <ProjectsTab />}
                    {activeTab === 'sdlc' && <SdlcTab />}
                    {activeTab === 'team' && <TeamTab />}
                    {activeTab === 'testimonials' && <TestimonialsTab />}
                    {activeTab === 'marquee' && <MarqueeTab />}
                    {activeTab === 'blogs' && <BlogTab />}
                    {activeTab === 'contact' && <ContactTab />}
                    {activeTab === 'seo' && <SeoTab />}
                    {activeTab === 'preview' && <LivePreviewTab />}
                </main>
            </div>

            {/* Reset to Defaults Confirmation Modal */}
            {showResetConfirm && (
                <div className="admin-modal-overlay" onClick={() => setShowResetConfirm(false)}>
                    <div className="admin-modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title" style={{ color: '#f87171' }}>
                                Reset to Factory Defaults?
                            </h3>
                        </div>

                        <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                            Are you sure you want to reset all landing page customizations (Hero, Projects, Services, Team, Marquee, Footer) back to original default content? This action cannot be undone unless you have exported a JSON backup.
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
                                onClick={() => {
                                    resetToDefaults();
                                    setShowResetConfirm(false);
                                }}
                            >
                                Yes, Reset Everything
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {saveMessage && (
                <div className={`admin-toast ${saveMessage.type}`}>
                    {saveMessage.type === 'success' && <CheckCircle2 size={18} />}
                    {saveMessage.type === 'error' && <AlertCircle size={18} />}
                    {saveMessage.type === 'info' && <Info size={18} />}
                    <span>{saveMessage.text}</span>
                </div>
            )}
        </div>
    );
}
