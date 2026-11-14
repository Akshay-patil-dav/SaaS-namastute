import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Briefcase, Layers, ShoppingCart, BookOpen, Phone, Globe,
    Code, Wrench, ShoppingBag, GraduationCap, Building2, Bot,
    Linkedin, Github, Instagram, Twitter
} from 'lucide-react';
import logo from '../../../assets/logo.svg';

const MAIN_SITE_URL = 'https://namustutam.vercel.app';

const servicesDropdown = {
    columns: [
        {
            heading: 'Development Services',
            items: [
                { icon: <Globe size={20} />, title: 'Web Application Development', desc: 'Shopify & WordPress Development', color: '#2563EB', href: `${MAIN_SITE_URL}/services/web-development` },
                { icon: <Code size={20} />, title: 'Software Development', desc: 'Custom & Business requirement based', color: '#EC4899', href: `${MAIN_SITE_URL}/services/software-development` },
                { icon: <Wrench size={20} />, title: 'Custom Development', desc: 'Tailored solutions for your needs', color: '#06B6D4', href: `${MAIN_SITE_URL}/services/custom-development` },
            ],
        },
        {
            heading: 'Platform & E-commerce',
            items: [
                { icon: <ShoppingCart size={20} />, title: 'Namustutam POS Software', desc: 'Retail & Multi-store Cloud POS', color: '#EA580C', to: '/possoftware' },
                { icon: <ShoppingBag size={20} />, title: 'E-commerce Platform Development', desc: 'Online stores and marketplaces', color: '#F59E0B', href: `${MAIN_SITE_URL}/services/e-commerce-platform-development` },
                { icon: <GraduationCap size={20} />, title: 'Education Platform Development', desc: 'Institute, Startup & Market Level', color: '#10B981', href: `${MAIN_SITE_URL}/services/education-platform-development` },
                { icon: <Building2 size={20} />, title: 'Business Website Development', desc: 'Static Service & Landing Sites', color: '#3B82F6', href: `${MAIN_SITE_URL}/services/business-website-development` },
                { icon: <Bot size={20} />, title: 'AI Automation', desc: 'Voice call & Chatbot automation', color: '#7C3AED', href: `${MAIN_SITE_URL}/services/ai-automation` },
            ],
        }
    ],
};

export default function GlobalWebsiteHeader() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [caretLeft, setCaretLeft] = useState(0);
    const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false);
    const dropdownTimeout = useRef(null);
    const navRef = useRef(null);
    const servicesBtnRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (activeDropdown === 'services' && servicesBtnRef.current && navRef.current) {
            const btnRect = servicesBtnRef.current.getBoundingClientRect();
            const navRect = navRef.current.getBoundingClientRect();
            setCaretLeft(btnRect.left + btnRect.width / 2 - navRect.left);
        }
    }, [activeDropdown]);

    const handleMouseEnter = (name) => {
        clearTimeout(dropdownTimeout.current);
        setActiveDropdown(name);
    };

    const handleMouseLeave = () => {
        dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
    };

    const isPosActive = location.pathname === '/possoftware' || location.pathname === '/pos-software';

    return (
        <>
            <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`} ref={navRef}>
                <a href={MAIN_SITE_URL} className="lp-nav-logo">
                    <img src={logo} alt="Namustutam Logo" className="lp-nav-logo-img" />
                    <span className="lp-nav-logo-text">amus<span>tutam</span></span>
                </a>

                <ul className="lp-nav-links">
                    <li>
                        <a href={`${MAIN_SITE_URL}/project-works`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Briefcase size={16} /> Project Works
                        </a>
                    </li>
                    <li
                        className="lp-nav-dropdown-trigger"
                        onMouseEnter={() => handleMouseEnter('services')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            ref={servicesBtnRef}
                            type="button"
                            className={`lp-nav-btn ${activeDropdown === 'services' ? 'active' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Layers size={16} /> Services
                            <svg className={`lp-nav-chevron ${activeDropdown === 'services' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                    </li>
                    <li>
                        <Link
                            to="/possoftware"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                textDecoration: 'none',
                                color: isPosActive ? 'var(--primary, #ff5b00)' : 'inherit',
                                fontWeight: isPosActive ? 700 : 500
                            }}
                        >
                            <ShoppingCart size={16} style={{ color: '#ea580c' }} /> POS Software
                        </Link>
                    </li>
                    <li>
                        <a href={`${MAIN_SITE_URL}/blog`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <BookOpen size={16} /> Blog
                        </a>
                    </li>
                    <li>
                        <a href={`${MAIN_SITE_URL}/contact`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={16} /> Contact
                        </a>
                    </li>
                </ul>

                <div className="lp-nav-socials">
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="lp-social-icon" aria-label="LinkedIn"><Linkedin size={20} /></a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="lp-social-icon" aria-label="GitHub"><Github size={20} /></a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="lp-social-icon" aria-label="Instagram"><Instagram size={20} /></a>
                    <a href="https://x.com" target="_blank" rel="noreferrer" className="lp-social-icon" aria-label="Twitter"><Twitter size={20} /></a>
                </div>

                <button
                    type="button"
                    className={`lp-hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>

                {activeDropdown === 'services' && (
                    <div
                        className="lp-dropdown lp-dropdown--wide"
                        onMouseEnter={() => handleMouseEnter('services')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="lp-dropdown-caret" style={{ left: `${caretLeft}px` }} />
                        <div className="lp-dropdown-body">
                            <div className="lp-dropdown-inner">
                                {servicesDropdown.columns.map((col, ci) => (
                                    <div className="lp-dropdown-column" key={ci}>
                                        <span className="lp-dropdown-heading">{col.heading}</span>
                                        {col.items.map((item, ii) => {
                                            const inner = (
                                                <>
                                                    <span className="lp-dropdown-icon" style={{ background: `${item.color}12`, color: item.color }}>
                                                        {item.icon}
                                                    </span>
                                                    <div className="lp-dropdown-text">
                                                        <span className="lp-dropdown-title">{item.title}</span>
                                                        <span className="lp-dropdown-desc">{item.desc}</span>
                                                    </div>
                                                </>
                                            );
                                            return item.to ? (
                                                <Link to={item.to} className="lp-dropdown-item" key={ii} onClick={() => setActiveDropdown(null)}>
                                                    {inner}
                                                </Link>
                                            ) : (
                                                <a href={item.href} className="lp-dropdown-item" key={ii}>
                                                    {inner}
                                                </a>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <div className={`lp-mobile-menu ${menuOpen ? 'open' : ''}`}>
                <div className="lp-mobile-scroll">
                    <a
                        href={`${MAIN_SITE_URL}/project-works`}
                        onClick={() => setMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border-soft)', fontWeight: 600, fontSize: 15 }}
                    >
                        <Briefcase size={16} /> Project Works
                    </a>

                    <div className="lp-mobile-accordion">
                        <button
                            type="button"
                            className={`lp-mobile-link lp-accordion-toggle ${mobileAccordionOpen ? 'open' : ''}`}
                            onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
                        >
                            Services
                            <svg className={`lp-accordion-chevron ${mobileAccordionOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                        {mobileAccordionOpen && (
                            <div className="lp-mobile-accordion-content">
                                {servicesDropdown.columns.map((col, ci) => (
                                    <div key={ci} className="lp-mobile-accordion-group">
                                        <span className="lp-mobile-accordion-heading">{col.heading}</span>
                                        {col.items.map((item, ii) => {
                                            const inner = (
                                                <>
                                                    <span className="lp-mobile-accordion-icon" style={{ background: `${item.color}12`, color: item.color }}>
                                                        {item.icon}
                                                    </span>
                                                    <div>
                                                        <span className="lp-mobile-accordion-title">{item.title}</span>
                                                        <span className="lp-mobile-accordion-desc">{item.desc}</span>
                                                    </div>
                                                </>
                                            );
                                            return item.to ? (
                                                <Link to={item.to} className="lp-mobile-accordion-item" key={ii} onClick={() => setMenuOpen(false)}>
                                                    {inner}
                                                </Link>
                                            ) : (
                                                <a href={item.href} className="lp-mobile-accordion-item" key={ii} onClick={() => setMenuOpen(false)}>
                                                    {inner}
                                                </a>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/possoftware"
                        onClick={() => setMenuOpen(false)}
                        style={{
                            color: isPosActive ? 'var(--primary, #ff5b00)' : 'var(--text)',
                            fontWeight: 700,
                            textDecoration: 'none',
                            padding: '12px 0',
                            borderBottom: '1px solid var(--border-soft)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: 15
                        }}
                    >
                        <ShoppingCart size={16} style={{ color: '#ea580c' }} /> POS Software
                    </Link>

                    <a
                        href={`${MAIN_SITE_URL}/blog`}
                        onClick={() => setMenuOpen(false)}
                        style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 15 }}
                    >
                        <BookOpen size={16} /> Blog
                    </a>

                    <a
                        href={`${MAIN_SITE_URL}/contact`}
                        onClick={() => setMenuOpen(false)}
                        style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 15 }}
                    >
                        <Phone size={16} /> Contact Us
                    </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '24px 0 10px' }}>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Linkedin size={22} /></a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Github size={22} /></a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Instagram size={22} /></a>
                    <a href="https://x.com" target="_blank" rel="noreferrer" className="lp-social-icon"><Twitter size={22} /></a>
                </div>
            </div>
        </>
    );
}

