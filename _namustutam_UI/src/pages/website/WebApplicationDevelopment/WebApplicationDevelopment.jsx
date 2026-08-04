import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';
import {
    Server, Shield, Zap, Database, Globe, Cpu, Layout, Activity,
    Layers, Lock, Cloud, RefreshCw, Code, CheckCircle, ArrowRight,
    Terminal, Monitor, Settings
} from 'lucide-react';
import './WebApplicationDevelopment.css';

/* ── Hooks ── */
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

export default function WebApplicationDevelopment() {
    const navigate = useNavigate();

    // Refs for scroll animations
    const heroRef = useReveal();
    const statsRef = useReveal();
    const featuresRef = useReveal();
    const stackRef = useReveal();
    const ctaRef = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Web Application Development | Namustutam';
    }, []);

    const scrollToContact = () => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="wad-root">
            <WebsiteNavbar />

            {/* ── Hero Section ── */}
            <section className="wad-hero">
                <div className="wad-hero-bg">
                    <div className="wad-glow-orb orb-primary"></div>
                    <div className="wad-glow-orb orb-secondary"></div>
                    <div className="wad-grid-overlay"></div>
                </div>

                <div className="wad-container">
                    <div className="wad-hero-content" ref={heroRef}>
                        <div className="wad-badge">
                            <span className="wad-badge-dot"></span>
                            Enterprise-Grade Engineering
                        </div>
                        <h1 className="wad-title">
                            Next-Generation <br />
                            <span className="wad-text-gradient">Web Applications</span>
                        </h1>
                        <p className="wad-subtitle">
                            We architect, design, and engineer highly scalable, multi-tenant web applications built to handle millions of users. Transform your complex business logic into a seamless digital experience.
                        </p>
                        <div className="wad-hero-actions">
                            <button className="wad-btn wad-btn-primary" onClick={scrollToContact}>
                                Start Your Project <ArrowRight size={18} />
                            </button>
                            <button className="wad-btn wad-btn-secondary" onClick={() => navigate('/project-works')}>
                                View Our Work
                            </button>
                        </div>
                    </div>

                    <div className="wad-hero-visual">
                        <div className="wad-glass-panel wad-dashboard-mockup">
                            <div className="wad-mockup-header">
                                <div className="wad-dots"><span></span><span></span><span></span></div>
                                <div className="wad-url-bar">namustutam.com/app</div>
                            </div>
                            <div className="wad-mockup-body">
                                <div className="wad-sidebar">
                                    <div className="wad-sb-item active"><Layout size={14} /></div>
                                    <div className="wad-sb-item"><Activity size={14} /></div>
                                    <div className="wad-sb-item"><Settings size={14} /></div>
                                </div>
                                <div className="wad-main-content">
                                    <div className="wad-header-mock"></div>
                                    <div className="wad-cards-grid">
                                        <div className="wad-card-mock"><Activity size={24} color="#ffb38a" /></div>
                                        <div className="wad-card-mock"><Database size={24} color="#ec4899" /></div>
                                        <div className="wad-card-mock"><Shield size={24} color="#10b981" /></div>
                                    </div>
                                    <div className="wad-chart-mock">
                                        <div className="wad-chart-bar b1"></div>
                                        <div className="wad-chart-bar b2"></div>
                                        <div className="wad-chart-bar b3"></div>
                                        <div className="wad-chart-bar b4"></div>
                                        <div className="wad-chart-bar b5"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating elements */}
                            <div className="wad-float wad-float-1"><Cloud size={20} /> Cloud Native</div>
                            <div className="wad-float wad-float-2"><RefreshCw size={20} /> Real-Time Sync</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Strip ── */}
            <section className="wad-stats" ref={statsRef}>
                <div className="wad-container wad-stats-grid">
                    <div className="wad-stat-item">
                        <h3>99.99%</h3>
                        <p>Uptime Guarantee</p>
                    </div>
                    <div className="wad-stat-item">
                        <h3>&lt;50ms</h3>
                        <p>API Latency</p>
                    </div>
                    <div className="wad-stat-item">
                        <h3>100%</h3>
                        <p>Data Security</p>
                    </div>
                    <div className="wad-stat-item">
                        <h3>24/7</h3>
                        <p>DevOps Support</p>
                    </div>
                </div>
            </section>

            {/* ── Core Capabilities ── */}
            <section className="wad-features">
                <div className="wad-container">
                    <div className="wad-section-header reveal" ref={featuresRef}>
                        <h2 className="wad-section-title">Architected for Scale</h2>
                        <p className="wad-section-desc">Our applications are built on modern infrastructure, ensuring they grow seamlessly alongside your business without performance bottlenecks.</p>
                    </div>

                    <div className="wad-features-grid">
                        <div className="wad-feature-card">
                            <div className="wad-feature-icon"><Layers size={28} /></div>
                            <h3>Multi-Tenant SaaS</h3>
                            <p>Robust architecture designed to support thousands of simultaneous organizations with complete data isolation and customized user roles.</p>
                        </div>
                        <div className="wad-feature-card">
                            <div className="wad-feature-icon"><Zap size={28} /></div>
                            <h3>High-Performance APIs</h3>
                            <p>Lightning-fast REST and GraphQL APIs that power your frontend and seamlessly integrate with third-party enterprise tools.</p>
                        </div>
                        <div className="wad-feature-card">
                            <div className="wad-feature-icon"><Lock size={28} /></div>
                            <h3>Enterprise Security</h3>
                            <p>End-to-end encryption, OAuth2/JWT authentication, rate limiting, and regular penetration testing to keep your data secure.</p>
                        </div>
                        <div className="wad-feature-card">
                            <div className="wad-feature-icon"><RefreshCw size={28} /></div>
                            <h3>Real-Time Data Sync</h3>
                            <p>WebSocket integrations and event-driven architectures ensuring your users see updates instantly without refreshing.</p>
                        </div>
                        <div className="wad-feature-card">
                            <div className="wad-feature-icon"><Server size={28} /></div>
                            <h3>Cloud-Native Infrastructure</h3>
                            <p>Deployed on AWS, Google Cloud, or Azure using Docker and Kubernetes for automated scaling and zero-downtime deployments.</p>
                        </div>
                        <div className="wad-feature-card">
                            <div className="wad-feature-icon"><Monitor size={28} /></div>
                            <h3>Responsive Admin Dashboards</h3>
                            <p>Intuitive, data-rich interfaces that give you full control and visibility over your application's metrics and user management.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Tech Stack ── */}
            <section className="wad-stack" ref={stackRef}>
                <div className="wad-container">
                    <div className="wad-stack-content">
                        <h2>Powered by Modern Tech</h2>
                        <p>We use industry-standard, future-proof technologies to ensure your application remains maintainable and scalable for years to come.</p>
                        
                        <div className="wad-tech-categories">
                            <div className="wad-tech-col">
                                <div className="wad-tech-header"><Code size={20} /> Frontend</div>
                                <ul>
                                    <li><CheckCircle size={16} /> React.js & Next.js</li>
                                    <li><CheckCircle size={16} /> TypeScript</li>
                                    <li><CheckCircle size={16} /> Tailwind CSS / MUI</li>
                                    <li><CheckCircle size={16} /> Redux / Zustand</li>
                                </ul>
                            </div>
                            <div className="wad-tech-col">
                                <div className="wad-tech-header"><Terminal size={20} /> Backend & APIs</div>
                                <ul>
                                    <li><CheckCircle size={16} /> Node.js & Express</li>
                                    <li><CheckCircle size={16} /> Java Spring Boot</li>
                                    <li><CheckCircle size={16} /> Python / Django</li>
                                    <li><CheckCircle size={16} /> GraphQL & REST</li>
                                </ul>
                            </div>
                            <div className="wad-tech-col">
                                <div className="wad-tech-header"><Database size={20} /> Infrastructure</div>
                                <ul>
                                    <li><CheckCircle size={16} /> PostgreSQL & MongoDB</li>
                                    <li><CheckCircle size={16} /> Redis Caching</li>
                                    <li><CheckCircle size={16} /> Docker & Kubernetes</li>
                                    <li><CheckCircle size={16} /> AWS / NGINX</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="wad-cta" id="contact" ref={ctaRef}>
                <div className="wad-container">
                    <div className="wad-cta-box">
                        <div className="wad-cta-content">
                            <h2>Ready to Build Something Extraordinary?</h2>
                            <p>Let's discuss your application requirements. Our senior engineering team is ready to architect your next big idea.</p>
                        </div>
                        <div className="wad-cta-action">
                            <button className="wad-btn wad-btn-white" onClick={() => navigate('/contact')}>
                                Schedule a Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <BlogPreviewSection />
            <WebsiteFooter />
        </div>
    );
}
