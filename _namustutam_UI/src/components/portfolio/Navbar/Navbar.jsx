import { useState, useEffect, useRef } from 'react';
import LoginPopup from '../LoginPopup/LoginPopup';
import { Package, Briefcase, Layers, BookOpen, Phone, Info, Image, Globe, Monitor, Code, Wrench, ShoppingBag, GraduationCap, Building2, Bot, FileText, FileCode, Palette } from 'lucide-react';

/* ─── Dropdown Data ─── */
const productsDropdown = {
  columns: [
    {
      heading: 'Products',
      items: [
        { icon: <Image size={20} />, title: 'List of Products', desc: 'Browse products with banner images', color: '#2563EB' },
      ],
    },
  ],
};

const servicesDropdown = {
  columns: [
    {
      heading: 'Development Services',
      items: [
        { icon: <Globe size={20} />, title: 'Web Development', desc: 'Shopify & WordPress Development', color: '#2563EB' },
        { icon: <Monitor size={20} />, title: 'Web Application Development', desc: 'Single, Multiple & Business Use', color: '#8B5CF6' },
        { icon: <Code size={20} />, title: 'Software Development', desc: 'Custom & Business requirement based', color: '#EC4899' },
        { icon: <Wrench size={20} />, title: 'Custom Development', desc: 'Tailored solutions for your needs', color: '#06B6D4' },
      ],
    },
    {
      heading: 'Platform & E-commerce',
      items: [
        { icon: <ShoppingBag size={20} />, title: 'E-commerce Platform Development', desc: 'Online stores and marketplaces', color: '#F59E0B' },
        { icon: <GraduationCap size={20} />, title: 'Education Platform Development', desc: 'Institute, Startup & Market Level', color: '#10B981' },
        { icon: <Building2 size={20} />, title: 'Business Website Development', desc: 'Static Service & Landing Sites', color: '#3B82F6' },
        { icon: <Bot size={20} />, title: 'AI Automation', desc: 'Voice call & Chatbot automation', color: '#7C3AED' },
      ],
    },
    {
      heading: 'Design & Templates',
      items: [
        { icon: <FileText size={20} />, title: 'Form Development', desc: 'Event, Organization & Registration Forms', color: '#10B981' },
        { icon: <FileCode size={20} />, title: 'Template Development', desc: 'Custom template creation', color: '#EF4444' },
        { icon: <Palette size={20} />, title: 'Event Banner Design', desc: 'Business, Events, Rentals & Product', color: '#F97316' },
      ],
    },
  ],
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [caretLeft, setCaretLeft] = useState(0);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const navRef = useRef(null);
  const linkRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Calculate caret position when dropdown changes */
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

  const handleMouseEnter = (name) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const dropdownMap = {
    products: productsDropdown,
    services: servicesDropdown,
  };

  const toggleMobileAccordion = (name) => {
    setMobileAccordion(mobileAccordion === name ? null : name);
  };

  const renderMobileAccordion = (name, label) => {
    const data = dropdownMap[name];
    if (!data) return null;
    const isOpen = mobileAccordion === name;

    return (
      <div className="mobile-accordion">
        <button
          className={`navbar__mobile-link mobile-accordion__toggle ${isOpen ? 'open' : ''}`}
          onClick={() => toggleMobileAccordion(name)}
        >
          {label}
          <svg className={`mobile-accordion__chevron ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {isOpen && (
          <div className="mobile-accordion__content">
            {data.columns.map((col, ci) => (
              <div key={ci} className="mobile-accordion__group">
                <span className="mobile-accordion__heading">{col.heading}</span>
                {col.items.map((item, ii) => (
                  <a href="#" className="mobile-accordion__item" key={ii} onClick={() => setMobileOpen(false)}>
                    <span className="mobile-accordion__icon" style={{ background: `${item.color}12`, color: item.color }}>
                      {item.icon}
                    </span>
                    <div>
                      <span className="mobile-accordion__title">{item.title}</span>
                      <span className="mobile-accordion__desc">{item.desc}</span>
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

  const activeData = activeDropdown ? dropdownMap[activeDropdown] : null;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="navbar" ref={navRef}>
      <div className="navbar__inner container">
        {/* Logo */}
        <a href="#" className="navbar__logo" id="logo">
          <div className="navbar__logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="50%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="15" fill="url(#logoGrad)" />
              <circle cx="12" cy="14" r="4" fill="rgba(255,255,255,0.6)" />
              <circle cx="20" cy="18" r="3" fill="rgba(255,255,255,0.4)" />
              <circle cx="16" cy="10" r="2" fill="rgba(255,255,255,0.8)" />
            </svg>
          </div>
          <span className="navbar__logo-text">Namustutam</span>
        </a>

        {/* Desktop Nav */}
        <div className="navbar__links" id="nav-links">
          {/* Products */}
          <div
            className="navbar__link-wrapper"
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={(el) => (linkRefs.current.products = el)}
              className={`navbar__link ${activeDropdown === 'products' ? 'active' : ''}`}
              id="nav-products"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Package size={16} /> Product
              <svg className={`navbar__chevron-svg ${activeDropdown === 'products' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>

          {/* Project Works */}
          <a href="#projectWorks" className="navbar__link" id="nav-projectWorks" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={16} /> Project Works</a>

          {/* Services */}
          <div
            className="navbar__link-wrapper"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={(el) => (linkRefs.current.services = el)}
              className={`navbar__link ${activeDropdown === 'services' ? 'active' : ''}`}
              id="nav-services"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Layers size={16} /> Services
              <svg className={`navbar__chevron-svg ${activeDropdown === 'services' ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>

          <a href="#blogs" className="navbar__link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><BookOpen size={16} /> Blogs</a>
          <a href="#contact" className="navbar__link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> Contact Us</a>
          <a href="#about" className="navbar__link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Info size={16} /> About Us</a>
        </div>

        {/* CTA Buttons */}
        <div className="navbar__actions">
          <button className="navbar__login" id="login-btn" onClick={() => setIsLoginOpen(true)}>Log In</button>
          <a href="#" className="btn btn-primary navbar__cta" id="get-started-btn">Get Started</a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`navbar__hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          id="hamburger-btn"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* ═══ Desktop Dropdown — rendered at navbar level, centered ═══ */}
      {activeData && (
        <div
          className="dropdown"
          onMouseEnter={() => handleMouseEnter(activeDropdown)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Caret / pointer arrow */}
          <div className="dropdown__caret" style={{ left: `${caretLeft}px` }} />
          <div className="dropdown__body">
            <div
              className="dropdown__inner"
              style={{ left: `${caretLeft}px`, transform: 'translateX(-50%)' }}
            >
              {activeData.columns.map((col, ci) => (
                <div className="dropdown__column" key={ci}>
                  <span className="dropdown__heading">{col.heading}</span>
                  {col.items.map((item, ii) => (
                    <a href="#" className="dropdown__item" key={ii}>
                      <span className="dropdown__item-icon" style={{ background: `${item.color}12`, color: item.color }}>
                        {item.icon}
                      </span>
                      <div className="dropdown__item-text">
                        <span className="dropdown__item-title">{item.title}</span>
                        <span className="dropdown__item-desc">{item.desc}</span>
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar__mobile" id="mobile-menu">
          <div className="navbar__mobile-scroll">
            {renderMobileAccordion('products', <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Package size={16} /> Product</span>)}
            <a href="#projectWorks" className="navbar__mobile-link" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={16} /> Project Works</a>
            {renderMobileAccordion('services', <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Layers size={16} /> Services</span>)}

            <a href="#blogs" className="navbar__mobile-link" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><BookOpen size={16} /> Blogs</a>
            <a href="#contact" className="navbar__mobile-link" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> Contact Us</a>
            <a href="#about" className="navbar__mobile-link" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Info size={16} /> About Us</a>
          </div>
          <div className="navbar__mobile-actions">
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setIsLoginOpen(true)}>Log In</button>
            <a href="#" className="btn btn-primary" style={{ width: '100%' }}>Get Started</a>
          </div>
        </div>
      )}

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
};

export default Navbar;
