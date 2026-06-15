import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../BlogDetail/LandingPage.css';
import './ITPortfolio.css';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import NodeFeatures from '../../../components/common/NodeFeatures/NodeFeatures';
import TeamSection from '../../../components/common/TeamSection/TeamSection';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';



export default function ITPortfolio() {
    const navigate = useNavigate();

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
        { icon: '🌐', title: 'Web Development', desc: 'Custom WordPress & Shopify themes built for performance and scalability.' },
        { icon: '💻', title: 'SaaS Applications', desc: 'End-to-end multi-tenant application development with React and Spring Boot.' },
        { icon: '📱', title: 'UI/UX Design', desc: 'Premium, user-centric interfaces with responsive and modern aesthetics.' },
        { icon: '🛍️', title: 'E-commerce Solutions', desc: 'High-converting online stores engineered for maximum sales and seamless checkout.' },
        { icon: '🤖', title: 'AI Automation', desc: 'Integrate intelligent chatbots and automated workflows to streamline operations.' },
        { icon: '🛠️', title: 'Dedicated Support', desc: '24/7 technical assistance and post-launch maintenance to keep you running smoothly.' }
    ];

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
        <div className="portfolio-root">
            <WebsiteNavbar />

            {/* ── Hero Section ──────────────────────── */}
            <section className="portfolio-hero">
                <div className="portfolio-hero-bg">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="portfolio-hero-video"
                    >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-2256-large.mp4" type="video/mp4" />
                    </video>
                    <div className="portfolio-glow-orb orb-1"></div>
                    <div className="portfolio-glow-orb orb-2"></div>
                    <div className="portfolio-glow-orb orb-3"></div>
                </div>
                <div className="portfolio-hero-content reveal-up">
                    <div className="portfolio-badge">
                        <span className="portfolio-badge-dot"></span>
                        Premium IT Services & Solutions
                    </div>
                    <h1 className="portfolio-hero-title">
                        Crafting Digital <span className="portfolio-gradient-text">Excellence</span><br />
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
                    
                    <div className="portfolio-stats">
                        <div className="portfolio-stat reveal-up delay-100">
                            <h3>3</h3>
                            <p>Projects Delivered</p>
                        </div>
                        <div className="portfolio-stat reveal-up delay-200">
                            <h3>1</h3>
                            <p>SaaS Solutions</p>
                        </div>
                        <div className="portfolio-stat reveal-up delay-300">
                            <h3>100%</h3>
                            <p>Client Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Node Features (Replaces Our Expertise) ──────────────── */}
            <section id="services">
                <NodeFeatures 
                    badgeTitle="Expertise"
                    title={<>End-to-End IT Services</>}
                    subtitle="Comprehensive solutions tailored to accelerate your digital growth and streamline operations."
                    features={services}
                    centerNode={{
                        title: "Namustutam",
                        icon: <img src="/logo.png" alt="Namustutam Logo" style={{ width: '177px', height: '177px', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }} />
                    }}
                />
            </section>


            {/* ── Portfolio Section ──────────────────────── */}
            {/* ── Showcase of Brilliance (Dynamic Carousel) ──────────────────────── */}
            <section className="portfolio-showcase-section" id="portfolio">
                <div className="portfolio-section-header reveal-up">
                    <div className="portfolio-section-label">Selected Works</div>
                    <h2 className="portfolio-section-title">Showcase of Brilliance</h2>
                    <p className="portfolio-section-subtitle">Explore some of our recent flagship projects and enterprise solutions.</p>
                </div>

                <div className="portfolio-showcase-carousel">
                    <div className="portfolio-showcase-row row-left">
                        {[...projects, ...projects, ...projects].map((p, i) => (
                            <div key={`left-${i}`} className="portfolio-showcase-card">
                                <div className="portfolio-showcase-img-wrapper" style={{ background: p.color }}>
                                    <img src={p.img} alt={p.title} className="portfolio-showcase-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                                    <div className="portfolio-showcase-overlay">
                                        <span className="portfolio-showcase-category">{p.category}</span>
                                        <h3 className="portfolio-showcase-card-title">{p.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="portfolio-showcase-row row-right">
                        {[...projects, ...projects, ...projects].reverse().map((p, i) => (
                            <div key={`right-${i}`} className="portfolio-showcase-card">
                                <div className="portfolio-showcase-img-wrapper" style={{ background: p.color }}>
                                    <img src={p.img} alt={p.title} className="portfolio-showcase-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                                    <div className="portfolio-showcase-overlay">
                                        <span className="portfolio-showcase-category">{p.category}</span>
                                        <h3 className="portfolio-showcase-card-title">{p.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="portfolio-btn-wrapper" style={{ marginTop: '60px' }}>
                    <button className="portfolio-btn-outline" onClick={() => navigate('/retail-saas-platform')}>
                        Explore Retail SaaS Demo →
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
                            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" alt="Technology Consulting Session" />
                            <div className="about-formal-experience">
                                <h3>10+</h3>
                                <p>Years of Excellence<br/>in IT Solutions</p>
                            </div>
                        </div>
                        <div className="about-formal-img-secondary">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" alt="Data Analytics Dashboard" />
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
