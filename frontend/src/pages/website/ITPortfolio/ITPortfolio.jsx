import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../BlogDetail/LandingPage.css';
import './ITPortfolio.css';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import NodeFeatures from '../../../components/common/NodeFeatures/NodeFeatures';
import TeamSection from '../../../components/common/TeamSection/TeamSection';

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
    const portfolioRef = useReveal();
    const whyRef = useReveal();
    const ctaRef = useReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Namustutam | IT Services & Solutions";
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

    const [activePortfolioTab, setActivePortfolioTab] = useState('WordPress UI Dev');
    const portfolioTabsData = [
        { id: 'WordPress UI Dev', icon: '💻' },
        { id: 'Shopify Dev', icon: '🛍️' },
        { id: 'Custom Software Dev', icon: '⚙️' },
        { id: 'Custom Web App', icon: '🌐' }
    ];
    const portfolioContentData = {
        'WordPress UI Dev': {
            mainImg: '/wpweb11.png',
            title: 'WordPress UI Development',
            desc: 'Custom WordPress UI development ensuring scalable and secure websites tailored to your unique business needs, with easy content management.',
            features: [
                { icon: '⚡', title: 'Optimized\nPerformance' },
                { icon: '🛡️', title: 'Enhanced\nSecurity' },
                { icon: '🎨', title: 'Custom\nDesign' }
            ],
            innerImg: '/wpweb1.png'
        },
        'Shopify Dev': {
            mainImg: '/shopify11.png',
            title: 'Shopify Development',
            desc: 'High-converting online stores engineered for maximum sales and seamless checkout experiences.',
            features: [
                { icon: '🛍️', title: 'E-commerce\nOptimization' },
                { icon: '⭐', title: '100% Customers\nSatisfaction' },
                { icon: '📈', title: 'Sales\nGrowth' }
            ],
            innerImg: '/dashboard1.png'
        },
        'Custom Software Dev': {
            mainImg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            title: 'Custom Software Development',
            desc: 'End-to-end multi-tenant application development with robust backend architecture and scalable solutions.',
            features: [
                { icon: '💻', title: 'Robust\nArchitecture' },
                { icon: '☁️', title: 'Cloud\nIntegration' },
                { icon: '🔒', title: 'Secure Data\nPipelines' }
            ],
            innerImg: '/dashboard1.png'
        },
        'Custom Web App': {
            mainImg: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
            title: 'Custom Web App',
            desc: 'We craft intuitive and engaging web applications that delight your customers and drive business operations.',
            features: [
                { icon: '✨', title: 'Pixel-Perfect\nUI' },
                { icon: '🌐', title: 'Responsive\nDesign' },
                { icon: '⚡', title: 'Fast\nLoading' }
            ],
            innerImg: '/dashboard2.png'
        }
    };
    const activeContent = portfolioContentData[activePortfolioTab];

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
                            <h3>3</h3>
                            <p>Projects Delivered</p>
                        </div>
                        <div className="portfolio-stat">
                            <h3>1</h3>
                            <p>SaaS Solutions</p>
                        </div>
                        <div className="portfolio-stat">
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

            {/* ── Latest Portfolios Section (Our Experience) ──────────────────────── */}
            <section className="portfolio-latest-section" id="experience">
                <div className="portfolio-section-label">SELECTED WORKS</div>
                <h2 className="portfolio-latest-title">Check Our Latest Portfolios</h2>
                
                <div className="portfolio-tabs-container">
                    {portfolioTabsData.map(tab => (
                        <button 
                            key={tab.id}
                            className={`portfolio-tab-btn ${activePortfolioTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActivePortfolioTab(tab.id)}
                        >
                            <div className="portfolio-tab-icon-wrapper">
                                <span className="icon">{tab.icon}</span>
                            </div>
                            <span className="text">{tab.id}</span>
                        </button>
                    ))}
                </div>

                <div className="portfolio-tab-content" key={activePortfolioTab}>
                    <div className="portfolio-tab-left-img">
                        <img src={activeContent.mainImg} alt={activeContent.title} />
                    </div>
                    <div className="portfolio-tab-right-card">
                        <div className="portfolio-tab-card-info">
                            <h3>{activeContent.title}</h3>
                            <p>{activeContent.desc}</p>
                            
                            <div className="portfolio-tab-features">
                                {activeContent.features.map((feature, idx) => (
                                    <div key={idx} className="portfolio-tab-feature">
                                        <div className="icon">{feature.icon}</div>
                                        <div className="text">{feature.title}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="portfolio-explore-badge">
                                <div className="portfolio-explore-badge-inner">
                                    <svg viewBox="0 0 100 100" width="80" height="80">
                                        <defs>
                                            <path id="circlePath" d="M 50, 50 m -30, 0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" fill="none" />
                                        </defs>
                                        <text className="portfolio-explore-svg-text" fontSize="11" fontWeight="bold" letterSpacing="1">
                                            <textPath href="#circlePath" startOffset="0%">
                                                EXPLORE MORE • EXPLORE MORE •
                                            </textPath>
                                        </text>
                                    </svg>
                                </div>
                                <span className="portfolio-explore-arrow">↘</span>
                            </div>
                        </div>
                        <div className="portfolio-tab-card-mockup">
                            <img src={activeContent.innerImg} alt="App mockup" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Portfolio Section ──────────────────────── */}
            {/* ── Showcase of Brilliance (Dynamic Carousel) ──────────────────────── */}
            <section className="portfolio-showcase-section" id="portfolio">
                <div className="portfolio-section-header reveal" ref={portfolioRef}>
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
                <div className="portfolio-about-us-container reveal" ref={whyRef}>
                    {/* Left Visuals */}
                    <div className="portfolio-about-visuals">
                        <div className="about-glow-bg"></div>
                        <div className="about-star-icon">
                            <svg width="45" height="45" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 0C20 11.0457 28.9543 20 40 20C28.9543 20 20 28.9543 20 40C20 28.9543 11.0457 20 0 20C11.0457 20 20 11.0457 20 0Z" fill="currentColor"/>
                            </svg>
                        </div>
                        
                        <div className="about-img-main-wrapper">
                            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=600" alt="Team meeting" className="about-img-main" />
                        </div>
                        
                        <div className="about-doc-graphic">
                            <div className="doc-content">
                                <span className="doc-title">INSURANCE<br/>POLICY</span>
                                <div className="doc-lines"><span></span><span></span><span></span><span></span><span></span></div>
                            </div>
                            <div className="doc-stamp">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                        </div>

                        <div className="about-img-secondary-wrapper">
                            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400" alt="Handshake" className="about-img-secondary" />
                        </div>

                        <div className="about-experience-badge">
                            <span className="badge-number">30</span>
                            <span className="badge-text">Years of<br/>experience</span>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="portfolio-about-content">
                        <div className="about-label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}><path d="M12 22S19 18 19 12V5L12 2L5 5V12C5 18 12 22 12 22Z" fill="currentColor"/></svg>
                            ABOUT US
                        </div>
                        <h2 className="about-title">The Best Insurance Policy<br/>For Customers</h2>
                        <p className="about-desc">
                            Insurance that reflects the way you live your life. Our solutions<br/>optimize operations so you easily can focus on success.
                        </p>

                        <div className="about-features-list">
                            <div className="about-feature-item">
                                <div className="feature-icon-wrapper">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 12H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/><path d="M12 18V21M12 21H9M12 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                </div>
                                <div className="feature-text">
                                    <h4>EASY FINANCIAL<br/>PLANNING</h4>
                                    <p>The a long established fact that a reader will<br/>be distracted.</p>
                                </div>
                            </div>
                            <div className="about-feature-item">
                                <div className="feature-icon-wrapper">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7H17V17C17 18.1046 16.1046 19 15 19H9C7.89543 19 7 18.1046 7 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="13" r="2" stroke="currentColor" strokeWidth="2"/></svg>
                                </div>
                                <div className="feature-text">
                                    <h4>COMPARE OUR<br/>OFFERS</h4>
                                    <p>The a long established fact that a reader will<br/>be distracted.</p>
                                </div>
                            </div>
                        </div>

                        <div className="about-actions-row">
                            <button className="about-btn-primary">GET IN TOUCH <span>↗</span></button>
                            
                            <div className="about-customers">
                                <div className="customer-avatars">
                                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="C1" />
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="C2" />
                                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="C3" />
                                    <img src="https://randomuser.me/api/portraits/women/90.jpg" alt="C4" />
                                </div>
                                <span className="customers-text"><strong>30K+</strong> ACTIVE CUSTOMERS</span>
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
                    <button className="portfolio-btn-cta" onClick={() => navigate('/contact')}>Start a Conversation</button>
                </div>
            </section>

            <WebsiteFooter />
        </div>
    );
}
