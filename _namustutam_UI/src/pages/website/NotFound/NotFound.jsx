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
        return () => { document.title = prevTitle; };
    }, []);

    return (
        <div className="notfound-wrapper">
            <div className="notfound-glow-top" aria-hidden="true" />
            <div className="notfound-glow-bottom" aria-hidden="true" />

            <WebsiteNavbar />

            <main className="notfound-main">
                <div className="notfound-card">
                    <div className="notfound-badge">
                        <span className="notfound-pulse-dot" />
                        <span>404 • Page Not Found</span>
                    </div>

                    <div className="notfound-code" aria-label="404">
                        404
                    </div>

                    <h1 className="notfound-title">
                        Page Not Found
                    </h1>

                    <p className="notfound-description">
                        The requested page could not be found or is not available on this domain.
                    </p>

                    <button
                        type="button"
                        className="notfound-btn-primary"
                        onClick={() => navigate('/')}
                    >
                        <Home size={18} />
                        <span>Back to Homepage</span>
                    </button>
                </div>
            </main>

            <WebsiteFooter />
        </div>
    );
}
