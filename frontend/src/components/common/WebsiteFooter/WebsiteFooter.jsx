import { Link } from 'react-router-dom';
import './WebsiteFooter.css';

const WebsiteFooter = () => {
    return (
        <div className="premium-footer-wrapper">
            {/* Animated Liquid Wave */}
            <div className="liquid-wave-container">
                <svg className="liquid-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g className="parallax">
                        <use href="#gentle-wave" x="48" y="0" fill="rgba(255, 144, 47, 0.4)" />
                        <use href="#gentle-wave" x="48" y="3" fill="rgba(255, 144, 47, 0.2)" />
                        <use href="#gentle-wave" x="48" y="5" fill="rgba(255, 144, 47, 0.1)" />
                        <use href="#gentle-wave" x="48" y="7" fill="var(--bg, #f5f7ff)" />
                    </g>
                </svg>
            </div>

            <footer className="premium-footer">
                {/* Liquid background blobs */}
                <div className="liquid-blob blob-1"></div>
                <div className="liquid-blob blob-2"></div>

                <div className="premium-footer-inner">
                    <div className="premium-footer-grid">
                        
                        <div className="premium-footer-brand">
                            <div className="logo">
                                <div className="logo-icon"></div>
                                <span>Namastute</span>
                            </div>
                            <p>Empowering businesses with intelligent SaaS solutions. Build, scale, and innovate faster with our comprehensive platform designed for the modern web.</p>
                            
                            <div className="premium-footer-socials">
                                {/* LinkedIn */}
                                <a href="https://www.linkedin.com/company/namustute/" target="_blank" rel="noreferrer" className="premium-social-icon" aria-label="LinkedIn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                                {/* Instagram */}
                                <a href="https://www.instagram.com/namustute/" target="_blank" rel="noreferrer" className="premium-social-icon" aria-label="Instagram">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="premium-footer-col">
                            <h4>PRODUCTS</h4>
                            <ul>
                                <li><Link to="/retail-saas-platform">Retail SaaS Platform</Link></li>
                                <li><Link to="/services/web-development">Web Development</Link></li>
                                <li><Link to="/services/ai-automation">AI Automation</Link></li>
                                <li><Link to="/services/e-commerce-platform-development">E-Commerce</Link></li>
                                <li><Link to="/blog">Our Templates</Link></li>
                                <li><a href="#pricing">Pricing & Plans</a></li>
                            </ul>
                        </div>

                        <div className="premium-footer-col">
                            <h4>COMPANY</h4>
                            <ul>
                                <li><Link to="/">About Us</Link></li>
                                <li><a href="#">Careers</a></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/blog">Blog & News</Link></li>
                                <li><a href="#">Documentation</a></li>
                            </ul>
                        </div>

                        <div className="premium-footer-col">
                            <h4>CONTACT US</h4>
                            <div className="premium-footer-contact">
                                <a href="mailto:namustutam@gmail.com">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    namustutam@gmail.com
                                </a>
                                <a href="tel:+919580112795">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    +91 9580112795
                                </a>
                                <span style={{ color: 'var(--text-muted, #7a89b0)', fontSize: '13px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"></circle><path d="M12 217c-5.1-5.1-9-10.4-9-15 0-5.5 4.5-10 10-10s10 4.5 10 10c0 4.6-3.9 9.9-9 15-2.2 2.2-4.5 4.5-6.5 6.5l-1.5-1.5z" transform="translate(-1, -7) scale(1.1)"></path></svg>
                                    Remote / Online Only
                                </span>
                            </div>
                        </div>

                    </div>

                    <div className="premium-footer-bottom">
                        <p>© 2026 Namastute Inc. All rights reserved.</p>
                        <div className="premium-footer-bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WebsiteFooter;
