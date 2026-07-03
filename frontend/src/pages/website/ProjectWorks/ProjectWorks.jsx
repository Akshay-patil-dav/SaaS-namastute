import { useEffect } from 'react';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import '../ITPortfolio/ITPortfolio.css';
import './ProjectWorks.css';

export default function ProjectWorks() {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Namustutam | Project Works";
    }, []);

    const projects = [
        {
            title: 'Retail POS Platform',
            category: 'SaaS Application',
            img: '/dashboard1.png', 
            color: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
        },
        {
            title: 'CA Firm Management System',
            category: 'Enterprise Dashboard',
            img: '/dashboard2.png',
            color: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)'
        },
        {
            title: 'Consultez Corporate Theme',
            category: 'Web Development',
            img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            title: 'Mobile Banking App',
            category: 'Fintech Solution',
            img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
            color: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)'
        },
        {
            title: 'AI Chatbot Integration',
            category: 'Machine Learning',
            img: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800',
            color: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)'
        },
        {
            title: 'E-commerce Fashion Store',
            category: 'Online Retail',
            img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
            color: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
        }
    ];

    return (
        <div className="lp-root project-works-root">
            <WebsiteNavbar />
            
            <section className="project-works-hero">
                <div className="project-works-hero-content">
                    <div className="lp-section-label" style={{ margin: '0 auto' }}>Our Projects</div>
                    <h1 className="project-works-hero-title">
                        Selected <span className="portfolio-gradient-text">Project Works</span>
                    </h1>
                    <p className="project-works-hero-sub">
                        Explore our recent implementations, custom web solutions, and robust enterprise applications built by our talented engineers.
                    </p>
                </div>
            </section>

            <main className="project-works-main" style={{ padding: '0 5% 80px' }}>
                <div className="portfolio-bento-grid">
                    {projects.map((p, i) => (
                        <div key={`pw-project-${i}`} className={`portfolio-bento-card bento-card-${i}`}>
                            <div className="portfolio-bento-img-wrapper">
                                <img src={p.img} alt={p.title} className="portfolio-bento-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                                <div className="portfolio-bento-overlay">
                                    <div className="portfolio-bento-content">
                                        <span className="portfolio-bento-category">{p.category}</span>
                                        <h3 className="portfolio-bento-card-title">{p.title}</h3>
                                    </div>
                                    <div className="portfolio-bento-arrow">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <WebsiteFooter />
        </div>
    );
}
