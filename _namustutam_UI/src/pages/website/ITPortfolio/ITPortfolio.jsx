import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Smartphone, Server, Database, Cloud, ShieldCheck, MonitorPlay, Component } from 'lucide-react';
import '../BlogDetail/LandingPage.css';
import './ITPortfolio.css';
import '../ProjectWorks/ProjectWorks.css';
import { projectsData } from '../../../data/projectsData';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import ExpertiseSection from '../../../components/common/ExpertiseSection/ExpertiseSection';
import TeamSection from '../../../components/common/TeamSection/TeamSection';
import BlogPreviewSection from '../../../components/common/BlogPreviewSection/BlogPreviewSection';


export default function ITPortfolio() {
    const navigate = useNavigate();
    
    // Rotating Text State
    const [wordIndex, setWordIndex] = useState(0);
    const rotatingWords = ['Excellence', 'Innovation', 'Experiences', 'Solutions'];

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

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
        { icon: '🌐', title: 'Web Development', desc: 'Custom WordPress & Shopify themes built for performance and scalability.', link: '/services/web-development' },
        { icon: '💻', title: 'SaaS Applications', desc: 'End-to-end multi-tenant application development with React and Spring Boot.', link: '/services/saas-applications' },
        { icon: '📱', title: 'UI/UX Design', desc: 'Premium, user-centric interfaces with responsive and modern aesthetics.', link: '/services/ui-ux-design' },
        { icon: '🛍️', title: 'E-commerce Solutions', desc: 'High-converting online stores engineered for maximum sales and seamless checkout.', link: '/services/e-commerce-platform-development' },
        { icon: '🤖', title: 'AI Automation', desc: 'Integrate intelligent chatbots and automated workflows to streamline operations.', link: '/services/ai-automation' },
        { icon: '🛠️', title: 'Dedicated Support', desc: '24/7 technical assistance and post-launch maintenance to keep you running smoothly.', link: '/contact' }
    ];

    // Using real data from projectsData for the showcase
    const projects = projectsData.slice(0, 6);

    // Hardcoded images for floating background (using a mix of real data and old placeholders)
    const floatingImages = [
        projects[0]?.img || '/dashboard1.png',
        projects[1]?.img || '/dashboard2.png',
        projects[2]?.img || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        projects[3]?.img || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        projects[4]?.img || 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800',
        projects[5]?.img || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
    ];

    return (
        <div className="portfolio-root">
            <WebsiteNavbar />

            {/* ── Hero Section (Redesigned) ──────────────────────── */}
            <section className="portfolio-hero-redesigned">
                {/* Floating Background Cards */}
                <div className="hero-floating-background">
                    {/* Floating Project Images */}
                    {floatingImages.map((imgUrl, index) => (
                        <div 
                            key={`img-${index}`} 
                            className={`floating-project-card floating-card-${index + 1}`}
                            style={{ backgroundImage: `url(${imgUrl})` }}
                        ></div>
                    ))}
                    {floatingImages.map((imgUrl, index) => (
                        <div 
                            key={`dup-${index}`} 
                            className={`floating-project-card floating-card-dup-${index + 1}`}
                            style={{ backgroundImage: `url(${imgUrl})` }}
                        ></div>
                    ))}

                    {/* Floating Tech Icons */}
                    <div className="floating-icon-card floating-icon-1"><Code2 size={36} color="#ff8c42" /></div>
                    <div className="floating-icon-card floating-icon-2"><Smartphone size={32} color="#3b82f6" /></div>
                    <div className="floating-icon-card floating-icon-3"><Server size={40} color="#10b981" /></div>
                    <div className="floating-icon-card floating-icon-4"><Database size={30} color="#f43f5e" /></div>
                    <div className="floating-icon-card floating-icon-5"><Cloud size={44} color="#8b5cf6" /></div>
                    <div className="floating-icon-card floating-icon-6"><ShieldCheck size={38} color="#f59e0b" /></div>
                    <div className="floating-icon-card floating-icon-7"><MonitorPlay size={34} color="#0ea5e9" /></div>
                    <div className="floating-icon-card floating-icon-8"><Component size={42} color="#ec4899" /></div>
                </div>

                <div className="hero-light-overlay"></div>

                <div className="portfolio-hero-content reveal-up" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="portfolio-badge">
                        <span className="portfolio-badge-dot"></span>
                        {/* Premium IT Services & Solutions */}
                        Freelance Software Developer • IT Solutions
                    </div>
                    <h1 className="portfolio-hero-title">
                        Building Digital 
                        <div className="rotating-text-wrapper">
                            {rotatingWords.map((word, index) => {
                                const isActive = index === wordIndex;
                                const isPrevious = index === (wordIndex - 1 + rotatingWords.length) % rotatingWords.length;
                                
                                return (
                                    <span 
                                        key={index}
                                        className={`portfolio-gradient-text rotating-text-item ${isActive ? 'active' : ''} ${isPrevious && !isActive ? 'previous' : ''}`}
                                    >
                                        {word}
                                    </span>
                                );
                            })}
                        </div>
                        <br />
                        For Modern Businesses
                    </h1>
                    <p className="portfolio-hero-subtitle">
                        {/* We transform ideas into high-performance web applications, scalable e-commerce platforms, and beautiful corporate websites. Your technology partner from concept to launch. */}
                  I build custom software, POS solutions, business websites, and web applications tailored to your business needs — from idea to deployment
                    </p>
                    <div className="portfolio-hero-actions">
                        <button className="portfolio-btn-primary" onClick={() => scrollTo('portfolio')}>
                            View Our Work
                        </button>
                        <button className="portfolio-btn-outline" onClick={() => scrollTo('contact')}>
                            Discuss Your Project
                        </button>
                    </div>
                </div>
                
                {/* Gradient transition to next section */}
                <div className="hero-bottom-transition"></div>
            </section>



            {/* ── Expertise Section (SDLC & Architecture) ──────────────── */}
            <ExpertiseSection />


            {/* ── Portfolio Section ──────────────────────── */}
            {/* ── Showcase of Brilliance (Bento Grid) ──────────────────────── */}
            <section className="portfolio-showcase-section" id="portfolio">
                <div className="portfolio-section-header reveal-up">
                    <div className="portfolio-section-label">Selected Works</div>
                    <h2 className="portfolio-section-title">Showcase of Brilliance</h2>
                    <p className="portfolio-section-subtitle">Explore some of our recent flagship projects and enterprise solutions.</p>
                </div>

                <div className="portfolio-bento-grid">
                    {projects.map((p, i) => (
                        <div 
                            key={`project-${i}`} 
                            className={`portfolio-bento-card bento-card-${i} reveal-up`} 
                            style={{ transitionDelay: `${i * 100}ms` }}
                            onClick={() => navigate('/project-info/' + p.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''))}
                        >
                            <div className="portfolio-bento-img-wrapper">
                                <img src={p.img} alt={p.title} className="portfolio-bento-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                                <div className="portfolio-bento-overlay">
                                    <div className="portfolio-bento-content">
                                        <span className="portfolio-bento-category">{p.category}</span>
                                        <h3 className="portfolio-bento-card-title">{p.title}</h3>
                                    </div>
                                    <div className="portfolio-bento-arrow">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="portfolio-btn-wrapper" style={{ marginTop: '40px' }}>
                    <button className="portfolio-btn-outline" onClick={() => navigate('/project-works')}>
                        See more project work →
                    </button>
                </div>
            </section>

            {/* ── Team Section ──────────────────────── */}
            <TeamSection />

            {/* ── Progressive Growth Section ──────────────────────── */}
            <section className="portfolio-progressive-section" id="progressive-growth">
                <div className="progressive-main-content">
                    {/* Left Side: Curved Image */}
                    <div className="progressive-image-wrapper reveal">
                        <img src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&q=80&w=1200" alt="Team discussing operational challenges" />
                    </div>

                    {/* Right Side: Content */}
                    <div className="progressive-content reveal-right">
                        <div className="progressive-label">SCALABLE INNOVATION</div>
                        <h2 className="progressive-title">Solving Complex<br/>IT Challenges</h2>
                        <p className="progressive-desc">
                            We dig deep to identify the root of technological bottlenecks and focus on delivering tangible software solutions. Partner with us to modernize your operations and scale seamlessly.
                        </p>
                        <button className="progressive-btn" onClick={() => navigate('/contact')}>GET IN TOUCH</button>
                        
                        <div className="progressive-sparkle">
                            <svg viewBox="0 0 100 100" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 0C50 27.6 72.4 50 100 50C72.4 50 50 72.4 50 100C50 72.4 27.6 50 0 50C27.6 50 50 27.6 50 0Z" />
                            </svg>
                        </div>
                        {/* Little dot as seen in image near the curve */}
                        <div className="progressive-dot"></div>
                    </div>
                </div>
                
                {/* Bottom Marquee */}
                <div className="progressive-marquee-container">
                    <div className="progressive-marquee">
                        <span>IT Services ✦ SaaS Development ✦ E-commerce Solutions ✦ Digital Transformation ✦ IT Services ✦ SaaS Development ✦</span>
                        <span>IT Services ✦ SaaS Development ✦ E-commerce Solutions ✦ Digital Transformation ✦ IT Services ✦ SaaS Development ✦</span>
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────── */}
            {/* <section className="portfolio-cta-section" id="contact">
                <div className="portfolio-cta-box reveal-up">
                    <h2>Ready to Build the Future?</h2>
                    <p>Let's collaborate to create software that drives your business forward.</p>
                    <button className="portfolio-btn-cta" onClick={() => navigate('/contact')}>Start a Conversation</button>
                </div>
            </section> */}

            {/* ── Blog Preview ────────────────── */}
            <BlogPreviewSection />

            <WebsiteFooter />
        </div>
    );
}
