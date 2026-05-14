import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LandingPage.css';
import WebsiteNavbar from '../components/common/WebsiteNavbar';
import WebsiteFooter from '../components/common/WebsiteFooter';
import NodeFeatures from '../components/common/NodeFeatures';

/* ── Scroll-reveal hook ─────────────────────────────────────────────────── */
function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

/* ── Feature Card ───────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, delay = 0 }) {
    const ref = useReveal();
    return (
        <div
            ref={ref}
            className="lp-feature-card lp-reveal"
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="lp-feature-icon">{icon}</div>
            <div className="lp-feature-title">{title}</div>
            <div className="lp-feature-desc">{desc}</div>
        </div>
    );
}

/* ── Pricing Card ───────────────────────────────────────────────────────── */
function PricingCard({ plan, price, desc, features, popular, cta }) {
    const navigate = useNavigate();
    const ref = useReveal();
    return (
        <div ref={ref} className={`lp-pricing-card lp-reveal ${popular ? 'popular' : ''}`}>
            {popular && <div className="lp-pricing-badge">Most Popular</div>}
            <div className="lp-pricing-plan">{plan}</div>
            <div className="lp-pricing-price">
                <span className="lp-currency">₹</span>
                <span className="lp-amount">{price}</span>
                <span className="lp-period">/mo</span>
            </div>
            <div className="lp-pricing-desc">{desc}</div>
            <ul className="lp-pricing-features">
                {features.map((f, i) => (
                    <li key={i} className={f.off ? 'off' : ''}>{f.text}</li>
                ))}
            </ul>
            <button
                className={`lp-btn-pricing ${popular ? 'fill' : 'outline'}`}
                onClick={() => navigate('/register')}
            >
                {cta}
            </button>
        </div>
    );
}

/* ── Dashboard Image Showcase ───────────────────────────────────────────── */
function DashboardShowcase() {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        { label: 'Admin Dashboard', src: '/dashboard1.png' },
        { label: 'Purchase & Sales', src: '/dashboard2.png' },
    ];
    return (
        <div className="lp-showcase-frame">
            {/* Browser chrome bar */}
            <div className="lp-showcase-bar">
                <div className="lp-mockup-dot" />
                <div className="lp-mockup-dot" />
                <div className="lp-mockup-dot" />
                <div className="lp-showcase-url">app.namastute.com/dashboard</div>
                <div className="lp-showcase-tabs">
                    {tabs.map((t, i) => (
                        <button
                            key={i}
                            className={`lp-showcase-tab ${activeTab === i ? 'active' : ''}`}
                            onClick={() => setActiveTab(i)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>
            {/* Screenshot */}
            <div className="lp-showcase-img-wrap">
                {tabs.map((t, i) => (
                    <img
                        key={i}
                        src={t.src}
                        alt={t.label}
                        className={`lp-showcase-img ${activeTab === i ? 'active' : ''}`}
                        draggable={false}
                    />
                ))}
            </div>
        </div>
    );
}

/* ── Main Landing Page ──────────────────────────────────────────────────── */
export default function LandingPage() {
    const navigate = useNavigate();

    // hero refs
    const featuresRef   = useReveal();
    const howRef        = useReveal();
    const pricingRef    = useReveal();
    const testimonialRef = useReveal();
    const ctaRef        = useReveal();
    const blogRef       = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Retail SaaS Platform";
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    /* ── Features data ── */
    const features = [
        {
            icon: '📊',
            title: 'Real-Time Analytics',
            desc: 'Track sales, revenue, and inventory in real time with beautiful charts and actionable insights.',
        },
        {
            icon: '🛒',
            title: 'POS & Online Orders',
            desc: 'Handle walk-in customers and online orders from a single, unified dashboard effortlessly.',
        },
        {
            icon: '📦',
            title: 'Smart Inventory',
            desc: 'Auto-track stock levels, get low-stock alerts, and manage product variants with ease.',
        },
        {
            icon: '🏷️',
            title: 'Barcode & QR Printing',
            desc: 'Generate and print custom barcode and QR labels for products in seconds.',
        },
        {
            icon: '👥',
            title: 'Role-Based Access',
            desc: 'Assign Super Admin, Admin, or Client roles with granular permission controls.',
        },
        {
            icon: '🔒',
            title: 'Enterprise Security',
            desc: 'OTP authentication, JWT tokens, and end-to-end encryption keep your data safe.',
        },
    ];

    /* ── Pricing data ── */
    const plans = [
        {
            plan: 'Starter',
            price: '999',
            desc: 'Perfect for small businesses getting started.',
            popular: false,
            cta: 'Get Started',
            features: [
                { text: '1 Store Location' },
                { text: 'Up to 500 Products' },
                { text: 'POS & Online Orders' },
                { text: 'Basic Analytics' },
                { text: 'Email Support' },
                { text: 'Barcode Printing', off: true },
                { text: 'Multi-role Access', off: true },
            ],
        },
        {
            plan: 'Business',
            price: '2,499',
            desc: 'For growing businesses with advanced needs.',
            popular: true,
            cta: 'Start Free Trial',
            features: [
                { text: '5 Store Locations' },
                { text: 'Unlimited Products' },
                { text: 'POS & Online Orders' },
                { text: 'Advanced Analytics' },
                { text: 'Priority Support' },
                { text: 'Barcode & QR Printing' },
                { text: 'Multi-role Access' },
            ],
        },
        {
            plan: 'Enterprise',
            price: 'Custom',
            desc: 'Tailored solutions for large enterprises.',
            popular: false,
            cta: 'Contact Sales',
            features: [
                { text: 'Unlimited Locations' },
                { text: 'Unlimited Products' },
                { text: 'All Order Channels' },
                { text: 'Custom Analytics' },
                { text: 'Dedicated Manager' },
                { text: 'White-label Option' },
                { text: 'SLA Guarantee' },
            ],
        },
    ];

    /* ── Testimonials ── */
    const testimonials = [
        {
            stars: '⭐⭐⭐⭐⭐',
            text: '"Namastute transformed our retail operations. We cut manual work by 80% and our stock accuracy is now near-perfect."',
            name: 'Priya S.',
            role: 'Owner, StyleHub Boutique',
            avatar: 'P',
        },
        {
            stars: '⭐⭐⭐⭐⭐',
            text: '"The POS integration is seamless. Our staff picked it up in minutes and customers love the faster checkout."',
            name: 'Rohan M.',
            role: 'Manager, FreshMart Grocery',
            avatar: 'R',
        },
        {
            stars: '⭐⭐⭐⭐⭐',
            text: '"Best SaaS investment we\'ve made. The multi-role access lets different teams work independently without conflicts."',
            name: 'Ananya K.',
            role: 'CTO, TechRetail Co.',
            avatar: 'A',
        },
    ];

    return (
        <div className="lp-root">
            <WebsiteNavbar />

            {/* ── Hero ────────────────────────── */}
            <section className="lp-hero">
                <div className="lp-hero-bg" />
                <div className="lp-hero-grid" />
                <div className="lp-orb lp-orb-1" />
                <div className="lp-orb lp-orb-2" />

                <div className="lp-hero-content">
                    <div className="lp-hero-badge">
                        <span className="lp-hero-badge-dot" />
                        🚀 India's #1 Retail SaaS Platform
                    </div>

                    <h1 className="lp-hero-title">
                        Manage Your Business<br />
                        With <span className="gradient-text">Namastute POS</span>
                    </h1>

                    <p className="lp-hero-subtitle">
                        The all-in-one platform for inventory management, POS billing,
                        online orders, and real-time analytics — built for modern Indian retailers.
                    </p>

                    <div className="lp-hero-actions">
                        <button
                            id="hero-get-started"
                            className="lp-btn-hero"
                            onClick={() => navigate('/register')}
                        >
                            Get Started Free →
                        </button>
                        <button
                            className="lp-btn-outline"
                            onClick={() => scrollTo('how-it-works')}
                        >
                            ▶ See How It Works
                        </button>
                    </div>

                    <div className="lp-hero-stats">
                        <div className="lp-stat">
                            <div className="lp-stat-num">500<span>+</span></div>
                            <div className="lp-stat-label">Active Businesses</div>
                        </div>
                        <div className="lp-stat-divider" />
                        <div className="lp-stat">
                            <div className="lp-stat-num">₹12<span>Cr+</span></div>
                            <div className="lp-stat-label">Transactions Processed</div>
                        </div>
                        <div className="lp-stat-divider" />
                        <div className="lp-stat">
                            <div className="lp-stat-num">99.9<span>%</span></div>
                            <div className="lp-stat-label">Uptime SLA</div>
                        </div>
                        <div className="lp-stat-divider" />
                        <div className="lp-stat">
                            <div className="lp-stat-num">4.9<span>★</span></div>
                            <div className="lp-stat-label">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Dashboard Showcase ──────────── */}
            <section className="lp-mockup-section">
                <div className="lp-mockup-wrapper">
                    <DashboardShowcase />
                    <div className="lp-mockup-glow" />
                </div>
            </section>

            {/* ── Features ────────────────────── */}
            <section id="features">
                <NodeFeatures 
                    badgeTitle="Features"
                    title={<>All Features in One</>}
                    subtitle="From inventory to billing to analytics — Namastute is the only tool your team will ever need."
                    features={features}
                    centerNode={{
                        title: "Namastute",
                        icon: <svg viewBox="0 0 24 24" width="48" height="48" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                    }}
                />
            </section>

            {/* ── How It Works ────────────────── */}
            <section className="lp-section lp-section-alt" id="how-it-works">
                <div ref={howRef} className="lp-reveal">
                    <div className="lp-section-label">How It Works</div>
                    <h2 className="lp-section-title">Up & Running in Minutes</h2>
                    <p className="lp-section-sub">
                        No technical expertise needed. Get your store live in three simple steps.
                    </p>
                </div>
                <div className="lp-steps">
                    {[
                        { num: '1', title: 'Create Account', desc: 'Sign up free, set up your store profile, and invite your team in under 5 minutes.' },
                        { num: '2', title: 'Add Products', desc: 'Upload your product catalog with categories, variants, and pricing — in bulk or one by one.' },
                        { num: '3', title: 'Start Selling', desc: 'Accept POS and online orders, track inventory, and view real-time analytics instantly.' },
                    ].map((s, i) => (
                        <div key={i} className="lp-step">
                            <div className="lp-step-num">{s.num}</div>
                            <div className="lp-step-title">{s.title}</div>
                            <div className="lp-step-desc">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Pricing ─────────────────────── */}
            <section className="lp-section" id="pricing">
                <div ref={pricingRef} className="lp-reveal">
                    <div className="lp-section-label">Pricing</div>
                    <h2 className="lp-section-title">Simple, Transparent Pricing</h2>
                    <p className="lp-section-sub">
                        No hidden fees. Start free, upgrade when you're ready.
                    </p>
                </div>
                <div className="lp-pricing-grid">
                    {plans.map((p, i) => (
                        <PricingCard key={i} {...p} />
                    ))}
                </div>
            </section>

            {/* ── Testimonials ────────────────── */}
            <section className="lp-section" id="testimonials">
                <div ref={testimonialRef} className="lp-reveal">
                    <div className="lp-section-label">Testimonials</div>
                    <h2 className="lp-section-title">Loved by Retailers Across India</h2>
                    <p className="lp-section-sub">
                        Join hundreds of businesses that trust Namastute every day.
                    </p>
                </div>
                <div className="lp-testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="lp-testimonial-card lp-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                            <div className="lp-testimonial-stars">{t.stars}</div>
                            <div className="lp-testimonial-text">{t.text}</div>
                            <div className="lp-testimonial-author">
                                <div className="lp-testimonial-avatar">{t.avatar}</div>
                                <div>
                                    <div className="lp-testimonial-name">{t.name}</div>
                                    <div className="lp-testimonial-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Blog Preview ────────────────── */}
            <section className="lp-section lp-section-alt" id="blog">
                <div className="lp-reveal" ref={blogRef}>
                    <div className="lp-section-label">Blog</div>
                    <h2 className="lp-section-title">Latest from Our Team</h2>
                    <p className="lp-section-sub">
                        Insights on software, development, and retail technology — straight from the Namastute team.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1200, margin: '0 auto' }}>
                    {[
                        { emoji: '📦', color: 'linear-gradient(135deg,#6366f1,#8b5cf6)', cat: 'Software',    title: 'How Namastute Transformed Retail Inventory', slug: 'namastute-retail-inventory' },
                        { emoji: '🏗️', color: 'linear-gradient(135deg,#10b981,#06b6d4)', cat: 'Development', title: 'Building a Multi-Tenant SaaS with Spring Boot',  slug: 'multi-tenant-saas-spring-boot' },
                        { emoji: '🚀', color: 'linear-gradient(135deg,#ff902f,#ff5f1f)', cat: 'Updates',     title: 'Namastute v2.0 Launch: What\'s New',           slug: 'namastute-v2-launch' },
                    ].map((b, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(`/blog/${b.slug}`)}
                            style={{
                                background: 'var(--glass-bg)',
                                backdropFilter: 'var(--glass-blur)',
                                border: '1.5px solid var(--glass-border)',
                                borderRadius: 20,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                flex: '1 1 280px',
                                maxWidth: 360,
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                        >
                            <div style={{ height: 140, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, opacity: 0.85 }}>{b.emoji}</div>
                            <div style={{ padding: 22 }}>
                                <span style={{ background: 'var(--primary-pale)', color: 'var(--primary-d)', borderRadius: 50, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>{b.cat}</span>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginTop: 12, lineHeight: 1.4, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{b.title}</div>
                                <div style={{ marginTop: 14, color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>Read Article →</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button
                        id="landing-view-all-blogs"
                        className="lp-btn-outline"
                        onClick={() => navigate('/blog')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                        View All Articles →
                    </button>
                </div>
            </section>

            {/* ── CTA ─────────────────────────── */}
            <section className="lp-section lp-cta">
                <div ref={ctaRef} className="lp-cta-inner lp-reveal">
                    <h2 className="lp-cta-title">Ready to Transform<br />Your Business?</h2>
                    <p className="lp-cta-sub">Start your free trial today. No credit card required.</p>
                    <div className="lp-cta-actions">
                        <button
                            id="cta-get-started"
                            className="lp-btn-cta-white"
                            onClick={() => navigate('/register')}
                        >
                            Get Started Free →
                        </button>
                        <button
                            className="lp-btn-cta-outline"
                            onClick={() => navigate('/login')}
                        >
                            Log In to Dashboard
                        </button>
                    </div>
                </div>
            </section>

            <WebsiteFooter />
        </div>
    );
}
