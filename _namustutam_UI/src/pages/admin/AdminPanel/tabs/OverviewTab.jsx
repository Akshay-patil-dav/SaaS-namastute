import { 
    LayoutDashboard, Sparkles, FolderGit2, Wrench, Users, 
    MessageSquare, Megaphone, PhoneCall, Globe, ExternalLink,
    CheckCircle2, AlertTriangle, ArrowUpRight, Layers, RefreshCw, Star, BookOpen, Bot
} from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';

export default function OverviewTab({ setActiveTab }) {
    const { landingData, hasUnsavedChanges, toggleSectionVisibility, updateSection } = useLandingPage();
    const { hero, projects, services, team, announcement, contact, chatbot } = landingData;
    const visibility = landingData?.sectionVisibility || {};

    const stats = [
        {
            title: 'Featured Projects',
            value: projects?.length || 0,
            subtitle: 'Showcased in Bento Grid',
            icon: FolderGit2,
            color: '#6366f1',
            tab: 'projects'
        },
        {
            title: 'Active Services',
            value: services?.filter(s => s.active !== false).length || 0,
            subtitle: 'Displayed in Offerings',
            icon: Wrench,
            color: '#10b981',
            tab: 'services'
        },
        {
            title: 'AI Chatbot',
            value: chatbot?.apiKey ? 'Active' : 'Setup',
            subtitle: chatbot?.provider ? `${chatbot.provider.toUpperCase()} Engine` : 'Ready to configure',
            icon: Bot,
            color: '#a855f7',
            tab: 'chatbot'
        },
        {
            title: 'Team Members',
            value: team?.length || 0,
            subtitle: 'Engineers & Architects',
            icon: Users,
            color: '#ff620b',
            tab: 'team'
        },
        {
            title: 'Rotating Words',
            value: hero?.rotatingWords?.length || 0,
            subtitle: 'Hero Headline Animation',
            icon: Sparkles,
            color: '#8b5cf6',
            tab: 'hero'
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Top Welcome Card */}
            <div className="admin-card" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(255, 98, 11, 0.1) 100%)',
                borderColor: 'rgba(99, 102, 241, 0.25)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span className="admin-status-pill">
                                <span className="admin-status-dot" />
                                CMS Engine Active
                            </span>
                            {hasUnsavedChanges && (
                                <span className="unsaved-pill">
                                    <AlertTriangle size={14} />
                                    Unsaved Changes Pending
                                </span>
                            )}
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px', color: '#ffffff' }}>
                            Welcome to the Namustutam Landing Page Studio
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', maxWidth: '650px', lineHeight: 1.5 }}>
                            Manage hero copy, rotating words, featured portfolio projects, service catalog, team bios, and footer contact channels with real-time updates.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-secondary"
                        >
                            <span>Live Landing Page</span>
                            <ExternalLink size={15} />
                        </a>
                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={() => setActiveTab('hero')}
                        >
                            <span>Edit Hero Section</span>
                            <ArrowUpRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick KPI Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '18px'
            }}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className="admin-card"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
                            onClick={() => setActiveTab(stat.tab)}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = stat.color}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {stat.title}
                                    </span>
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', margin: '6px 0 2px' }}>
                                        {stat.value}
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                                        {stat.subtitle}
                                    </span>
                                </div>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: `${stat.color}1a`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: stat.color
                                }}>
                                    <Icon size={22} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Section Visibility Toggles */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h3 className="admin-card-title" style={{ margin: 0 }}>
                                <Layers size={18} color="#ff620b" />
                                Website Sections Visibility & Layout
                            </h3>
                            <span className="admin-status-pill" style={{ fontSize: '11px', padding: '2px 8px' }}>
                                Live Toggles
                            </span>
                        </div>
                        <div className="admin-card-subtitle">
                            Toggle individual sections on or off to immediately show or hide them from public visitors.
                        </div>
                    </div>
                    <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => setActiveTab('sections')}
                        style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                        <span>Full Section Manager</span>
                        <ArrowUpRight size={14} />
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px'
                }}>
                    {[
                        { key: 'announcement', name: 'Announcement Bar', icon: Megaphone, color: '#ff620b', defaultVal: false },
                        { key: 'hero', name: 'Hero & Dynamic Copy', icon: Sparkles, color: '#8b5cf6', defaultVal: true },
                        { key: 'sdlc', name: 'SDLC Process Roadmap', icon: RefreshCw, color: '#06b6d4', defaultVal: true },
                        { key: 'services', name: 'Services Catalog', icon: Wrench, color: '#10b981', defaultVal: true },
                        { key: 'projects', name: 'Portfolio Showcase', icon: FolderGit2, color: '#6366f1', defaultVal: true },
                        { key: 'testimonials', name: 'Client Reviews', icon: Star, color: '#f59e0b', defaultVal: true },
                        { key: 'team', name: 'Engineering Team', icon: Users, color: '#ec4899', defaultVal: true },
                        { key: 'marquee', name: 'Infinite Marquee', icon: Megaphone, color: '#3b82f6', defaultVal: true },
                        { key: 'blogs', name: 'Blog Publications', icon: BookOpen, color: '#14b8a6', defaultVal: true },
                        { key: 'contact', name: 'Footer & Channels', icon: PhoneCall, color: '#ea580c', defaultVal: true }
                    ].map(item => {
                        const Icon = item.icon;
                        const isVis = visibility[item.key] !== undefined ? Boolean(visibility[item.key]) : item.defaultVal;
                        return (
                            <div
                                key={item.key}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 14px',
                                    borderRadius: '12px',
                                    background: isVis ? 'rgba(15, 23, 42, 0.7)' : 'rgba(15, 23, 42, 0.35)',
                                    border: `1px solid ${isVis ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.2)'}`,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: `${item.color}15`,
                                        color: item.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: isVis ? '#ffffff' : '#94a3b8' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ fontSize: '10.5px', color: isVis ? '#34d399' : '#f87171', fontWeight: '600' }}>
                                            {isVis ? '● Active' : '○ Hidden'}
                                        </div>
                                    </div>
                                </div>

                                <label className="admin-switch" style={{ margin: 0, transform: 'scale(0.85)' }}>
                                    <input
                                        type="checkbox"
                                        checked={isVis}
                                        onChange={() => {
                                            toggleSectionVisibility(item.key);
                                            if (item.key === 'announcement' && announcement) {
                                                updateSection('announcement', { ...announcement, enabled: !isVis });
                                            }
                                        }}
                                    />
                                    <span className="admin-switch-slider" />
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hero & Announcement Live Snapshot */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {/* Hero Snapshot */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <h3 className="admin-card-title">
                                <Sparkles size={18} color="#8b5cf6" />
                                Current Hero Headline
                            </h3>
                            <div className="admin-card-subtitle">Snapshot of the primary visitor viewport</div>
                        </div>
                        <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => setActiveTab('hero')}
                        >
                            Configure
                        </button>
                    </div>

                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(255, 140, 66, 0.12)',
                            color: '#ff8c42',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            width: 'fit-content'
                        }}>
                            {hero?.badge || 'Freelance Software Developer • IT Solutions'}
                        </div>

                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', lineHeight: 1.3 }}>
                            {hero?.titlePrefix || 'Building Digital'}{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #ff8c42 0%, #ff620b 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {hero?.rotatingWords?.[0] || 'Excellence'}
                            </span>{' '}
                            {hero?.titleSuffix || 'For Modern Businesses'}
                        </div>

                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                            {hero?.subtitle}
                        </p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                            <span style={{
                                background: '#ff620b',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600'
                            }}>
                                {hero?.primaryBtnText || 'View Our Work'}
                            </span>
                            <span style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#cbd5e1',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600'
                            }}>
                                {hero?.secondaryBtnText || 'Discuss Your Project'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Announcement Banner & Contact Summary */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <h3 className="admin-card-title">
                                <Megaphone size={18} color="#ff620b" />
                                Announcement & Channels
                            </h3>
                            <div className="admin-card-subtitle">Global banners & contact points</div>
                        </div>
                        <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => setActiveTab('marquee')}
                        >
                            Configure
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{
                            padding: '14px',
                            borderRadius: '12px',
                            background: announcement?.enabled ? 'rgba(255, 98, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${announcement?.enabled ? 'rgba(255, 98, 11, 0.35)' : 'rgba(255, 255, 255, 0.06)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: announcement?.enabled ? '#ff9666' : '#64748b' }}>
                                    Top Announcement Bar
                                </span>
                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#ffffff', marginTop: '3px' }}>
                                    {announcement?.enabled ? announcement.text : 'Currently Disabled'}
                                </div>
                            </div>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: '9999px',
                                background: announcement?.enabled ? '#10b98126' : '#64748b26',
                                color: announcement?.enabled ? '#34d399' : '#94a3b8'
                            }}>
                                {announcement?.enabled ? 'LIVE' : 'OFF'}
                            </span>
                        </div>

                        <div style={{
                            padding: '14px',
                            borderRadius: '12px',
                            background: 'rgba(15, 23, 42, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            fontSize: '13px',
                            color: '#cbd5e1'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Support Email:</span>
                                <strong>{contact?.email || 'namustutam@gmail.com'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Phone / WhatsApp:</span>
                                <strong>{contact?.phone || '+91 98765 43210'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Headquarters / Model:</span>
                                <strong>{contact?.location || 'Remote / Global'}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
