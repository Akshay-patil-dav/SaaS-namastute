import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../BlogDetail/BlogPage.css';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import { DEFAULT_BLOGS } from '../../../data/blogData';

/* ── Category Badge ──────────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Software', 'Development', 'Business', 'Updates', 'Tutorial'];
const CATEGORY_COLORS = {
    Software:    { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
    Development: { bg: 'rgba(16,185,129,0.10)', color: '#059669' },
    Business:    { bg: 'rgba(245,158,11,0.10)', color: '#d97706' },
    Updates:     { bg: 'rgba(255, 179, 138,0.10)', color: '#ff6b1a' },
    Tutorial:    { bg: 'rgba(236,72,153,0.10)', color: '#db2777' },
    All:         { bg: 'rgba(100,116,139,0.10)',color: '#475569' },
};

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
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const POSTS_PER_PAGE = 6;

    // Load blogs: custom + defaults
    const [allBlogs] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('namustutam_blogs') || '[]');
            const combined = [...saved, ...DEFAULT_BLOGS];
            // deduplicate by id
            const seen = new Set();
            return combined.filter(b => { if (seen.has(b.id)) return false; seen.add(b.id); return true; });
        } catch { return DEFAULT_BLOGS; }
    });

    useEffect(() => { window.scrollTo(0, 0); }, []);

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
            <WebsiteNavbar />

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
                        Expert articles on SaaS, retail technology, backend development, and business growth — straight from the Namustutam team.
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

            <WebsiteFooter />
        </div>
    );
}
