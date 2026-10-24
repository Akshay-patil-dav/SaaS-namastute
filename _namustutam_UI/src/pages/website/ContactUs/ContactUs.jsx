import { useEffect, useState } from 'react';
import { 
    Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, 
    MessageSquare, Sparkles, ArrowRight, ExternalLink 
} from 'lucide-react';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import { useLandingPage } from '../../../context/LandingPageContext';
import apiClient, { ENV } from '../../../api/config';
import './ContactUs.css';

export default function ContactUs() {
    const { landingData } = useLandingPage();
    const contact = landingData?.contact || {};
    const socials = contact.socials || {};

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'SaaS Platform Development',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMessage, setErrorMessage] = useState('');
    const [submittedName, setSubmittedName] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Contact Us | Namustutam";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (submitStatus === 'error') {
            setSubmitStatus(null);
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setSubmitStatus('error');
            setErrorMessage('Please fill in your name, email, and message.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrorMessage('');

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
            service: formData.service || undefined,
            subject: formData.subject.trim() || `${formData.service || 'Website Inquiry'} from ${formData.name.trim()}`,
            message: formData.message.trim()
        };

        try {
            // Send to backend database
            const res = await apiClient.post('/contact-submissions', payload);
            
            if (res.data?.success || res.status === 200 || res.status === 201) {
                setSubmittedName(formData.name.trim());
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: 'SaaS Platform Development',
                    subject: '',
                    message: ''
                });
            } else {
                throw new Error(res.data?.message || 'Failed to submit form');
            }
        } catch (err) {
            console.error('[ContactUs] Submission error:', err);
            // Fallback retry to alternative endpoint if available
            try {
                const retryRes = await apiClient.post('/contacts', payload);
                if (retryRes.data?.success || retryRes.status === 200 || retryRes.status === 201) {
                    setSubmittedName(formData.name.trim());
                    setSubmitStatus('success');
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        service: 'SaaS Platform Development',
                        subject: '',
                        message: ''
                    });
                    setIsSubmitting(false);
                    return;
                }
            } catch (retryErr) {
                // Secondary fallback failed
            }

            setSubmitStatus('error');
            const msg = err.response?.data?.message || err.message || 'Unable to connect to the server. Please try again or reach out directly via email.';
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Dynamic contact channel values (no hardcoded fallback if user clears or leaves empty)
    const rawEmail = (contact.email ?? '').trim();
    const rawPhone = (contact.phone ?? '').trim();
    const rawWhatsapp = (contact.whatsapp ?? '').trim();
    const rawLocation = (contact.location ?? '').trim();
    const rawHours = (contact.supportHours ?? '').trim();

    // Check availability - if value is empty or explicitly turned off, hide the section
    const showEmail = contact.showEmail !== false && Boolean(rawEmail);
    const showPhone = contact.showPhone !== false && Boolean(rawPhone || rawWhatsapp);
    const showLocation = contact.showLocation !== false && Boolean(rawLocation);
    const showHours = contact.showHours !== false && Boolean(rawHours);

    // Resolved phone/whatsapp values and URLs
    const phoneDisplayNumber = rawWhatsapp || rawPhone;
    const cleanWhatsapp = (rawWhatsapp || rawPhone).replace(/[^0-9]/g, '');
    const cleanPhone = (rawPhone || rawWhatsapp).replace(/[^0-9+]/g, '');
    const whatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '';
    const phoneTelUrl = cleanPhone ? `tel:${cleanPhone}` : '';
    const primaryPhoneLink = rawWhatsapp ? whatsappUrl : phoneTelUrl;

    // Check if any socials exist
    const hasAnySocial = Object.values(socials).some(url => url && typeof url === 'string' && url.trim().length > 0);

    return (
        <div className="contact-root">
            <WebsiteNavbar />

            {/* Header Section */}
            <header className="contact-header">
                <div className="contact-container">
                    <span className="contact-badge">GET IN TOUCH</span>
                    <h1 className="contact-title">
                        Let's build something <span className="contact-gradient-text">amazing</span> together.
                    </h1>
                    <p className="contact-subtitle">
                        Whether you have a question about our SaaS platform, custom software engineering, AI automation, or need an enterprise quote — we're ready to help.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <section className="contact-main">
                <div className="contact-container">
                    <div className="contact-grid">
                        
                        {/* Left Side: Contact Information Panel */}
                        <div className="contact-info-panel">
                            <h2>Contact Information</h2>
                            <p className="contact-info-desc">
                                Fill out the form and our technical leadership team will get back to you within 24 hours.
                            </p>

                            <div className="contact-details">
                                {/* Email */}
                                {showEmail && (
                                    <div className="contact-detail-item">
                                        <div className="contact-icon">
                                            <Mail size={20} color="#ffffff" />
                                        </div>
                                        <div>
                                            <h4>Email Us</h4>
                                            <p>
                                                <a 
                                                    href={`mailto:${rawEmail}`}
                                                    style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}
                                                >
                                                    {rawEmail}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Phone / WhatsApp - Dynamic, hidden if value is not available */}
                                {showPhone && (
                                    <div className="contact-detail-item">
                                        <div className="contact-icon">
                                            <Phone size={20} color="#ffffff" />
                                        </div>
                                        <div>
                                            <h4>{rawWhatsapp && rawPhone ? 'Phone / WhatsApp' : rawWhatsapp ? 'WhatsApp' : 'Phone'}</h4>
                                            <p>
                                                {primaryPhoneLink ? (
                                                    <a 
                                                        href={primaryPhoneLink} 
                                                        target={rawWhatsapp ? "_blank" : undefined} 
                                                        rel={rawWhatsapp ? "noreferrer" : undefined}
                                                        style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}
                                                    >
                                                        {phoneDisplayNumber}
                                                    </a>
                                                ) : (
                                                    <span style={{ color: '#ffffff', fontWeight: 600 }}>
                                                        {phoneDisplayNumber}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Office Location */}
                                {showLocation && (
                                    <div className="contact-detail-item">
                                        <div className="contact-icon">
                                            <MapPin size={20} color="#ffffff" />
                                        </div>
                                        <div>
                                            <h4>Office / Presence</h4>
                                            <p>{rawLocation}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Support Hours */}
                                {showHours && (
                                    <div className="contact-detail-item">
                                        <div className="contact-icon">
                                            <Clock size={20} color="#ffffff" />
                                        </div>
                                        <div>
                                            <h4>Availability</h4>
                                            <p>{rawHours}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Social Media Links - only render if at least one valid social link is configured */}
                            {hasAnySocial && (
                                <div className="contact-socials">
                                    {socials.linkedin && socials.linkedin.trim() && (
                                        <a href={socials.linkedin.trim()} target="_blank" rel="noreferrer" className="contact-social-btn">
                                            LinkedIn
                                        </a>
                                    )}
                                    {socials.instagram && socials.instagram.trim() && (
                                        <a href={socials.instagram.trim()} target="_blank" rel="noreferrer" className="contact-social-btn">
                                            Instagram
                                        </a>
                                    )}
                                    {socials.github && socials.github.trim() && (
                                        <a href={socials.github.trim()} target="_blank" rel="noreferrer" className="contact-social-btn">
                                            GitHub
                                        </a>
                                    )}
                                    {socials.twitter && socials.twitter.trim() && (
                                        <a href={socials.twitter.trim()} target="_blank" rel="noreferrer" className="contact-social-btn">
                                            Twitter
                                        </a>
                                    )}
                                    {socials.discord && socials.discord.trim() && (
                                        <a href={socials.discord.trim()} target="_blank" rel="noreferrer" className="contact-social-btn">
                                            Discord
                                        </a>
                                    )}
                                </div>
                            )}
                            
                            {/* Decorative background elements */}
                            <div className="contact-circle contact-circle-1"></div>
                            <div className="contact-circle contact-circle-2"></div>
                        </div>

                        {/* Right Side: Interactive Dynamic Form */}
                        <div className="contact-form-panel">
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="contact-form-row">
                                    <div className="contact-form-group">
                                        <label htmlFor="contact-name">Full Name *</label>
                                        <input 
                                            id="contact-name"
                                            type="text" 
                                            name="name" 
                                            placeholder="e.g. John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    <div className="contact-form-group">
                                        <label htmlFor="contact-email">Email Address *</label>
                                        <input 
                                            id="contact-email"
                                            type="email" 
                                            name="email" 
                                            placeholder="e.g. john@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="contact-form-row">
                                    <div className="contact-form-group">
                                        <label htmlFor="contact-phone">Phone / WhatsApp Number</label>
                                        <input 
                                            id="contact-phone"
                                            type="tel" 
                                            name="phone" 
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="contact-form-group">
                                        <label htmlFor="contact-service">Interested Service</label>
                                        <select 
                                            id="contact-service"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                        >
                                            <option value="SaaS Platform Development">SaaS Platform Development</option>
                                            <option value="Web Development & Full-Stack Apps">Web Development & Full-Stack Apps</option>
                                            <option value="AI Automation & Custom Agents">AI Automation & Custom Agents</option>
                                            <option value="UI/UX Design & Frontend Systems">UI/UX Design & Frontend Systems</option>
                                            <option value="Cloud Architecture & Migration">Cloud Architecture & Migration</option>
                                            <option value="General Inquiry & Consultation">General Inquiry & Consultation</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="contact-subject">Inquiry Subject</label>
                                    <input 
                                        id="contact-subject"
                                        type="text" 
                                        name="subject" 
                                        placeholder="e.g. Building our multi-tenant SaaS MVP"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="contact-message">Project Details or Message *</label>
                                    <textarea 
                                        id="contact-message"
                                        name="message" 
                                        placeholder="Tell us about your project requirements, scope, timeline, or any specific questions..."
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
                                    {isSubmitting ? (
                                        <>
                                            <span className="admin-spinner" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                            <span>Sending to Namustutam...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>

                                {submitStatus === 'success' && (
                                    <div className="contact-success-msg">
                                        <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>
                                                Thank you{submittedName ? `, ${submittedName}` : ''}!
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#065f46', lineHeight: 1.5 }}>
                                                Your message has been securely recorded in our database. Our technical leads will review your inquiry and reach out via email shortly.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="contact-error-msg">
                                        <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>
                                                Submission Issue
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#991b1b', lineHeight: 1.5 }}>
                                                {errorMessage || 'Failed to submit inquiry. Please check your internet connection or email us directly.'}
                                            </div>
                                        </div>
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
