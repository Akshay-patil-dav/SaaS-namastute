import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';
import { Code, ShoppingCart, Layout, Smartphone, Search, HeadphonesIcon, ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsData } from '../../../data/projectsData';
import './WebDevelopment.css';

export default function WebDevelopment() {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 400; // width of card + gap
            sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };
    
    // Select relevant projects for web development showcase
    let showcaseProjects = projectsData.filter(p => 
        p.category.includes('Web') || p.category.includes('E-Commerce') || p.category.includes('SaaS')
    ).slice(0, 8);
    
    if (showcaseProjects.length < 4) {
        showcaseProjects = projectsData.slice(0, 8);
    }
    return (
        <div className="web-development-page">
            <WebsiteNavbar />
            <main className="web-development-content">
                {/* Hero Section */}
                <section className="web-dev-hero">
                    <div className="hero-text-content">
                        <div className="badge">Premium Web Solutions</div>
                        <h1 className="hero-title">
                            Next-Generation <br/><span className="highlight">Web Development</span>
                        </h1>
                        <p className="hero-subtitle">
                            We craft stunning, high-performance websites and web applications tailored to your business needs. Elevate your online presence with cutting-edge technology and premium design.
                        </p>
                        <div className="hero-cta-group">
                            <button className="primary-btn">Start Your Project <span className="arrow">→</span></button>
                            <button className="secondary-btn">View Portfolio</button>
                        </div>
                        
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Projects Delivered</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">99%</span>
                                <span className="stat-label">Client Satisfaction</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">24/7</span>
                                <span className="stat-label">Premium Support</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hero-animation-view">
                        <div className="animated-browser-mockup">
                            <div className="browser-header">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                                <div className="browser-url">www.namustutam.com</div>
                            </div>
                            <div className="browser-body">
                                <div className="mockup-nav">
                                    <div className="nav-logo"></div>
                                    <div className="nav-links">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                                <div className="mockup-hero">
                                    <div className="hero-image-placeholder"></div>
                                    <div className="hero-lines">
                                        <div className="code-line w-70"></div>
                                        <div className="code-line w-90"></div>
                                        <div className="code-line w-50"></div>
                                    </div>
                                </div>
                                <div className="mockup-grid">
                                    <div className="grid-item"></div>
                                    <div className="grid-item"></div>
                                    <div className="grid-item"></div>
                                </div>
                            </div>
                            <div className="floating-element float-1">
                                <div className="tag">&lt;React /&gt;</div>
                            </div>
                            <div className="floating-element float-2">
                                <div className="tag">{"{API_Ready}"}</div>
                            </div>
                            <div className="floating-element float-3">
                                <div className="tag">TailwindCSS</div>
                            </div>
                        </div>
                        <div className="glow-backdrop"></div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="web-dev-features">
                    <div className="features-header">
                        <h2>Our Core <span className="highlight">Expertise</span></h2>
                        <p>Comprehensive web development services designed to scale your business.</p>
                    </div>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-wrapper"><Code size={24} className="feature-icon"/></div>
                            <h3>Custom Web Apps</h3>
                            <p>Scalable, secure, and robust custom web applications built with modern frameworks.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper"><ShoppingCart size={24} className="feature-icon"/></div>
                            <h3>E-Commerce Solutions</h3>
                            <p>High-converting online stores optimized for seamless user experiences and sales.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper"><Layout size={24} className="feature-icon"/></div>
                            <h3>CMS Development</h3>
                            <p>Easy-to-manage content management systems including WordPress and Shopify.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper"><Smartphone size={24} className="feature-icon"/></div>
                            <h3>Responsive Design</h3>
                            <p>Flawless experiences across all devices, from desktop to mobile screens.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper"><Search size={24} className="feature-icon"/></div>
                            <h3>SEO Optimization</h3>
                            <p>Built-in technical SEO to ensure your website ranks higher on search engines.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper"><HeadphonesIcon size={24} className="feature-icon"/></div>
                            <h3>Ongoing Support</h3>
                            <p>Reliable maintenance and updates to keep your website secure and fast.</p>
                        </div>
                    </div>
                </section>

                {/* Projects Showcase Section */}
                <section className="web-dev-showcase">
                    <div className="showcase-header">
                        <div className="showcase-header-text">
                            <h2>Working Projects</h2>
                            <p>Explore our live working projects and pre-built solutions</p>
                        </div>
                        <div className="slider-controls">
                            <button className="slider-btn" onClick={() => scrollSlider('left')} aria-label="Scroll left">
                                <ChevronLeft size={24} />
                            </button>
                            <button className="slider-btn" onClick={() => scrollSlider('right')} aria-label="Scroll right">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="showcase-slider-container">
                        <div className="showcase-slider" ref={sliderRef}>
                            {showcaseProjects.map((project, index) => (
                                <div key={index} className="showcase-card slider-card" onClick={() => navigate('/project-info/' + project.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''))}>
                                    <div className="showcase-img-wrapper">
                                        <div className="showcase-category">{project.category}</div>
                                        <img src={project.img} alt={project.title} className="showcase-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                                        <div className="showcase-hover-overlay">
                                            <button className="view-project-btn">
                                                View Case Study <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="showcase-info">
                                        <h3>{project.title}</h3>
                                        <p>{project.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="showcase-action mt-12">
                        <button className="secondary-btn" onClick={() => navigate('/project-works')}>
                            View All Projects <ArrowRight size={18} />
                        </button>
                    </div>
                </section>

                {/* Latest Blog Section */}
                <div className="web-dev-blog-wrapper">
                    <BlogPreviewSection />
                </div>

                {/* Contact CTA Section */}
                <section className="web-dev-cta">
                    <div className="cta-content">
                        <h2>Ready to transform your web presence?</h2>
                        <p>Let's build something extraordinary together. Our team is ready to turn your vision into a high-performance reality.</p>
                        <button className="primary-btn cta-btn" onClick={() => navigate('/contact')}>
                            Contact Us Today <ArrowRight size={20} className="arrow" />
                        </button>
                    </div>
                    <div className="cta-background-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                    </div>
                </section>
            </main>
            <WebsiteFooter />
        </div>
    );
}
