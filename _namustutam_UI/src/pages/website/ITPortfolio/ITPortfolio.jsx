import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Smartphone, Server, Database, Cloud, ShieldCheck, MonitorPlay, Component, ArrowRight, ArrowUpRight, Star, ExternalLink } from 'lucide-react';
import '../BlogDetail/LandingPage.css';
import './ITPortfolio.css';
import '../ProjectWorks/ProjectWorks.css';
import { projectsData, formatLiveUrl } from '../../../data/projectsData';
import { useLandingPage } from '../../../context/LandingPageContext';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import ExpertiseSection from '../../../components/common/ExpertiseSection/ExpertiseSection';
import TeamSection from '../../../components/common/TeamSection/TeamSection';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';

export default function ITPortfolio() {
    const navigate = useNavigate();
    const { landingData } = useLandingPage();

    const hero = landingData?.hero || {};
    const rotatingWords = useMemo(() => {
        return (hero.rotatingWords && hero.rotatingWords.length > 0)
            ? hero.rotatingWords
            : ['Excellence', 'Innovation', 'Experiences', 'Solutions'];
    }, [hero.rotatingWords]);

    // Rotating Text State
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2800);
        return () => clearInterval(interval);
    }, [rotatingWords]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = landingData?.seo?.pageTitle || "Namustutam | Software Dev & Freelancer";

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        // Select all elements with reveal classes and observe them
        const elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
        };
    }, [landingData]);

    const scrollTo = (id) => {
        if (!id) return;
        if (id.startsWith('/')) {
            navigate(id);
            return;
        }
        const cleanId = id.replace(/^#/, '');
        const elem = document.getElementById(cleanId);
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
        } else if (cleanId === 'contact') {
            document.querySelector('.premium-footer')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Services from landingData
    const services = landingData?.services || [
        { icon: '🌐', title: 'Web Development', desc: 'Custom WordPress & Shopify themes built for performance and scalability.', link: '/services/web-development', active: true },
        { icon: '💻', title: 'SaaS Applications', desc: 'End-to-end multi-tenant application development with React and Spring Boot.', link: '/services/saas-applications', active: true },
        { icon: '📱', title: 'UI/UX Design', desc: 'Premium, user-centric interfaces with responsive and modern aesthetics.', link: '/services/ui-ux-design', active: true },
        { icon: '🛍️', title: 'E-commerce Solutions', desc: 'High-converting online stores engineered for maximum sales and seamless checkout.', link: '/services/e-commerce-platform-development', active: true },
        { icon: '🤖', title: 'AI Automation', desc: 'Integrate intelligent chatbots and automated workflows to streamline operations.', link: '/services/ai-automation', active: true },
        { icon: '🛠️', title: 'Dedicated Support', desc: '24/7 technical assistance and post-launch maintenance to keep you running smoothly.', link: '/contact', active: true }
    ];

    // Projects from landingData
    const projects = (landingData?.projects && landingData.projects.length > 0)
        ? landingData.projects.slice(0, 6)
        : projectsData.slice(0, 6);

    // Testimonials from landingData
    const testimonials = landingData?.testimonials || [];

    // Floating mockup screenshots
    const floatingImages = (hero.floatingImages && hero.floatingImages.length > 0)
        ? hero.floatingImages
        : [
            projects[0]?.img || '/dashboard1.png',
            projects[1]?.img || '/dashboard2.png',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
        ];

    const marqueeText = landingData?.marquee?.text || 
        'IT Services ✦ SaaS Development ✦ E-commerce Solutions ✦ Digital Transformation ✦ AI Integration ✦ Cloud Architecture ✦';

    // Showcase of Brilliance section header
    const portfolioSection = landingData?.portfolioSection || {};
    const showcaseLabel = portfolioSection.badge || 'Selected Works';
    const showcaseTitle = portfolioSection.title || 'Showcase of Brilliance';
    const showcaseSubtitle = portfolioSection.subtitle || 'Explore some of our recent flagship projects and enterprise solutions.';

    // Section Visibility Checker
    const visibility = landingData?.sectionVisibility || {};
    const isVisible = (key, def = true) => {
        if (visibility[key] !== undefined) return Boolean(visibility[key]);
        return def;
    };
    return (
        <div className="portfolio-root">
            <WebsiteNavbar />

            {/* ── Hero Section (Light Namustutam Theme: Content Side-by-Side with Akshay Patil) ── */}
            {isVisible('hero') && (
                <section className="portfolio-hero-section" id="hero">
                    {/* Background Radial Warm Glow & Dotted Matrix Mesh */}
                    <div className="hero-bg-glow" />
                    <div className="hero-grid-mesh" />

                    {/* Ambient Floating Mockup Cards from Reference Design */}
                    <div className="hero-floating-mockups" aria-hidden="true">
                        <div className="hero-mockup-card mockup-1">
                            <img src={floatingImages[0] || '/dashboard1.png'} alt="App Preview" />
                        </div>
                        <div className="hero-mockup-card mockup-2">
                            <img src={floatingImages[1] || '/dashboard2.png'} alt="Analytics Preview" />
                        </div>
                        <div className="hero-mockup-card mockup-3">
                            <img src="/edge_shot.png" alt="Device Preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                        <div className="hero-mockup-card mockup-4">
                            <img src="/edge_shot2.png" alt="Dashboard Preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                    </div>

                    <div className="portfolio-hero-container">
                        {/* ── Left Side: Content & Actions from Reference Design ── */}
                        <div className="portfolio-hero-content">
                            {/* Pill Badge with Glowing Orange Dot */}
                            <div className="hero-badge-pill">
                                <span className="hero-badge-dot" />
                                <span className="hero-badge-text">
                                    {hero.badge || 'Freelance Software Developer • IT Solutions'}
                                </span>
                            </div>

                            {/* Main Headline with Boxed Rotating Word */}
                            <h1 className="hero-headline">
                                <span className="hero-title-prefix">{hero.titlePrefix || 'Building Digital'}</span>{' '}
                                <span className="hero-rotating-box">
                                    <span key={wordIndex} className="hero-rotating-word">
                                        {rotatingWords[wordIndex] || 'Solutions'}
                                    </span>
                                </span>
                                <br />
                                <span className="hero-title-suffix">{hero.titleSuffix || 'For Modern Businesses'}</span>
                            </h1>

                            {/* Subtitle Description */}
                            <p className="hero-subtitle">
                                {hero.subtitle || 'I build custom software, POS solutions, business websites, and web applications tailored to your business needs — from idea to deployment'}
                            </p>

                            {/* Action Buttons */}
                            <div className="hero-actions">
                                <button
                                    className="hero-btn-primary"
                                    onClick={() => scrollTo(hero.primaryBtnLink || '#portfolio')}
                                >
                                    {hero.primaryBtnText || 'View Our Work'}
                                </button>
                                <button
                                    className="hero-btn-outline"
                                    onClick={() => scrollTo(hero.secondaryBtnLink || '#contact')}
                                >
                                    {hero.secondaryBtnText || 'Discuss Your Project'}
                                </button>
                            </div>

                            {/* Micro-Trust & Highlights */}
                            <div className="hero-trust-row">
                                <div className="hero-trust-chip">
                                    <span className="trust-chip-dot" />
                                    <span>21,000+ Screen Hours</span>
                                </div>
                                <div className="hero-trust-chip">
                                    <span className="trust-chip-dot" />
                                    <span>30+ Delivered Projects</span>
                                </div>
                                <div className="hero-trust-chip">
                                    <span className="trust-chip-dot" />
                                    <span>100% On-Time Delivery</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Right Side: Akshay Patil Portrait & Glow Elements ── */}
                        <div className="portfolio-hero-visual">
                            {/* Radiant Sun Glow behind Akshay */}
                            <div className="hero-sun-glow" />

                            {/* Akshay Portrait Stage */}
                            <div className="hero-person-stage">
                                <img
                                    src={hero.personImage || '/team/Akshay_namustutam.png'}
                                    alt={hero.name || 'Akshay Patil - Namustutam'}
                                    className="hero-person-portrait"
                                    onError={(e) => { e.currentTarget.src = '/team/Akshay_namustutam.png'; }}
                                />

                                {/* Subtle Floating Glass Experience Chip */}
                                <div className="hero-stat-badge stat-badge-bottom">
                                    <div className="stat-badge-icon">✦</div>
                                    <div className="stat-badge-text">
                                        <span className="stat-badge-strong">4+ Years</span>
                                        <span className="stat-badge-sub">Creating & Designing</span>
                                    </div>
                                </div>

                                <div className="hero-stat-badge stat-badge-top">
                                    <ArrowUpRight className="stat-badge-arrow" size={16} />
                                    <div className="stat-badge-text">
                                        <span className="stat-badge-strong">30+ Clients</span>
                                        <span className="stat-badge-sub">Worked With Globally</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Smooth Bottom Section Transition */}
                    <div className="portfolio-hero-bottom-transition" />
                </section>
            )}

            {/* ── Expertise Section (SDLC & Architecture) ──────────────── */}
            {isVisible('sdlc') && <ExpertiseSection />}

            {/* ── Services Section ────────────────────────────────────── */}
            {isVisible('services') && (
                <section className="portfolio-services-section" id="services">
                    <div className="portfolio-section-header reveal-up">
                        <div className="portfolio-section-label">Capabilities & Solutions</div>
                        <h2 className="portfolio-section-title">End-To-End Engineering Services</h2>
                        <p className="portfolio-section-subtitle">Tailored technical solutions engineered to elevate modern businesses and scale operations.</p>
                    </div>

                    <div className="portfolio-services-grid">
                        {services.filter(s => s.active !== false).map((srv, i) => (
                            <div
                                key={srv.id || i}
                                className="portfolio-service-card reveal-up"
                                style={{ transitionDelay: `${i * 80}ms` }}
                                onClick={() => srv.link && (srv.link.startsWith('#') ? scrollTo(srv.link) : navigate(srv.link))}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') srv.link && (srv.link.startsWith('#') ? scrollTo(srv.link) : navigate(srv.link)); }}
                            >
                                <div className="portfolio-service-icon">
                                    {srv.icon}
                                </div>
                                <h3 className="portfolio-service-title">
                                    {srv.title}
                                </h3>
                                <p className="portfolio-service-desc">
                                    {srv.desc}
                                </p>
                                <div className="portfolio-service-link">
                                    <span>Explore Service</span>
                                    <span>→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Portfolio Section / Selected Works Showcase ─────────── */}
            {isVisible('projects') && (
                <section className="portfolio-showcase-section" id="portfolio">
                    <div className="portfolio-section-header reveal-up">
                        <div className="portfolio-section-label">{showcaseLabel}</div>
                        <h2 className="portfolio-section-title">{showcaseTitle}</h2>
                        <p className="portfolio-section-subtitle">{showcaseSubtitle}</p>
                    </div>

                    <div className="portfolio-showcase-grid">
                        {projects.map((p, i) => {
                            const slug = (p.title || 'project').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                            const techList = Array.isArray(p.techStack)
                                ? p.techStack.slice(0, 3).map(t => (typeof t === 'string' ? t : t?.name)).filter(Boolean)
                                : [];
                            const isLive = p.liveLink && p.liveLink !== '#';
                            const liveUrl = isLive ? formatLiveUrl(p.liveLink) : null;

                            return (
                                <div
                                    key={p.id || `project-${i}`}
                                    className={`portfolio-project-card project-card-${i} reveal-up`}
                                    style={{ transitionDelay: `${i * 90}ms` }}
                                    onClick={() => navigate(`/project-info/${slug}`)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/project-info/${slug}`); }}
                                >
                                    {/* Media Container */}
                                    <div className="project-card-media">
                                        {p.img ? (
                                            <img
                                                src={p.img}
                                                alt={p.title}
                                                className="project-card-img"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.classList.add('no-img');
                                                }}
                                            />
                                        ) : (
                                            <div className="project-card-no-img">
                                                <Code2 size={36} color="#ff5b00" />
                                                <span>Interactive Demo</span>
                                            </div>
                                        )}

                                        {/* Top Badges */}
                                        <div className="project-media-badges">
                                            <span className="project-category-pill">
                                                {p.filter || p.category || 'Web App'}
                                            </span>
                                            {liveUrl && (
                                                <a
                                                    href={liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="project-live-btn"
                                                    onClick={e => e.stopPropagation()}
                                                    title={`Visit live: ${p.title}`}
                                                >
                                                    <span className="project-live-dot" />
                                                    <span>Live ↗</span>
                                                </a>
                                            )}
                                        </div>

                                        {/* Quick View Hover Mask */}
                                        <div className="project-card-hover-mask">
                                            <span className="project-hover-cta">Explore Details →</span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="project-card-body">
                                        <div className="project-card-top-row">
                                            <h3 className="project-card-title">{p.title}</h3>
                                            {p.price && <span className="project-card-price">{p.price}</span>}
                                        </div>

                                        {p.description && (
                                            <p className="project-card-desc">{p.description}</p>
                                        )}

                                        <div className="project-card-footer">
                                            <div className="project-card-tech-tags">
                                                {techList.map((t, ti) => (
                                                    <span key={ti} className="project-card-tech-tag">{t}</span>
                                                ))}
                                            </div>
                                            <div className="project-card-arrow-icon" title="View Project Details">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="portfolio-btn-wrapper" style={{ marginTop: '40px' }}>
                        <button className="portfolio-btn-outline" onClick={() => navigate('/project-works')}>
                            See more project work →
                        </button>
                    </div>
                </section>
            )}

            {/* ── Testimonials Section ────────────────────────────────── */}
            {isVisible('testimonials') && testimonials && testimonials.length > 0 && (
                <section className="portfolio-testimonials-section" id="testimonials">
                    <div className="portfolio-section-header reveal-up">
                        <div className="portfolio-section-label">Client Reviews</div>
                        <h2 className="portfolio-section-title">Trusted By Visionary Brands</h2>
                        <p className="portfolio-section-subtitle">Real experiences and feedback from business founders and technology partners.</p>
                    </div>

                    <div className="portfolio-testimonials-grid">
                        {testimonials.map((t, i) => (
                            <div
                                key={t.id || i}
                                className="portfolio-testimonial-card reveal-up"
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className="portfolio-testimonial-stars">
                                    {Array(t.rating || 5).fill(0).map((_, idx) => (
                                        <span key={idx}>⭐</span>
                                    ))}
                                </div>
                                <p className="portfolio-testimonial-review">
                                    "{t.review}"
                                </p>
                                <div className="portfolio-testimonial-author">
                                    <div className="portfolio-testimonial-avatar">
                                        {t.avatar || (t.name ? t.name[0] : 'C')}
                                    </div>
                                    <div>
                                        <div className="portfolio-testimonial-name">{t.name}</div>
                                        <div className="portfolio-testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Team Section ──────────────────────── */}
            {isVisible('team') && <TeamSection />}

            {/* ── Progressive Growth Section ──────────────────────── */}
            {isVisible('marquee') && (
                <section className="portfolio-progressive-section" id="progressive-growth">
                    {/* Bottom Marquee */}
                    <div className="progressive-marquee-container">
                        <div className="progressive-marquee">
                            <span>{marqueeText}</span>
                            <span>{marqueeText}</span>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Blog Preview ────────────────── */}
            {isVisible('blogs') && <BlogPreviewSection />}

            {/* ── Website Footer / Contact ────── */}
            {isVisible('contact') && <WebsiteFooter />}
        </div>
    );
}
