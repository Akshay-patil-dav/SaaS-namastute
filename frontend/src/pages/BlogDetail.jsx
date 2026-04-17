import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import './BlogPage.css';
import './LandingPage.css';

/* ── Simple Markdown Renderer ────────────────────────────────────────────── */
function renderMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul]|<\/[hul])/gm, match => match ? `<p>${match.trim()}</p>` : '')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[hul])/g, '$1')
        .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
}

/* ── Nav Logo ────────────────────────────────────────────────────────────── */
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

/* ── Get all blogs ───────────────────────────────────────────────────────── */
function getAllBlogs() {
    try {
        const saved = JSON.parse(localStorage.getItem('namastute_blogs') || '[]');
        const DEFAULT_IDS = ['b1','b2','b3','b4','b5','b6'];
        // Import defaults inline to avoid circular deps
        return saved;
    } catch { return []; }
}

const CATEGORY_COLORS = {
    Software:    { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
    Development: { bg: 'rgba(16,185,129,0.10)', color: '#059669' },
    Business:    { bg: 'rgba(245,158,11,0.10)', color: '#d97706' },
    Updates:     { bg: 'rgba(255,144,47,0.10)', color: '#ff6b1a' },
    Tutorial:    { bg: 'rgba(236,72,153,0.10)', color: '#db2777' },
    All:         { bg: 'rgba(100,116,139,0.10)',color: '#475569' },
};

export default function BlogDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams();
    const [scrolled, setScrolled] = useState(false);

    // Blog passed via state OR found by slug in localStorage
    const [blog, setBlog] = useState(() => {
        if (location.state?.blog) return location.state.blog;
        try {
            const saved = JSON.parse(localStorage.getItem('namastute_blogs') || '[]');
            return saved.find(b => b.slug === slug) || null;
        } catch { return null; }
    });

    // Related blogs
    const [related, setRelated] = useState([]);
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('namastute_blogs') || '[]');
            const rel = saved.filter(b => b.id !== blog?.id && b.category === blog?.category).slice(0, 3);
            setRelated(rel);
        } catch { setRelated([]); }
    }, [blog]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    if (!blog) {
        return (
            <div className="lp-root blog-detail-root">
                <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
                    <NavLogo />
                    <div className="lp-nav-cta">
                        <button className="lp-btn-ghost" onClick={() => navigate('/blog')}>← Back to Blog</button>
                    </div>
                </nav>
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 64 }}>📭</div>
                    <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>Article Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>This article may have been removed or moved.</p>
                    <button className="lp-btn-primary" onClick={() => navigate('/blog')}>Browse All Articles</button>
                </div>
            </div>
        );
    }

    const cat = CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.All;
    const htmlContent = renderMarkdown(blog.content || '');

    return (
        <div className="lp-root blog-detail-root">
            {/* ── Navbar ─────────────────────────────── */}
            <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
                <NavLogo />
                <ul className="lp-nav-links">
                    <li><Link to="/blog" className="blog-nav-active">Blog</Link></li>
                </ul>
                <div className="lp-nav-cta">
                    <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Log In</button>
                    <button className="lp-btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
                </div>
            </nav>

            {/* ── Cover ──────────────────────────────── */}
            <div className="blog-detail-cover" style={{ background: blog.coverColor }}>
                <span className="blog-detail-cover-emoji">{blog.coverEmoji}</span>
                <div className="blog-detail-cover-overlay" />
                <div className="blog-detail-cover-content">
                    <button onClick={() => navigate('/blog')} className="blog-detail-back">← All Articles</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span className="blog-card-cat" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                            {blog.category}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{blog.readTime} read</span>
                    </div>
                    <h1 className="blog-detail-cover-title">{blog.title}</h1>
                </div>
            </div>

            {/* ── Article Layout ──────────────────────── */}
            <div className="blog-detail-layout">
                {/* Main Article */}
                <article>
                    {/* Meta Bar */}
                    <div className="blog-detail-meta-bar">
                        <div className="blog-detail-author-info">
                            <div className="blog-detail-avatar">{blog.author?.charAt(0)}</div>
                            <div>
                                <div className="blog-detail-author-name">{blog.author}</div>
                                <div className="blog-detail-author-role">{blog.authorRole}</div>
                            </div>
                        </div>
                        <span className="blog-detail-dot">·</span>
                        <span className="blog-detail-date">
                            {blog.date ? new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                        </span>
                        <span className="blog-detail-dot">·</span>
                        <span className="blog-detail-read">{blog.readTime} read</span>
                    </div>

                    {/* Content */}
                    {blog.content ? (
                        <div
                            className="blog-detail-article"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    ) : (
                        <div className="blog-detail-article">
                            <p>{blog.excerpt}</p>
                        </div>
                    )}

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="blog-detail-tags">
                            {blog.tags.map((tag, i) => (
                                <span key={i} className="blog-detail-tag">#{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Back */}
                    <div style={{ marginTop: 48 }}>
                        <button className="lp-btn-ghost" onClick={() => navigate('/blog')}>← Back to Blog</button>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="blog-detail-sidebar">
                    {/* Author Card */}
                    <div className="blog-detail-sidebar-card">
                        <div className="blog-sidebar-title">About the Author</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                            <div className="blog-detail-avatar" style={{ width: 50, height: 50, fontSize: 20 }}>{blog.author?.charAt(0)}</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{blog.author}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{blog.authorRole}</div>
                            </div>
                        </div>
                    </div>

                    {/* Related Posts */}
                    {related.length > 0 && (
                        <div className="blog-detail-sidebar-card">
                            <div className="blog-sidebar-title">Related Articles</div>
                            {related.map(r => (
                                <div
                                    key={r.id}
                                    className="blog-sidebar-related-item"
                                    onClick={() => navigate(`/blog/${r.slug}`, { state: { blog: r } })}
                                >
                                    <div className="blog-sidebar-emoji" style={{ background: r.coverColor || 'var(--primary-pale)' }}>
                                        {r.coverEmoji}
                                    </div>
                                    <div>
                                        <div className="blog-sidebar-item-title">{r.title}</div>
                                        <div className="blog-sidebar-item-date">{r.readTime} read · {r.category}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    <div className="blog-detail-sidebar-card" style={{ background: 'var(--gradient)', border: 'none' }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>🚀</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 8 }}>
                            Try Namastute Free
                        </div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, marginBottom: 16 }}>
                            Join 500+ businesses using Namastute POS to manage inventory and grow faster.
                        </p>
                        <button className="lp-btn-primary" style={{ background: 'white', color: 'var(--primary-d)', width: '100%', borderRadius: 10 }} onClick={() => navigate('/register')}>
                            Get Started Free →
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
