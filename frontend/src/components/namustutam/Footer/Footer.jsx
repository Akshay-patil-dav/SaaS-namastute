const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__col">
                        <h4 className="footer__heading">Products</h4>
                        <ul className="footer__links">
                            <li><a href="#">3D Design</a></li>
                            <li><a href="#">Hana</a></li>
                            <li><a href="#">iOS</a></li>
                            <li><a href="#">Android</a></li>
                            <li><a href="#">Spline Mirror</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Download</a></li>
                            <li><a href="#">AI 3D Generation</a></li>
                            <li><a href="#">AI Style Transfer</a></li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__heading">Resources</h4>
                        <ul className="footer__links">
                            <li><a href="#">Education</a></li>
                            <li><a href="#">Enterprise</a></li>
                            <li><a href="#">Solutions</a></li>
                            <li><a href="#">Docs</a></li>
                            <li><a href="#">API</a></li>
                            <li><a href="#">Examples</a></li>
                            <li><a href="#">Academy</a></li>
                            <li><a href="#">Customers</a></li>
                            <li><a href="#">Community</a></li>
                            <li><a href="#">Updates</a></li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__heading">Company</h4>
                        <ul className="footer__links">
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Security</a></li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__heading">Contact</h4>
                        <ul className="footer__links">
                            <li><a href="mailto:help@spline.design">help@spline.design</a></li>
                            <li><a href="mailto:jobs@spline.design">jobs@spline.design</a></li>
                        </ul>
                        <div className="footer__socials">
                            <a href="#" className="footer__social" aria-label="Twitter">𝕏</a>
                            <a href="#" className="footer__social" aria-label="YouTube">▶</a>
                            <a href="#" className="footer__social" aria-label="Discord">💬</a>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <div className="footer__logo">
                        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                            <defs>
                                <linearGradient id="footerGrad" x1="0" y1="0" x2="32" y2="32">
                                    <stop offset="0%" stopColor="#667eea" />
                                    <stop offset="100%" stopColor="#7C3AED" />
                                </linearGradient>
                            </defs>
                            <circle cx="16" cy="16" r="15" fill="url(#footerGrad)" />
                            <circle cx="12" cy="14" r="4" fill="rgba(255,255,255,0.6)" />
                            <circle cx="20" cy="18" r="3" fill="rgba(255,255,255,0.4)" />
                        </svg>
                        <span>spline</span>
                    </div>
                    <p className="footer__copyright">© 2024 Spline Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
