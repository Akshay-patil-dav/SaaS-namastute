import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Package, Briefcase, Layers, Star, Tag, BookOpen, Phone, ShoppingCart, Image, Globe, Monitor, Code, Wrench, ShoppingBag, GraduationCap, Building2, Bot, FileText, FileCode, Palette, Linkedin, Github, Instagram, Twitter } from 'lucide-react';
import logo from '../../../assets/logo.svg';
import '../../../pages/website/BlogDetail/LandingPage.css';


const servicesDropdown = {
    columns: [
        {
            heading: 'Development Services',
            items: [
                { icon: <Globe size={20} />, title: 'Web Application Development', desc: 'Shopify & WordPress Development', color: '#2563EB', link: '/services/web-development' },
                // { icon: <Monitor size={20} />, title: 'Web Application Development', desc: 'Single, Multiple & Business Use', color: '#8B5CF6', link: '/services/web-application-development' },
                { icon: <Code size={20} />, title: 'Software Development', desc: 'Custom & Business requirement based', color: '#EC4899', link: '/services/software-development' },
                { icon: <Wrench size={20} />, title: 'Custom Development', desc: 'Tailored solutions for your needs', color: '#06B6D4', link: '/services/custom-development' },
            ],
        },
        {
            heading: 'Platform & E-commerce',
            items: [
                { icon: <ShoppingBag size={20} />, title: 'E-commerce Platform Development', desc: 'Online stores and marketplaces', color: '#F59E0B', link: '/services/e-commerce-platform-development' },
                { icon: <GraduationCap size={20} />, title: 'Education Platform Development', desc: 'Institute, Startup & Market Level', color: '#10B981', link: '/services/education-platform-development' },
                { icon: <Building2 size={20} />, title: 'Business Website Development', desc: 'Static Service & Landing Sites', color: '#3B82F6', link: '/services/business-website-development' },
                { icon: <Bot size={20} />, title: 'AI Automation', desc: 'Voice call & Chatbot automation', color: '#7C3AED', link: '/services/ai-automation' },
            ],
        }
    ],
};

const dropdownMap = {
    services: servicesDropdown,
};

export const NavLogo = () => (
    <Link to="/" className="lp-nav-logo">
        <img src={logo} alt="Namustutam Logo" className="lp-nav-logo-img" />
        <span className="lp-nav-logo-text">amus<span>tutam</span></span>
    </Link>
);

const WebsiteNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const showCTA = false;
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [caretLeft, setCaretLeft] = useState(0);
    const [mobileAccordion, setMobileAccordion] = useState(null);
    const dropdownTimeout = useRef(null);
    const navRef = useRef(null);
    const linkRefs = useRef({});

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleMouseEnter = (name) => {
        clearTimeout(dropdownTimeout.current);
        setActiveDropdown(name);
    };

    const handleMouseLeave = () => {
        dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
    };

    const toggleMobileAccordion = (name) => {
        setMobileAccordion(mobileAccordion === name ? null : name);
    };

    useEffect(() => {
        if (activeDropdown && linkRefs.current[activeDropdown]) {
            const btnEl = linkRefs.current[activeDropdown];
            const navEl = navRef.current;
            if (btnEl && navEl) {
                const btnRect = btnEl.getBoundingClientRect();
                const navRect = navEl.getBoundingClientRect();
                setCaretLeft(btnRect.left + btnRect.width / 2 - navRect.left);
            }
        }
    }, [activeDropdown]);

    const scrollTo = (id) => {
        setMenuOpen(false);
        if (window.location.pathname !== '/retail-saas-platform') {
            navigate('/retail-saas-platform');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderMobileAccordion = (name, label) => {
        const data = dropdownMap[name];
        if (!data) return null;
        const isOpen = mobileAccordion === name;

        return (
            <div className="lp-mobile-accordion">
                <button
                    className={`lp-mobile-link lp-accordion-toggle ${isOpen ? 'open' : ''}`}
                    onClick={() => toggleMobileAccordion(name)}
                >
                    {label}
                    <svg className={`lp-accordion-chevron ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {isOpen && (
                    <div className="lp-mobile-accordion-content">
                        {data.columns.map((col, ci) => (
                            <div key={ci} className="lp-mobile-accordion-group">
                                <span className="lp-mobile-accordion-heading">{col.heading}</span>
                                {col.items.map((item, ii) => (
                                    <Link to={item.link || '#'} className="lp-mobile-accordion-item" key={ii} onClick={() => setMenuOpen(false)}>
                                        <span className="lp-mobile-accordion-icon" style={{ background: `${item.color}12`, color: item.color }}>
                                            {item.icon}
                                        </span>
                                        <div>
                                            <span className="lp-mobile-accordion-title">{item.title}</span>
                                            <span className="lp-mobile-accordion-desc">{item.desc}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`} ref={navRef}>
                <NavLogo />

                <ul className="lp-nav-links">
                    <li><Link to="/project-works" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none' }}><Briefcase size={16} /> Project Works</Link></li>
                    <li
                        className="lp-nav-dropdown-trigger"
                        onMouseEnter={() => handleMouseEnter('services')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            ref={(el) => (linkRefs.current.services = el)}
                            className={`lp-nav-btn ${activeDropdown === 'services' ? 'active' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Layers size={16} /> Skill
                            <svg className={`lp-nav-chevron ${activeDropdown === 'services' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                    </li>
                    {showCTA && (
                        <>
                            <li><a href="#features" onClick={() => scrollTo('features')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={16} /> Features</a></li>
                            <li><a href="#pricing" onClick={() => scrollTo('pricing')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={16} /> Pricing</a></li>
                        </>
                    )}
                    <li><Link to="/blog" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><BookOpen size={16} /> Blog</Link></li>
                    <li><Link to="/contact" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> Contact</Link></li>
                </ul>

                {/* Social Icons */}
                <div className="lp-nav-socials">
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Linkedin size={20} /></a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Github size={20} /></a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Instagram size={20} /></a>
                    <a href="https://x.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Twitter size={20} /></a>
                </div>

                {showCTA && (
                    <div className="lp-nav-cta">
                        <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Log In</button>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
                    </div>
                )}

                <button
                    className={`lp-hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>

                {/* Desktop Dropdown */}
                {activeDropdown && dropdownMap[activeDropdown] && (() => {
                    const activeData = dropdownMap[activeDropdown];
                    const totalItems = activeData.columns.reduce((sum, col) => sum + col.items.length, 0);
                    const isWide = totalItems > 5;

                    return (
                        <div
                            className={`lp-dropdown ${isWide ? 'lp-dropdown--wide' : ''}`}
                            onMouseEnter={() => handleMouseEnter(activeDropdown)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="lp-dropdown-caret" style={{ left: `${caretLeft}px` }} />
                            <div className="lp-dropdown-body">
                                <div
                                    className="lp-dropdown-inner"
                                    style={isWide ? {} : { left: `${caretLeft}px`, transform: 'translateX(-50%)' }}
                                >
                                    {activeData.columns.map((col, ci) => (
                                        <div className="lp-dropdown-column" key={ci}>
                                            <span className="lp-dropdown-heading">{col.heading}</span>
                                            {col.items.map((item, ii) => (
                                                <Link to={item.link || '#'} className="lp-dropdown-item" key={ii} onClick={() => setMenuOpen(false)}>
                                                    <span className="lp-dropdown-icon" style={{ background: `${item.color}12`, color: item.color }}>
                                                        {item.icon}
                                                    </span>
                                                    <div className="lp-dropdown-text">
                                                        <span className="lp-dropdown-title">{item.title}</span>
                                                        <span className="lp-dropdown-desc">{item.desc}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </nav>

            <div className={`lp-mobile-menu ${menuOpen ? 'open' : ''}`}>
                <div className="lp-mobile-scroll">
                    <Link to="/project-works" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border-soft)', fontWeight: 600, fontSize: 15 }}><Briefcase size={16} /> Project Works</Link>
                    {renderMobileAccordion('services', 'Services')}
                    {showCTA && (
                        <>
                            <a href="#features" onClick={() => scrollTo('features')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={16} /> Features</a>
                            <a href="#pricing" onClick={() => scrollTo('pricing')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={16} /> Pricing</a>
                        </>
                    )}
                    <Link to="/blog" onClick={() => setMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 15 }}><BookOpen size={16} /> Blog</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 15 }}><Phone size={16} /> Contact Us</Link>
                </div>
                {showCTA && (
                    <div className="lp-mobile-menu-cta">
                        <a href="#" className="lp-btn-ghost" onClick={() => { setMenuOpen(false); navigate('/login'); }}>Log In</a>
                        <a href="#" className="lp-btn-primary" onClick={() => { setMenuOpen(false); navigate('/register'); }}>Get Started Free</a>
                    </div>
                )}
                
                {/* Mobile Social Icons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '24px 0 10px' }}>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Linkedin size={22} /></a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Github size={22} /></a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Instagram size={22} /></a>
                    <a href="https://x.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Twitter size={22} /></a>
                </div>
            </div>
        </>
    );
};

export default WebsiteNavbar;
