import { useEffect } from 'react';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Privacy Policy | Namustutam";
    }, []);

    const lastUpdated = "August 13, 2026";

    return (
        <div className="privacy-root">
            <WebsiteNavbar />

            <header className="privacy-header">
                <div className="privacy-container">
                    <span className="privacy-badge">LEGAL</span>
                    <h1 className="privacy-title">Privacy <span className="privacy-gradient-text">Policy</span></h1>
                    <p className="privacy-subtitle">
                        We value your privacy and are committed to protecting your personal information.
                    </p>
                </div>
            </header>

            <section className="privacy-main">
                <div className="privacy-container">
                    <div className="privacy-content">
                        <p><strong>Last Updated: {lastUpdated}</strong></p>
                        
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Namustutam. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                        </p>

                        <h2>2. Information We Collect</h2>
                        <p>
                            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                        </p>
                        <ul>
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                        </ul>

                        <h2>3. Use of Your Information</h2>
                        <p>
                            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                        </p>
                        <ul>
                            <li>Create and manage your account.</li>
                            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
                            <li>Email you regarding your account or order.</li>
                            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                            <li>Respond to customer service requests and provide support.</li>
                        </ul>

                        <h2>4. Disclosure of Your Information</h2>
                        <p>
                            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                        </p>
                        <ul>
                            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                        </ul>

                        <h2>5. Security of Your Information</h2>
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                        </p>

                        <h2>6. Contact Us</h2>
                        <p>
                            If you have questions or comments about this Privacy Policy, please contact us at:
                        </p>
                        <p>
                            <strong>Email:</strong> namustutam@gmail.com<br/>
                            <strong>Phone:</strong> +91 82375 12742
                        </p>
                    </div>
                </div>
            </section>

            <WebsiteFooter />
        </div>
    );
}
