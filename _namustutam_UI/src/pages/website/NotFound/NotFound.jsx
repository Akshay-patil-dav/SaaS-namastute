import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Briefcase, Phone, AlertTriangle, ArrowLeft } from 'lucide-react';
import WebsiteNavbar from '@/components/common/WebsiteNavbar/WebsiteNavbar.jsx';
import WebsiteFooter from '@/components/common/WebsiteFooter/WebsiteFooter.jsx';
import './NotFound.css';

export default function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        const prevTitle = document.title;
        document.title = '404 - Page Not Found | Namustutam';
        window.scrollTo(0, 0);

        return () => {
            document.title = prevTitle;
        };
    }, []);

    return (
        <div className="notfound-wrapper">
            {/* Ambient Background Lights */}
            <div className="notfound-glow-top" />
            <div className="notfound-glow-bottom" />

            {/* Global Website Navbar */}
            <WebsiteNavbar />

            {/* Main 404 Hero Area */}
            <main className="notfound-main">
                <div className="notfound-content">
                    <div className="notfound-badge">
                        <span className="notfound-pulse-dot" />
                        <span>404 Error • Page Not Found</span>
                    </div>

                    <div className="notfound-code" aria-label="Error 404">
                        404
                    </div>

                    <h1 className="notfound-title">
                        Page Not Found
                    </h1>

                    <p className="notfound-description">
                        The requested URL was not found on this server or is not available on this domain.
                        Please verify the web address or navigate using the options below.
                    </p>

                    <div className="notfound-actions">
                        <button
                            type="button"
                            className="notfound-btn-primary"
                            onClick={() => navigate('/')}
                        >
                            <Home size={18} />
                            <span>Back to Home</span>
                        </button>

                        <button
                            type="button"
                            className="notfound-btn-secondary"
                            onClick={() => navigate('/project-works')}
                        >
                            <Briefcase size={18} />
                            <span>Browse Projects</span>
                        </button>

                        <button
                            type="button"
                            className="notfound-btn-secondary"
                            onClick={() => navigate('/contact')}
                        >
                            <Phone size={18} />
                            <span>Contact Support</span>
                        </button>
                    </div>

                    <div className="notfound-quick-links">
                        <span className="notfound-quick-links-title">Quick Navigation</span>
                        <div className="notfound-pills">
                            <Link to="/" className="notfound-pill">Home</Link>
                            <Link to="/project-works" className="notfound-pill">Projects</Link>
                            <Link to="/services/web-development" className="notfound-pill">Web Development</Link>
                            <Link to="/services/ai-automation" className="notfound-pill">AI Automation</Link>
                            <Link to="/blog" className="notfound-pill">Blog</Link>
                            <Link to="/contact" className="notfound-pill">Contact</Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Website Footer */}
            <WebsiteFooter />
        </div>
    );
}
