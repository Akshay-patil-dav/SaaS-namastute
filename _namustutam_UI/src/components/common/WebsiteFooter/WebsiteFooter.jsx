import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavLogo } from '../WebsiteNavbar/WebsiteNavbar';
import {
    FaTwitter, FaGithub, FaDiscord, FaInstagram, FaLinkedinIn,
    FaMapMarkerAlt, FaEnvelope, FaRegClock, FaLock, FaShieldAlt,
    FaRegCreditCard, FaCode, FaTrophy, FaHandshake
} from 'react-icons/fa';
import { Shield } from 'lucide-react';
import { useLandingPage } from '../../../context/LandingPageContext';
import { resolveContactChannels } from '../../../utils/contactChannels';
import { isAdminPanelDisabled } from '@/utils/domainConfig';
import './WebsiteFooter.css';

const DEFAULT_LEGAL_LINKS = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
    { label: 'Cookie Policy', path: '/cookie-policy' },
    { label: 'Refund Policy', path: '/refund-policy' },
];

const WebsiteFooter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { landingData } = useLandingPage();
    const contact = landingData?.contact || {};
    const socials = contact.socials || {};
    const legalLinks = Array.isArray(landingData?.legalLinks) && landingData.legalLinks.length > 0
        ? landingData.legalLinks
        : DEFAULT_LEGAL_LINKS;

    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveSection('');
            return;
        }

        const hashSection = location.hash ? location.hash.replace('#', '') : '';
        if (hashSection === 'services' || hashSection === 'portfolio') {
            setActiveSection(hashSection);
        } else {
            setActiveSection('');
        }

        const watchedIds = ['services', 'portfolio'];
        const elements = watchedIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (elements.length === 0 || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id);
                } else if (window.scrollY < 320) {
                    setActiveSection('');
                }
            },
            { rootMargin: '-20% 0px -55% 0px', threshold: 0.05 }
        );

        elements.forEach((el) => observer.observe(el));

        const onScroll = () => {
            if (window.scrollY < 260) {
                setActiveSection('');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', onScroll);
        };
    }, [location.pathname, location.hash]);

    const handleSectionLink = (e, sectionId) => {
        e.preventDefault();
        if (location.pathname === '/') {
            setActiveSection(sectionId);
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/#${sectionId}`);
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            }, 350);
        }
    };

    const isRouteActive = (targetPath) => {
        if (!targetPath) return false;
        const currentPath = location.pathname.toLowerCase();
        const currentHash = location.hash.toLowerCase();
        const target = targetPath.toLowerCase();

        // Check hash links e.g. /#services or /#portfolio
        if (target.includes('#')) {
            const [tPath, tHash] = target.split('#');
            const cleanTPath = tPath || '/';
            if (currentPath === cleanTPath && currentHash === `#${tHash}`) return true;
            if (currentPath === '/' && activeSection === tHash) return true;
            return false;
        }

        // Direct path matches
        if (currentPath === target) return true;
        if (target === '/possoftware' && (currentPath === '/pos-software' || currentPath === '/possoftware')) return true;
        if (target === '/terms-of-service' && (currentPath === '/terms' || currentPath === '/terms-of-service')) return true;
        if (target === '/cookie-policy' && (currentPath === '/cookies' || currentPath === '/cookie-policy')) return true;
        if (target === '/refund-policy' && (currentPath === '/refunds' || currentPath === '/refund-policy')) return true;
        if (target === '/privacy-policy' && (currentPath === '/privacy' || currentPath === '/privacy-policy')) return true;
        if (target.startsWith('/services/') && currentPath === target) return true;
        return false;
    };

    const {
        brandName,
        rawEmail,
        rawLocation,
        rawHours,
        showEmail,
        showPhone,
        showLocation,
        showHours,
        phoneDisplay
    } = resolveContactChannels(contact);

    return (
        <div className="premium-footer-wrapper">
            <footer className="premium-footer" id="contact">
                <div className="premium-footer-inner">
                    <div className="premium-footer-grid">

                        <div className="premium-footer-brand">
                            <div className="logo" style={{ marginBottom: '16px' }}>
                                <NavLogo />
                            </div>
                            <p className="brand-description">
                                {contact.brandDescription || 'Namustutam empowers businesses to scale and innovate with premium Web Development, SaaS Applications, AI Automation, and cutting-edge UI/UX Design tailored to your specific needs.'}
                            </p>

                            <div className="company-info-box">
                                <div className="company-info-header">
                                    <strong>{brandName}</strong>
                                </div>
                                {showLocation && (
                                    <div className="company-info-item">
                                        <FaMapMarkerAlt className="info-icon" />
                                        <span>{rawLocation}</span>
                                    </div>
                                )}
                                {showEmail && (
                                    <div className="company-info-item">
                                        <FaEnvelope className="info-icon" />
                                        <span>{rawEmail}</span>
                                    </div>
                                )}
                                {showPhone && (
                                    <div className="company-info-item">
                                        <span className="info-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>📞</span>
                                        <span>{phoneDisplay}</span>
                                    </div>
                                )}
                                {showHours && (
                                    <div className="company-info-item">
                                        <FaRegClock className="info-icon" />
                                        <span>{rawHours}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="premium-footer-col">
                            <h4>Quick Links</h4>
                            <ul>
                                <li>
                                    <Link
                                        to="/"
                                        className={location.pathname === '/' && !activeSection ? 'active' : ''}
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="/#services"
                                        className={location.pathname === '/' && activeSection === 'services' ? 'active' : ''}
                                        onClick={(e) => handleSectionLink(e, 'services')}
                                    >
                                        Our Services
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#portfolio"
                                        className={location.pathname === '/' && activeSection === 'portfolio' ? 'active' : ''}
                                        onClick={(e) => handleSectionLink(e, 'portfolio')}
                                    >
                                        Portfolio
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        to="/contact"
                                        className={isRouteActive('/contact') ? 'active' : ''}
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="premium-footer-col">
                            <h4>Services</h4>
                            <ul>
                                <li>
                                    <Link
                                        to="/possoftware"
                                        className={isRouteActive('/possoftware') ? 'active' : ''}
                                    >
                                        Namustutam POS Software
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/services/web-development"
                                        className={isRouteActive('/services/web-development') ? 'active' : ''}
                                    >
                                        Web Development
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/services/saas-applications"
                                        className={isRouteActive('/services/saas-applications') ? 'active' : ''}
                                    >
                                        SaaS Applications
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/services/ui-ux-design"
                                        className={isRouteActive('/services/ui-ux-design') ? 'active' : ''}
                                    >
                                        UI/UX Design
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/services/ai-automation"
                                        className={isRouteActive('/services/ai-automation') ? 'active' : ''}
                                    >
                                        AI Automation
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {landingData?.sectionVisibility?.legal !== false && (
                            <div className="premium-footer-col">
                                <h4>Legal</h4>
                                <ul>
                                    {legalLinks.map((item) => (
                                        <li key={item.path || item.label}>
                                            <Link
                                                to={item.path}
                                                className={isRouteActive(item.path) ? 'active' : ''}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="premium-footer-socials">
                            {socials.twitter && (
                                <a href={socials.twitter} target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                                    <FaTwitter />
                                </a>
                            )}
                            {socials.github && (
                                <a href={socials.github} target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                                    <FaGithub />
                                </a>
                            )}
                            {socials.discord && (
                                <a href={socials.discord} target="_blank" rel="noreferrer" className="social-icon" aria-label="Discord">
                                    <FaDiscord />
                                </a>
                            )}
                            {socials.instagram && (
                                <a href={socials.instagram} target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                            )}
                            {socials.linkedin && (
                                <a href={socials.linkedin} target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                                    <FaLinkedinIn />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="premium-footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <p>{contact.copyright || `© ${new Date().getFullYear()} Namustutam. All rights reserved.`}</p>

                        {!isAdminPanelDisabled() && (
                            <Link
                                to="/admin"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: '#94a3b8',
                                    fontSize: '12px',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    fontWeight: 500
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#ff5b00'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                            >
                                <Shield size={12} />
                                <span>Admin Portal</span>
                            </Link>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WebsiteFooter;
