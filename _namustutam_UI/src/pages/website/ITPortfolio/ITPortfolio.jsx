import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Smartphone, Server, Database, Cloud, ShieldCheck, MonitorPlay, Component, ArrowRight, Star } from 'lucide-react';
import '../BlogDetail/LandingPage.css';
import './ITPortfolio.css';
import '../ProjectWorks/ProjectWorks.css';
import { projectsData } from '../../../data/projectsData';
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
    const rotatingWords = (hero.rotatingWords && hero.rotatingWords.length > 0)
        ? hero.rotatingWords
        : ['Excellence', 'Innovation', 'Experiences', 'Solutions'];

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
        const cleanId = (id || '').replace(/^#/, '');
        document.getElementById(cleanId)?.scrollIntoView({ behavior: 'smooth' });
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
    const showAnnouncement = (visibility.announcement !== undefined ? visibility.announcement : false) || Boolean(landingData?.announcement?.enabled);

    return (
        <div className="portfolio-root">
            {/* Top Announcement Banner (Dynamic from Admin Panel) */}
            {showAnnouncement && landingData?.announcement?.text && (
                <div style={{
                    backgroundColor: landingData.announcement.bgColor || '#ff620b',
                    color: landingData.announcement.textColor || '#ffffff',
                    padding: '9px 16px',
                    textAlign: 'center',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    position: 'relative',
                    zIndex: 9999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    <span>{landingData.announcement.text}</span>
                    {landingData.announcement.link && (
                        <a 
                            href={landingData.announcement.link} 
                            style={{ 
                                color: '#ffffff', 
                                textDecoration: 'underline', 
                                fontWeight: '700',
                                marginLeft: '6px'
                            }}
                        >
                            Learn More →
                        </a>
                    )}
                </div>
            )}

            <WebsiteNavbar />

            {/* ── Hero Section (Redesigned) ──────────────────────── */}
            {isVisible('hero') && (
                <section className="portfolio-hero-redesigned">
                    {/* Floating Background Cards */}
                    <div className="hero-floating-background">
                        {floatingImages.map((imgUrl, index) => (
                            <div
                                key={`img-${index}`}
                                className={`floating-project-card floating-card-${index + 1}`}
                                style={{ backgroundImage: `url(${imgUrl})` }}
                            ></div>
                        ))}
                        {floatingImages.map((imgUrl, index) => (
                            <div
                                key={`dup-${index}`}
                                className={`floating-project-card floating-card-dup-${index + 1}`}
                                style={{ backgroundImage: `url(${imgUrl})` }}
                            ></div>
                        ))}

                        {/* Floating Tech Icons */}
                        <div className="floating-icon-card floating-icon-1"><Code2 size={36} color="#ff8c42" /></div>
                        <div className="floating-icon-card floating-icon-2"><Smartphone size={32} color="#3b82f6" /></div>
                        <div className="floating-icon-card floating-icon-3"><Server size={40} color="#10b981" /></div>
                        <div className="floating-icon-card floating-icon-4"><Database size={30} color="#f43f5e" /></div>
                        <div className="floating-icon-card floating-icon-5"><Cloud size={44} color="#8b5cf6" /></div>
                        <div className="floating-icon-card floating-icon-6"><ShieldCheck size={38} color="#f59e0b" /></div>
                        <div className="floating-icon-card floating-icon-7"><MonitorPlay size={34} color="#0ea5e9" /></div>
                        <div className="floating-icon-card floating-icon-8"><Component size={42} color="#ec4899" /></div>
                    </div>

                    <div className="hero-light-overlay"></div>

                    <div className="portfolio-hero-content reveal-up" style={{ position: 'relative', zIndex: 2 }}>
                        <div className="portfolio-badge">
                            <span className="portfolio-badge-dot"></span>
                            {hero.badge || 'Freelance Software Developer • IT Solutions'}
                        </div>
                        <h1 className="portfolio-hero-title">
                            {hero.titlePrefix || 'Building Digital'}
                            <div className="rotating-text-wrapper">
                                {rotatingWords.map((word, index) => {
                                    const isActive = index === wordIndex;
                                    const isPrevious = index === (wordIndex - 1 + rotatingWords.length) % rotatingWords.length;

                                    return (
                                        <span
                                            key={index}
                                            className={`portfolio-gradient-text rotating-text-item ${isActive ? 'active' : ''} ${isPrevious && !isActive ? 'previous' : ''}`}
                                        >
                                            {word}
                                        </span>
                                    );
                                })}
                            </div>
                            <br />
                            {hero.titleSuffix || 'For Modern Businesses'}
                        </h1>
                        <p className="portfolio-hero-subtitle">
                            {hero.subtitle || 'I build custom software, POS solutions, business websites, and web applications tailored to your business needs — from idea to deployment'}
                        </p>
                        <div className="portfolio-hero-actions">
                            <button className="portfolio-btn-primary" onClick={() => scrollTo(hero.primaryBtnLink || 'portfolio')}>
                                {hero.primaryBtnText || 'View Our Work'}
                            </button>
                            <button className="portfolio-btn-outline" onClick={() => scrollTo(hero.secondaryBtnLink || 'contact')}>
                                {hero.secondaryBtnText || 'Discuss Your Project'}
                            </button>
                        </div>
                    </div>

                    {/* Gradient transition to next section */}
                    <div className="hero-bottom-transition"></div>
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
                                            {p.liveLink && p.liveLink !== '#' && (
                                                <a
                                                    href={p.liveLink}
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
