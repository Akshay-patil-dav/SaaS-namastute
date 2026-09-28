import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';
import { DEFAULT_BLOGS } from '../../../data/blogData';
import './BlogPreviewSection.css';

export default function BlogPreviewSection() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const mapBlog = (b) => ({
            color: b.coverColor || 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            cat: b.category || 'Updates',
            title: b.title,
            desc: b.excerpt,
            slug: b.slug,
            date: new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            readTime: typeof b.readTime === 'string' && b.readTime.includes('read') ? b.readTime : `${b.readTime} read`,
            author: b.author || 'Namustutam Team',
            originalBlog: b
        });

        try {
            const saved = JSON.parse(localStorage.getItem('namustutam_blogs') || '[]');
            const combined = [...saved, ...DEFAULT_BLOGS];
            const seen = new Set();
            const uniqueBlogs = combined.filter(b => { 
                if (seen.has(b.id)) return false; 
                seen.add(b.id); 
                return true; 
            });
            
            setBlogs(uniqueBlogs.slice(0, 3).map(mapBlog));
        } catch {
            setBlogs(DEFAULT_BLOGS.slice(0, 3).map(mapBlog));
        }
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
                        key={i}
                        className="bps-card group"
                        onClick={() => navigate(`/blog/${b.slug}`, { state: { blog: b.originalBlog } })}
                    >
                        <div className="bps-card-img-wrapper">
                            <div className="bps-card-img" style={{ background: b.color }}>
                                <div className="bps-img-pattern"></div>
                            </div>
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
