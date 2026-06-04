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

    const [activePortfolioTab, setActivePortfolioTab] = useState('wordpress UI Dev');
    const portfolioTabsData = [
        { id: 'wordpress UI Dev', icon: '💻' },
        { id: 'Shopify Dev', icon: '🛍️' },
        { id: 'Custome SOftware Dev', icon: '⚙️' },
        { id: 'Custome Web Dev', icon: '🌐' }
    ];
    const portfolioContentData = {
        'wordpress UI Dev': {
            mainImg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
            title: 'WordPress UI Development',
            desc: 'Custom WordPress UI development ensuring scalable and secure websites tailored to your unique business needs, with easy content management.',
            features: [
                { icon: '⚡', title: 'Optimized\nPerformance' },
                { icon: '🛡️', title: 'Enhanced\nSecurity' },
                { icon: '🎨', title: 'Custom\nDesign' }
            ],
            innerImg: '/dashboard2.png'
        },
        'Shopify Dev': {
            mainImg: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
            title: 'Shopify Development',
            desc: 'High-converting online stores engineered for maximum sales and seamless checkout experiences.',
            features: [
                { icon: '🛍️', title: 'E-commerce\nOptimization' },
                { icon: '⭐', title: '100% Customers\nSatisfaction' },
                { icon: '📈', title: 'Sales\nGrowth' }
            ],
            innerImg: '/dashboard1.png'
        },
        'Custome SOftware Dev': {
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
        'Custome Web Dev': {
            mainImg: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
            title: 'Custom Web Development',
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
                        title: "Namastute",
                        icon: <img src="/logo.png" alt="Namastute Logo" style={{ width: '177px', height: '177px', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }} />
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
