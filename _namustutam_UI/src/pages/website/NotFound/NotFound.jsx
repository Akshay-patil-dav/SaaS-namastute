import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
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
            {/* Ambient Background Glows */}
            <div className="notfound-glow-top" />
            <div className="notfound-glow-bottom" />

            {/* Global Website Navbar */}
            <WebsiteNavbar />

            {/* Main 404 Hero Area */}
            <main className="notfound-main">
                <div className="notfound-card">
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
                        The requested page could not be found or is not accessible on this domain.
                        Please check the web address or return to the homepage.
                    </p>

                    <div className="notfound-actions">
                        <button
                            type="button"
                            className="notfound-btn-primary"
                            onClick={() => navigate('/')}
                        >
                            <Home size={18} />
                            <span>Back to Homepage</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Global Website Footer */}
            <WebsiteFooter />
        </div>
    );
}
