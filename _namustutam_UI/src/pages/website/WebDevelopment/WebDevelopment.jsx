import React from 'react';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import './WebDevelopment.css';

export default function WebDevelopment() {
    return (
        <div className="web-development-page">
            <WebsiteNavbar />
            <main className="web-development-content">
                {/* Blank Web Development Page */}
            </main>
            <WebsiteFooter />
        </div>
    );
}
