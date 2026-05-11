import { Link } from 'react-router-dom';

const WebsiteFooter = () => {
    return (
        <footer className="lp-footer">
            <div className="lp-footer-inner">
                <div className="lp-footer-grid">
                    <div className="lp-footer-col">
                        <h4>PRODUCTS</h4>
                        <ul>
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
                    <div className="lp-footer-col">
                        <h4>RESOURCES</h4>
                        <ul>
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
                    <div className="lp-footer-col">
                        <h4>COMPANY</h4>
                        <ul>
                            <li><Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Security</a></li>
                        </ul>
                    </div>
                    <div className="lp-footer-col">
                        <h4>CONTACT</h4>
                        <div className="lp-footer-contact">
                            <a href="mailto:help@namustutam.com">help@namustutam.com</a>
                            <a href="mailto:jobs@namustutam.com">jobs@namustutam.com</a>
                            <div className="lp-footer-socials">
                                <a href="#" className="lp-social-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                                <a href="#" className="lp-social-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></a>
                                <a href="#" className="lp-social-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.307 4.262a10.109 10.109 0 0 0-2.497-.773 10.015 10.015 0 0 0-.256-.47 11.22 11.22 0 0 0-1.18-.32 12.3 12.3 0 0 0-1.424-.132C11.516 2.5 8.784 4.316 7.424 7.21a11.16 11.16 0 0 0-.903 5.372 11.2 11.2 0 0 0 1.545 4.887 11.12 11.12 0 0 0 3.75 3.655c1.472.84 3.12 1.288 4.796 1.288a11.08 11.08 0 0 0 4.17-.807 11.18 11.18 0 0 0 3.424-2.28c.113-.11.11-.295-.008-.4L22.25 17.5a.286.286 0 0 0-.342-.047 7.74 7.74 0 0 1-1.01.464c-.354.128-.72.23-1.092.304-.15.03-.234.19-.183.332.06.166.126.33.2.49.074.153.284.148.353-.008l.19-.415c.026-.057.1-.073.148-.033.454.383.955.703 1.487.954.127.06.183.21.13.344a11.14 11.14 0 0 1-5.18 5.7c-1.396.723-2.94 1.107-4.507 1.115a11.22 11.22 0 0 1-4.707-1.025 11.2 11.2 0 0 1-3.83-2.905 11.2 11.2 0 0 1-2.207-4.14 11.1 11.1 0 0 1-.364-5.26 11.1 11.1 0 0 1 1.944-4.57c1.166-1.57 2.72-2.775 4.493-3.484 1.77-.708 3.708-.946 5.594-.687 1.887.26 3.666.974 5.166 2.066.124.09.302.046.37-.1l.142-.31c.063-.14-.02-.303-.166-.35a11.22 11.22 0 0 0-4.04-1.023l-.123-.006c-.16-.01-.264-.17-.223-.326l.16-.6c.044-.165.233-.23.364-.13a10.1 10.1 0 0 0 2.493.77z"/></svg></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lp-footer-bottom">
                    <div className="lp-footer-logo">
                        <div className="lp-footer-logo-icon"></div>
                        <span>namustutam</span>
                    </div>
                    <p>© 2024 Namustutam Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default WebsiteFooter;
