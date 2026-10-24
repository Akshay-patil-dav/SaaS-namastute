import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { 
    Clock, Calendar, Eye, Heart, Share2, Copy, Check, 
    ArrowLeft, Bookmark, MessageSquare, Sparkles, Send,
    Twitter, Linkedin, ExternalLink, ChevronRight, User, ThumbsUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './BlogPage.css';
import './LandingPage.css';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import { DEFAULT_BLOGS } from '../../../data/blogData';
import apiClient, { ENV } from '../../../api/config';

const CATEGORY_COLORS = {
    Software:    { bg: 'rgba(99,102,241,0.12)',  color: '#6366f1', border: 'rgba(99,102,241,0.3)' },
    Development: { bg: 'rgba(16,185,129,0.12)', color: '#059669', border: 'rgba(16,185,129,0.3)' },
    Business:    { bg: 'rgba(245,158,11,0.12)', color: '#d97706', border: 'rgba(245,158,11,0.3)' },
    Updates:     { bg: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', border: 'rgba(234, 88, 12, 0.35)' },
    Tutorial:    { bg: 'rgba(236,72,153,0.12)', color: '#db2777', border: 'rgba(236,72,153,0.3)' },
    News:        { bg: 'rgba(14,165,233,0.12)', color: '#0284c7', border: 'rgba(14,165,233,0.3)' },
    All:         { bg: 'rgba(100,116,139,0.12)',color: '#475569', border: 'rgba(100,116,139,0.3)' },
};

function getCategoryColor(category) {
    return CATEGORY_COLORS[category] || { 
        bg: 'rgba(234, 88, 12, 0.12)', 
        color: '#ea580c', 
        border: 'rgba(234, 88, 12, 0.35)' 
    };
}

function resolveCoverEmoji(blog) {
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

export default function BlogDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { slug } = useParams();

    // Initial state from location.state if present or cache
    const [blog, setBlog] = useState(() => {
        if (location.state?.blog) return location.state.blog;
        try {
            const cached = JSON.parse(localStorage.getItem('namustutam_cached_blogs') || '[]');
            const found = cached.find(b => b.slug === slug);
            if (found) return found;
        } catch { }
        return DEFAULT_BLOGS.find(b => b.slug === slug) || null;
    });

    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(!blog || !blog.content);
    const [related, setRelated] = useState([]);
    const [likesCount, setLikesCount] = useState(blog?.likesCount || 0);
    const [hasLiked, setHasLiked] = useState(() => {
        try {
            const likedList = JSON.parse(localStorage.getItem('namustutam_liked_blogs') || '[]');
            return likedList.includes(slug);
        } catch { return false; }
    });
    const [copied, setCopied] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    // Reader Discussion / Comments State
    const [comments, setComments] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(`blog_comments_${slug}`) || '[]');
        } catch { return []; }
    });
    const [commentAuthor, setCommentAuthor] = useState('');
    const [commentText, setCommentText] = useState('');

    // Fetch dynamic article by slug from API
    useEffect(() => {
        let isMounted = true;
        const fetchArticle = async () => {
            try {
                const res = await apiClient.get(`/blog-posts/slug/${slug}`);
                if (res.data && isMounted) {
                    setBlog(res.data);
                    setLikesCount(res.data.likesCount || 0);
                    document.title = `${res.data.title} | Namustutam Blog`;
                }
            } catch (err) {
                console.warn('Could not fetch article by slug from backend, using fallback:', err);
                if (!blog) {
                    const fallback = DEFAULT_BLOGS.find(b => b.slug === slug);
                    if (fallback && isMounted) {
                        setBlog(fallback);
                        setLikesCount(fallback.likesCount || 0);
                        document.title = `${fallback.title} | Namustutam Blog`;
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchArticle();
        return () => { isMounted = false; };
    }, [slug]);

    // Fetch related articles
    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await apiClient.get('/blog-posts');
                if (Array.isArray(res.data)) {
                    const filtered = res.data
                        .filter(b => b.slug !== slug && (!b.visibility || b.visibility === 'Visible'))
                        .slice(0, 3);
                    setRelated(filtered);
                }
            } catch {
                const fallbackRelated = DEFAULT_BLOGS.filter(b => b.slug !== slug).slice(0, 3);
                setRelated(fallbackRelated);
            }
        };
        fetchRelated();
    }, [slug]);

    // Scroll reading progress listener
    useEffect(() => {
        window.scrollTo(0, 0);

        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
                setReadingProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    // Handle Like
    const handleLike = async () => {
        if (hasLiked) return;
        setLikesCount(prev => prev + 1);
        setHasLiked(true);

        try {
            const likedList = JSON.parse(localStorage.getItem('namustutam_liked_blogs') || '[]');
            likedList.push(slug);
            localStorage.setItem('namustutam_liked_blogs', JSON.stringify(likedList));
        } catch { }

        if (blog?.id) {
            try {
                await apiClient.post(`/blog-posts/${blog.id}/like`);
            } catch (err) {
                console.warn('Like request failed on backend:', err);
            }
        }
    };

    // Share handlers
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleShareWhatsApp = () => {
        const text = encodeURIComponent(`Read "${blog?.title}" on Namustutam:\n${currentUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    const handleShareTwitter = () => {
        const text = encodeURIComponent(`"${blog?.title}" via @Namustutam`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
    };

    const handleShareLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
    };

    // Submit comment
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment = {
            id: Date.now(),
            author: commentAuthor.trim() || 'Software Engineer',
            text: commentText.trim(),
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        const updated = [newComment, ...comments];
        setComments(updated);
        try {
            localStorage.setItem(`blog_comments_${slug}`, JSON.stringify(updated));
        } catch { }

        setCommentText('');
    };

    if (loading) {
        return (
            <div className="lp-root blog-detail-root">
                <WebsiteNavbar />
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        border: '3px solid rgba(255, 255, 255, 0.1)',
                        borderTopColor: '#ea580c',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                    }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Loading article...</p>
                </div>
                <WebsiteFooter />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="lp-root blog-detail-root">
                <WebsiteNavbar />
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 64 }}>📭</div>
                    <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>Article Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>This article may have been archived or moved.</p>
                    <button className="lp-btn-primary" onClick={() => navigate('/blog')}>Browse All Articles</button>
                </div>
                <WebsiteFooter />
            </div>
        );
    }

    const cat = getCategoryColor(blog.category);
    const backendBase = ENV.BACKEND_BASE_URL || 'http://localhost:3000';
    const hasImage = Boolean(blog.imageUrl) && !imageError;
    const fullImageUrl = hasImage && blog.imageUrl.startsWith('/') 
        ? `${backendBase}${blog.imageUrl}` 
        : blog.imageUrl;
    const coverEmoji = resolveCoverEmoji(blog);

    const formattedDate = blog.createdAt || blog.date
        ? new Date(blog.createdAt || blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Recently Published';

    const authorInitial = (blog.author || 'N').charAt(0).toUpperCase();

    return (
        <div className="lp-root blog-detail-root">
            {/* ── Reading Progress Bar ────────────────── */}
            <div 
                className="blog-reading-progress"
                style={{ width: `${readingProgress}%` }}
            />

            <WebsiteNavbar />

            {/* ── Cover Hero Header ──────────────────────── */}
            <div 
                className="blog-detail-cover" 
                style={{ 
                    background: hasImage ? '#090d16' : (blog.coverColor || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'),
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {hasImage ? (
                    <img 
                        src={fullImageUrl} 
                        alt={blog.title} 
                        className="blog-detail-hero-img"
                        loading="eager"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="blog-detail-cover-emoji">{coverEmoji}</span>
                )}
                
                <div className="blog-detail-cover-overlay" />
                
                <div className="blog-detail-cover-content">
                    {/* Breadcrumbs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, fontSize: 13, color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/blog" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Blog</Link>
                        <ChevronRight size={12} />
                        <span style={{ color: cat.color, fontWeight: 600 }}>{blog.category}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                        <span 
                            className="blog-card-cat" 
                            style={{ 
                                background: 'rgba(255,255,255,0.2)', 
                                color: 'white',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.35)'
                            }}
                        >
                            {blog.category}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={13} /> {blog.readTime || '5 min'} read
                        </span>
                        {blog.viewsCount > 0 && (
                            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Eye size={13} /> {blog.viewsCount} reads
                            </span>
                        )}
                    </div>

                    <h1 className="blog-detail-cover-title">{blog.title}</h1>
                </div>
            </div>

            {/* ── Article Layout ──────────────────────── */}
            <div className="blog-detail-layout">
                {/* Main Article Body */}
                <article>
                    {/* Meta Bar */}
                    <div className="blog-detail-meta-bar">
                        <div className="blog-detail-author-info">
                            <div className="blog-detail-avatar">{authorInitial}</div>
                            <div>
                                <div className="blog-detail-author-name">{blog.author || 'Akshay Patil'}</div>
                                <div className="blog-detail-author-role">{blog.authorRole || 'Founder & CTO'}</div>
                            </div>
                        </div>

                        <span className="blog-detail-dot">·</span>
                        <span className="blog-detail-date" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={13} /> {formattedDate}
                        </span>

                        {/* Social Share Group */}
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button 
                                onClick={handleCopyLink} 
                                className="blog-share-btn"
                                title="Copy article link"
                            >
                                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                                <span style={{ fontSize: 12 }}>{copied ? 'Copied!' : 'Share'}</span>
                            </button>
                            <button onClick={handleShareWhatsApp} className="blog-share-icon-btn" title="Share on WhatsApp">
                                💬
                            </button>
                            <button onClick={handleShareTwitter} className="blog-share-icon-btn" title="Share on Twitter / X">
                                𝕏
                            </button>
                            <button onClick={handleShareLinkedIn} className="blog-share-icon-btn" title="Share on LinkedIn">
                                in
                            </button>
                        </div>
                    </div>

                    {/* Excerpt Lead Box */}
                    {blog.excerpt && (
                        <div className="blog-detail-lead-box">
                            <p style={{ margin: 0, fontSize: 16, fontStyle: 'italic', color: 'var(--text-2)', lineHeight: 1.7 }}>
                                "{blog.excerpt}"
                            </p>
                        </div>
                    )}

                    {/* Markdown Content */}
                    <div className="blog-detail-article">
                        <ReactMarkdown
                            components={{
                                img: ({ node, src, alt, ...props }) => {
                                    const resolvedSrc = src?.startsWith('/') && !src.startsWith('//')
                                        ? `${ENV.BACKEND_BASE_URL || ''}${src}`
                                        : src;
                                    return (
                                        <figure className="blog-article-figure" style={{ margin: '32px 0', textAlign: 'center' }}>
                                            <img
                                                src={resolvedSrc}
                                                alt={alt || 'Blog illustration'}
                                                loading="lazy"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                                                    margin: '0 auto',
                                                    display: 'block'
                                                }}
                                                {...props}
                                            />
                                            {alt && alt.trim() !== '' && alt !== 'Blog Visual' && (
                                                <figcaption style={{
                                                    marginTop: '10px',
                                                    fontSize: '13px',
                                                    color: 'var(--text-muted, #94a3b8)',
                                                    fontStyle: 'italic'
                                                }}>
                                                    {alt}
                                                </figcaption>
                                            )}
                                        </figure>
                                    );
                                },
                                a: ({ node, href, children, ...props }) => {
                                    const isDirectImage = typeof href === 'string' && (
                                        /\.(jpeg|jpg|gif|png|webp|svg|avif|bmp)($|\?)/i.test(href) ||
                                        href.includes('images.unsplash.com') ||
                                        href.includes('res.cloudinary.com') ||
                                        href.includes('imgur.com') ||
                                        href.includes('images.pexels.com') ||
                                        href.startsWith('/uploads/')
                                    );
                                    const childStr = Array.isArray(children) ? children.join('') : (children?.toString() || '');
                                    if (isDirectImage && (!childStr || childStr === href || childStr.startsWith('http') || childStr.startsWith('/uploads/'))) {
                                        const resolvedSrc = href.startsWith('/') && !href.startsWith('//')
                                            ? `${ENV.BACKEND_BASE_URL || ''}${href}`
                                            : href;
                                        return (
                                            <figure className="blog-article-figure" style={{ margin: '32px 0', textAlign: 'center' }}>
                                                <img
                                                    src={resolvedSrc}
                                                    alt="Blog visual"
                                                    loading="lazy"
                                                    style={{
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                                                        margin: '0 auto',
                                                        display: 'block'
                                                    }}
                                                    onError={e => { e.target.style.display = 'none'; }}
                                                />
                                            </figure>
                                        );
                                    }
                                    return (
                                        <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#ff620b', textDecoration: 'underline' }} {...props}>
                                            {children}
                                        </a>
                                    );
                                }
                            }}
                        >
                            {blog.content ? blog.content.replace(
                                /(^|\n)(https?:\/\/[^\s]+?\.(?:png|jpe?g|webp|gif|svg|avif|bmp)(?:\?[^\s]*)?|\/uploads\/[^\s]+?\.(?:png|jpe?g|webp|gif|svg|avif)|https?:\/\/(?:images\.unsplash\.com|res\.cloudinary\.com|images\.pexels\.com|imgur\.com)[^\s]+)(\n|$)/gi,
                                (match, p1, url, p3) => `${p1}![Blog Visual](${url})${p3}`
                            ) : ''}
                        </ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {blog.tags && (
                        <div className="blog-detail-tags">
                            {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(','))
                                .filter(Boolean)
                                .map((tag, i) => (
                                    <span key={i} className="blog-detail-tag">#{tag.trim()}</span>
                                ))}
                        </div>
                    )}

                    {/* Interactive Like & Clap Bar */}
                    <div className="blog-detail-reactions-bar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button 
                                onClick={handleLike} 
                                className={`blog-reaction-heart-btn ${hasLiked ? 'liked' : ''}`}
                                aria-label="Like article"
                            >
                                <Heart size={18} fill={hasLiked ? '#f43f5e' : 'none'} color={hasLiked ? '#f43f5e' : 'currentColor'} />
                                <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                            </button>
                            {hasLiked && (
                                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                    Thanks for reading and liking! ❤️
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <button className="blog-share-btn" onClick={handleCopyLink}>
                                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Reader Comments Section */}
                    <div className="blog-comments-section">
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MessageSquare size={20} color="var(--primary)" />
                            Discussion ({comments.length})
                        </h3>

                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="blog-comment-form">
                            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                <input 
                                    type="text" 
                                    placeholder="Your Name (optional)" 
                                    value={commentAuthor} 
                                    onChange={e => setCommentAuthor(e.target.value)}
                                    className="blog-comment-input"
                                />
                            </div>
                            <textarea 
                                placeholder="Share your perspective or ask a question regarding this article…" 
                                value={commentText} 
                                onChange={e => setCommentText(e.target.value)}
                                rows={3}
                                className="blog-comment-textarea"
                                required
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                <button type="submit" className="lp-btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
                                    <Send size={13} style={{ marginRight: 6 }} /> Post Comment
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        {comments.length > 0 ? (
                            <div className="blog-comments-list">
                                {comments.map(c => (
                                    <div key={c.id} className="blog-comment-card">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.author}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.date}</div>
                                        </div>
                                        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{c.text}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic', marginTop: 16 }}>
                                No comments yet. Be the first to start the discussion!
                            </p>
                        )}
                    </div>

                    {/* Back Navigation */}
                    <div style={{ marginTop: 48 }}>
                        <button className="lp-btn-ghost" onClick={() => navigate('/blog')}>
                            <ArrowLeft size={16} style={{ marginRight: 6 }} /> Back to All Articles
                        </button>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="blog-detail-sidebar">
                    {/* Author Card */}
                    <div className="blog-detail-sidebar-card">
                        <div className="blog-sidebar-title">Author Profile</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                            <div className="blog-detail-avatar" style={{ width: 52, height: 52, fontSize: 22 }}>
                                {authorInitial}
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>
                                    {blog.author || 'Akshay Patil'}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                    {blog.authorRole || 'Founder & Software Architect'}
                                </div>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                            Architecting resilient enterprise software, AI automation pipelines, and high-performance multi-tenant SaaS systems.
                        </p>
                    </div>

                    {/* Related Posts */}
                    {related.length > 0 && (
                        <div className="blog-detail-sidebar-card">
                            <div className="blog-sidebar-title">Related Insights</div>
                            {related.map(r => (
                                <div
                                    key={r.id || r.slug}
                                    className="blog-sidebar-related-item"
                                    onClick={() => navigate(`/blog/${r.slug}`, { state: { blog: r } })}
                                >
                                    <div 
                                        className="blog-sidebar-emoji" 
                                        style={{ background: r.coverColor || 'var(--primary-pale)' }}
                                    >
                                        {resolveCoverEmoji(r)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="blog-sidebar-item-title">{r.title}</div>
                                        <div className="blog-sidebar-item-date">
                                            {r.readTime || '5 min'} · {r.category}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Try Namustutam CTA */}
                    <div className="blog-detail-sidebar-card" style={{ background: 'var(--gradient, linear-gradient(135deg, #ff620b 0%, #c2410c 100%))', border: 'none', color: '#fff' }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>🚀</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 8 }}>
                            Need Custom Software?
                        </div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, marginBottom: 18 }}>
                            Partner with Namustutam to build high-scale SaaS architectures, modern web apps, and automated workflows.
                        </p>
                        <button 
                            className="lp-btn-primary" 
                            style={{ background: 'white', color: '#ea580c', width: '100%', borderRadius: 10, fontWeight: 700 }} 
                            onClick={() => navigate('/contact')}
                        >
                            Schedule Consultation →
                        </button>
                    </div>
                </aside>
            </div>

            <WebsiteFooter />

            <style>{`
                .blog-reading-progress {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 3px;
                    background: var(--gradient, linear-gradient(90deg, #ea580c, #ff620b, #c2410c));
                    z-index: 9999;
                    transition: width 0.1s ease-out;
                    box-shadow: 0 0 10px rgba(234, 88, 12, 0.5);
                }
                .blog-detail-hero-img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    inset: 0;
                    object-fit: cover;
                }
                .blog-share-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: var(--surface-solid);
                    border: 1px solid var(--border-soft);
                    color: var(--text-2);
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .blog-share-btn:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                }
                .blog-share-icon-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: 1px solid var(--border-soft);
                    background: var(--surface-solid);
                    color: var(--text-2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .blog-share-icon-btn:hover {
                    border-color: var(--primary);
                    background: var(--primary-pale, rgba(234, 88, 12, 0.1));
                }
                .blog-detail-lead-box {
                    padding: 20px 24px;
                    background: var(--surface-solid);
                    border-left: 4px solid var(--primary);
                    border-radius: 0 12px 12px 0;
                    margin-bottom: 36px;
                    box-shadow: var(--shadow-sm);
                }
                .blog-detail-reactions-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px;
                    background: var(--surface-solid);
                    border: 1px solid var(--border-soft);
                    border-radius: 14px;
                    margin: 40px 0;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .blog-reaction-heart-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--surface-sunken, rgba(255,255,255,0.05));
                    border: 1px solid var(--border-soft);
                    padding: 8px 18px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .blog-reaction-heart-btn:hover {
                    border-color: #f43f5e;
                    color: #f43f5e;
                    transform: scale(1.03);
                }
                .blog-reaction-heart-btn.liked {
                    background: rgba(244, 63, 94, 0.15);
                    border-color: #f43f5e;
                    color: #f43f5e;
                }
                .blog-comments-section {
                    margin-top: 48px;
                    padding-top: 36px;
                    border-top: 1px solid var(--border-soft);
                }
                .blog-comment-form {
                    background: var(--surface-solid);
                    border: 1px solid var(--border-soft);
                    border-radius: 12px;
                    padding: 18px;
                    margin-bottom: 24px;
                }
                .blog-comment-input {
                    width: 100%;
                    max-width: 320px;
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 1px solid var(--border-soft);
                    background: var(--surface-sunken, rgba(0,0,0,0.2));
                    color: var(--text);
                    font-size: 13px;
                    outline: none;
                }
                .blog-comment-textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 6px;
                    border: 1px solid var(--border-soft);
                    background: var(--surface-sunken, rgba(0,0,0,0.2));
                    color: var(--text);
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;
                    outline: none;
                }
                .blog-comments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    margin-top: 16px;
                }
                .blog-comment-card {
                    padding: 14px 18px;
                    background: var(--surface-solid);
                    border: 1px solid var(--border-soft);
                    border-radius: 10px;
                }
                /* Markdown typography overrides */
                .blog-detail-article h2 {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 24px;
                    font-weight: 800;
                    color: var(--text);
                    margin: 36px 0 16px;
                    letter-spacing: -0.5px;
                }
                .blog-detail-article h3 {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 19px;
                    font-weight: 700;
                    color: var(--text);
                    margin: 28px 0 12px;
                }
                .blog-detail-article p {
                    font-size: 16px;
                    line-height: 1.8;
                    color: var(--text-2);
                    margin-bottom: 20px;
                }
                .blog-detail-article ul, .blog-detail-article ol {
                    margin: 16px 0 24px 24px;
                    color: var(--text-2);
                    line-height: 1.8;
                }
                .blog-detail-article li {
                    margin-bottom: 8px;
                }
                .blog-detail-article code {
                    background: rgba(234, 88, 12, 0.1);
                    color: var(--primary);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-family: monospace;
                }
                .blog-detail-article pre {
                    background: #0f172a;
                    padding: 18px 20px;
                    border-radius: 10px;
                    overflow-x: auto;
                    margin: 24px 0;
                    border: 1px solid var(--border-soft);
                }
                .blog-detail-article pre code {
                    background: transparent;
                    color: #e2e8f0;
                    padding: 0;
                }
                .blog-detail-article blockquote {
                    border-left: 4px solid var(--primary);
                    padding: 8px 18px;
                    margin: 20px 0;
                    background: var(--surface-sunken, rgba(255,255,255,0.03));
                    color: var(--text-muted);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}
