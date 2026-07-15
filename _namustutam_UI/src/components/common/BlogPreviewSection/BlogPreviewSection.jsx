import { useNavigate } from 'react-router-dom';
import './BlogPreviewSection.css';

export default function BlogPreviewSection() {
    const navigate = useNavigate();

    const blogs = [
        { emoji: '📦', color: 'linear-gradient(135deg,#6366f1,#8b5cf6)', cat: 'Software',    title: 'How Namustutam Transformed Retail Inventory', slug: 'namustutam-retail-inventory' },
        { emoji: '🏗️', color: 'linear-gradient(135deg,#10b981,#06b6d4)', cat: 'Development', title: 'Building a Multi-Tenant SaaS with Spring Boot',  slug: 'multi-tenant-saas-spring-boot' },
        { emoji: '🚀', color: 'linear-gradient(135deg,#ff902f,#ff5f1f)', cat: 'Updates',     title: 'Namustutam v2.0 Launch: What\'s New',           slug: 'namustutam-v2-launch' },
    ];

    return (
        <section className="bps-section" id="blog">
            <div className="bps-reveal">
                <div className="bps-section-label">Blog</div>
                <h2 className="bps-section-title">Latest from Our Team</h2>
                <p className="bps-section-sub">
                    Insights on software, development, and retail technology — straight from the Namustutam team.
                </p>
            </div>
            <div className="bps-grid">
                {blogs.map((b, i) => (
                    <div
                        key={i}
                        className="bps-card"
                        onClick={() => navigate(`/blog/${b.slug}`)}
                    >
                        <div className="bps-card-img" style={{ background: b.color }}>
                            {b.emoji}
                        </div>
                        <div className="bps-card-content">
                            <span className="bps-cat">{b.cat}</span>
                            <div className="bps-title">{b.title}</div>
                            <div className="bps-read-more">Read Article →</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bps-footer">
                <button
                    className="bps-btn-outline"
                    onClick={() => navigate('/blog')}
                >
                    View All Articles →
                </button>
            </div>
        </section>
    );
}
