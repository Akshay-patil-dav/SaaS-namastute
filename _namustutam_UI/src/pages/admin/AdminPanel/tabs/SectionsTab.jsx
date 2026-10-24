import React, { useState } from 'react';
import { 
    Layers, Eye, EyeOff, Sparkles, FolderGit2, Wrench, RefreshCw, 
    Users, Star, Megaphone, PhoneCall, BookOpen, ExternalLink,
    CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Check, Bot
} from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';

const SECTION_DEFINITIONS = [
    {
        key: 'announcement',
        title: 'Top Announcement Bar',
        category: 'Banner & Alerts',
        description: 'Urgent notices, promo badges, and special announcements displayed at the very top of the page above the navbar.',
        icon: Megaphone,
        color: '#ff620b',
        targetTab: 'marquee',
        badge: 'Top Viewport',
        defaultVisible: false
    },
    {
        key: 'hero',
        title: 'Hero & Dynamic Headline',
        category: 'Introduction',
        description: 'Primary landing viewport with animated rotating keywords, floating mockup cards, tech icons, and main call-to-action buttons.',
        icon: Sparkles,
        color: '#8b5cf6',
        targetTab: 'hero',
        badge: 'Above The Fold',
        defaultVisible: true
    },
    {
        key: 'sdlc',
        title: 'SDLC Process Roadmap',
        category: 'Engineering Architecture',
        description: 'Interactive 8-stage software delivery lifecycle illustrating the engineering flow from ideation to scaling.',
        icon: RefreshCw,
        color: '#06b6d4',
        targetTab: 'sdlc',
        badge: 'Technical Process',
        defaultVisible: true
    },
    {
        key: 'services',
        title: 'Engineering Capabilities & Services',
        category: 'Offerings Catalog',
        description: 'Grid of specialized service solutions: Web Development, SaaS Platforms, UI/UX Design, AI Automation, and Support.',
        icon: Wrench,
        color: '#10b981',
        targetTab: 'services',
        badge: 'Core Services',
        defaultVisible: true
    },
    {
        key: 'projects',
        title: 'Showcase Projects (Portfolio)',
        category: 'Works & Case Studies',
        description: 'High-visibility Bento Grid highlighting completed client products, tech stacks, live links, and interactive modals.',
        icon: FolderGit2,
        color: '#6366f1',
        targetTab: 'projects',
        badge: 'Portfolio Grid',
        defaultVisible: true
    },
    {
        key: 'testimonials',
        title: 'Client Reviews & Social Proof',
        category: 'Trust & Reputation',
        description: 'Verified reviews, 5-star satisfaction ratings, and founder testimonials demonstrating proven reliability.',
        icon: Star,
        color: '#f59e0b',
        targetTab: 'testimonials',
        badge: 'Social Proof',
        defaultVisible: true
    },
    {
        key: 'team',
        title: 'Engineering Team & Leadership',
        category: 'Founders & Roster',
        description: 'Profiles of lead software engineers, tech architects, and domain experts along with social channels.',
        icon: Users,
        color: '#ec4899',
        targetTab: 'team',
        badge: 'Core Team',
        defaultVisible: true
    },
    {
        key: 'marquee',
        title: 'Infinite Growth Marquee Ribbon',
        category: 'Brand Ticker',
        description: 'Dynamic flowing marquee ticker streaming technology keywords, core skills, and service tags across the screen.',
        icon: Megaphone,
        color: '#3b82f6',
        targetTab: 'marquee',
        badge: 'Infinite Ticker',
        defaultVisible: true
    },
    {
        key: 'blogs',
        title: 'Blog Articles & Tech Insights',
        category: 'Publications CMS',
        description: 'Interactive articles preview grid featuring modern software publications, categories, tags, and reading times.',
        icon: BookOpen,
        color: '#14b8a6',
        targetTab: 'blogs',
        badge: 'Insights & CMS',
        defaultVisible: true
    },
    {
        key: 'contact',
        title: 'Website Footer & Contact Details',
        category: 'Footer & Channels',
        description: 'Full-width footer with brand identity, quick links, global office locations, support channels, and direct inquiry touchpoints.',
        icon: PhoneCall,
        color: '#ea580c',
        targetTab: 'contact',
        badge: 'Footer & Inquiries',
        defaultVisible: true
    },
    {
        key: 'chatbot',
        title: 'AI Chatbot Assistant Widget',
        category: 'Interactive & AI',
        description: 'Floating intelligent AI chatbot widget on the bottom-right of the website powered dynamically by Groq, Gemini, or OpenAI.',
        icon: Bot,
        color: '#7c3aed',
        targetTab: 'chatbot',
        badge: 'Floating AI Widget',
        defaultVisible: true
    }
];

export default function SectionsTab({ setActiveTab }) {
    const { 
        landingData, 
        toggleSectionVisibility, 
        setSectionVisibility,
        updateSection 
    } = useLandingPage();

    const [filter, setFilter] = useState('all'); // 'all', 'visible', 'hidden'
    const [search, setSearch] = useState('');

    const visibility = landingData?.sectionVisibility || {};

    const isSectionVisible = (key, def = true) => {
        if (visibility[key] !== undefined) return Boolean(visibility[key]);
        return def;
    };

    const handleToggle = (key) => {
        const currentlyVisible = isSectionVisible(key);
        toggleSectionVisibility(key);

        if (key === 'announcement' && landingData?.announcement) {
            updateSection('announcement', {
                ...landingData.announcement,
                enabled: !currentlyVisible
            });
        }
    };

    const handleEnableAll = () => {
        SECTION_DEFINITIONS.forEach(sec => {
            setSectionVisibility(sec.key, true);
            if (sec.key === 'announcement' && landingData?.announcement) {
                updateSection('announcement', { ...landingData.announcement, enabled: true });
            }
        });
    };

    const handleRestoreDefaults = () => {
        SECTION_DEFINITIONS.forEach(sec => {
            setSectionVisibility(sec.key, sec.defaultVisible);
            if (sec.key === 'announcement' && landingData?.announcement) {
                updateSection('announcement', { ...landingData.announcement, enabled: sec.defaultVisible });
            }
        });
    };

    // Metrics
    const totalCount = SECTION_DEFINITIONS.length;
    const visibleCount = SECTION_DEFINITIONS.filter(s => isSectionVisible(s.key, s.defaultVisible)).length;
    const hiddenCount = totalCount - visibleCount;

    // Filtered list
    const filteredSections = SECTION_DEFINITIONS.filter(sec => {
        const isVis = isSectionVisible(sec.key, sec.defaultVisible);
        if (filter === 'visible' && !isVis) return false;
        if (filter === 'hidden' && isVis) return false;
        if (search.trim()) {
            const query = search.toLowerCase();
            return (
                sec.title.toLowerCase().includes(query) ||
                sec.description.toLowerCase().includes(query) ||
                sec.category.toLowerCase().includes(query)
            );
        }
        return true;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Top Stat & Control Hero */}
            <div className="admin-card" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
                borderColor: 'rgba(99, 102, 241, 0.25)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span className="admin-status-pill">
                                <span className="admin-status-dot" />
                                Layout Controller Active
                            </span>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                background: 'rgba(255, 98, 11, 0.15)',
                                color: '#ff8c42',
                                border: '1px solid rgba(255, 98, 11, 0.3)'
                            }}>
                                Real-Time View Toggle
                            </span>
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px', color: '#ffffff' }}>
                            Website Section Visibility Manager
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', maxWidth: '680px', lineHeight: 1.5 }}>
                            Enable or disable individual sections of the public landing page with one click. Hidden sections are completely stripped from visitor view without deleting your configured content.
                        </p>
                    </div>

                    {/* Quick Stats Badges */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '12px 18px',
                            textAlign: 'center',
                            minWidth: '100px'
                        }}>
                            <div style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff' }}>{totalCount}</div>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Total</div>
                        </div>

                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '12px',
                            padding: '12px 18px',
                            textAlign: 'center',
                            minWidth: '100px'
                        }}>
                            <div style={{ fontSize: '22px', fontWeight: '800', color: '#34d399' }}>{visibleCount}</div>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#34d399', textTransform: 'uppercase' }}>Visible</div>
                        </div>

                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '12px',
                            padding: '12px 18px',
                            textAlign: 'center',
                            minWidth: '100px'
                        }}>
                            <div style={{ fontSize: '22px', fontWeight: '800', color: '#f87171' }}>{hiddenCount}</div>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#f87171', textTransform: 'uppercase' }}>Hidden</div>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions & Filter Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px',
                    marginTop: '22px',
                    paddingTop: '18px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <button
                                type="button"
                                onClick={() => setFilter('all')}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    background: filter === 'all' ? '#ff620b' : 'transparent',
                                    color: filter === 'all' ? '#ffffff' : '#94a3b8',
                                    transition: 'all 0.2s'
                                }}
                            >
                                All ({totalCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter('visible')}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    background: filter === 'visible' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                                    color: filter === 'visible' ? '#34d399' : '#94a3b8',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Visible ({visibleCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter('hidden')}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    background: filter === 'hidden' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                                    color: filter === 'hidden' ? '#f87171' : '#94a3b8',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Hidden ({hiddenCount})
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Search sections..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: '#ffffff',
                                borderRadius: '10px',
                                padding: '8px 14px',
                                fontSize: '13px',
                                outline: 'none',
                                width: '200px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={handleRestoreDefaults}
                            style={{ fontSize: '12.5px', padding: '8px 14px' }}
                            title="Reset section visibility to standard recommendations"
                        >
                            Reset Defaults
                        </button>
                        <button
                            type="button"
                            className="admin-btn admin-btn-primary"
                            onClick={handleEnableAll}
                            style={{ fontSize: '12.5px', padding: '8px 14px' }}
                        >
                            <Check size={14} />
                            <span>Enable All Sections</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sections Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '20px'
            }}>
                {filteredSections.map((sec) => {
                    const Icon = sec.icon;
                    const isVisible = isSectionVisible(sec.key, sec.defaultVisible);

                    return (
                        <div
                            key={sec.key}
                            className="admin-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s ease',
                                borderColor: isVisible ? 'rgba(255, 255, 255, 0.12)' : 'rgba(239, 68, 68, 0.25)',
                                background: isVisible ? 'rgba(15, 23, 42, 0.65)' : 'rgba(15, 23, 42, 0.4)',
                                opacity: isVisible ? 1 : 0.78,
                                padding: '22px'
                            }}
                        >
                            {/* Card Top: Header & Toggle */}
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: `${sec.color}18`,
                                            color: sec.color,
                                            border: `1px solid ${sec.color}35`,
                                            flexShrink: 0
                                        }}>
                                            <Icon size={22} />
                                        </div>

                                        <div>
                                            <div style={{
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: sec.color,
                                                marginBottom: '2px'
                                            }}>
                                                {sec.category}
                                            </div>
                                            <h3 style={{
                                                fontSize: '16.5px',
                                                fontWeight: '800',
                                                color: '#ffffff',
                                                margin: 0,
                                                lineHeight: 1.3
                                            }}>
                                                {sec.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                        <label className="admin-switch" style={{ margin: 0 }}>
                                            <input 
                                                type="checkbox" 
                                                checked={isVisible} 
                                                onChange={() => handleToggle(sec.key)}
                                            />
                                            <span className="admin-switch-slider" />
                                        </label>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: isVisible ? '#34d399' : '#f87171'
                                        }}>
                                            {isVisible ? 'ENABLED' : 'DISABLED'}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p style={{
                                    fontSize: '13px',
                                    color: '#94a3b8',
                                    lineHeight: 1.5,
                                    margin: '0 0 16px',
                                    minHeight: '40px'
                                }}>
                                    {sec.description}
                                </p>
                            </div>

                            {/* Card Footer: Status Pill & Jump To Tab Button */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '14px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: isVisible ? '#10b981' : '#64748b',
                                        boxShadow: isVisible ? '0 0 8px #10b981' : 'none'
                                    }} />
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: isVisible ? '#cbd5e1' : '#64748b'
                                    }}>
                                        {isVisible ? 'Visible on Public Web' : 'Hidden from Public Web'}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab(sec.targetTab)}
                                    className="admin-btn admin-btn-secondary"
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <span>Edit Content</span>
                                    <ArrowRight size={13} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Persistence & Save Reminder Card */}
            <div className="admin-card" style={{
                background: 'linear-gradient(135deg, rgba(255, 98, 11, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
                borderColor: 'rgba(255, 98, 11, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(255, 98, 11, 0.2)',
                        color: '#ff620b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 3px', color: '#ffffff', fontSize: '15px', fontWeight: '700' }}>
                            Instant Preview & Database Sync
                        </h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>
                            Toggling a switch immediately updates your browser preview. To make your changes permanent and visible to all worldwide visitors, click <strong>"Save & Publish"</strong> in the top right header.
                        </p>
                    </div>
                </div>

                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    <span>View Public Website</span>
                    <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}
