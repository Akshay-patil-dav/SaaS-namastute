import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './BlogPage.css';

/* ── Scroll-reveal hook ─────────────────────────────────────────────────── */
function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); }
            },
            { threshold: 0.08 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

/* ── Nav Logo (shared) ──────────────────────────────────────────────────── */
function NavLogo() {
    return (
        <Link to="/" className="lp-nav-logo">
            <div className="lp-nav-logo-icon">
                {[...Array(6)].map((_, i) => <div key={i} className="lp-nav-logo-dot" />)}
            </div>
            <span className="lp-nav-logo-text">Namas<span>tute</span></span>
        </Link>
    );
}

/* ── Category Badge ──────────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Software', 'Development', 'Business', 'Updates', 'Tutorial'];
const CATEGORY_COLORS = {
    Software:    { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
    Development: { bg: 'rgba(16,185,129,0.10)', color: '#059669' },
    Business:    { bg: 'rgba(245,158,11,0.10)', color: '#d97706' },
    Updates:     { bg: 'rgba(255,144,47,0.10)', color: '#ff6b1a' },
    Tutorial:    { bg: 'rgba(236,72,153,0.10)', color: '#db2777' },
    All:         { bg: 'rgba(100,116,139,0.10)',color: '#475569' },
};

/* ── Default sample blogs (shown when no saved blogs exist) ─────────────── */
const DEFAULT_BLOGS = [
    {
        id: 'b1',
        title: 'How Namastute Transformed Retail Inventory Management',
        slug: 'namastute-retail-inventory',
        excerpt: 'Discover how our AI-powered inventory engine saves modern Indian retailers hours every week and reduces stockouts by 40%.',
        content: `## Introduction\n\nInventory management has long been the Achilles heel of retail businesses across India. With Namastute POS, we set out to fundamentally change that.\n\n## The Problem\n\nManual stock tracking leads to costly errors, overstocking, and missed sales opportunities. Small businesses often rely on spreadsheets that don't scale.\n\n## Our Solution\n\nNamestute's real-time inventory engine automatically tracks every transaction, triggers low-stock alerts, and generates purchase orders — all from one unified dashboard.\n\n## Results\n\n- 40% reduction in stockouts\n- 60% faster stock reconciliation\n- 80% less manual data entry\n\n## Conclusion\n\nModern retail demands modern tools. Namastute gives you the edge to compete — and win.`,
        category: 'Software',
        author: 'Akshay Patil',
        authorRole: 'Founder & CTO',
        date: '2026-04-10',
        readTime: '5 min',
        coverColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        coverEmoji: '📦',
        tags: ['inventory', 'retail', 'saas'],
    },
    {
        id: 'b2',
        title: 'Building a Multi-Tenant SaaS Architecture with Spring Boot',
        slug: 'multi-tenant-saas-spring-boot',
        excerpt: 'A deep dive into how we built a scalable, secure multi-tenant backend that serves hundreds of businesses from a single deployment.',
        content: `## Overview\n\nDesigning a multi-tenant SaaS platform is one of the most challenging architectural decisions you'll make. Here's how we did it at Namastute.\n\n## Database Strategy\n\nWe chose a shared-schema approach with tenant IDs on every table, giving us the best balance of cost efficiency and data isolation.\n\n## Security\n\nEvery API request is intercepted at the filter layer to validate the tenant context before any business logic runs.\n\n## Lessons Learned\n\n1. Plan your tenant isolation model early\n2. Use database-level RLS where possible\n3. Cache aggressively at the tenant level\n\n## Conclusion\n\nWith the right architecture, a single Spring Boot application can serve thousands of tenants reliably.`,
        category: 'Development',
        author: 'Rahul Sharma',
        authorRole: 'Backend Engineer',
        date: '2026-04-05',
        readTime: '8 min',
        coverColor: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        coverEmoji: '🏗️',
        tags: ['spring boot', 'architecture', 'backend'],
    },
    {
        id: 'b3',
        title: 'POS Billing for Indian Retailers: What to Look For',
        slug: 'pos-billing-indian-retailers',
        excerpt: 'A buyer\'s guide for choosing the right POS system for your Indian retail or F&B business.',
        content: `## Why Your POS Choice Matters\n\nYour Point of Sale system is the nerve center of your retail operation. Choosing poorly costs you time, money, and customers.\n\n## Key Features Checklist\n\n- GST-compliant billing\n- Offline mode support\n- Barcode & QR generation\n- Real-time inventory sync\n- Multi-role staff management\n\n## Namastute vs. Alternatives\n\nWe compared five leading platforms on price, features, and Indian compliance. Namastute came out on top for mid-sized retailers.\n\n## Conclusion\n\nDon't settle for generic software. Demand a platform built specifically for Indian retail.`,
        category: 'Business',
        author: 'Priya S.',
        authorRole: 'Product Manager',
        date: '2026-03-28',
        readTime: '6 min',
        coverColor: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        coverEmoji: '🛒',
        tags: ['pos', 'billing', 'retail'],
    },
    {
        id: 'b4',
        title: 'Namastute v2.0 Launch: What\'s New',
        slug: 'namastute-v2-launch',
        excerpt: 'Barcode & QR printing overhaul, role-based access improvements, and a brand-new analytics dashboard — all live now.',
        content: `## What's in v2.0\n\nAfter months of development, we're thrilled to announce Namastute v2.0.\n\n## New Features\n\n### Barcode & QR Printing\nCustomize label sizes, choose which fields to display, and print in bulk.\n\n### Advanced Analytics\nNew sales trend charts, product performance heatmaps, and exportable reports.\n\n### Role-Based Access\nFine-grained permissions for every page and action.\n\n## How to Upgrade\n\nExisting customers are automatically upgraded. No action required.\n\n## Roadmap\n\nV2.1 will bring WhatsApp notifications and UPI payment reconciliation.`,
        category: 'Updates',
        author: 'Akshay Patil',
        authorRole: 'Founder & CTO',
        date: '2026-04-14',
        readTime: '4 min',
        coverColor: 'linear-gradient(135deg, #ff902f 0%, #ff5f1f 100%)',
        coverEmoji: '🚀',
        tags: ['release', 'features', 'update'],
    },
    {
        id: 'b5',
        title: 'How to Set Up Barcode Printing in Under 5 Minutes',
        slug: 'barcode-printing-tutorial',
        excerpt: 'Step-by-step guide to configuring your barcode label printer with Namastute POS — no technical expertise needed.',
        content: `## Prerequisites\n\n- A supported thermal printer (Zebra, TSC, or any USB printer)\n- Namastute POS account (any plan)\n\n## Step 1 — Connect Your Printer\n\nPlug in your printer and install the manufacturer driver. Namastute uses your browser's native print dialog.\n\n## Step 2 — Configure Labels\n\nGo to Print Barcode → Configure. Choose your label size (36mm × 22mm, 38mm × 25mm, etc.) and toggle which fields to display.\n\n## Step 3 — Select Products\n\nSearch for products by name or scan existing barcodes. Add them to your print queue.\n\n## Step 4 — Print\n\nClick "Print" and select your thermal printer from the dialog. Done!\n\n## Tips\n\n- Preview before printing to avoid waste\n- Use the quantity multiplier for bulk jobs`,
        category: 'Tutorial',
        author: 'Dev Team',
        authorRole: 'Engineering',
        date: '2026-03-20',
        readTime: '3 min',
        coverColor: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
        coverEmoji: '🏷️',
        tags: ['tutorial', 'barcode', 'printing'],
    },
    {
        id: 'b6',
        title: '5 Ways to Reduce Retail Shrinkage with Better Inventory Tech',
        slug: 'reduce-retail-shrinkage',
        excerpt: 'Shrinkage costs Indian retailers billions every year. Here are five proven strategies powered by smart inventory software.',
        content: `## The Shrinkage Problem\n\nRetail shrinkage — from theft, damage, or administrative errors — can silently eat 1–3% of your revenue.\n\n## 1. Real-Time Stock Tracking\n\nKnow your exact stock levels at all times. Discrepancies trigger automatic alerts.\n\n## 2. Barcode Scanning on Every Transaction\n\nManual data entry is the #1 cause of administrative shrinkage. Scan everything.\n\n## 3. Role-Based Access Control\n\nLimit who can apply discounts, process returns, and adjust stock.\n\n## 4. Regular Automated Audits\n\nSchedule daily or weekly stock reconciliation reports instead of annual counts.\n\n## 5. Supplier Verification\n\nCross-check inbound deliveries against purchase orders automatically.\n\n## Conclusion\n\nWith the right tools, shrinkage is manageable. Namastute helps you stay in control.`,
        category: 'Business',
        author: 'Ananya K.',
        authorRole: 'Business Analyst',
        date: '2026-03-15',
        readTime: '7 min',
        coverColor: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
        coverEmoji: '📉',
        tags: ['inventory', 'business', 'tips'],
    },
];

/* ── Blog Card ───────────────────────────────────────────────────────────── */
function BlogCard({ blog, onClick, delay = 0 }) {
    const ref = useReveal();
    const cat = CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.All;
    return (
        <article
            ref={ref}
            className="blog-card lp-reveal"
            style={{ transitionDelay: `${delay}ms` }}
            onClick={() => onClick(blog)}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick(blog)}
            aria-label={`Read: ${blog.title}`}
        >
            {/* Cover */}
            <div className="blog-card-cover" style={{ background: blog.coverColor }}>
                <span className="blog-card-emoji">{blog.coverEmoji}</span>
                <div className="blog-card-cover-overlay" />
            </div>

            {/* Body */}
            <div className="blog-card-body">
                <div className="blog-card-meta">
                    <span className="blog-card-cat" style={{ background: cat.bg, color: cat.color }}>
                        {blog.category}
                    </span>
                    <span className="blog-card-read">{blog.readTime} read</span>
                </div>

                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.excerpt}</p>

                <div className="blog-card-footer">
                    <div className="blog-card-author">
                        <div className="blog-card-avatar">{blog.author.charAt(0)}</div>
                        <div>
                            <div className="blog-card-author-name">{blog.author}</div>
                            <div className="blog-card-author-date">
                                {new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    <span className="blog-card-arrow">→</span>
                </div>
            </div>
        </article>
    );
}

/* ── Featured Blog Hero Card ─────────────────────────────────────────────── */
function FeaturedCard({ blog, onClick }) {
    const cat = CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.All;
    return (
        <div className="blog-featured" onClick={() => onClick(blog)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick(blog)}>
            <div className="blog-featured-cover" style={{ background: blog.coverColor }}>
                <span className="blog-featured-emoji">{blog.coverEmoji}</span>
                <div className="blog-featured-overlay" />
                <div className="blog-featured-content">
                    <span className="blog-card-cat" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(6px)' }}>
                        {blog.category}
                    </span>
                    <h2 className="blog-featured-title">{blog.title}</h2>
                    <p className="blog-featured-excerpt">{blog.excerpt}</p>
                    <div className="blog-featured-footer">
                        <div className="blog-card-author" style={{ gap: 10 }}>
                            <div className="blog-card-avatar" style={{ background: 'rgba(255,255,255,0.25)' }}>{blog.author.charAt(0)}</div>
                            <div>
                                <div className="blog-card-author-name" style={{ color: 'rgba(255,255,255,0.9)' }}>{blog.author}</div>
                                <div className="blog-card-author-date" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {blog.readTime} read
                                </div>
                            </div>
                        </div>
                        <button className="blog-featured-cta" onClick={e => { e.stopPropagation(); onClick(blog); }}>
                            Read Article →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Main Blog Page ──────────────────────────────────────────────────────── */
export default function BlogPage() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const POSTS_PER_PAGE = 6;

    // Load blogs: custom + defaults
    const [allBlogs] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('namastute_blogs') || '[]');
            const combined = [...saved, ...DEFAULT_BLOGS];
            // deduplicate by id
            const seen = new Set();
            return combined.filter(b => { if (seen.has(b.id)) return false; seen.add(b.id); return true; });
        } catch { return DEFAULT_BLOGS; }
    });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const scrollTo = (id) => {
        setMenuOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const openBlog = (blog) => navigate(`/blog/${blog.slug}`, { state: { blog } });

    // Filter
    const filtered = allBlogs.filter(b => {
        const matchCat = activeCategory === 'All' || b.category === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.tags?.some(t => t.includes(q));
        return matchCat && matchSearch;
    });

    const featured = filtered[0] || null;
    const gridBlogs = filtered.slice(1);
    const totalPages = Math.ceil(gridBlogs.length / POSTS_PER_PAGE);
    const paginated = gridBlogs.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

    const handleCatChange = (cat) => { setActiveCategory(cat); setPage(1); };
    const handleSearch = (e) => { setSearchQuery(e.target.value); setPage(1); };

    const heroRef = useReveal();

    return (
        <div className="lp-root blog-root">
            {/* ── Navbar ─────────────────────── */}
            <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
                <NavLogo />
                <ul className="lp-nav-links">
                    <li><a href="/#features"     onClick={() => { navigate('/'); setTimeout(() => scrollTo('features'), 100); }}>Features</a></li>
                    <li><a href="/#pricing"       onClick={() => { navigate('/'); setTimeout(() => scrollTo('pricing'), 100); }}>Pricing</a></li>
                    <li><Link to="/blog" className="blog-nav-active">Blog</Link></li>
                </ul>
                <div className="lp-nav-cta">
                    <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Log In</button>
                    <button className="lp-btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
                </div>
                <button className={`lp-hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    <span /><span /><span />
                </button>
            </nav>

            {/* ── Mobile Menu ─────────────────── */}
            <div className={`lp-mobile-menu ${menuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
                <div className="lp-mobile-menu-cta">
                    <a href="#" className="lp-btn-ghost" onClick={() => { setMenuOpen(false); navigate('/login'); }}>Log In</a>
                    <a href="#" className="lp-btn-primary" onClick={() => { setMenuOpen(false); navigate('/register'); }}>Get Started Free</a>
                </div>
            </div>

            {/* ── Hero Banner ──────────────────── */}
            <section className="blog-hero">
                <div className="lp-hero-bg" />
                <div className="lp-hero-grid" />
                <div className="lp-orb lp-orb-1" />
                <div className="lp-orb lp-orb-2" />
                <div ref={heroRef} className="blog-hero-content lp-reveal">
                    <div className="lp-section-label">Our Blog</div>
                    <h1 className="blog-hero-title">
                        Insights on <span className="gradient-text">Software & Development</span>
                    </h1>
                    <p className="blog-hero-sub">
                        Expert articles on SaaS, retail technology, backend development, and business growth — straight from the Namastute team.
                    </p>

                    {/* Search */}
                    <div className="blog-search-wrap">
                        <span className="blog-search-icon">🔍</span>
                        <input
                            id="blog-search-input"
                            type="text"
                            className="blog-search-input"
                            placeholder="Search articles…"
                            value={searchQuery}
                            onChange={handleSearch}
                            aria-label="Search blog articles"
                        />
                        {searchQuery && (
                            <button className="blog-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Category Filter ──────────────── */}
            <div className="blog-filter-bar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        id={`blog-cat-${cat.toLowerCase()}`}
                        className={`blog-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => handleCatChange(cat)}
                    >
                        {cat}
                        <span className="blog-filter-count">
                            {cat === 'All' ? allBlogs.length : allBlogs.filter(b => b.category === cat).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Main Content ─────────────────── */}
            <main className="blog-main">
                {filtered.length === 0 ? (
                    <div className="blog-empty">
                        <div className="blog-empty-icon">📭</div>
                        <h3>No articles found</h3>
                        <p>Try a different category or search term.</p>
                        <button className="lp-btn-primary" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Featured */}
                        {featured && page === 1 && <FeaturedCard blog={featured} onClick={openBlog} />}

                        {/* Grid */}
                        {paginated.length > 0 && (
                            <div className="blog-grid">
                                {paginated.map((b, i) => (
                                    <BlogCard key={b.id} blog={b} onClick={openBlog} delay={i * 60} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="blog-pagination">
                                <button className="blog-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`blog-page-btn ${page === i + 1 ? 'active' : ''}`}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button className="blog-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* ── Newsletter CTA ───────────────── */}
            <section className="blog-newsletter">
                <div className="blog-newsletter-inner">
                    <div className="blog-newsletter-icon">✉️</div>
                    <h2 className="blog-newsletter-title">Stay in the Loop</h2>
                    <p className="blog-newsletter-sub">Get the latest articles on retail tech and SaaS delivered to your inbox weekly.</p>
                    <div className="blog-newsletter-form">
                        <input id="newsletter-email" type="email" className="blog-newsletter-input" placeholder="Enter your email address" />
                        <button className="lp-btn-primary blog-newsletter-btn">Subscribe →</button>
                    </div>
                </div>
            </section>

            {/* ── Footer ──────────────────────── */}
            <footer className="lp-footer">
                <div className="lp-footer-top">
                    <div className="lp-footer-brand">
                        <NavLogo />
                        <p className="lp-footer-desc">India's leading retail SaaS platform helping businesses manage inventory, orders, and analytics from one powerful dashboard.</p>
                    </div>
                    <div>
                        <div className="lp-footer-col-title">Quick Links</div>
                        <ul className="lp-footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/register">Get Started</Link></li>
                            <li><Link to="/login">Log In</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="lp-footer-bottom">
                    <div className="lp-footer-copy">© 2026 Namastute POS. All rights reserved.</div>
                    <div className="lp-footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
