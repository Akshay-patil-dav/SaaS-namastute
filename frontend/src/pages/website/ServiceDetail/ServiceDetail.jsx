import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesData } from '../../../data/servicesData';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';
import './ServiceDetail.css';

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

export default function ServiceDetail() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const service = servicesData[serviceId];

    const heroRef = useReveal();
    const featuresRef = useReveal();
    const benefitsRef = useReveal();
    const ctaRef = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (service) {
            document.title = `Namustutam | ${service.title}`;
        } else {
            navigate('/');
        }
    }, [serviceId, service, navigate]);

    if (!service) return null;

    return (
        <div className="sd-root">
            <WebsiteNavbar />

            {/* Hero Section */}
            <section className="sd-hero">
                <div className="sd-hero-bg">
                    <div className="sd-glow-orb orb-1"></div>
                    <div className="sd-glow-orb orb-2"></div>
                </div>
                
                <div className="sd-container">
                    <div className="sd-hero-content" ref={heroRef}>
                        <div className="sd-badge">
                            <span className="sd-badge-dot"></span>
                            Premium Service
                        </div>
                        <h1 className="sd-hero-title">
                            {service.title.split(' ').map((word, i, arr) => 
                                i === arr.length - 1 ? <span key={i} className="sd-gradient-text"> {word}</span> : word + ' '
                            )}
                        </h1>
                        <p className="sd-hero-subtitle">{service.subtitle}</p>
                        <p className="sd-hero-desc">{service.description}</p>
                        <div className="sd-hero-actions">
                            <button className="sd-btn-primary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                                Get a Quote
                            </button>
                        </div>
                    </div>

                    <div className="sd-hero-visual">
                        <div className="sd-glass-panel">
                            <div className="sd-browser-mockup">
                                <div className="sd-mockup-header">
                                    <span></span><span></span><span></span>
                                </div>
                                <img src={service.image} alt={service.title} className="sd-hero-img" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="sd-features-section">
                <div className="sd-container">
                    <div className="sd-section-header reveal" ref={featuresRef}>
                        <h2 className="sd-section-title">Core Capabilities</h2>
                        <p className="sd-section-subtitle">What makes our {service.title.toLowerCase()} superior.</p>
                    </div>

                    <div className="sd-features-grid">
                        {service.features.map((feature, idx) => (
                            <div key={idx} className="sd-feature-card">
                                <div className="sd-feature-icon-wrapper">
                                    {feature.icon}
                                </div>
                                <h3 className="sd-feature-title">{feature.title}</h3>
                                <p className="sd-feature-desc">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="sd-benefits-section">
                <div className="sd-container">
                    <div className="sd-benefits-grid reveal" ref={benefitsRef}>
                        <div className="sd-benefits-content">
                            <h2 className="sd-section-title">Why Choose Us?</h2>
                            <p className="sd-section-desc">
                                We go beyond just delivering a service. We partner with you to ensure maximum ROI and long-term success.
                            </p>
                            <ul className="sd-benefits-list">
                                {service.benefits.map((benefit, idx) => (
                                    <li key={idx}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="sd-benefits-visual">
                            <div className="sd-floating-card card-1">
                                <div className="sd-icon">🚀</div>
                                <div>
                                    <h4>Fast Delivery</h4>
                                    <p>Without compromising quality</p>
                                </div>
                            </div>
                            <div className="sd-floating-card card-2">
                                <div className="sd-icon">💎</div>
                                <div>
                                    <h4>Premium Quality</h4>
                                    <p>Built to enterprise standards</p>
                                </div>
                            </div>
                            <div className="sd-floating-card card-3">
                                <div className="sd-icon">🔒</div>
                                <div>
                                    <h4>Highly Secure</h4>
                                    <p>Your data is protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="sd-cta-section" id="contact">
                <div className="sd-cta-box reveal" ref={ctaRef}>
                    <h2>Ready to elevate your business?</h2>
                    <p>Let's discuss how our {service.title.toLowerCase()} services can drive your growth.</p>
                    <button className="sd-btn-cta">Start Your Project Today</button>
                </div>
            </section>

            {/* ── Blog Preview ────────────────── */}
            <BlogPreviewSection />

            <WebsiteFooter />
        </div>
    );
}
