import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Code2, Cpu, Globe, Layout, ShieldCheck, Zap } from 'lucide-react';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';
import './WebDevelopment.css';

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
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

export default function WebDevelopment() {
    const navigate = useNavigate();
    const heroRef = useReveal();
    const featuresRef = useReveal();
    const showcaseRef = useReveal();
    const projectsRef = useReveal();
    const ctaRef = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Web Development | Premium Solutions";
    }, []);

    return (
        <div className="wd-premium-root">
            <WebsiteNavbar />

            {/* Ambient Background Effects */}
            <div className="wd-ambient-orb orb-1"></div>
            <div className="wd-ambient-orb orb-2"></div>
            <div className="wd-noise-overlay"></div>

            {/* Hero Section */}
            <section className="wd-hero">
                <div className="wd-container">
                    <div className="wd-hero-content" ref={heroRef}>
                        <div className="wd-badge">
                            <span className="wd-badge-dot"></span>
                            Enterprise Grade Solutions
                        </div>
                        <h1 className="wd-title">
                            Engineering <span className="wd-text-gradient">Digital Excellence</span>
                        </h1>
                        <p className="wd-subtitle">
                            We design and develop high-performance web applications tailored to elevate your business. Seamlessly merging stunning aesthetics with robust, scalable architecture.
                        </p>
                        <div className="wd-actions">
                            <button className="wd-btn-primary" onClick={() => document.getElementById('contact-cta').scrollIntoView({ behavior: 'smooth' })}>
                                Start a Project <ChevronRight className="wd-btn-icon" size={18} />
                            </button>
                            <button className="wd-btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                                Explore Capabilities
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section className="wd-features" id="features">
                <div className="wd-container" ref={featuresRef}>
                    <div className="wd-section-header">
                        <h2>World-Class Capabilities</h2>
                        <p>Architected for scale, optimized for conversion.</p>
                    </div>

                    <div className="wd-features-grid">
                        <div className="wd-feature-card">
                            <div className="wd-feature-icon-wrapper">
                                <Layout className="wd-feature-icon" />
                            </div>
                            <h3>Bespoke UI/UX</h3>
                            <p>Pixel-perfect, intuitive interfaces designed to maximize user engagement and deliver a flawless brand experience.</p>
                        </div>
                        <div className="wd-feature-card">
                            <div className="wd-feature-icon-wrapper">
                                <Zap className="wd-feature-icon" />
                            </div>
                            <h3>Lightning Performance</h3>
                            <p>Sub-second load times utilizing modern edge computing, intelligent caching, and optimized asset delivery.</p>
                        </div>
                        <div className="wd-feature-card">
                            <div className="wd-feature-icon-wrapper">
                                <ShieldCheck className="wd-feature-icon" />
                            </div>
                            <h3>Enterprise Security</h3>
                            <p>Bank-grade encryption, secure data pipelines, and proactive defense mechanisms to protect your intellectual property.</p>
                        </div>
                        <div className="wd-feature-card">
                            <div className="wd-feature-icon-wrapper">
                                <Globe className="wd-feature-icon" />
                            </div>
                            <h3>Global Scalability</h3>
                            <p>Cloud-native architecture designed to seamlessly handle traffic spikes and grow dynamically with your business.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="wd-showcase">
                <div className="wd-container" ref={showcaseRef}>
                    <div className="wd-split">
                        <div className="wd-split-content">
                            <div className="wd-icon-badge">
                                <Code2 size={24} />
                            </div>
                            <h2>Modern Stack.<br/>Flawless Execution.</h2>
                            <p>
                                Whether you need a sophisticated React single-page application, a robust corporate portal, or a high-converting e-commerce platform, our engineering team delivers clean, maintainable code that drives measurable business impact.
                            </p>
                            <ul className="wd-list">
                                <li>Custom React & Next.js Applications</li>
                                <li>Headless CMS Architecture</li>
                                <li>High-converting E-commerce (Shopify/Custom)</li>
                                <li>Progressive Web Apps (PWA)</li>
                            </ul>
                        </div>
                        <div className="wd-split-visual">
                            <div className="wd-image-wrapper">
                                <img 
                                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" 
                                    alt="Modern Web Development" 
                                    className="wd-image" 
                                />
                                </div>
                            
                            {/* Floating stat card */}
                            <div className="wd-floating-card">
                                <div className="wd-floating-icon">
                                    <Cpu size={20} />
                                </div>
                                <div>
                                    <h4>99.99%</h4>
                                    <span>Uptime Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Portfolio Section */}
            <section className="wd-projects" id="projects">
                <div className="wd-container" ref={projectsRef}>
                    <div className="wd-section-header">
                        <h2>Selected Works</h2>
                        <p>A glimpse into the digital experiences we've engineered.</p>
                    </div>
                    
                    <div className="wd-projects-grid">
                        <div className="wd-project-card">
                            <div className="wd-project-image-wrap">
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" alt="Project 1" className="wd-project-image" />
                                <div className="wd-project-overlay">
                                    <button className="wd-btn-project">View Case Study <ChevronRight size={16} /></button>
                                </div>
                            </div>
                            <div className="wd-project-info">
                                <span className="wd-project-category">E-Commerce</span>
                                <h3>NextGen Retail Platform</h3>
                                <p>A high-converting, headless Shopify build with sub-second load times.</p>
                            </div>
                        </div>
                        
                        <div className="wd-project-card">
                            <div className="wd-project-image-wrap">
                                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" alt="Project 2" className="wd-project-image" />
                                <div className="wd-project-overlay">
                                    <button className="wd-btn-project">View Case Study <ChevronRight size={16} /></button>
                                </div>
                            </div>
                            <div className="wd-project-info">
                                <span className="wd-project-category">SaaS Dashboard</span>
                                <h3>FinTech Analytics</h3>
                                <p>A complex React dashboard for real-time financial data visualization.</p>
                            </div>
                        </div>

                        <div className="wd-project-card">
                            <div className="wd-project-image-wrap">
                                <img src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=800" alt="Project 3" className="wd-project-image" />
                                <div className="wd-project-overlay">
                                    <button className="wd-btn-project">View Case Study <ChevronRight size={16} /></button>
                                </div>
                            </div>
                            <div className="wd-project-info">
                                <span className="wd-project-category">Corporate Portal</span>
                                <h3>Global Logistics UI</h3>
                                <p>A comprehensive re-architecture of an international logistics web app.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="wd-cta" id="contact-cta">
                <div className="wd-container" ref={ctaRef}>
                    <div className="wd-cta-box">
                        <div className="wd-cta-bg"></div>
                        <h2>Ready to transform your digital presence?</h2>
                        <p>Partner with us to build a web experience that outpaces the competition.</p>
                        <button className="wd-btn-primary large">
                            Schedule a Consultation
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Blog Preview ────────────────── */}
            <BlogPreviewSection />

            <WebsiteFooter />
        </div>
    );
}
