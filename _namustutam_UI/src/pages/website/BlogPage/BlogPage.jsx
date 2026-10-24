import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Search, Filter, ArrowRight, Clock, Calendar, Eye, Heart, 
    Share2, Sparkles, BookOpen, ChevronRight, TrendingUp, RefreshCw, CheckCircle2 
} from 'lucide-react';
import '../BlogDetail/LandingPage.css';
import '../BlogDetail/BlogPage.css';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import { DEFAULT_BLOGS } from '../../../data/blogData';
import apiClient, { ENV } from '../../../api/config';

/* ── Category Colors ──────────────────────────────────────────────────────── */
const CATEGORY_COLORS = {
    Software:    { bg: 'rgba(99,102,241,0.12)',  color: '#6366f1', border: 'rgba(99,102,241,0.3)' },
    Development: { bg: 'rgba(16,185,129,0.12)', color: '#059669', border: 'rgba(16,185,129,0.3)' },
    Business:    { bg: 'rgba(245,158,11,0.12)', color: '#d97706', border: 'rgba(245,158,11,0.3)' },
    Updates:     { bg: 'rgba(234, 88, 12, 0.12)',  color: '#ea580c', border: 'rgba(234, 88, 12, 0.35)' },
    Tutorial:    { bg: 'rgba(236,72,153,0.12)', color: '#db2777', border: 'rgba(236,72,153,0.3)' },
    News:        { bg: 'rgba(14,165,233,0.12)', color: '#0284c7', border: 'rgba(14,165,233,0.3)' },
    All:         { bg: 'rgba(100,116,139,0.12)',color: '#475569', border: 'rgba(100,116,139,0.3)' },
};

export function getCategoryColor(category) {
    return CATEGORY_COLORS[category] || { 
        bg: 'rgba(234, 88, 12, 0.12)', 
        color: '#ea580c', 
        border: 'rgba(234, 88, 12, 0.35)' 
    };
}

/* ── Safe Cover Emoji Resolver ────────────────────────────────────────────── */
export function resolveCoverEmoji(blog) {
    if (blog?.coverEmoji && !blog.coverEmoji.includes('?')) {
        return blog.coverEmoji;
    }
    const cat = (blog?.category || '').toLowerCase();
    switch (cat) {
        case 'software': return '💻';
        case 'development': return '⚡';
        case 'business': return '📈';
        case 'updates': return '🚀';
        case 'tutorial': return '📚';
        case 'news': return '📰';
        default: return '✨';
    }
}

/* ── Blog Card ───────────────────────────────────────────────────────────── */
function BlogCard({ blog, onClick, delay = 0 }) {
    const [imageError, setImageError] = useState(false);
    const cat = getCategoryColor(blog.category);
    const backendBase = ENV.BACKEND_BASE_URL || 'http://localhost:3000';
    const hasImage = Boolean(blog.imageUrl) && !imageError;
    const fullImageUrl = hasImage && blog.imageUrl.startsWith('/') 
        ? `${backendBase}${blog.imageUrl}` 
        : blog.imageUrl;

    const formattedDate = blog.createdAt || blog.date
        ? new Date(blog.createdAt || blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Recent';

    const authorInitial = (blog.author || 'N').charAt(0).toUpperCase();
    const coverEmoji = resolveCoverEmoji(blog);

    return (
        <article
            className="blog-card"
            style={{ animationDelay: `${Math.min(delay, 300)}ms` }}
            onClick={() => onClick(blog)}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick(blog)}
            aria-label={`Read article: ${blog.title}`}
        >
            {/* Cover */}
            <div 
                className="blog-card-cover" 
                style={{ 
                    background: hasImage ? '#0f172a' : (blog.coverColor || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'),
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {hasImage ? (
                    <img 
                        src={fullImageUrl} 
                        alt={blog.title} 
                        className="blog-card-cover-img"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="blog-card-emoji">{coverEmoji}</span>
                )}
                <div className="blog-card-cover-overlay" />
                
                {/* Floating Category Tag */}
                <div style={{ position: 'absolute', top: '14px', left: '16px', zIndex: 3 }}>
                    <span 
                        className="blog-card-cat" 
                        style={{ 
                            background: 'rgba(15, 23, 42, 0.75)', 
                            color: cat.color,
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${cat.border || 'rgba(255,255,255,0.2)'}`
                        }}
                    >
                        {blog.category || 'General'}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="blog-card-body">
                <div className="blog-card-meta">
                    <span className="blog-card-read" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {blog.readTime || '5 min'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {blog.viewsCount !== undefined && blog.viewsCount !== null && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Eye size={12} /> {blog.viewsCount}
                            </span>
                        )}
                        {blog.likesCount !== undefined && blog.likesCount !== null && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Heart size={12} color="#f43f5e" /> {blog.likesCount}
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.excerpt}</p>

                {/* Tags preview if any */}
                {blog.tags && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                        {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(','))
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((t, idx) => (
                                <span key={idx} style={{ 
                                    fontSize: '10px', 
                                    background: 'var(--surface-sunken, #f8fafc)', 
                                    color: 'var(--text-muted, #64748b)', 
                                    padding: '2px 8px', 
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-soft, #e2e8f0)'
                                }}>
                                    #{t.trim()}
                                </span>
                            ))}
                    </div>
                )}

                <div className="blog-card-footer">
                    <div className="blog-card-author">
                        <div className="blog-card-avatar">{authorInitial}</div>
                        <div>
                            <div className="blog-card-author-name">{blog.author || 'Namustutam Team'}</div>
                            <div className="blog-card-author-date">{formattedDate}</div>
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
    const [imageError, setImageError] = useState(false);
    const cat = getCategoryColor(blog.category);
    const backendBase = ENV.BACKEND_BASE_URL || 'http://localhost:3000';
    const hasImage = Boolean(blog.imageUrl) && !imageError;
    const fullImageUrl = hasImage && blog.imageUrl.startsWith('/') 
        ? `${backendBase}${blog.imageUrl}` 
        : blog.imageUrl;

    const formattedDate = blog.createdAt || blog.date
        ? new Date(blog.createdAt || blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Recently Published';

    const authorInitial = (blog.author || 'N').charAt(0).toUpperCase();
    const coverEmoji = resolveCoverEmoji(blog);

    return (
        <div 
            className="blog-featured" 
            onClick={() => onClick(blog)} 
            tabIndex={0} 
            onKeyDown={e => e.key === 'Enter' && onClick(blog)}
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            <div 
                className="blog-featured-cover" 
                style={{ 
                    background: hasImage ? '#090d16' : (blog.coverColor || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'),
                    position: 'relative'
                }}
            >
                {hasImage ? (
                    <img 
                        src={fullImageUrl} 
                        alt={blog.title} 
                        className="blog-featured-cover-img"
                        loading="eager"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="blog-featured-emoji">{coverEmoji}</span>
                )}
                
                <div className="blog-featured-overlay" />
                
                <div className="blog-featured-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span 
                            className="blog-card-cat" 
                            style={{ 
                                background: 'rgba(255,255,255,0.2)', 
                                color: 'white', 
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Sparkles size={11} /> Featured Article · {blog.category}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> {blog.readTime || '5 min'}
                        </span>
                        {blog.viewsCount > 0 && (
                            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Eye size={13} /> {blog.viewsCount} reads
                            </span>
                        )}
                    </div>

                    <h2 className="blog-featured-title">{blog.title}</h2>
                    <p className="blog-featured-excerpt">{blog.excerpt}</p>

                    <div className="blog-featured-footer">
                        <div className="blog-card-author" style={{ gap: 12 }}>
                            <div className="blog-card-avatar" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>
                                {authorInitial}
                            </div>
                            <div>
                                <div className="blog-card-author-name" style={{ color: 'rgba(255,255,255,0.95)', fontSize: '14px' }}>
                                    {blog.author || 'Akshay Patil'}
                                </div>
                                <div className="blog-card-author-date" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                    {formattedDate} · {blog.authorRole || 'Founder & CTO'}
                                </div>
                            </div>
                        </div>
                        <button 
                            className="blog-featured-cta" 
                            onClick={e => { e.stopPropagation(); onClick(blog); }}
                        >
                            Read Full Article →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Main Dynamic Blog Page ───────────────────────────────────────────────── */
export default function BlogPage() {
    const navigate = useNavigate();
    const [allBlogs, setAllBlogs] = useState(() => {
        try {
            const cached = JSON.parse(localStorage.getItem('namustutam_cached_blogs') || '[]');
            if (Array.isArray(cached) && cached.length > 0) return cached;
            return DEFAULT_BLOGS;
        } catch {
            return DEFAULT_BLOGS;
        }
    });

    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('');
    const POSTS_PER_PAGE = 6;

    // Fetch dynamic posts from API on mount
    const fetchLiveBlogs = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/blog-posts');
            if (Array.isArray(res.data) && res.data.length > 0) {
                // Filter visible only for public page
                const visiblePosts = res.data.filter(p => !p.visibility || p.visibility === 'Visible');
                if (visiblePosts.length > 0) {
                    setAllBlogs(visiblePosts);
                    try {
                        localStorage.setItem('namustutam_cached_blogs', JSON.stringify(visiblePosts));
                    } catch (e) {
                        console.warn('Could not cache blogs', e);
                    }
                }
            }
        } catch (err) {
            console.warn('API fetch failed, retaining cached or default blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Namustutam Blog | Engineering & Retail Tech Insights';
        fetchLiveBlogs();
    }, []);

    const openBlog = (blog) => {
        navigate(`/blog/${blog.slug}`, { state: { blog } });
    };

    // Dynamically derive categories and counts from active blogs
    const categories = useMemo(() => {
        const set = new Set();
        allBlogs.forEach(b => {
            if (b.category) set.add(b.category);
        });
        return ['All', ...Array.from(set)];
    }, [allBlogs]);

    // Filter and Sort
    const filtered = useMemo(() => {
        return allBlogs.filter(b => {
            const matchCat = activeCategory === 'All' || (b.category && b.category.toLowerCase() === activeCategory.toLowerCase());
            const q = searchQuery.toLowerCase().trim();
            const tagsMatch = Array.isArray(b.tags)
                ? b.tags.some(t => t.toLowerCase().includes(q))
                : (b.tags && b.tags.toLowerCase().includes(q));
            const matchSearch = !q 
                || (b.title && b.title.toLowerCase().includes(q))
                || (b.excerpt && b.excerpt.toLowerCase().includes(q))
                || (b.category && b.category.toLowerCase().includes(q))
                || tagsMatch;
            return matchCat && matchSearch;
        }).sort((a, b) => {
            if (sortBy === 'popular') {
                return (b.viewsCount || 0) - (a.viewsCount || 0);
            }
            if (sortBy === 'liked') {
                return (b.likesCount || 0) - (a.likesCount || 0);
            }
            // default 'newest'
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB - dateA;
        });
    }, [allBlogs, activeCategory, searchQuery, sortBy]);

    const featured = filtered[0] || null;
    const gridBlogs = filtered.slice(1);
    const totalPages = Math.ceil(gridBlogs.length / POSTS_PER_PAGE);
    const paginated = gridBlogs.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

    const handleCatChange = (cat) => {
        setActiveCategory(cat);
        setPage(1);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        setNewsletterStatus('subscribed');
        setTimeout(() => {
            setNewsletterEmail('');
        }, 3000);
    };

    return (
        <div className="lp-root blog-root">
            <WebsiteNavbar />

            {/* ── Hero Banner ──────────────────── */}
            <section className="blog-hero">
                <div className="lp-hero-bg" />
                <div className="lp-hero-grid" />
                <div className="lp-orb lp-orb-1" />
                <div className="lp-orb lp-orb-2" />
                <div className="blog-hero-content">
                    <div className="lp-section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={14} /> Official Namustutam Publication
                    </div>
                    <h1 className="blog-hero-title">
                        Insights on <span className="gradient-text">Software & Tech</span>
                    </h1>
                    <p className="blog-hero-sub">
                        Deep-dives on SaaS architecture, full-stack Spring Boot & React engineering, retail technology, and enterprise business scaling.
                    </p>

                    {/* Search & Sort Controls */}
                    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="blog-search-wrap" style={{ maxWidth: '100%' }}>
                            <span className="blog-search-icon"><Search size={16} color="var(--text-muted)" /></span>
                            <input
                                id="blog-search-input"
                                type="text"
                                className="blog-search-input"
                                placeholder="Search by keywords, tags, or topics…"
                                value={searchQuery}
                                onChange={handleSearch}
                                aria-label="Search blog articles"
                            />
                            {searchQuery && (
                                <button className="blog-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
                            )}
                        </div>

                        {/* Sort & Live Refresh Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--surface-solid, #ffffff)', padding: '4px', borderRadius: '30px', border: '1px solid var(--border-soft, #e2e8f0)', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                                <button 
                                    className={`blog-sort-pill ${sortBy === 'newest' ? 'active' : ''}`}
                                    onClick={() => setSortBy('newest')}
                                >
                                    <Clock size={12} /> Newest
                                </button>
                                <button 
                                    className={`blog-sort-pill ${sortBy === 'popular' ? 'active' : ''}`}
                                    onClick={() => setSortBy('popular')}
                                >
                                    <TrendingUp size={12} /> Most Read
                                </button>
                                <button 
                                    className={`blog-sort-pill ${sortBy === 'liked' ? 'active' : ''}`}
                                    onClick={() => setSortBy('liked')}
                                >
                                    <Heart size={12} /> Top Liked
                                </button>
                            </div>

                            <button 
                                onClick={fetchLiveBlogs} 
                                title="Refresh live articles"
                                style={{ 
                                    background: 'var(--surface-solid, #ffffff)', 
                                    border: '1px solid var(--border-soft, #e2e8f0)', 
                                    color: 'var(--text-muted, #64748b)', 
                                    borderRadius: '50%', 
                                    width: '34px', 
                                    height: '34px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
                                }}
                            >
                                <RefreshCw size={14} className={loading ? 'spin' : ''} />
                            </button>
                        </div>

                        {/* Search status counter */}
                        <div style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>
                            {searchQuery ? (
                                <span>Found <strong>{filtered.length}</strong> matching articles for "{searchQuery}"</span>
                            ) : (
                                <span>Showing <strong>{filtered.length}</strong> articles across {categories.length - 1} topics</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Dynamic Category Filter Bar ──────────────── */}
            <div className="blog-filter-bar">
                {categories.map(cat => {
                    const count = cat === 'All' 
                        ? allBlogs.length 
                        : allBlogs.filter(b => b.category && b.category.toLowerCase() === cat.toLowerCase()).length;
                    return (
                        <button
                            key={cat}
                            id={`blog-cat-${cat.toLowerCase()}`}
                            className={`blog-filter-btn ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                            onClick={() => handleCatChange(cat)}
                        >
                            {cat}
                            <span className="blog-filter-count">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Main Content ─────────────────── */}
            <main className="blog-main">
                {filtered.length === 0 ? (
                    <div className="blog-empty">
                        <div className="blog-empty-icon">📭</div>
                        <h3>No articles found</h3>
                        <p>No published articles match "{searchQuery}" in category "{activeCategory}".</p>
                        <button 
                            className="lp-btn-primary" 
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Featured Hero Article (shown when on page 1) */}
                        {featured && page === 1 && (
                            <FeaturedCard blog={featured} onClick={openBlog} />
                        )}

                        {/* Article Grid */}
                        {paginated.length > 0 ? (
                            <div className="blog-grid">
                                {paginated.map((b, i) => (
                                    <BlogCard key={b.id || b.slug} blog={b} onClick={openBlog} delay={i * 50} />
                                ))}
                            </div>
                        ) : page > 1 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <p style={{ color: 'var(--text-muted)' }}>No more articles on this page.</p>
                                <button className="lp-btn-ghost" onClick={() => setPage(1)}>Back to First Page</button>
                            </div>
                        ) : null}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="blog-pagination">
                                <button 
                                    className="blog-page-btn" 
                                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }} 
                                    disabled={page === 1}
                                >
                                    ← Prev
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`blog-page-btn ${page === i + 1 ? 'active' : ''}`}
                                        onClick={() => { setPage(i + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    className="blog-page-btn" 
                                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }} 
                                    disabled={page === totalPages}
                                >
                                    Next →
                                </button>
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
                    <p className="blog-newsletter-sub">
                        Get the latest architectural breakdowns, engineering deep-dives, and SaaS growth strategies delivered to your inbox weekly.
                    </p>

                    {newsletterStatus === 'subscribed' ? (
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            background: 'rgba(16, 185, 129, 0.15)', 
                            color: '#10b981', 
                            padding: '12px 24px', 
                            borderRadius: '30px', 
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            fontWeight: 600,
                            fontSize: '14px'
                        }}>
                            <CheckCircle2 size={18} /> You're subscribed! Welcome to our developer circle.
                        </div>
                    ) : (
                        <form className="blog-newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <input 
                                id="newsletter-email" 
                                type="email" 
                                className="blog-newsletter-input" 
                                placeholder="Enter your work email address…" 
                                value={newsletterEmail}
                                onChange={e => setNewsletterEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="lp-btn-primary blog-newsletter-btn">
                                Subscribe →
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <WebsiteFooter />

            <style>{`
                .blog-sort-pill {
                    background: transparent;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-muted, #64748b);
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.2s ease;
                }
                .blog-sort-pill:hover {
                    color: var(--text, #0f172a);
                }
                .blog-sort-pill.active {
                    background: var(--gradient, linear-gradient(135deg, #ff620b 0%, #c2410c 100%));
                    color: white;
                    box-shadow: 0 2px 8px rgba(234, 88, 12, 0.28);
                }
                .blog-card-cover-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }
                .blog-card:hover .blog-card-cover-img {
                    transform: scale(1.05);
                }
                .blog-featured-cover-img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    inset: 0;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .blog-featured:hover .blog-featured-cover-img {
                    transform: scale(1.03);
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin {
                    animation: spin 0.8s linear infinite;
                }
            `}</style>
        </div>
    );
}
