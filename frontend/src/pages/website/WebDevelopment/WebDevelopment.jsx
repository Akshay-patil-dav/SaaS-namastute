import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
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
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

export default function WebDevelopment() {
    const navigate = useNavigate();
    const heroRef = useReveal();
    const techRef = useReveal();
    const showcaseRef = useReveal();
    const ctaRef = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Web Development | Next-Gen Architecture";
    }, []);

    const codeSnippet = `const deployPlatform = async () => {
  const architecture = new NextGenArch();
  await architecture.compile({
    speed: 'blazing',
    security: 'enterprise',
    ui: 'premium'
  });
  return architecture.launch();
};`;

    return (
        <div className="wd-root">
            <WebsiteNavbar />

            {/* Futuristic Hero */}
            <section className="wd-hero">
                <div className="wd-hero-particles"></div>
                <div className="wd-grid-floor"></div>
                
                <div className="wd-hero-content" ref={heroRef}>
                    <div className="wd-cyber-badge">
                        <span className="wd-blink"></span>
                        SYSTEM READY
                    </div>
                    <h1 className="wd-hero-title">
                        Architecting the <span className="wd-glitch" data-text="Future">Future</span><br/>of the Web
                    </h1>
                    <p className="wd-hero-subtitle">
                        We build high-performance, flawlessly designed web experiences engineered for absolute speed and massive scalability.
                    </p>
                    <div className="wd-hero-actions">
                        <button className="wd-btn-neon" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                            INITIATE PROJECT
                        </button>
                    </div>
                </div>

                <div className="wd-hero-visual">
                    <div className="wd-hologram-container">
                        <div className="wd-holo-ring ring-1"></div>
                        <div className="wd-holo-ring ring-2"></div>
                        <div className="wd-code-block">
                            <div className="wd-code-header">
                                <span className="dot r"></span>
                                <span className="dot y"></span>
                                <span className="dot g"></span>
                                <span className="wd-code-title">deploy.js</span>
                            </div>
                            <pre><code>{codeSnippet}</code></pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Asymmetric Tech Grid */}
            <section className="wd-tech-section">
                <div className="wd-container" ref={techRef}>
                    <div className="wd-section-header">
                        <h2>Advanced Capabilities</h2>
                        <p>Powered by the modern stack.</p>
                    </div>
                    
                    <div className="wd-bento-grid">
                        <div className="wd-bento-card large">
                            <div className="wd-card-glow"></div>
                            <h3>Lightning Speed</h3>
                            <p>Sub-second load times utilizing edge computing and optimized asset delivery.</p>
                            <div className="wd-speed-chart">
                                <div className="wd-bar" style={{ height: '40%' }}></div>
                                <div className="wd-bar" style={{ height: '70%' }}></div>
                                <div className="wd-bar" style={{ height: '100%' }}></div>
                                <div className="wd-bar wd-accent" style={{ height: '120%' }}></div>
                            </div>
                        </div>
                        <div className="wd-bento-card">
                            <h3>Responsive</h3>
                            <p>Pixel-perfect rendering across all devices and screen sizes.</p>
                            <div className="wd-icon-display">📱</div>
                        </div>
                        <div className="wd-bento-card dark">
                            <h3>Secure</h3>
                            <p>Enterprise-grade encryption and OWASP top 10 protection.</p>
                            <div className="wd-icon-display">🛡️</div>
                        </div>
                        <div className="wd-bento-card wide">
                            <div className="wd-flex-split">
                                <div>
                                    <h3>SEO Dominance</h3>
                                    <p>Built-in technical SEO that search engines love.</p>
                                </div>
                                <div className="wd-seo-score">
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Showcase */}
            <section className="wd-showcase-section">
                <div className="wd-container reveal" ref={showcaseRef}>
                    <div className="wd-split-layout">
                        <div className="wd-split-text">
                            <h2>Flawless Execution</h2>
                            <p>
                                From intricate React single-page applications to robust WordPress corporate portals, we write clean, maintainable code that drives actual business results.
                            </p>
                            <ul className="wd-cyber-list">
                                <li>Custom WordPress Themes</li>
                                <li>High-converting Shopify Stores</li>
                                <li>Headless CMS Architectures</li>
                                <li>Progressive Web Apps (PWA)</li>
                            </ul>
                        </div>
                        <div className="wd-split-visual">
                            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" alt="Code Architecture" className="wd-cyber-image" />
                            <div className="wd-cyber-overlay"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cyber CTA */}
            <section className="wd-cta-section" id="contact">
                <div className="wd-container reveal" ref={ctaRef}>
                    <div className="wd-cta-frame">
                        <div className="wd-cta-scanline"></div>
                        <h2>Ready to upgrade your web presence?</h2>
                        <button className="wd-btn-neon solid">START TRANSMISSION</button>
                    </div>
                </div>
            </section>

            <WebsiteFooter />
        </div>
    );
}
