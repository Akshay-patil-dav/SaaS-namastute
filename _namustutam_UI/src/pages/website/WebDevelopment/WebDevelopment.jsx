import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';
import {
    Code, ShoppingCart, Layout, Smartphone, Search, HeadphonesIcon,
    ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Check,
    Globe, Zap, Shield, BarChart2, Layers, GitBranch, Star,
    MessageSquare, Clock, Cpu, TrendingUp, Package, Users, Lock
} from 'lucide-react';
import { projectsData } from '../../../data/projectsData';
import './WebDevelopment.css';
import { useCurrency } from '../../../hooks/useCurrency';


/* ── Service Cards Data ──────────────────── */
const SERVICES = [
    {
        icon: <Globe size={26} />,
        title: 'Business Websites',
        desc: 'Stunning, high-converting corporate websites and landing pages that are your 24/7 digital sales engine.',
        badge: 'Most Popular',
        gradient: 'linear-gradient(135deg, #ff8c42 0%, #ff9666 100%)',
    },
    {
        icon: <ShoppingCart size={26} />,
        title: 'E-Commerce Stores',
        desc: 'Full-featured online stores with seamless checkout, inventory management, and payment integrations.',
        badge: null,
        gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    },
    {
        icon: <Cpu size={26} />,
        title: 'SaaS Applications',
        desc: 'Scalable multi-tenant SaaS platforms with dashboards, real-time data, role-based access, and API layers.',
        badge: 'Flagship',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    },
    {
        icon: <BarChart2 size={26} />,
        title: 'Business Management Apps',
        desc: 'Custom ERP, CRM, POS and inventory tools tailored precisely to your operational workflows.',
        badge: null,
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
        icon: <Layout size={26} />,
        title: 'CMS Development',
        desc: 'WordPress, Shopify, and headless CMS solutions for effortless, non-technical content management.',
        badge: null,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
        icon: <GitBranch size={26} />,
        title: 'API & Integrations',
        desc: 'RESTful and GraphQL APIs, third-party integrations, webhook systems, and microservices architecture.',
        badge: null,
        gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    },
];

/* ── Why Choose Us Data ───────────────── */
const WHY_US = [
    { icon: <Zap size={20} />, title: 'Fast Delivery', desc: 'Agile sprints — MVP in weeks, not months.' },
    { icon: <Shield size={20} />, title: 'Enterprise Security', desc: 'JWT auth, encrypted data, GDPR-ready builds.' },
    { icon: <Search size={20} />, title: 'SEO-First Development', desc: 'Structured data, Core Web Vitals, 90+ PageSpeed.' },
    { icon: <Smartphone size={20} />, title: 'Mobile-First Design', desc: 'Pixel-perfect responsiveness on every device.' },
    { icon: <TrendingUp size={20} />, title: 'Built to Scale', desc: 'Cloud-native architecture that grows with you.' },
    { icon: <HeadphonesIcon size={20} />, title: '24/7 Support', desc: 'Dedicated post-launch maintenance & updates.' },
];

/* ── Process Steps ─────────────────────── */
const PROCESS = [
    { num: '01', title: 'Discovery & Planning', desc: 'We deep-dive into your business goals, audience, and technical requirements to craft the perfect project roadmap.' },
    { num: '02', title: 'UI/UX Design', desc: 'Our designers create wireframes and interactive prototypes that put user experience first.' },
    { num: '03', title: 'Development Sprint', desc: 'Agile cycles deliver working features week by week, keeping you in the loop at every stage.' },
    { num: '04', title: 'Testing & QA', desc: 'Rigorous cross-device, cross-browser testing ensures your product is flawless at launch.' },
    { num: '05', title: 'Launch & Grow', desc: 'Seamless deployment with CI/CD pipelines, followed by ongoing support and growth optimization.' },
];

/* ── Testimonials ─────────────────────── */
const TESTIMONIALS = [
    { name: 'Priya S.', role: 'Owner, StyleHub Boutique', avatar: 'P', stars: 5, text: 'Namustutam built our e-commerce store from scratch in just 3 weeks. Sales went up 40% the first month. Absolutely premium work!' },
    { name: 'Rohan M.', role: 'CEO, FreshMart Grocery', avatar: 'R', stars: 5, text: 'The business management app they built replaced 4 tools we were paying for. Inventory tracking is now real-time and flawless.' },
    { name: 'Ananya K.', role: 'CTO, TechRetail Co.', avatar: 'A', stars: 5, text: 'The SaaS dashboard they delivered is miles ahead of what we expected. Clean code, great architecture, and zero bugs at launch.' },
    { name: 'Vikram D.', role: 'Founder, LaunchPad Startup', avatar: 'V', stars: 5, text: 'Our startup MVP was live in 6 weeks. The team understood our vision immediately and delivered beyond expectations.' },
];

export default function WebDevelopment() {
    const { currencySymbol } = useCurrency();

    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Web Development Services | Namustutam';
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: direction === 'left' ? -420 : 420, behavior: 'smooth' });
        }
    };

    let showcaseProjects = projectsData.filter(p =>
        p.category.includes('Web') || p.category.includes('E-Commerce') || p.category.includes('SaaS')
    ).slice(0, 8);
    if (showcaseProjects.length < 4) showcaseProjects = projectsData.slice(0, 8);

    return (
        <div className="wd-page">
            <WebsiteNavbar />
            <main className="wd-main">

                {/* ══ HERO ═══════════════════════════════════════════════════ */}
                <section className="wd-hero">
                    {/* Background orbs */}
                    <div className="wd-orb wd-orb-1" />
                    <div className="wd-orb wd-orb-2" />
                    <div className="wd-orb wd-orb-3" />
                    <div className="wd-grid-overlay" />

                    <div className="wd-hero-inner">
                        <div className="wd-hero-text">
                            <div className="wd-badge">
                                <span className="wd-badge-dot" />
                                Website &amp; Business App Development Startup
                            </div>
                            <h1 className="wd-hero-title">
                                We Build Digital Products<br />
                                <span className="wd-gradient-text">That Drive Real Growth</span>
                            </h1>
                            <p className="wd-hero-subtitle">
                                From stunning business websites to full-scale SaaS platforms and custom business management applications — we engineer digital experiences that convert visitors into customers and manual processes into automated workflows.
                            </p>
                            <div className="wd-hero-actions">
                                <button className="wd-btn-primary" onClick={() => navigate('/contact')}>
                                    Start Your Project <ArrowRight size={18} />
                                </button>
                                <button className="wd-btn-secondary" onClick={() => navigate('/project-works')}>
                                    View Our Work <ExternalLink size={16} />
                                </button>
                            </div>
                            <div className="wd-hero-stats">
                                <div className="wd-stat">
                                    <span className="wd-stat-num">50+</span>
                                    <span className="wd-stat-lbl">Projects Live</span>
                                </div>
                                <div className="wd-stat-divider" />
                                <div className="wd-stat">
                                    <span className="wd-stat-num">99%</span>
                                    <span className="wd-stat-lbl">Satisfaction Rate</span>
                                </div>
                                <div className="wd-stat-divider" />
                                <div className="wd-stat">
                                    <span className="wd-stat-num">3 Wks</span>
                                    <span className="wd-stat-lbl">Avg. Delivery</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual – Layered Cards */}
                        <div className="wd-hero-visual">
                            <div className="wd-hero-card wd-hc-main">
                                <div className="wd-hc-bar">
                                    <span className="wd-dot red" /><span className="wd-dot yellow" /><span className="wd-dot green" />
                                    <span className="wd-hc-url">app.namustutam.com</span>
                                </div>
                                <div className="wd-hc-body">
                                    <div className="wd-hc-sidebar">
                                        <div className="wd-hc-nav-item active" />
                                        <div className="wd-hc-nav-item" />
                                        <div className="wd-hc-nav-item" />
                                        <div className="wd-hc-nav-item" />
                                    </div>
                                    <div className="wd-hc-content">
                                        <div className="wd-hc-chart">
                                            <div className="wd-chart-bar h-60" />
                                            <div className="wd-chart-bar h-80" />
                                            <div className="wd-chart-bar h-45" />
                                            <div className="wd-chart-bar h-90 accent" />
                                            <div className="wd-chart-bar h-70" />
                                        </div>
                                        <div className="wd-hc-metrics">
                                            <div className="wd-hc-metric">
                                                <span className="wd-metric-val">{currencySymbol}2.4L</span>
                                                <span className="wd-metric-lbl">Revenue</span>
                                            </div>
                                            <div className="wd-hc-metric">
                                                <span className="wd-metric-val green">+34%</span>
                                                <span className="wd-metric-lbl">Growth</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating tech tags */}
                            <div className="wd-float-tag wd-ft-1"><Code size={14} /> React.js</div>
                            <div className="wd-float-tag wd-ft-2"><Package size={14} /> Node.js</div>
                            <div className="wd-float-tag wd-ft-3"><Shield size={14} /> Secured</div>
                            <div className="wd-float-tag wd-ft-4"><Zap size={14} /> Fast Deploy</div>
                            {/* Mini card */}
                            <div className="wd-mini-card">
                                <div className="wd-mini-icon">🚀</div>
                                <div>
                                    <div className="wd-mini-title">Project Launched!</div>
                                    <div className="wd-mini-sub">E-Commerce Store · 2.8s build</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* ══ SERVICES GRID ══════════════════════════════════════════ */}
                <section className="wd-section wd-services">
                    <div className="wd-section-header">
                        <div className="wd-section-tag">What We Build</div>
                        <h2>Full-Spectrum <span className="wd-gradient-text">Web Solutions</span></h2>
                        <p>Whether you're a startup launching your first product or a business scaling operations — we have the right solution.</p>
                    </div>
                    <div className="wd-services-grid">
                        {SERVICES.map((s, i) => (
                            <div key={i} className="wd-service-card" style={{ '--card-gradient': s.gradient }}>
                                {s.badge && <div className="wd-service-badge">{s.badge}</div>}
                                <div className="wd-service-icon" style={{ background: s.gradient }}>
                                    {s.icon}
                                </div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <button className="wd-service-link" onClick={() => navigate('/contact')}>
                                    Get Started <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══ WHY CHOOSE US ══════════════════════════════════════════ */}
                <section className="wd-section wd-why">
                    <div className="wd-why-inner">
                        <div className="wd-why-left">
                            <div className="wd-section-tag">Why Namustutam</div>
                            <h2>Built for <span className="wd-gradient-text">Startups & Growing Businesses</span></h2>
                            <p>We're not just a dev agency — we're a product-first startup that understands the pressure of building something that must work, scale, and impress from day one.</p>
                            <button className="wd-btn-primary" style={{ marginTop: '32px' }} onClick={() => navigate('/contact')}>
                                Let's Talk <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="wd-why-grid">
                            {WHY_US.map((w, i) => (
                                <div key={i} className="wd-why-card">
                                    <div className="wd-why-icon">{w.icon}</div>
                                    <h4>{w.title}</h4>
                                    <p>{w.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ PROCESS ════════════════════════════════════════════════ */}
                <section className="wd-section wd-process">
                    <div className="wd-section-header">
                        <div className="wd-section-tag">How We Work</div>
                        <h2>Our <span className="wd-gradient-text">Delivery Process</span></h2>
                        <p>A streamlined, transparent approach from first conversation to post-launch growth.</p>
                    </div>
                    <div className="wd-process-steps">
                        {PROCESS.map((step, i) => (
                            <div key={i} className="wd-process-step">
                                <div className="wd-process-num">{step.num}</div>
                                {i < PROCESS.length - 1 && <div className="wd-process-line" />}
                                <div className="wd-process-body">
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══ PRICING ════════════════════════════════════════════════ */}
                <section className="wd-section wd-pricing">
                    <div className="wd-section-header">
                        <div className="wd-section-tag">Pricing</div>
                        <h2>Transparent <span className="wd-gradient-text">Investment Plans</span></h2>
                        <p>No hidden charges. Simple, fair pricing crafted for businesses at every stage.</p>
                    </div>
                    <div className="wd-pricing-grid">
                        {/* Plan 1 */}
                        <div className="wd-plan">
                            <div className="wd-plan-header">
                                <Globe size={28} className="wd-plan-icon" />
                                <h3>Starter Website</h3>
                                <p>Perfect for local businesses &amp; startups needing a professional online presence fast.</p>
                            </div>
                            <div className="wd-plan-price">
                                <span className="wd-price-amt">{currencySymbol}8,000</span>
                                <span className="wd-price-note">one-time</span>
                            </div>
                            <ul className="wd-plan-features">
                                <li><Check size={16} /> Free Hosting Included</li>
                                <li><Check size={16} /> Only Domain Cost Extra</li>
                                <li><Check size={16} /> Up to 5 Static Pages</li>
                                <li><Check size={16} /> Mobile Responsive Design</li>
                                <li><Check size={16} /> SEO Foundations</li>
                                <li><Check size={16} /> Contact Form</li>
                            </ul>
                            <button className="wd-btn-plan outline" onClick={() => navigate('/contact')}>
                                Get Started
                            </button>
                        </div>

                        {/* Plan 2 – Popular */}
                        <div className="wd-plan popular">
                            <div className="wd-popular-badge">Most Popular</div>
                            <div className="wd-plan-header">
                                <Layers size={28} className="wd-plan-icon" />
                                <h3>Business Functional</h3>
                                <p>For businesses needing dynamic features, client messages, and operational capabilities.</p>
                            </div>
                            <div className="wd-plan-price">
                                <span className="wd-price-amt">{currencySymbol}15,000</span>
                                <span className="wd-price-note">one-time</span>
                            </div>
                            <ul className="wd-plan-features">
                                <li><Check size={16} /> Free Hosting Included</li>
                                <li><Check size={16} /> Only Domain Cost Extra</li>
                                <li><Check size={16} /> Unlimited Pages</li>
                                <li><Check size={16} /> Admin Panel Included</li>
                                <li><Check size={16} /> Client Message Integration</li>
                                <li><Check size={16} /> Blog / News Section</li>
                                <li><Check size={16} /> 3 Months Support</li>
                            </ul>
                            <button className="wd-btn-plan fill" onClick={() => navigate('/contact')}>
                                Choose This Plan
                            </button>
                        </div>

                        {/* Plan 3 – Custom */}
                        <div className="wd-plan custom">
                            <div className="wd-plan-header">
                                <Cpu size={28} className="wd-plan-icon" />
                                <h3>Full SaaS / App</h3>
                                <p>End-to-end custom web applications, SaaS platforms, and business management systems.</p>
                            </div>
                            <div className="wd-plan-price">
                                <span className="wd-price-amt">Custom</span>
                                <span className="wd-price-note">based on scope</span>
                            </div>
                            <ul className="wd-plan-features">
                                <li><Check size={16} /> Fully Custom Architecture</li>
                                <li><Check size={16} /> Multi-tenant / SaaS Ready</li>
                                <li><Check size={16} /> Custom API &amp; Backend</li>
                                <li><Check size={16} /> Role-based Access Control</li>
                                <li><Check size={16} /> Real-time Features</li>
                                <li><Check size={16} /> Cloud Deployment</li>
                                <li><Check size={16} /> Ongoing Maintenance</li>
                            </ul>
                            <button className="wd-btn-plan outline" onClick={() => navigate('/contact')}>
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </section>

                {/* ══ PROJECTS SHOWCASE ══════════════════════════════════════ */}
                <section className="wd-section wd-showcase">
                    <div className="wd-showcase-top">
                        <div>
                            <div className="wd-section-tag">Our Work</div>
                            <h2>Live <span className="wd-gradient-text">Working Projects</span></h2>
                            <p>Real solutions, real results — explore what we've built.</p>
                        </div>
                        <div className="wd-slider-btns">
                            <button className="wd-slider-btn" onClick={() => scrollSlider('left')} aria-label="Previous">
                                <ChevronLeft size={22} />
                            </button>
                            <button className="wd-slider-btn" onClick={() => scrollSlider('right')} aria-label="Next">
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="wd-slider-wrap">
                        <div className="wd-slider" ref={sliderRef}>
                            {showcaseProjects.map((project, i) => (
                                <div
                                    key={i}
                                    className="wd-project-card"
                                    onClick={() => navigate('/project-info/' + project.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''))}
                                >
                                    <div className="wd-project-img-wrap">
                                        <div className="wd-project-cat">{project.category}</div>
                                        <img
                                            src={project.img}
                                            alt={project.title}
                                            className="wd-project-img"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        <div className="wd-project-overlay">
                                            <button className="wd-view-btn">
                                                View Case Study <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="wd-project-info">
                                        <h3>{project.title}</h3>
                                        <span className="wd-project-author">{project.author}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="wd-showcase-action">
                        <button className="wd-btn-secondary" onClick={() => navigate('/project-works')}>
                            View All Projects <ArrowRight size={16} />
                        </button>
                    </div>
                </section>

                {/* ══ TESTIMONIALS ═══════════════════════════════════════════ */}
                <section className="wd-section wd-testimonials">
                    <div className="wd-section-header">
                        <div className="wd-section-tag">Client Stories</div>
                        <h2>What Our <span className="wd-gradient-text">Clients Say</span></h2>
                    </div>
                    <div className="wd-testimonial-carousel">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className={`wd-testimonial-card ${i === activeTestimonial ? 'active' : ''}`}>
                                <div className="wd-testimonial-stars">
                                    {Array.from({ length: t.stars }).map((_, si) => (
                                        <Star key={si} size={16} fill="#ff8c42" color="#ff8c42" />
                                    ))}
                                </div>
                                <p className="wd-testimonial-text">"{t.text}"</p>
                                <div className="wd-testimonial-author">
                                    <div className="wd-testimonial-avatar">{t.avatar}</div>
                                    <div>
                                        <div className="wd-testimonial-name">{t.name}</div>
                                        <div className="wd-testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="wd-testimonial-dots">
                            {TESTIMONIALS.map((_, i) => (
                                <button key={i} className={`wd-dot-btn ${i === activeTestimonial ? 'active' : ''}`} onClick={() => setActiveTestimonial(i)} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ BLOG SECTION ═══════════════════════════════════════════ */}
                <div className="wd-blog-wrapper">
                    <BlogPreviewSection />
                </div>

                {/* ══ CTA ════════════════════════════════════════════════════ */}
                <section className="wd-cta">
                    <div className="wd-cta-orb1" />
                    <div className="wd-cta-orb2" />
                    <div className="wd-cta-inner">
                        <div className="wd-cta-icon-row">
                            <Globe size={28} /><Code size={28} /><Cpu size={28} /><TrendingUp size={28} />
                        </div>
                        <h2>Ready to Build Something <span className="wd-gradient-text">Extraordinary?</span></h2>
                        <p>Let's turn your idea into a digital product that stands out. Whether it's a website, a web app, or a full SaaS platform — we're here to make it happen.</p>
                        <div className="wd-cta-actions">
                            <button className="wd-btn-primary large" onClick={() => navigate('/contact')}>
                                Start Your Project Today <ArrowRight size={20} />
                            </button>
                            <a href="tel:+91XXXXXXXXXX" className="wd-cta-phone">
                                <MessageSquare size={18} /> Or Chat With Us
                            </a>
                        </div>
                        <div className="wd-cta-trust">
                            <span><Check size={14} /> Free Consultation</span>
                            <span><Check size={14} /> No Hidden Charges</span>
                            <span><Check size={14} /> Fast Turnaround</span>
                        </div>
                    </div>
                </section>

            </main>
            <WebsiteFooter />
        </div>
    );
}
