import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './ITPortfolio.css';
import WebsiteNavbar from '../components/common/WebsiteNavbar';
import WebsiteFooter from '../components/common/WebsiteFooter';

function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

export default function ITPortfolio() {
    const navigate = useNavigate();
    const heroRef = useReveal();
    const servicesRef = useReveal();
    const portfolioRef = useReveal();
    const whyRef = useReveal();
    const ctaRef = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Namastute | IT Services & Solutions";
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
        }
    ];

    return (
        <div className="portfolio-root">
            <WebsiteNavbar />

            {/* ── Hero Section ──────────────────────── */}
            <section className="portfolio-hero">
                <div className="portfolio-hero-bg">
                    <div className="portfolio-glow-orb orb-1"></div>
                    <div className="portfolio-glow-orb orb-2"></div>
                    <div className="portfolio-glow-orb orb-3"></div>
                </div>
                <div className="portfolio-hero-content" ref={heroRef}>
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
                        <div className="portfolio-stat">
                            <h3>50+</h3>
                            <p>Projects Delivered</p>
                        </div>
                        <div className="portfolio-stat">
                            <h3>15+</h3>
                            <p>SaaS Solutions</p>
                        </div>
                        <div className="portfolio-stat">
                            <h3>99%</h3>
                            <p>Client Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Services Section ──────────────────────── */}
            <section className="portfolio-section" id="services">
                <div className="portfolio-section-header reveal" ref={servicesRef}>
                    <div className="portfolio-section-label">Our Expertise</div>
                    <h2 className="portfolio-section-title">End-to-End IT Services</h2>
                    <p className="portfolio-section-subtitle">Comprehensive solutions tailored to accelerate your digital growth and streamline operations.</p>
                </div>
                <div className="portfolio-services-grid">
                    {services.map((s, i) => (
                        <div key={i} className="portfolio-service-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                            <div className="portfolio-service-icon">{s.icon}</div>
                            <h3 className="portfolio-service-title">{s.title}</h3>
                            <p className="portfolio-service-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Portfolio Section ──────────────────────── */}
            <section className="portfolio-section portfolio-section-alt" id="portfolio">
                <div className="portfolio-section-header reveal" ref={portfolioRef}>
                    <div className="portfolio-section-label">Selected Works</div>
                    <h2 className="portfolio-section-title">Showcase of Brilliance</h2>
                    <p className="portfolio-section-subtitle">Explore some of our recent flagship projects and enterprise solutions.</p>
                </div>
                <div className="portfolio-projects-grid">
                    {projects.map((p, i) => (
                        <div key={i} className="portfolio-project-card reveal" style={{ transitionDelay: `${i * 150}ms` }}>
                            <div className="portfolio-project-img-wrapper" style={{ background: p.color }}>
                                <img src={p.img} alt={p.title} className="portfolio-project-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                            </div>
                            <div className="portfolio-project-info">
                                <div className="portfolio-project-category">{p.category}</div>
                                <h3 className="portfolio-project-title">{p.title}</h3>
                                <div className="portfolio-project-link">View Case Study →</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="portfolio-btn-wrapper">
                    <button className="portfolio-btn-outline" onClick={() => navigate('/retail-saas-platform')}>
                        Explore Retail SaaS Demo →
                    </button>
                </div>
            </section>

            {/* ── Why Choose Us ──────────────────────── */}
            <section className="portfolio-section" id="why-us">
                <div className="portfolio-why-grid reveal" ref={whyRef}>
                    <div className="portfolio-why-content">
                        <div className="portfolio-section-label">Why Namastute</div>
                        <h2 className="portfolio-section-title">Built for Performance,<br/>Designed for Humans</h2>
                        <p className="portfolio-section-desc">
                            We don't just write code; we solve business problems. Our engineering philosophy is rooted in creating scalable architectures while ensuring an intuitive, premium user experience.
                        </p>
                        <ul className="portfolio-why-list">
                            <li>
                                <strong>🚀 Lightning Fast Delivery</strong>
                                <p>Agile methodologies ensuring rapid prototyping and timely deployment.</p>
                            </li>
                            <li>
                                <strong>💎 Uncompromising Quality</strong>
                                <p>Clean code, rigorous testing, and pixel-perfect design implementation.</p>
                            </li>
                            <li>
                                <strong>🔒 Enterprise-Grade Security</strong>
                                <p>Robust security practices integrated at every layer of development.</p>
                            </li>
                        </ul>
                    </div>
                    <div className="portfolio-why-visual">
                        <div className="portfolio-glass-panel">
                            <div className="portfolio-code-mockup">
                                <div className="portfolio-mockup-header">
                                    <span></span><span></span><span></span>
                                </div>
                                <pre>
                                    <code>
{`// Delivering Excellence
const buildSolution = async (requirements) => {
  const design = await createUI(requirements);
  const architecture = planScalability();
  
  return {
    status: 'Success',
    performance: 'Blazing Fast',
    ux: 'Premium & Intuitive',
    impact: 'Maximum ROI'
  };
};`}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────── */}
            <section className="portfolio-cta-section" id="contact">
                <div className="portfolio-cta-box reveal" ref={ctaRef}>
                    <h2>Ready to Build the Future?</h2>
                    <p>Let's collaborate to create software that drives your business forward.</p>
                    <button className="portfolio-btn-cta">Start a Conversation</button>
                </div>
            </section>

            <WebsiteFooter />
        </div>
    );
}
