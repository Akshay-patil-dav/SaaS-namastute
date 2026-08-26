import { Link } from 'react-router-dom';
import { NavLogo } from '../WebsiteNavbar/WebsiteNavbar';
import { 
    FaTwitter, FaGithub, FaDiscord, FaInstagram, FaLinkedinIn,
    FaMapMarkerAlt, FaEnvelope, FaRegClock, FaLock, FaShieldAlt, 
    FaRegCreditCard, FaCode, FaTrophy, FaHandshake
} from 'react-icons/fa';
import './WebsiteFooter.css';

const WebsiteFooter = () => {
    return (
        <div className="premium-footer-wrapper">
            <footer className="premium-footer">
                <div className="premium-footer-inner">
                    {/* Watermark */}
                    <div className="footer-watermark">namustutam</div>

                    <div className="premium-footer-grid">
                        
                        <div className="premium-footer-brand">
                            <div className="logo" style={{ marginBottom: '16px' }}>
                                <NavLogo />
                            </div>
                            <p className="brand-description">
                                Namustutam empowers businesses to scale and innovate with premium Web Development, SaaS Applications, AI Automation, and cutting-edge UI/UX Design tailored to your specific needs.
                            </p>
                            
                            <div className="company-info-box">
                                <div className="company-info-header">
                                     <strong>Namustutam</strong> 
                                    {/* <span className="verified-badge">Verified IT Agency</span> */}
                                </div>
                                <div className="company-info-item">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <span>Remote / Global Agency</span>
                                </div>
                                <div className="company-info-item">
                                    <FaEnvelope className="info-icon" />
                                    <span>namustutam@gmail.com</span>
                                </div>
                                <div className="company-info-item">
                                    <FaRegClock className="info-icon" />
                                    <span>Available 24/7 for Support</span>
                                </div>
                            </div>
                        </div>

                        <div className="premium-footer-col">
                            <h4>Company</h4>
                            <ul>
                                <li><Link to="/">About Us</Link></li>
                                <li><Link to="#services">Our Services</Link></li>
                                <li><Link to="#projects">Portfolio</Link></li>
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
                            <a href="#" className="social-icon" aria-label="Twitter"><FaTwitter /></a>
                            {/* <a href="#" className="social-icon" aria-label="GitHub"><FaGithub /></a> */}
                            <a href="#" className="social-icon" aria-label="Discord"><FaDiscord /></a>
                            <a href="https://www.instagram.com/namustute/" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
                            <a href="https://www.linkedin.com/company/namustute/" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn"><FaLinkedinIn /></a>
                        </div>
                    </div>

                    {/* <div className="footer-badges">
                        <div className="badge-item"><FaLock className="badge-icon green"/> SSL 256-Bit Encryption</div>
                        <div className="badge-item"><FaShieldAlt className="badge-icon blue"/> Quality Assured Delivery</div>
                        <div className="badge-item"><FaTrophy className="badge-icon" style={{color: '#eab308'}}/> Top Rated Agency</div>
                        <div className="badge-item"><FaHandshake className="badge-icon purple"/> Secure & Transparent Process</div>
                    </div> */}

                    <div className="premium-footer-bottom">
                        <p>© {new Date().getFullYear()} Namustutam. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WebsiteFooter;
