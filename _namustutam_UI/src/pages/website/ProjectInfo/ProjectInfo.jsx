import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsData } from '../../../data/projectsData';
import { useLandingPage } from '../../../context/LandingPageContext';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import {
    ExternalLink, Github, ArrowLeft, ArrowRight,
    CheckCircle2, Tag, Code2, Globe, Zap, Star,
    Share2, Twitter, Linkedin, Copy, MessageCircle,
    Clock, Shield, Wrench, ChevronDown, Check,
    Layers, Cpu, Sparkles, Monitor, X
} from 'lucide-react';
import './ProjectInfo.css';

// Slug helper — must match ProjectWorks and landing page navigation
const toSlug = (title) =>
    (title || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

// Merge static + admin projects and normalize fields
function buildAllProjects(adminProjects, staticProjects) {
    const adminNormalized = (adminProjects || []).map(p => ({
        id: p.id,
        title: p.title || 'Untitled Project',
        author: p.author || 'Namustutam',
        category: p.category || 'Premium',
        filter: p.filter || 'Web App',
        price: p.price || 'Contact Us',
        img: p.img || '',
        techStack: Array.isArray(p.techStack)
            ? p.techStack.map(t => (typeof t === 'string' ? { name: t, color: '#ff5b00' } : t))
            : [],
        description: p.description || '',
        liveLink: p.liveLink || '#',
        githubLink: p.githubLink || '',
        featured: p.featured || false,
        isAdminProject: true,
        // Dynamic project details configured via Admin Panel
        architectureDescription: p.architectureDescription || '',
        whatsIncluded: Array.isArray(p.whatsIncluded) ? p.whatsIncluded : (typeof p.whatsIncluded === 'string' ? p.whatsIncluded.split('\n').filter(Boolean) : null),
        features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? p.features.split('\n').filter(Boolean) : null),
        licenseTier: p.licenseTier || 'Single End Product',
        licenseTerms: Array.isArray(p.licenseTerms) ? p.licenseTerms : (typeof p.licenseTerms === 'string' ? p.licenseTerms.split('\n').filter(Boolean) : null),
        faqs: Array.isArray(p.faqs) && p.faqs.length > 0 ? p.faqs : null,
    }));

    const staticNormalized = (staticProjects || []).map((p, i) => ({
        id: `static-${i}`,
        title: p.title || 'Untitled',
        author: p.author || 'Freelancer',
        category: p.category || 'NEW',
        filter: p.filter || 'Project',
        price: p.price || 'Free',
        img: p.img || '',
        techStack: Array.isArray(p.techStack)
            ? p.techStack.map(t => (typeof t === 'string' ? { name: t, color: '#ff5b00' } : t))
            : [],
        description: p.description || '',
        liveLink: p.liveLink || '#',
        githubLink: p.githubLink || '',
        featured: false,
        isAdminProject: false,
    }));

    // Admin projects take priority; de-duplicate by title
    const seen = new Set(adminNormalized.map(p => p.title.toLowerCase().trim()));
    const merged = [
        ...adminNormalized,
        ...staticNormalized.filter(p => !seen.has(p.title.toLowerCase().trim()))
    ];
    return merged;
}

// Extended FAQ list per project
const DEFAULT_FAQS = [
    {
        q: 'Can I use this for multiple clients?',
        a: 'Standard licenses are single-use. Each client website requires a separate license. Contact us for bulk / agency pricing.'
    },
    {
        q: 'Do I need coding knowledge to customize it?',
        a: 'No. The template is built to be fully manageable without touching code. For deeper customization, our team is available for hourly support.'
    },
    {
        q: 'Will I receive future updates?',
        a: 'Yes. All purchased templates include 6 months of free updates. Extended update plans are available.'
    },
    {
        q: 'Is there a refund policy?',
        a: 'Due to the digital nature of our products, all sales are final. If you experience genuine technical issues, our support team will resolve them promptly.'
    },
    {
        q: 'Can I request custom modifications?',
        a: 'Absolutely. We offer custom development packages. Reach out via the contact page with your requirements for a quote.'
    }
];

// Feature highlights by category
const CATEGORY_FEATURES = {
    'E-Commerce': ['Product Catalog & Variants', 'Cart & Checkout Flow', 'Payment Gateway Ready', 'Admin Dashboard', 'SEO Optimized', 'Mobile First Design'],
    'SaaS Project': ['Multi-Tenant Architecture', 'JWT Authentication', 'Role-Based Access', 'REST API', 'PostgreSQL Backend', 'Real-Time Updates'],
    'Business Page': ['Responsive Design', 'Contact Forms', 'SEO Metadata', 'Performance Optimized', 'Cross-Browser Tested', 'Google Analytics Ready'],
    'Web Application': ['Component Library', 'State Management', 'API Integration', 'Lazy Loading', 'PWA Ready', 'Dark Mode Support'],
    default: ['Modern UI/UX', 'Responsive Design', 'Cross-Browser Compatible', 'Performance Optimized', 'SEO Ready', 'Easy Customization'],
};

export default function ProjectInfo() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { landingData } = useLandingPage();
    const [activeTab, setActiveTab] = useState('overview');
    const [activeFaq, setActiveFaq] = useState(null);
    const [copied, setCopied] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const shareDropdownRef = useRef(null);

    // Merge admin + static projects
    const allProjects = useMemo(
        () => buildAllProjects(landingData?.projects, projectsData),
        [landingData?.projects]
    );

    // Find the current project by slug or ID
    const project = useMemo(
        () => allProjects.find(p => toSlug(p.title) === slug || p.id === slug || toSlug(p.id) === slug),
        [allProjects, slug]
    );

    // Similar projects (same filter, different title)
    const similarProjects = useMemo(
        () => allProjects.filter(p => p.title !== project?.title && p.filter === project?.filter).slice(0, 3),
        [allProjects, project]
    );
    const otherProjects = useMemo(
        () => allProjects.filter(p => p.title !== project?.title).slice(0, 3),
        [allProjects, project]
    );
    const displaySimilar = similarProjects.length >= 2 ? similarProjects : otherProjects;

    // Features for this project's category
    const features = CATEGORY_FEATURES[project?.filter] || CATEGORY_FEATURES.default;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (project) {
            document.title = `${project.title} | Namustutam Portfolio`;
        } else {
            document.title = 'Project Not Found | Namustutam';
        }
    }, [project]);

    // Close share popover on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target)) {
                setShareOpen(false);
            }
        }
        if (shareOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [shareOpen]);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out ${project?.title || 'this project'} on Namustutam!`;

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            }).catch(() => {
                setCopied(false);
            });
        }
    };

    const shareOnWhatsApp = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    };

    const shareOnTwitter = () =>
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');

    const shareOnLinkedIn = () =>
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');

    const shareOnNative = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: project?.title || 'Project Showcase',
                    text: shareText,
                    url: shareUrl,
                });
            } catch {
                // user cancelled
            }
        } else {
            handleCopyLink();
        }
    };

    if (!project) {
        return (
            <div className="pi-root pi-not-found">
                <WebsiteNavbar />
                <div className="pi-404-body">
                    <div className="pi-404-icon">🔍</div>
                    <h1>Project Not Found</h1>
                    <p>The project you're looking for doesn't exist or may have been moved.</p>
                    <div className="pi-404-actions">
                        <button className="pi-btn-primary" onClick={() => navigate('/project-works')}>
                            <ArrowLeft size={16} /> View All Projects
                        </button>
                        <button className="pi-btn-ghost" onClick={() => navigate('/')}>
                            Go Home
                        </button>
                    </div>
                </div>
                <WebsiteFooter />
            </div>
        );
    }

    return (
        <div className="pi-root">
            <WebsiteNavbar />

            {/* ── Hero Banner ── */}
            <section className="pi-hero-banner">
                <div className="pi-hero-bg" style={{ backgroundImage: project.img ? `url(${project.img})` : 'none' }} />
                <div className="pi-hero-overlay" />
                <div className="pi-hero-ambient-glow" />
                
                <div className="pi-hero-content">
                    {/* Top Navigation & Back Button */}
                    <div className="pi-hero-nav-bar">
                        <nav className="pi-breadcrumb">
                            <Link to="/">Home</Link>
                            <span>/</span>
                            <Link to="/#portfolio">Showcase</Link>
                            <span>/</span>
                            <span className="pi-breadcrumb-current">{project.filter || 'Project'}</span>
                        </nav>

                        {/* Top Right Action Buttons */}
                        <div className="pi-hero-nav-actions" ref={shareDropdownRef}>
                            <button
                                type="button"
                                className="pi-back-btn"
                                onClick={() => {
                                    if (window.history.length > 1) {
                                        navigate(-1);
                                    } else {
                                        navigate('/#portfolio');
                                    }
                                }}
                                title="Return to projects showcase"
                            >
                                <ArrowLeft size={14} />
                                <span>Back to Showcase</span>
                            </button>

                            {/* Share Project with Popover Menu */}
                            <div className="pi-share-dropdown-wrapper">
                                <button
                                    type="button"
                                    className={`pi-share-pill-btn ${shareOpen ? 'active' : ''}`}
                                    onClick={() => setShareOpen(prev => !prev)}
                                    title="Share this project"
                                    aria-expanded={shareOpen}
                                >
                                    <Share2 size={14} />
                                    <span>Share Project</span>
                                </button>

                                {shareOpen && (
                                    <div className="pi-share-popover">
                                        <div className="pi-share-popover-header">
                                            <div className="pi-share-title">
                                                <Share2 size={15} color="#ff5b00" />
                                                <span>Share This Project</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="pi-share-close-btn"
                                                onClick={() => setShareOpen(false)}
                                                title="Close"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>

                                        <p className="pi-share-subtext">Copy project link or share across your network</p>

                                        {/* Copy Link Input & Button */}
                                        <div className="pi-share-copy-box">
                                            <input
                                                type="text"
                                                readOnly
                                                value={shareUrl}
                                                className="pi-share-url-input"
                                                onClick={(e) => e.target.select()}
                                            />
                                            <button
                                                type="button"
                                                className={`pi-share-copy-btn ${copied ? 'copied' : ''}`}
                                                onClick={handleCopyLink}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check size={13} />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={13} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Social Channels Grid */}
                                        <div className="pi-share-options-grid">
                                            <button
                                                type="button"
                                                className="pi-share-opt-btn whatsapp"
                                                onClick={shareOnWhatsApp}
                                            >
                                                <MessageCircle size={15} />
                                                <span>WhatsApp</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="pi-share-opt-btn twitter"
                                                onClick={shareOnTwitter}
                                            >
                                                <Twitter size={15} />
                                                <span>Twitter (X)</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="pi-share-opt-btn linkedin"
                                                onClick={shareOnLinkedIn}
                                            >
                                                <Linkedin size={15} />
                                                <span>LinkedIn</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="pi-share-opt-btn native"
                                                onClick={shareOnNative}
                                            >
                                                <Globe size={15} />
                                                <span>{typeof navigator !== 'undefined' && navigator.share ? 'More Apps' : 'Share'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pi-hero-header">
                        <div className="pi-hero-badge">
                            <span className="pi-badge-dot" />
                            <span>{project.category === 'NEW' ? 'Featured Work' : (project.category || 'Premium Project')}</span>
                        </div>
                        <h1 className="pi-hero-title">{project.title}</h1>
                        <p className="pi-hero-sub">{project.description}</p>
                    </div>

                    <div className="pi-hero-meta">
                        <div className="pi-meta-item">
                            <Tag size={14} />
                            <span>{project.filter || 'Web Solution'}</span>
                        </div>
                        <div className="pi-meta-item">
                            <Code2 size={14} />
                            <span>{project.techStack?.length || 3} Core Technologies</span>
                        </div>
                        <div className="pi-meta-item">
                            <Star size={14} />
                            <span>Crafted by {project.author || 'Namustutam'}</span>
                        </div>
                        <div className="pi-meta-item">
                            <Shield size={14} />
                            <span>Production Ready</span>
                        </div>
                        {project.liveLink && project.liveLink !== '#' && (
                            <div className="pi-meta-item pi-meta-item-live">
                                <span className="pi-meta-live-dot" />
                                <span>Live Demo Online</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Main Layout ── */}
            <main className="pi-main">
                <div className="pi-layout">

                    {/* ── LEFT COLUMN: Image Showcase & Tabs ── */}
                    <div className="pi-left">

                        {/* Project Image Preview Showcase */}
                        <div className="pi-browser-frame">
                            <div className={`pi-img-showcase ${imgLoaded ? 'loaded' : ''}`}>
                                {!imgLoaded && <div className="pi-img-skeleton" />}
                                {project.img ? (
                                    <img
                                        src={project.img}
                                        alt={`${project.title} preview`}
                                        onLoad={() => setImgLoaded(true)}
                                        style={{ opacity: imgLoaded ? 1 : 0 }}
                                    />
                                ) : (
                                    <div className="pi-img-placeholder">
                                        <Code2 size={64} color="#ff5b00" />
                                        <span>Full Interactive Demonstration Available</span>
                                    </div>
                                )}
                                {project.liveLink && project.liveLink !== '#' && (
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pi-img-live-btn"
                                    >
                                        <span className="live-dot" />
                                        <ExternalLink size={14} /> Open Live Site
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="pi-tabs-wrapper">
                            <div className="pi-tabs">
                                {[
                                    { id: 'overview', label: 'Overview', shortLabel: 'Overview', icon: Globe },
                                    { id: 'features', label: 'Features', shortLabel: 'Features', icon: Zap },
                                    { id: 'tech', label: 'Tech Stack', shortLabel: 'Tech', icon: Code2 },
                                    { id: 'license', label: 'License & Rights', shortLabel: 'License', icon: Shield },
                                    { id: 'faq', label: 'FAQ', shortLabel: 'FAQ', icon: MessageCircle },
                                ].map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            className={`pi-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            <Icon size={16} />
                                            <span className="pi-tab-label-full">{tab.label}</span>
                                            <span className="pi-tab-label-short">{tab.shortLabel}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── OVERVIEW TAB ── */}
                        {activeTab === 'overview' && (
                            <div className="pi-tab-content pi-animate-in">
                                <div className="pi-overview-intro">
                                    <h2>Architecture & Purpose</h2>
                                    <p>{project.description || 'A modern, beautifully crafted digital solution built to the highest standards of performance and design.'}</p>
                                    <p>
                                        {project.architectureDescription || (
                                            <>
                                                This project was designed and engineered by <strong>{project.author || 'Namustutam'}</strong> as part of the official Namustutam engineering portfolio.
                                                It exemplifies modern enterprise best-practices: clean modular component hierarchy, responsive touch-optimized layout, rigorous typing, and rapid page-load times.
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="pi-highlights-grid">
                                    <div className="pi-highlight-card">
                                        <div className="pi-highlight-icon-box" style={{ background: '#fff5ed', color: '#ff5b00' }}>
                                            <Zap size={22} />
                                        </div>
                                        <h4>Performance First</h4>
                                        <p>Engineered for Google Core Web Vitals with lazy loading, asset compression, and optimal rendering performance.</p>
                                    </div>
                                    <div className="pi-highlight-card">
                                        <div className="pi-highlight-icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                                            <Shield size={22} />
                                        </div>
                                        <h4>Production Ready</h4>
                                        <p>Comprehensive error handling, secure endpoints, and ready for deployment to Vercel, AWS, or private servers.</p>
                                    </div>
                                    <div className="pi-highlight-card">
                                        <div className="pi-highlight-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
                                            <Wrench size={22} />
                                        </div>
                                        <h4>Modular & Customizable</h4>
                                        <p>Clean design tokens and organized folder structure make branding and feature extension seamless.</p>
                                    </div>
                                    <div className="pi-highlight-card">
                                        <div className="pi-highlight-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                                            <Clock size={22} />
                                        </div>
                                        <h4>Fast Turnaround</h4>
                                        <p>Pre-structured components and automated pipelines reduce time-to-market by up to 60%.</p>
                                    </div>
                                </div>

                                {/* What's Included Box */}
                                <div className="pi-included-box">
                                    <div className="pi-included-header">
                                        <Sparkles size={20} color="#ff5b00" />
                                        <h3>What's Included in This Package</h3>
                                    </div>
                                    <div className="pi-included-grid">
                                        {(project.whatsIncluded && project.whatsIncluded.length > 0
                                            ? project.whatsIncluded
                                            : [
                                                'Full Frontend & Component Source Code',
                                                'Complete API Integration Guide & Docs',
                                                'Responsive Mobile, Tablet & Desktop Layouts',
                                                '6 Months Bug Fixes & Setup Assistance'
                                            ]
                                        ).map((item, idx) => (
                                            <div key={idx} className="pi-included-item">
                                                <CheckCircle2 size={16} color="#10b981" />
                                                <span>{typeof item === 'string' ? item : item.text || item.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── FEATURES TAB ── */}
                        {activeTab === 'features' && (
                            <div className="pi-tab-content pi-animate-in">
                                <h2>Key Capabilities & Features</h2>
                                <p className="pi-tab-subtitle">
                                    Everything included in this {project.filter || 'project'} — tested, tuned, and ready to deploy.
                                </p>
                                <div className="pi-features-grid">
                                    {(project.features && project.features.length > 0 ? project.features : features).map((feature, i) => (
                                        <div key={i} className="pi-feature-item">
                                            <div className="pi-feature-check">
                                                <CheckCircle2 size={18} color="#ff5b00" />
                                            </div>
                                            <div className="pi-feature-text">
                                                <h4>{typeof feature === 'string' ? feature : feature.title || feature.name}</h4>
                                                <p>{typeof feature === 'object' && feature.desc ? feature.desc : 'Built with reliable architecture and comprehensive responsiveness.'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pi-feature-callout">
                                    <Star size={18} color="#d97706" />
                                    <span>All features listed are fully unlocked and ready out of the box — zero hidden subscriptions.</span>
                                </div>
                            </div>
                        )}

                        {/* ── TECH STACK TAB ── */}
                        {activeTab === 'tech' && (
                            <div className="pi-tab-content pi-animate-in">
                                <h2>Modern Technologies & Libraries</h2>
                                <p className="pi-tab-subtitle">
                                    Engineered with modern, widely adopted frameworks to guarantee longevity and ease of maintenance.
                                </p>
                                {project.techStack && project.techStack.length > 0 ? (
                                    <div className="pi-tech-grid">
                                        {project.techStack.map((tech, i) => {
                                            const name = typeof tech === 'string' ? tech : tech.name;
                                            const color = tech.color || '#ff5b00';
                                            return (
                                                <div key={i} className="pi-tech-card">
                                                    <div className="pi-tech-icon-wrap" style={{ background: '#fff5ed', color }}>
                                                        <Code2 size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="pi-tech-name">{name}</div>
                                                        <span className="pi-tech-badge-sub">Core Stack</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="pi-tech-grid">
                                        {['React', 'JavaScript (ES6+)', 'Modern CSS3', 'REST API', 'Vite', 'Git CI/CD'].map((t, i) => (
                                            <div key={i} className="pi-tech-card">
                                                <div className="pi-tech-icon-wrap" style={{ background: '#fff5ed', color: '#ff5b00' }}>
                                                    <Code2 size={20} />
                                                </div>
                                                <div>
                                                    <div className="pi-tech-name">{t}</div>
                                                    <span className="pi-tech-badge-sub">Standard Library</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── LICENSE TAB ── */}
                        {activeTab === 'license' && (
                            <div className="pi-tab-content pi-animate-in">
                                <h2>Licensing Options</h2>
                                <p className="pi-tab-subtitle">Clear, straightforward rights for developers, businesses, and agency teams.</p>
                                
                                <div className="pi-license-cards">
                                    <div className="pi-license-card pi-license-standard">
                                        <div className="pi-license-header">
                                            <Shield size={24} color="#10b981" />
                                            <div>
                                                <h3>Standard License</h3>
                                                <span className="pi-license-sub">{project.licenseTier || 'Single End Product'}</span>
                                            </div>
                                            <span className="pi-license-tag included">Included</span>
                                        </div>
                                        <ul className="pi-license-list">
                                            {(project.licenseTerms && project.licenseTerms.length > 0
                                                ? project.licenseTerms
                                                : [
                                                    'Personal or single business use',
                                                    'Full source code access',
                                                    'Lifetime rights for 1 domain',
                                                    '6 months developer support'
                                                ]
                                            ).map((term, idx) => (
                                                <li key={idx}>
                                                    <Check size={16} color="#10b981" /> {typeof term === 'string' ? term : term.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="pi-license-card pi-license-extended">
                                        <div className="pi-license-header">
                                            <Star size={24} color="#f59e0b" />
                                            <div>
                                                <h3>Extended License</h3>
                                                <span className="pi-license-sub">Unlimited & Agency</span>
                                            </div>
                                            <span className="pi-license-tag upgrade">Upgrade</span>
                                        </div>
                                        <ul className="pi-license-list">
                                            <li><Check size={16} color="#f59e0b" /> Unlimited end client projects</li>
                                            <li><Check size={16} color="#f59e0b" /> SaaS or subscription commercialization</li>
                                            <li><Check size={16} color="#f59e0b" /> Rebrand & redistribute as part of product</li>
                                            <li><Check size={16} color="#f59e0b" /> 12 months priority developer support</li>
                                        </ul>
                                        <Link to="/contact" className="pi-license-upgrade-btn">
                                            Request Extended License →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── FAQ TAB ── */}
                        {activeTab === 'faq' && (
                            <div className="pi-tab-content pi-animate-in">
                                <h2>Frequently Asked Questions</h2>
                                <p className="pi-tab-subtitle">Common questions regarding customization, deployment, and support.</p>
                                <div className="pi-faq-list">
                                    {(project.faqs && project.faqs.length > 0 ? project.faqs : DEFAULT_FAQS).map((faq, i) => (
                                        <div
                                            key={i}
                                            className={`pi-faq-item ${activeFaq === i ? 'open' : ''}`}
                                            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        >
                                            <div className="pi-faq-question">
                                                <span>{faq.q}</span>
                                                <ChevronDown size={18} className="pi-faq-chevron" />
                                            </div>
                                            <div className="pi-faq-answer">
                                                <p>{faq.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT SIDEBAR: Pricing, Meta & Actions ── */}
                    <aside className="pi-sidebar">
                        {/* Price Card */}
                        <div className="pi-sidebar-card pi-price-card">
                            <div className="pi-price-top-badge">
                                <span className="pi-price-label">Starting Investment</span>
                                <span className="pi-license-pill">Full Solution</span>
                            </div>

                            <div className="pi-price-display">
                                <div className="pi-price-value">{project.price || '$99 USD'}</div>
                                <span className="pi-price-period">One-time payment • Lifetime commercial rights</span>
                            </div>

                            {/* Key Highlights Checklist */}
                            <div className="pi-price-perks">
                                <div className="pi-perk-item">
                                    <Check size={14} className="pi-perk-check" />
                                    <span>Complete frontend & backend source code</span>
                                </div>
                                <div className="pi-perk-item">
                                    <Check size={14} className="pi-perk-check" />
                                    <span>Commercial & client deployment license</span>
                                </div>
                                <div className="pi-perk-item">
                                    <Check size={14} className="pi-perk-check" />
                                    <span>6 months technical support & updates</span>
                                </div>
                                <div className="pi-perk-item">
                                    <Check size={14} className="pi-perk-check" />
                                    <span>Instant setup & deployment guide</span>
                                </div>
                            </div>

                            <div className="pi-price-actions">
                                {project.liveLink && project.liveLink !== '#' ? (
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pi-cta-primary"
                                    >
                                        <ExternalLink size={16} />
                                        <span>Open Live Preview</span>
                                    </a>
                                ) : (
                                    <Link to="/contact" className="pi-cta-primary">
                                        <MessageCircle size={16} />
                                        <span>Get Project Quote</span>
                                    </Link>
                                )}

                                <Link to="/contact" className="pi-cta-secondary">
                                    <MessageCircle size={16} />
                                    <span>Discuss Customization</span>
                                </Link>

                                {project.githubLink && project.githubLink !== '#' && (
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pi-cta-ghost"
                                    >
                                        <Github size={16} />
                                        <span>View Source Code</span>
                                    </a>
                                )}
                            </div>

                            <div className="pi-price-guarantee">
                                <Shield size={13} color="#10b981" />
                                <span>100% Verified Quality & Direct Support</span>
                            </div>
                        </div>

                        {/* Project Specs */}
                        <div className="pi-sidebar-card pi-specs-card">
                            <h4 className="pi-sidebar-title">Project Specifications</h4>
                            <div className="pi-detail-row">
                                <span className="pi-detail-label">Category</span>
                                <span className="pi-detail-chip">{project.filter || 'Web Solution'}</span>
                            </div>
                            <div className="pi-detail-row">
                                <span className="pi-detail-label">Lead Author</span>
                                <span className="pi-detail-value author-badge">
                                    {project.author || 'Namustutam'}
                                    <CheckCircle2 size={13} color="#ff5b00" />
                                </span>
                            </div>
                            <div className="pi-detail-row">
                                <span className="pi-detail-label">Tier</span>
                                <span className="pi-detail-value">{project.category === 'NEW' ? 'Featured' : project.category}</span>
                            </div>
                            <div className="pi-detail-row">
                                <span className="pi-detail-label">License</span>
                                <span className="pi-detail-value">Commercial Ready</span>
                            </div>
                            <div className="pi-detail-row">
                                <span className="pi-detail-label">Responsive</span>
                                <span className="pi-detail-value" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Check size={14} /> 100% Tested
                                </span>
                            </div>
                        </div>

                        {/* Tech Badges */}
                        {project.techStack?.length > 0 && (
                            <div className="pi-sidebar-card pi-tech-badges-card">
                                <h4 className="pi-sidebar-title">Technologies Used</h4>
                                <div className="pi-tech-badges">
                                    {project.techStack.map((tech, i) => {
                                        const name = typeof tech === 'string' ? tech : tech.name;
                                        return (
                                            <span key={i} className="pi-tech-badge">
                                                <Code2 size={12} color="#ff5b00" />
                                                <span>{name}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Social Share Card */}
                        <div className="pi-sidebar-card pi-share-card">
                            <h4 className="pi-sidebar-title">Share This Project</h4>
                            <div className="pi-share-row">
                                <button
                                    className="pi-share-btn pi-share-twitter"
                                    onClick={shareOnTwitter}
                                    title="Share on Twitter / X"
                                >
                                    <Twitter size={16} />
                                </button>
                                <button
                                    className="pi-share-btn pi-share-linkedin"
                                    onClick={shareOnLinkedIn}
                                    title="Share on LinkedIn"
                                >
                                    <Linkedin size={16} />
                                </button>
                                <button
                                    className={`pi-share-btn pi-share-copy ${copied ? 'copied' : ''}`}
                                    onClick={handleCopyLink}
                                    title={copied ? "Link Copied!" : "Copy Project Link"}
                                >
                                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                </button>
                                <button
                                    className="pi-share-btn pi-share-wa"
                                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(project.title + ' — ' + window.location.href)}`, '_blank')}
                                    title="Share on WhatsApp"
                                >
                                    <Share2 size={16} />
                                </button>
                            </div>
                            {copied && (
                                <div className="pi-copied-notice">
                                    <Check size={13} /> Link copied to clipboard
                                </div>
                            )}
                        </div>

                        {/* Support Guarantee */}
                        <div className="pi-sidebar-card pi-support-card">
                            <Shield size={20} color="#10b981" />
                            <div>
                                <strong>6 Months Free Support</strong>
                                <p>Every project comes with direct technical assistance from our development team.</p>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ── Related / Similar Projects ── */}
                {displaySimilar.length > 0 && (
                    <section className="pi-similar-section">
                        <div className="pi-similar-header">
                            <div>
                                <h2>Related Flagship Projects</h2>
                                <p>Discover more digital solutions from our portfolio</p>
                            </div>
                            <Link to="/project-works" className="pi-see-all-link">
                                <span>Browse All Works</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="pi-similar-grid">
                            {displaySimilar.map((proj, i) => (
                                <Link
                                    to={`/project-info/${toSlug(proj.title)}`}
                                    key={`sim-${i}`}
                                    className="pi-similar-card"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                >
                                    <div className="pi-similar-img-wrap">
                                        {proj.img ? (
                                            <img src={proj.img} alt={proj.title} />
                                        ) : (
                                            <div className="pi-similar-no-img">
                                                <Code2 size={32} color="#ff5b00" />
                                            </div>
                                        )}
                                        <span className="pi-similar-filter-badge">{proj.filter}</span>
                                    </div>
                                    <div className="pi-similar-info">
                                        <div className="pi-similar-avatar">{(proj.title || 'P').charAt(0)}</div>
                                        <div className="pi-similar-text">
                                            <h5>{proj.title}</h5>
                                            <span>{proj.author} · {proj.price}</span>
                                        </div>
                                        <ArrowRight size={16} className="pi-similar-arrow" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── CTA Banner ── */}
                <section className="pi-cta-banner">
                    <div className="pi-cta-glow" />
                    <h2>Ready to Build Your Next Digital Product?</h2>
                    <p>Let's collaborate to build modern, high-converting web applications tailored precisely to your brand.</p>
                    <div className="pi-cta-actions">
                        <Link to="/contact" className="pi-cta-primary">
                            <span>Start Your Project</span>
                            <ArrowRight size={16} />
                        </Link>
                        <Link to="/project-works" className="pi-cta-ghost">
                            <ArrowLeft size={16} />
                            <span>Browse All Works</span>
                        </Link>
                    </div>
                </section>
            </main>

            <WebsiteFooter />
        </div>
    );
}
