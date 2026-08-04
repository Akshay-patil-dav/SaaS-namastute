import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';
import './Ecommerce.css';
import { useCurrency } from '../../../hooks/useCurrency';


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

export default function Ecommerce() {
    const { currencySymbol } = useCurrency();

    const navigate = useNavigate();
    const heroRef = useReveal();
    const featuresRef = useReveal();
    const metricsRef = useReveal();
    const ctaRef = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "E-Commerce Platforms | Digital Retail";
    }, []);

    return (
        <div className="ec-root">
            <WebsiteNavbar />

            {/* E-commerce Hero */}
            <section className="ec-hero">
                <div className="ec-hero-bg">
                    <div className="ec-blob ec-blob-1"></div>
                    <div className="ec-blob ec-blob-2"></div>
                    <div className="ec-blob ec-blob-3"></div>
                </div>

                <div className="ec-container">
                    <div className="ec-hero-content" ref={heroRef}>
                        <div className="ec-glass-pill">
                            <span className="ec-pill-icon">🛍️</span>
                            Next-Generation Retail
                        </div>
                        <h1 className="ec-hero-title">
                            Digital Storefronts that <span className="ec-gradient-text">Convert</span>
                        </h1>
                        <p className="ec-hero-subtitle">
                            We build beautifully engineered, frictionless e-commerce platforms designed to maximize sales and elevate brand perception.
                        </p>
                        <div className="ec-hero-actions">
                            <button className="ec-btn-primary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                                Build Your Store
                            </button>
                            <button className="ec-btn-ghost">
                                View Case Studies
                            </button>
                        </div>
                    </div>

                    {/* Floating Product Cards Visual */}
                    <div className="ec-hero-visual">
                        <div className="ec-product-card card-main">
                            <div className="ec-card-img"></div>
                            <div className="ec-card-info">
                                <h4>Premium Headphones</h4>
                                <div className="ec-price">{currencySymbol}299.00</div>
                                <button className="ec-btn-add">Add to Cart</button>
                            </div>
                        </div>
                        <div className="ec-product-card card-side-1">
                            <div className="ec-card-img alt-1"></div>
                            <div className="ec-card-info">
                                <h4>Smart Watch</h4>
                                <div className="ec-price">{currencySymbol}199.00</div>
                            </div>
                        </div>
                        <div className="ec-product-card card-side-2">
                            <div className="ec-card-img alt-2"></div>
                            <div className="ec-card-info">
                                <h4>Minimalist Desk</h4>
                                <div className="ec-price">{currencySymbol}450.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Retail Features */}
            <section className="ec-features-section">
                <div className="ec-container reveal" ref={featuresRef}>
                    <div className="ec-section-header">
                        <h2>The Modern Commerce Stack</h2>
                        <p>Everything you need to scale your digital retail empire.</p>
                    </div>

                    <div className="ec-grid-3">
                        <div className="ec-feature-box">
                            <div className="ec-box-icon">⚡</div>
                            <h3>Instant Checkouts</h3>
                            <p>Frictionless 1-click checkout flows that drastically reduce cart abandonment and increase conversions.</p>
                        </div>
                        <div className="ec-feature-box">
                            <div className="ec-box-icon">📱</div>
                            <h3>Mobile-First</h3>
                            <p>Flawless shopping experiences perfectly optimized for thumbs, taps, and small screens.</p>
                        </div>
                        <div className="ec-feature-box">
                            <div className="ec-box-icon">📊</div>
                            <h3>Data-Driven</h3>
                            <p>Integrated analytics and inventory management to make smart, data-backed retail decisions.</p>
                        </div>
                        <div className="ec-feature-box">
                            <div className="ec-box-icon">🛡️</div>
                            <h3>Secure Payments</h3>
                            <p>Bank-grade encryption and PCI compliance ensuring customer data is always protected.</p>
                        </div>
                        <div className="ec-feature-box">
                            <div className="ec-box-icon">🌐</div>
                            <h3>Omnichannel</h3>
                            <p>Connect your store seamlessly to Instagram, Facebook, TikTok, and Google Shopping.</p>
                        </div>
                        <div className="ec-feature-box">
                            <div className="ec-box-icon">📦</div>
                            <h3>Automated Logistics</h3>
                            <p>Real-time shipping calculations, automated labeling, and seamless ERP integrations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Integrations */}
            <section className="ec-metrics-section">
                <div className="ec-container reveal" ref={metricsRef}>
                    <div className="ec-glass-panel">
                        <div className="ec-glass-content">
                            <h2>Powered by Industry Leaders</h2>
                            <p>We leverage the best technology available to build your store, from robust headless APIs to industry-standard platforms.</p>
                            
                            <div className="ec-logo-strip">
                                <div className="ec-logo">Shopify Plus</div>
                                <div className="ec-logo">WooCommerce</div>
                                <div className="ec-logo">Stripe</div>
                                <div className="ec-logo">Magento</div>
                                <div className="ec-logo">Next.js</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="ec-cta-section" id="contact">
                <div className="ec-container reveal" ref={ctaRef}>
                    <div className="ec-cta-content">
                        <h2>Ready to Multiply Your Sales?</h2>
                        <p>Let's build a store that your customers will love shopping on.</p>
                        <button className="ec-btn-primary large">Start Your Free Consultation</button>
                    </div>
                </div>
            </section>

            {/* ── Blog Preview ────────────────── */}
            <BlogPreviewSection />

            <WebsiteFooter />
        </div>
    );
}
