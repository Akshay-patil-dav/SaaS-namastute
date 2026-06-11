import { useEffect, useState } from 'react';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import './ContactUs.css';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Contact Us | Namustutam";
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            setTimeout(() => setSubmitStatus(null), 5000);
        }, 1500);
    };

    return (
        <div className="contact-root">
            <WebsiteNavbar />

            {/* Header Section */}
            <header className="contact-header">
                <div className="contact-container">
                    <span className="contact-badge">GET IN TOUCH</span>
                    <h1 className="contact-title">Let's build something <span className="contact-gradient-text">amazing</span> together.</h1>
                    <p className="contact-subtitle">
                        Whether you have a question about our services, pricing, or need a custom solution, our team is ready to answer all your questions.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <section className="contact-main">
                <div className="contact-container">
                    <div className="contact-grid">
                        
                        {/* Left Side: Contact Information */}
                        <div className="contact-info-panel">
                            <h2>Contact Information</h2>
                            <p className="contact-info-desc">
                                Fill out the form and our team will get back to you within 24 hours.
                            </p>

                            <div className="contact-details">
                                <div className="contact-detail-item">
                                    <div className="contact-icon">📞</div>
                                    <div>
                                        <h4>Whatsapp No.</h4>
                                        <p>+91 82375 12742</p>
                                    </div>
                                </div>
                                <div className="contact-detail-item">
                                    <div className="contact-icon">✉️</div>
                                    <div>
                                        <h4>Email</h4>
                                        <p>namustutam@gmail.com</p>
                                    </div>
                                </div>
                                <div className="contact-detail-item">
                                    <div className="contact-icon">📍</div>
                                    <div>
                                        <h4>Office</h4>
                                        <p>Remote / Online Only</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-socials">
                                <a href="https://www.linkedin.com/company/namustute/" target="_blank" rel="noreferrer" className="contact-social-btn">LinkedIn</a>
                                <a href="https://www.instagram.com/namustute/" target="_blank" rel="noreferrer" className="contact-social-btn">Instagram</a>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="contact-circle contact-circle-1"></div>
                            <div className="contact-circle contact-circle-2"></div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="contact-form-panel">
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="contact-form-row">
                                    <div className="contact-form-group">
                                        <label>Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    <div className="contact-form-group">
                                        <label>Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="john@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="contact-form-group">
                                    <label>Subject</label>
                                    <input 
                                        type="text" 
                                        name="subject" 
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="contact-form-group">
                                    <label>Message</label>
                                    <textarea 
                                        name="message" 
                                        placeholder="Tell us about your project or inquiry..."
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required 
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`contact-submit-btn ${isSubmitting ? 'loading' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                                </button>

                                {submitStatus === 'success' && (
                                    <div className="contact-success-msg">
                                        ✅ Thank you! Your message has been sent successfully.
                                    </div>
                                )}
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            <WebsiteFooter />
        </div>
    );
}
