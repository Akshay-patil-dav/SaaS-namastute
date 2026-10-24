import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';
import { DEFAULT_BLOGS } from '../../../data/blogData';
import apiClient, { ENV } from '../../../api/config';
import './BlogPreviewSection.css';

function resolveCoverEmoji(b) {
    if (b?.coverEmoji && !b.coverEmoji.includes('?')) {
        return b.coverEmoji;
    }
    const cat = (b?.category || '').toLowerCase();
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

export default function BlogPreviewSection() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const mapBlog = (b) => {
            const backendBase = ENV.BACKEND_BASE_URL || 'http://localhost:3000';
            const hasImage = Boolean(b.imageUrl);
            const fullImageUrl = hasImage && b.imageUrl.startsWith('/') 
                ? `${backendBase}${b.imageUrl}` 
                : b.imageUrl;

            return {
                id: b.id || b.slug,
                color: b.coverColor || 'linear-gradient(135deg, #ff5b00 0%, #ff782d 100%)',
                emoji: resolveCoverEmoji(b),
                imageUrl: fullImageUrl,
                cat: b.category || 'Updates',
                title: b.title,
                desc: b.excerpt,
                slug: b.slug,
                date: b.createdAt || b.date
                    ? new Date(b.createdAt || b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Recent',
                readTime: typeof b.readTime === 'string' && b.readTime.includes('read') ? b.readTime : `${b.readTime || '5 min'} read`,
                author: b.author || 'Namustutam Team',
                originalBlog: b
            };
        };

        const loadBlogs = async () => {
            try {
                const res = await apiClient.get('/blog-posts');
                if (Array.isArray(res.data) && res.data.length > 0) {
                    const visible = res.data.filter(b => !b.visibility || b.visibility === 'Visible');
                    if (visible.length > 0) {
                        setBlogs(visible.slice(0, 3).map(mapBlog));
                        return;
                    }
                }
            } catch (err) {
                console.warn('API fetch for blog preview fallback:', err);
            }

            // Fallback to cache or defaults
            try {
                const cached = JSON.parse(localStorage.getItem('namustutam_cached_blogs') || '[]');
                if (cached.length > 0) {
                    setBlogs(cached.slice(0, 3).map(mapBlog));
                    return;
                }
            } catch { }

            setBlogs(DEFAULT_BLOGS.slice(0, 3).map(mapBlog));
        };

        loadBlogs();
    }, []);

    return (
        <section className="bps-section" id="blog">
            <div className="bps-background-glow"></div>
            <div className="bps-reveal">
                <div className="bps-section-label">Our Blog</div>
                <h2 className="bps-section-title">Latest from Our Team</h2>
                <p className="bps-section-sub">
                    Insights on software architecture, enterprise development, and retail technology — straight from the engineering team.
                </p>
            </div>
            <div className="bps-grid">
                {blogs.map((b, i) => (
                    <div
                        key={b.id || i}
                        className="bps-card group"
                        onClick={() => navigate(`/blog/${b.slug}`, { state: { blog: b.originalBlog } })}
                    >
                        <div className="bps-card-img-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
                            {b.imageUrl ? (
                                <img 
                                    src={b.imageUrl} 
                                    alt={b.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="bps-card-img" style={{ background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="bps-img-pattern"></div>
                                    <span style={{ fontSize: '48px', opacity: 0.4 }}>{b.emoji}</span>
                                </div>
                            )}
                            <span className="bps-cat">{b.cat}</span>
                        </div>
                        <div className="bps-card-content">
                            <div className="bps-meta">
                                <span className="bps-meta-item"><FiCalendar className="bps-meta-icon" /> {b.date}</span>
                                <span className="bps-meta-item"><FiClock className="bps-meta-icon" /> {b.readTime}</span>
                            </div>
                            <div className="bps-title">{b.title}</div>
                            <p className="bps-desc">{b.desc}</p>
                            <div className="bps-footer-content">
                                <span className="bps-author">{b.author}</span>
                                <div className="bps-read-more">
                                    Read Article <FiArrowRight className="bps-arrow-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bps-footer">
                <button
                    className="bps-btn-outline"
                    onClick={() => navigate('/blog')}
                >
                    View All Articles <FiArrowRight className="bps-btn-icon" />
                </button>
            </div>
        </section>
    );
}
