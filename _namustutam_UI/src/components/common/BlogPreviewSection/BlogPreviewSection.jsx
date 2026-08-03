import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';
import './BlogPreviewSection.css';

export default function BlogPreviewSection() {
    const navigate = useNavigate();

    const blogs = [
        { 
            color: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', 
            cat: 'Software',    
            title: 'How Namustutam Transformed Retail Inventory Management', 
            desc: 'Discover the technical architecture behind our real-time inventory tracking system.',
            slug: 'namustutam-retail-inventory',
            date: 'Oct 12, 2023',
            readTime: '5 min read',
            author: 'Alex D.'
        },
        { 
            color: 'linear-gradient(135deg, #4D4DFF 0%, #8A2BE2 100%)', 
            cat: 'Development', 
            title: 'Building a Scalable Multi-Tenant SaaS with Spring Boot',  
            desc: 'A deep dive into tenant isolation, database routing, and security best practices.',
            slug: 'multi-tenant-saas-spring-boot',
            date: 'Nov 05, 2023',
            readTime: '8 min read',
            author: 'Sarah K.'
        },
        { 
            color: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)', 
            cat: 'Updates',     
            title: 'Namustutam v2.0 Launch: New Features & Enhancements',           
            desc: 'Everything you need to know about our biggest platform update yet.',
            slug: 'namustutam-v2-launch',
            date: 'Dec 18, 2023',
            readTime: '4 min read',
            author: 'Product Team'
        },
    ];

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
                        onClick={() => navigate(`/blog/${b.slug}`)}
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
