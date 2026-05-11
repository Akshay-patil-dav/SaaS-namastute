import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/* ─── Dropdown Data ─── */
const productsDropdown = {
  columns: [
    {
      heading: 'Products',
      items: [
        { icon: '🖼️', title: 'List of Products', desc: 'Browse products with banner images', color: '#2563EB' },
      ],
    },
  ],
};

const projectWorksDropdown = {
  columns: [
    {
      heading: 'Types of work',
      items: [
        { icon: '🎨', title: 'Website Design', desc: 'Creative website design solutions', color: '#8B5CF6' },
        { icon: '📱', title: 'Application Design SS', desc: 'Application design services', color: '#EC4899' },
        { icon: '⚙️', title: 'Full-Stack Development', desc: 'End-to-end development', color: '#06B6D4' },
      ],
    },
  ],
};

const servicesDropdown = {
  columns: [
    {
      heading: 'Development Services',
      items: [
        { icon: '🌐', title: 'Web Development', desc: 'Shopify & WordPress Development', color: '#2563EB' },
        { icon: '💻', title: 'Web Application Development', desc: 'Single, Multiple & Business Use', color: '#8B5CF6' },
        { icon: '🖥️', title: 'Software Development', desc: 'Custom & Business requirement based', color: '#EC4899' },
        { icon: '🛠️', title: 'Custom Development', desc: 'Tailored solutions for your needs', color: '#06B6D4' },
      ],
    },
    {
      heading: 'Platform & E-commerce',
      items: [
        { icon: '🛒', title: 'E-commerce Platform Development', desc: 'Online stores and marketplaces', color: '#F59E0B' },
        { icon: '🎓', title: 'Education Platform Development', desc: 'Institute, Startup & Market Level', color: '#10B981' },
        { icon: '🏢', title: 'Business Website Development', desc: 'Static Service & Landing Sites', color: '#3B82F6' },
        { icon: '🤖', title: 'AI Automation', desc: 'Voice call & Chatbot automation', color: '#7C3AED' },
      ],
    },
    {
      heading: 'Design & Templates',
      items: [
        { icon: '📝', title: 'Form Development', desc: 'Event, Organization & Registration Forms', color: '#10B981' },
        { icon: '📄', title: 'Template Development', desc: 'Custom template creation', color: '#EF4444' },
        { icon: '🖼️', title: 'Event Banner Design', desc: 'Business, Events, Rentals & Product', color: '#F97316' },
      ],
    },
  ],
};

const dropdownMap = {
    products: productsDropdown,
    projectWorks: projectWorksDropdown,
    services: servicesDropdown,
};

export const NavLogo = () => (
    <Link to="/" className="lp-nav-logo">
        <div className="lp-nav-logo-icon">
            {[...Array(6)].map((_, i) => <div key={i} className="lp-nav-logo-dot" />)}
        </div>
        <span className="lp-nav-logo-text">Namas<span>tute</span></span>
    </Link>
);

const WebsiteNavbar = () => {
    const navigate = useNavigate();
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
        if (window.location.pathname !== '/') {
            navigate('/');
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
                                    <a href="#" className="lp-mobile-accordion-item" key={ii} onClick={() => setMenuOpen(false)}>
                                        <span className="lp-mobile-accordion-icon" style={{ background: `${item.color}12`, color: item.color }}>
                                            {item.icon}
                                        </span>
                                        <div>
                                            <span className="lp-mobile-accordion-title">{item.title}</span>
                                            <span className="lp-mobile-accordion-desc">{item.desc}</span>
                                        </div>
                                    </a>
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
                    <li 
                        className="lp-nav-dropdown-trigger"
                        onMouseEnter={() => handleMouseEnter('products')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button 
                            ref={(el) => (linkRefs.current.products = el)}
                            className={`lp-nav-btn ${activeDropdown === 'products' ? 'active' : ''}`}
                        >
                            Product
                            <svg className={`lp-nav-chevron ${activeDropdown === 'products' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                    </li>
                    <li 
                        className="lp-nav-dropdown-trigger"
                        onMouseEnter={() => handleMouseEnter('projectWorks')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button 
                            ref={(el) => (linkRefs.current.projectWorks = el)}
                            className={`lp-nav-btn ${activeDropdown === 'projectWorks' ? 'active' : ''}`}
                        >
                            Project Works
                            <svg className={`lp-nav-chevron ${activeDropdown === 'projectWorks' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                    </li>
                    <li 
                        className="lp-nav-dropdown-trigger"
                        onMouseEnter={() => handleMouseEnter('services')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button 
                            ref={(el) => (linkRefs.current.services = el)}
                            className={`lp-nav-btn ${activeDropdown === 'services' ? 'active' : ''}`}
                        >
                            Services
                            <svg className={`lp-nav-chevron ${activeDropdown === 'services' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                    </li>
                    <li><a href="#features" onClick={() => scrollTo('features')}>Features</a></li>
                    <li><a href="#pricing" onClick={() => scrollTo('pricing')}>Pricing</a></li>
                    <li><Link to="/blog" style={{ color: 'var(--primary)', fontWeight: 700 }}>Blog</Link></li>
                </ul>

                <div className="lp-nav-cta">
                    <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Log In</button>
                    <button className="lp-btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
                </div>

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
                                                <a href="#" className="lp-dropdown-item" key={ii}>
                                                    <span className="lp-dropdown-icon" style={{ background: `${item.color}12`, color: item.color }}>
                                                        {item.icon}
                                                    </span>
                                                    <div className="lp-dropdown-text">
                                                        <span className="lp-dropdown-title">{item.title}</span>
                                                        <span className="lp-dropdown-desc">{item.desc}</span>
                                                    </div>
                                                </a>
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
                    {renderMobileAccordion('products', 'Product')}
                    {renderMobileAccordion('projectWorks', 'Project Works')}
                    {renderMobileAccordion('services', 'Services')}
                    <a href="#features" onClick={() => scrollTo('features')}>Features</a>
                    <a href="#pricing" onClick={() => scrollTo('pricing')}>Pricing</a>
                    <Link to="/blog" onClick={() => setMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border-soft)', display: 'block', fontSize: 15 }}>Blog</Link>
                </div>
                <div className="lp-mobile-menu-cta">
                    <a href="#" className="lp-btn-ghost" onClick={() => { setMenuOpen(false); navigate('/login'); }}>Log In</a>
                    <a href="#" className="lp-btn-primary" onClick={() => { setMenuOpen(false); navigate('/register'); }}>Get Started Free</a>
                </div>
            </div>
        </>
    );
};

export default WebsiteNavbar;
