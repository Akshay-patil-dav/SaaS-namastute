import { Link } from 'react-router-dom';
import { NavLogo } from '../WebsiteNavbar/WebsiteNavbar';
import {
    FaTwitter, FaGithub, FaDiscord, FaInstagram, FaLinkedinIn,
    FaMapMarkerAlt, FaEnvelope, FaRegClock, FaLock, FaShieldAlt,
    FaRegCreditCard, FaCode, FaTrophy, FaHandshake
} from 'react-icons/fa';
import { Shield } from 'lucide-react';
import { useLandingPage } from '../../../context/LandingPageContext';
import './WebsiteFooter.css';

const WebsiteFooter = () => {
    const { landingData } = useLandingPage();
    const contact = landingData?.contact || {};
    const socials = contact.socials || {};

    const rawEmail = (contact.email ?? '').trim();
    const rawPhone = (contact.phone ?? '').trim();
    const rawWhatsapp = (contact.whatsapp ?? '').trim();
    const rawLocation = (contact.location ?? '').trim();
    const rawHours = (contact.supportHours ?? '').trim();
    const phoneDisplay = rawPhone || rawWhatsapp;

    return (
        <div className="premium-footer-wrapper">
            <footer className="premium-footer">
                <div className="premium-footer-inner">
                    {/* Watermark */}
                    <div className="footer-watermark">{contact.brandName || 'namustutam'}</div>

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
                                    <strong>{contact.brandName || 'Namustutam'}</strong>
                                </div>
                                {rawLocation && (
                                    <div className="company-info-item">
                                        <FaMapMarkerAlt className="info-icon" />
                                        <span>{rawLocation}</span>
                                    </div>
                                )}
                                {rawEmail && (
                                    <div className="company-info-item">
                                        <FaEnvelope className="info-icon" />
                                        <span>{rawEmail}</span>
                                    </div>
                                )}
                                {phoneDisplay && (
                                    <div className="company-info-item">
                                        <span className="info-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>📞</span>
                                        <span>{phoneDisplay}</span>
                                    </div>
                                )}
                                {rawHours && (
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
                                <li><Link to="/">About Us</Link></li>
                                <li><a href="/#services">Our Services</a></li>
                                <li><a href="/#portfolio">Portfolio</a></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div className="premium-footer-col">
                            <h4>Services</h4>
                            <ul>
                                <li><Link to="/services/web-development">Web Development</Link></li>
                                <li><Link to="/services/saas-applications">SaaS Applications</Link></li>
                                <li><Link to="/services/ui-ux-design">UI/UX Design</Link></li>
                                <li><Link to="/services/ai-automation">AI Automation</Link></li>
                            </ul>
                        </div>

                        <div className="premium-footer-col">
                            <h4>Legal</h4>
                            <ul>
                                <li><Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link></li>
                                <li><Link to="#">Terms of Service</Link></li>
                                <li><Link to="#">Cookie Policy</Link></li>
                                <li><Link to="#">Refund Policy</Link></li>
                            </ul>
                        </div>

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
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WebsiteFooter;
