import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Smartphone, Server, Database, Cloud, ShieldCheck, MonitorPlay, Component } from 'lucide-react';
import '../BlogDetail/LandingPage.css';
import './ITPortfolio.css';
import '../ProjectWorks/ProjectWorks.css';
import { projectsData } from '../../../data/projectsData';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import ExpertiseSection from '../../../components/common/ExpertiseSection/ExpertiseSection';
import TeamSection from '../../../components/common/TeamSection/TeamSection';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';


export default function ITPortfolio() {
    const navigate = useNavigate();
    
    // Rotating Text State
    const [wordIndex, setWordIndex] = useState(0);
    const rotatingWords = ['Excellence', 'Innovation', 'Experiences', 'Solutions'];

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Namustutam | IT Services & Solutions";

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        // Select all elements with reveal classes and observe them
        const elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
        };
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const services = [
        { icon: '🌐', title: 'Web Development', desc: 'Custom WordPress & Shopify themes built for performance and scalability.', link: '/services/web-development' },
        { icon: '💻', title: 'SaaS Applications', desc: 'End-to-end multi-tenant application development with React and Spring Boot.', link: '/services/saas-applications' },
        { icon: '📱', title: 'UI/UX Design', desc: 'Premium, user-centric interfaces with responsive and modern aesthetics.', link: '/services/ui-ux-design' },
        { icon: '🛍️', title: 'E-commerce Solutions', desc: 'High-converting online stores engineered for maximum sales and seamless checkout.', link: '/services/e-commerce-platform-development' },
        { icon: '🤖', title: 'AI Automation', desc: 'Integrate intelligent chatbots and automated workflows to streamline operations.', link: '/services/ai-automation' },
        { icon: '🛠️', title: 'Dedicated Support', desc: '24/7 technical assistance and post-launch maintenance to keep you running smoothly.', link: '/contact' }
    ];

    // Using real data from projectsData for the showcase
    const projects = projectsData.slice(0, 6);

    // Hardcoded images for floating background (using a mix of real data and old placeholders)
    const floatingImages = [
        projects[0]?.img || '/dashboard1.png',
        projects[1]?.img || '/dashboard2.png',
        projects[2]?.img || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        projects[3]?.img || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        projects[4]?.img || 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800',
        projects[5]?.img || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
    ];

    return (
        <div className="portfolio-root">
            <WebsiteNavbar />

            {/* ── Hero Section (Redesigned) ──────────────────────── */}
            <section className="portfolio-hero-redesigned">
                {/* Floating Background Cards */}
                <div className="hero-floating-background">
                    {/* Floating Project Images */}
                    {floatingImages.map((imgUrl, index) => (
                        <div 
                            key={`img-${index}`} 
                            className={`floating-project-card floating-card-${index + 1}`}
                            style={{ backgroundImage: `url(${imgUrl})` }}
                        ></div>
                    ))}
                    {floatingImages.map((imgUrl, index) => (
                        <div 
                            key={`dup-${index}`} 
                            className={`floating-project-card floating-card-dup-${index + 1}`}
                            style={{ backgroundImage: `url(${imgUrl})` }}
                        ></div>
                    ))}

                    {/* Floating Tech Icons */}
                    <div className="floating-icon-card floating-icon-1"><Code2 size={36} color="#ff8c42" /></div>
                    <div className="floating-icon-card floating-icon-2"><Smartphone size={32} color="#3b82f6" /></div>
                    <div className="floating-icon-card floating-icon-3"><Server size={40} color="#10b981" /></div>
                    <div className="floating-icon-card floating-icon-4"><Database size={30} color="#f43f5e" /></div>
                    <div className="floating-icon-card floating-icon-5"><Cloud size={44} color="#8b5cf6" /></div>
                    <div className="floating-icon-card floating-icon-6"><ShieldCheck size={38} color="#f59e0b" /></div>
                    <div className="floating-icon-card floating-icon-7"><MonitorPlay size={34} color="#0ea5e9" /></div>
                    <div className="floating-icon-card floating-icon-8"><Component size={42} color="#ec4899" /></div>
                </div>

                <div className="hero-light-overlay"></div>

                <div className="portfolio-hero-content reveal-up" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="portfolio-badge">
                        <span className="portfolio-badge-dot"></span>
                        Premium IT Services & Solutions
                    </div>
                    <h1 className="portfolio-hero-title">
                        Crafting Digital 
                        <div className="rotating-text-wrapper">
                            {rotatingWords.map((word, index) => {
                                const isActive = index === wordIndex;
                                const isPrevious = index === (wordIndex - 1 + rotatingWords.length) % rotatingWords.length;
                                
                                return (
                                    <span 
                                        key={index}
                                        className={`portfolio-gradient-text rotating-text-item ${isActive ? 'active' : ''} ${isPrevious && !isActive ? 'previous' : ''}`}
                                    >
                                        {word}
                                    </span>
                                );
                            })}
                        </div>
                        <br />
                        For Modern Businesses
                    </h1>
                    <p className="portfolio-hero-subtitle">
                        We transform ideas into high-performance web applications, scalable e-commerce platforms, and beautiful corporate websites. Your technology partner from concept to launch.
                    </p>
                    <div className="portfolio-hero-actions">
                        <button className="portfolio-btn-primary" onClick={() => scrollTo('portfolio')}>
                            View Our Work
                        </button>
                        <button className="portfolio-btn-outline" onClick={() => scrollTo('contact')}>
                            Discuss Your Project
                        </button>
                    </div>
                </div>
                
                {/* Gradient transition to next section */}
                <div className="hero-bottom-transition"></div>
            </section>



            {/* ── Expertise Section (SDLC & Architecture) ──────────────── */}
            <ExpertiseSection />


            {/* ── Portfolio Section ──────────────────────── */}
            {/* ── Showcase of Brilliance (Bento Grid) ──────────────────────── */}
            <section className="portfolio-showcase-section" id="portfolio">
                <div className="portfolio-section-header reveal-up">
                    <div className="portfolio-section-label">Selected Works</div>
                    <h2 className="portfolio-section-title">Showcase of Brilliance</h2>
                    <p className="portfolio-section-subtitle">Explore some of our recent flagship projects and enterprise solutions.</p>
                </div>

                <div className="portfolio-bento-grid">
                    {projects.map((p, i) => (
                        <div 
                            key={`project-${i}`} 
                            className={`portfolio-bento-card project-card bento-card-${i} reveal-up`} 
                            style={{ transitionDelay: `${i * 100}ms`, padding: '12px' }}
                            onClick={() => navigate('/project-info/' + p.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''))}
                        >
                            <div className="project-img-wrapper" style={{ height: 'calc(100% - 75px)' }}>
                                <span className="project-category-badge">+ {p.category}</span>
                                <img src={p.img} alt={p.title} className="project-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                                <div className="project-hover-overlay">
                                    <span className="glass-action-btn">View Details</span>
                                </div>
                            </div>
                            <div className="project-footer">
                                <div className="project-footer-left">
                                    <div className="project-author-icon">
                                        {p.title.charAt(0)}
                                    </div>
                                    <div className="project-footer-text">
                                        <h3 className="project-title">{p.title}</h3>
                                        <p className="project-author">{p.author}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="portfolio-btn-wrapper" style={{ marginTop: '40px' }}>
                    <button className="portfolio-btn-outline" onClick={() => navigate('/project-works')}>
                        See more project work →
                    </button>
                </div>
            </section>

            {/* ── Team Section ──────────────────────── */}
            <TeamSection />

            {/* ── Why Choose Us ──────────────────────── */}
            <section className="portfolio-section portfolio-section-alt" id="why-us" style={{ overflow: 'hidden' }}>
                <div className="portfolio-about-us-container">
                    {/* Left Visuals - Formal Layout */}
                    <div className="portfolio-about-visuals-formal reveal-left">
                        <div className="about-formal-accent"></div>
                        <div className="about-formal-img-main">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Technology Consulting Session" />
                            <div className="about-formal-experience">
                                <h3>10+</h3>
                                <p>Years of Excellence<br/>in IT Solutions</p>
                            </div>
                        </div>
                        <div className="about-formal-img-secondary">
                            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" alt="Data Analytics Dashboard" />
                        </div>
                    </div>

                    {/* Right Content - Formal Layout */}
                    <div className="portfolio-about-content reveal-right">
                        <div className="about-label-formal">
                            <span className="label-line"></span>
                            CORPORATE OVERVIEW
                        </div>
                        <h2 className="about-title-formal">Driving Digital Transformation & Enterprise Scalability</h2>
                        <p className="about-desc-formal">
                            We partner with forward-thinking organizations to deliver robust, secure, and scalable IT solutions. Our comprehensive approach ensures your technology infrastructure aligns perfectly with your strategic business objectives.
                        </p>

                        <div className="about-features-list-formal">
                            <div className="about-feature-item-formal">
                                <div className="feature-icon-wrapper-formal">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 13V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V14C3 15.1046 3.89543 16 5 16H8M21 13V15H14V11H21V13ZM21 13H14M11 21H14M14 21H17M14 21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                                <div className="feature-text-formal">
                                    <h4>Enterprise Software Engineering</h4>
                                    <p>Custom, high-performance applications designed to streamline complex corporate workflows.</p>
                                </div>
                            </div>
                            <div className="about-feature-item-formal">
                                <div className="feature-icon-wrapper-formal">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                                <div className="feature-text-formal">
                                    <h4>Reliable 24/7 Tech Support</h4>
                                    <p>Continuous monitoring and dedicated support to guarantee maximum uptime and security.</p>
                                </div>
                            </div>
                        </div>

                        <div className="about-actions-row">
                            <button className="about-btn-primary">Schedule a Consultation <span>↗</span></button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────── */}
            <section className="portfolio-cta-section" id="contact">
                <div className="portfolio-cta-box reveal-up">
                    <h2>Ready to Build the Future?</h2>
                    <p>Let's collaborate to create software that drives your business forward.</p>
                    <button className="portfolio-btn-cta" onClick={() => navigate('/contact')}>Start a Conversation</button>
                </div>
            </section>

            {/* ── Blog Preview ────────────────── */}
            <BlogPreviewSection />

            <WebsiteFooter />
        </div>
    );
}
