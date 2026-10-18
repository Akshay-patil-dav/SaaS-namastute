import React, { useState, useEffect, useMemo } from 'react';
import { 
    Settings as SettingsIcon, 
    Globe, 
    Smartphone, 
    Monitor, 
    DollarSign, 
    MoreHorizontal, 
    ChevronUp, 
    ChevronDown, 
    ChevronRight,
    User, 
    Lock,
    Bell,
    Puzzle,
    Users,
    CreditCard,
    Building,
    Hash,
    CheckCircle2,
    Share2,
    Languages,
    FileText,
    Layout,
    Printer as PrinterIcon,
    ListFilter,
    Mail,
    FileCode,
    MessageSquare,
    MessageCircle,
    KeyRound,
    ShieldCheck,
    Landmark,
    Percent,
    Coins,
    HardDrive,
    Ban,
    Bot,
    Search,
    X,
    Sliders,
    Sparkles,
    Menu
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './settings.css';

// ── Settings Sub-Components ──────────────────────────────────────────────────
import { ProfileSettings, SecuritySettings, Notifications, ConnectedApps } from '../../../components/settings/GeneralSettings/GeneralSettings';
import Billing from '../../../components/settings/GeneralSettings/Billing';
import TeamManagement from '../../../components/settings/GeneralSettings/TeamManagement';
import { SystemSettings, CompanySettings, Localization, Prefixes, Preference, SocialAuthentication, Language } from '../../../components/settings/WebsiteSettings/WebsiteSettings';
import { InvoiceSettings, InvoiceTemplate, Printer, PosSettings, CustomFields } from '../../../components/settings/AppSettings/AppSettings';
import { EmailSettings, EmailTemplate, SmsSettings, SmsTemplate, OtpSettings, GdprCookies } from '../../../components/settings/SystemSettings/SystemSettings';
import { PaymentGateway, BankAccounts, TaxRates, Currencies } from '../../../components/settings/FinancialSettings/FinancialSettings';
import { Storage, BanIp } from '../../../components/settings/OtherSettings/OtherSettings';
import { AiHelperSettings } from '../../../components/settings/AiHelperSettings/AiHelperSettings';

// ── Master Definitions for All 31 Settings Across 7 Sections ─────────────────
const SETTINGS_SECTIONS = [
    {
        id: 'general',
        title: 'General Settings',
        icon: SettingsIcon,
        color: '#ea580c',
        bgColor: '#fff7ed',
        items: [
            { id: 'profile', label: 'Profile Settings', path: 'profile', icon: User },
            { id: 'security', label: 'Security & Password', path: 'security', icon: Lock },
            { id: 'notifications', label: 'Notifications', path: 'notifications', icon: Bell },
            { id: 'connected_apps', label: 'Connected Apps', path: 'connected_apps', badge: 'apps', icon: Puzzle },
            { id: 'team_management', label: 'Team & Staff', path: 'team_management', icon: Users },
            { id: 'billing', label: 'Billing & Plans', path: 'billing', badge: 'plan', icon: CreditCard }
        ]
    },
    {
        id: 'website',
        title: 'Website Settings',
        icon: Globe,
        color: '#2563eb',
        bgColor: '#eff6ff',
        items: [
            { id: 'system_settings', label: 'System & Branding', path: 'system_settings', icon: Sliders },
            { id: 'company_settings', label: 'Company Settings', path: 'company_settings', icon: Building },
            { id: 'localization', label: 'Localization & Timezone', path: 'localization', icon: Globe },
            { id: 'prefixes', label: 'Document Prefixes', path: 'prefixes', icon: Hash },
            { id: 'preference', label: 'Store Preferences', path: 'preference', icon: CheckCircle2 },
            { id: 'social_authentication', label: 'Social Authentication', path: 'social_authentication', icon: Share2 },
            { id: 'language', label: 'Language & Locales', path: 'language', icon: Languages }
        ]
    },
    {
        id: 'app',
        title: 'App Settings',
        icon: Smartphone,
        color: '#7c3aed',
        bgColor: '#f5f3ff',
        items: [
            { id: 'invoice_settings', label: 'Invoice Settings', path: 'invoice_settings', icon: FileText },
            { id: 'invoice_template', label: 'Invoice Template', path: 'invoice_template', icon: Layout },
            { id: 'printer', label: 'Printer Settings', path: 'printer', icon: PrinterIcon },
            { id: 'pos_settings', label: 'POS Terminal Settings', path: 'pos_settings', icon: Smartphone },
            { id: 'custom_fields', label: 'Custom Fields', path: 'custom_fields', icon: ListFilter }
        ]
    },
    {
        id: 'system',
        title: 'System & Communications',
        icon: Monitor,
        color: '#0891b2',
        bgColor: '#ecfeff',
        items: [
            { id: 'email_settings', label: 'Email (SMTP) Settings', path: 'email_settings', icon: Mail },
            { id: 'email_template', label: 'Email Notification Templates', path: 'email_template', icon: FileCode },
            { id: 'sms_settings', label: 'SMS Gateway Settings', path: 'sms_settings', icon: MessageSquare },
            { id: 'sms_template', label: 'SMS Templates', path: 'sms_template', icon: MessageCircle },
            { id: 'otp', label: 'OTP Verification Settings', path: 'otp', icon: KeyRound },
            { id: 'gdpr_cookies', label: 'GDPR & Cookie Policy', path: 'gdpr_cookies', icon: ShieldCheck }
        ]
    },
    {
        id: 'financial',
        title: 'Financial Settings',
        icon: DollarSign,
        color: '#059669',
        bgColor: '#ecfdf5',
        items: [
            { id: 'payment_gateway', label: 'Payment Gateway', path: 'payment_gateway', icon: CreditCard },
            { id: 'bank_accounts', label: 'Bank Accounts', path: 'bank_accounts', icon: Landmark },
            { id: 'tax_rates', label: 'Tax Rates (GST/VAT)', path: 'tax_rates', icon: Percent },
            { id: 'currencies', label: 'Currencies & Rates', path: 'currencies', icon: Coins }
        ]
    },
    {
        id: 'other',
        title: 'Other Settings',
        icon: MoreHorizontal,
        color: '#475569',
        bgColor: '#f1f5f9',
        items: [
            { id: 'storage', label: 'Storage & Cloud S3', path: 'storage', icon: HardDrive },
            { id: 'ban_ip', label: 'Ban IP Address', path: 'ban_ip', icon: Ban }
        ]
    },
    {
        id: 'ai',
        title: 'AI Settings',
        icon: Bot,
        color: '#9333ea',
        bgColor: '#faf5ff',
        items: [
            { id: 'ai_helper', label: 'AI Helper Assistant', path: 'ai_helper', badge: 'ai', icon: Bot }
        ]
    }
];

// Lookup for fast mapping from URL slug to Section ID
const sectionMapping = {};
const itemMetaMapping = {};
SETTINGS_SECTIONS.forEach(sec => {
    sec.items.forEach(item => {
        sectionMapping[item.path] = sec.id;
        itemMetaMapping[item.path] = { 
            ...item, 
            sectionTitle: sec.title,
            sectionColor: sec.color,
            sectionBgColor: sec.bgColor,
            sectionIcon: sec.icon
        };
    });
});

export default function Settings() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedMobileCategory, setSelectedMobileCategory] = useState('all');

    // Responsive Mobile View Detection (<= 991px)
    const [isMobileView, setIsMobileView] = useState(() => 
        typeof window !== 'undefined' ? window.innerWidth <= 991 : false
    );
    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth <= 991);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile menu whenever route changes
    useEffect(() => {
        if (isMobileView) {
            setIsMobileMenuOpen(false);
        }
    }, [location.pathname, isMobileView]);

    const getPathSegment = () => {
        const segments = location.pathname.split('/').filter(Boolean);
        const last = segments[segments.length - 1];
        if (last === 'settings' || !last) return 'profile';
        return last;
    };

    const currentPath = getPathSegment();
    const activeSection = sectionMapping[currentPath] || 'general';

    // State of expanded sections (all open by default or expanded individually)
    const [expandedSections, setExpandedSections] = useState(() => {
        const initial = {};
        SETTINGS_SECTIONS.forEach(sec => {
            // Keep active section open or open all initially
            initial[sec.id] = true;
        });
        return initial;
    });

    // Ensure active section is open whenever the route changes
    useEffect(() => {
        if (activeSection && !expandedSections[activeSection]) {
            setExpandedSections(prev => ({ ...prev, [activeSection]: true }));
        }
    }, [activeSection]);

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const allExpanded = useMemo(() => {
        return SETTINGS_SECTIONS.every(sec => expandedSections[sec.id]);
    }, [expandedSections]);

    const toggleAllSections = () => {
        const nextState = !allExpanded;
        const updated = {};
        SETTINGS_SECTIONS.forEach(sec => {
            updated[sec.id] = nextState;
        });
        setExpandedSections(updated);
    };

    // Filtered sections based on live search query, category chip, and mobile responsiveness
    const filteredSections = useMemo(() => {
        let baseSections = isMobileView
            ? SETTINGS_SECTIONS.filter(sec => sec.id !== 'ai')
            : SETTINGS_SECTIONS;

        const q = searchQuery.trim().toLowerCase();

        // On mobile, if a specific category chip is chosen and not searching
        if (isMobileView && selectedMobileCategory !== 'all' && !q) {
            baseSections = baseSections.filter(sec => sec.id === selectedMobileCategory);
        }

        if (!q) return baseSections;

        return baseSections.map(section => {
            const matchesSection = section.title.toLowerCase().includes(q);
            const filteredItems = section.items.filter(item => 
                matchesSection ||
                item.label.toLowerCase().includes(q) ||
                item.path.toLowerCase().includes(q)
            );
            return {
                ...section,
                items: filteredItems
            };
        }).filter(section => section.items.length > 0);
    }, [searchQuery, isMobileView, selectedMobileCategory]);

    // Active item metadata for breadcrumb header
    const activeMeta = itemMetaMapping[currentPath] || { 
        label: 'Settings', 
        sectionTitle: 'General', 
        icon: SettingsIcon,
        sectionColor: '#ea580c',
        sectionBgColor: '#fff7ed'
    };
    const ActiveItemIcon = activeMeta.icon || SettingsIcon;

    return (
        <div className="settings-container">
            {/* ── Modern Premium Settings Hero Header ── */}
            <div className="settings-header-banner">
                <div className="settings-header-main">
                    <div 
                        className="settings-header-icon-box"
                        style={{ 
                            background: activeMeta.sectionBgColor || '#fff7ed', 
                            color: activeMeta.sectionColor || '#ea580c',
                            boxShadow: `0 8px 20px -4px ${(activeMeta.sectionColor || '#ea580c')}33`
                        }}
                    >
                        <ActiveItemIcon size={24} strokeWidth={2.2} />
                    </div>
                    <div>
                        <div className="settings-breadcrumbs">
                            <span className="settings-bc-root">Settings</span>
                            <ChevronRight size={13} className="settings-bc-sep" />
                            <span className="settings-bc-section" style={{ color: activeMeta.sectionColor || '#ea580c' }}>
                                {activeMeta.sectionTitle}
                            </span>
                            <ChevronRight size={13} className="settings-bc-sep" />
                            <span className="settings-bc-current">{activeMeta.label}</span>
                        </div>
                        <h1 className="settings-title">{activeMeta.label}</h1>
                        <p className="settings-desc">Manage, configure and customize your workspace preferences</p>
                    </div>
                </div>
                <div className="settings-header-meta">
                    <div className="settings-status-badge">
                        <span className="settings-status-pulse"></span>
                        <span>Live System</span>
                    </div>
                    <span className="settings-count-chip">
                        {isMobileView ? '30' : '31'} Active Modules
                    </span>
                    {isMobileView && (
                        <button 
                            type="button" 
                            className={`settings-mobile-menu-toggle-btn ${isMobileMenuOpen ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle settings menu"
                        >
                            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                            <span>{isMobileMenuOpen ? 'Close Menu' : 'Settings Menu'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Mobile-First Quick Switcher & Category Strip ── */}
            {isMobileView && (
                <div className="settings-mobile-nav-bar">
                    <button 
                        type="button" 
                        className={`settings-mobile-nav-trigger ${isMobileMenuOpen ? 'open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div className="settings-mobile-nav-left">
                            <span 
                                className="settings-mobile-nav-badge"
                                style={{ background: activeMeta.sectionBgColor || '#fff7ed', color: activeMeta.sectionColor || '#ea580c' }}
                            >
                                <ActiveItemIcon size={16} strokeWidth={2.2} />
                            </span>
                            <div className="settings-mobile-nav-labels">
                                <span className="settings-mobile-nav-section" style={{ color: activeMeta.sectionColor || '#ea580c' }}>
                                    {activeMeta.sectionTitle}
                                </span>
                                <span className="settings-mobile-nav-current">{activeMeta.label}</span>
                            </div>
                        </div>
                        <div className="settings-mobile-nav-right">
                            <span className="settings-mobile-nav-hint">{isMobileMenuOpen ? 'Hide' : 'Change'}</span>
                            <ChevronDown size={16} className={`settings-mobile-chevron ${isMobileMenuOpen ? 'rotate' : ''}`} />
                        </div>
                    </button>

                    {/* Mobile Horizontal Category Quick-Filter Bar */}
                    <div className="settings-mobile-cats-bar">
                        <button
                            type="button"
                            className={`settings-mobile-cat-pill ${selectedMobileCategory === 'all' ? 'active' : ''}`}
                            onClick={() => { setSelectedMobileCategory('all'); setIsMobileMenuOpen(true); }}
                        >
                            All ({isMobileView ? 30 : 31})
                        </button>
                        {SETTINGS_SECTIONS.filter(sec => !(isMobileView && sec.id === 'ai')).map(sec => (
                            <button
                                key={sec.id}
                                type="button"
                                className={`settings-mobile-cat-pill ${selectedMobileCategory === sec.id ? 'active' : ''} ${activeSection === sec.id ? 'active-section' : ''}`}
                                onClick={() => {
                                    setSelectedMobileCategory(sec.id);
                                    setIsMobileMenuOpen(true);
                                    setExpandedSections(prev => ({ ...prev, [sec.id]: true }));
                                }}
                            >
                                <span className="cat-pill-dot" style={{ background: sec.color }}></span>
                                {sec.title.replace(' Settings', '')}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="settings-layout">
                {/* ── Settings Navigation Sidebar ── */}
                <div className={`settings-sidebar ${isMobileView ? (isMobileMenuOpen ? 'mobile-open' : 'mobile-collapsed') : ''}`}>
                    {/* Live Search & Filter Bar */}
                    <div className="settings-sidebar-search-container">
                        <div className="settings-search-wrapper">
                            <Search className="settings-search-icon" size={14} />
                            <input
                                type="text"
                                className="settings-search-input"
                                placeholder="Search settings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="settings-search-clear" onClick={() => setSearchQuery('')} title="Clear search">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                        <div className="settings-sidebar-controls">
                            <span>{filteredSections.reduce((acc, s) => acc + s.items.length, 0)} visible</span>
                            <button type="button" className="settings-toggle-all-btn" onClick={toggleAllSections}>
                                {allExpanded ? 'Collapse All' : 'Expand All'}
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Section Categories List */}
                    <div className="settings-sidebar-scroll">
                        {filteredSections.length === 0 ? (
                            <div className="settings-sidebar-empty">
                                <Search size={22} style={{ opacity: 0.4, marginBottom: 8 }} />
                                <div>No settings matching "{searchQuery}"</div>
                            </div>
                        ) : (
                            filteredSections.map(section => {
                                const IconComponent = section.icon;
                                const isExpanded = searchQuery ? true : Boolean(expandedSections[section.id]);
                                const hasActiveChild = section.items.some(item => item.path === currentPath);

                                return (
                                    <div 
                                        className={`settings-sidebar-section ${section.id === 'ai' ? 'settings-ai-section hide-on-mobile' : ''} ${hasActiveChild ? 'has-active-child' : ''}`} 
                                        data-section={section.id} 
                                        key={section.id}
                                    >
                                        <div 
                                            className={`settings-sidebar-section-title ${hasActiveChild ? 'active' : ''}`}
                                            onClick={() => toggleSection(section.id)}
                                        >
                                            <div className="settings-sidebar-section-icon">
                                                <span className="settings-section-icon-badge" style={{ background: section.bgColor, color: section.color }}>
                                                    <IconComponent size={15} strokeWidth={2.2} />
                                                </span>
                                                <span className="settings-section-name">{section.title}</span>
                                            </div>
                                            <div className="settings-section-meta-right">
                                                <span className="settings-section-count">{section.items.length}</span>
                                                <span className={`settings-chevron-indicator ${isExpanded ? 'expanded' : ''}`}>
                                                    <ChevronDown size={14} />
                                                </span>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <ul className="settings-sidebar-list">
                                                {section.items.map(item => {
                                                    const ItemIcon = item.icon || SettingsIcon;
                                                    const isItemActive = currentPath === item.path;
                                                    return (
                                                        <li 
                                                            key={item.id}
                                                            data-item={item.id}
                                                            className={`settings-sidebar-item ${isItemActive ? 'active' : ''} ${item.id === 'ai_helper' ? 'hide-on-mobile' : ''}`}
                                                            onClick={() => {
                                                                navigate(`/settings/${item.path}`);
                                                                if (isMobileView) {
                                                                    setIsMobileMenuOpen(false);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }
                                                            }}
                                                        >
                                                            <div className="settings-item-label-group">
                                                                <ItemIcon size={14} className="settings-item-icon" />
                                                                <span>{item.label}</span>
                                                            </div>
                                                            {item.badge && (
                                                                <span className={`settings-item-badge badge-${item.badge}`}>
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Settings Content Container (Unconditional Routes for ALL Settings) ── */}
                <div className="settings-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="profile" replace />} />
                        
                        {/* 1. General Settings */}
                        <Route path="profile" element={<ProfileSettings />} />
                        <Route path="security" element={<SecuritySettings />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="connected_apps" element={<ConnectedApps />} />
                        <Route path="team_management" element={<TeamManagement />} />
                        <Route path="billing" element={<Billing />} />
                        
                        {/* 2. Website Settings */}
                        <Route path="system_settings" element={<SystemSettings />} />
                        <Route path="company_settings" element={<CompanySettings />} />
                        <Route path="localization" element={<Localization />} />
                        <Route path="prefixes" element={<Prefixes />} />
                        <Route path="preference" element={<Preference />} />
                        <Route path="social_authentication" element={<SocialAuthentication />} />
                        <Route path="language" element={<Language />} />
                        
                        {/* 3. App Settings */}
                        <Route path="invoice_settings" element={<InvoiceSettings />} />
                        <Route path="invoice_template" element={<InvoiceTemplate />} />
                        <Route path="printer" element={<Printer />} />
                        <Route path="pos_settings" element={<PosSettings />} />
                        <Route path="custom_fields" element={<CustomFields />} />
                        
                        {/* 4. System Settings */}
                        <Route path="email_settings" element={<EmailSettings />} />
                        <Route path="email_template" element={<EmailTemplate />} />
                        <Route path="sms_settings" element={<SmsSettings />} />
                        <Route path="sms_template" element={<SmsTemplate />} />
                        <Route path="otp" element={<OtpSettings />} />
                        <Route path="gdpr_cookies" element={<GdprCookies />} />
                        
                        {/* 5. Financial Settings */}
                        <Route path="payment_gateway" element={<PaymentGateway />} />
                        <Route path="bank_accounts" element={<BankAccounts />} />
                        <Route path="tax_rates" element={<TaxRates />} />
                        <Route path="currencies" element={<Currencies />} />
                        
                        {/* 6. Other Settings */}
                        <Route path="storage" element={<Storage />} />
                        <Route path="ban_ip" element={<BanIp />} />

                        {/* 7. AI Settings (Redirect to profile on mobile) */}
                        <Route path="ai_helper" element={isMobileView ? <Navigate to="/settings/profile" replace /> : <AiHelperSettings />} />

                        {/* Fallback to profile */}
                        <Route path="*" element={<Navigate to="profile" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
