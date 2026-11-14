import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ShieldCheck, FileText, Cookie, RotateCcw,
    Calendar, Building2, MapPin, Mail, Phone, Clock,
    Printer, ArrowRight, ChevronRight
} from 'lucide-react';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import { useLandingPage } from '../../../context/LandingPageContext';
import { resolveContactChannels } from '../../../utils/contactChannels';
import './LegalPage.css';

export const LEGAL_DOCUMENTS = [
    { id: 'privacy', label: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms of Service', path: '/terms-of-service', icon: FileText },
    { id: 'cookie', label: 'Cookie Policy', path: '/cookie-policy', icon: Cookie },
    { id: 'refund', label: 'Refund Policy', path: '/refund-policy', icon: RotateCcw },
];

export default function LegalPageLayout({
    badge = 'Legal',
    titlePrefix,
    titleHighlight,
    subtitle,
    summaryTitle = 'At a Glance',
    summaryText,
    sections = [],
    activePath,
}) {
    const location = useLocation();
    const { landingData } = useLandingPage();

    const contact = landingData?.contact || {};
    const legal = landingData?.legal || {};

    const {
        brandName,
        rawEmail,
        rawLocation,
        rawHours,
        showEmail,
        showPhone,
        showLocation,
        showHours,
        phoneDisplay,
        primaryPhoneLink,
        isWhatsappPreferred,
        hasAnyChannel
    } = resolveContactChannels(contact);

    const lastUpdated = (legal.lastUpdated || 'November 12, 2026').trim();
    const jurisdiction = (legal.jurisdiction || 'Maharashtra, India').trim();

    const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || '');

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `${titlePrefix} ${titleHighlight} | ${brandName}`.trim();
    }, [titlePrefix, titleHighlight, brandName, location.pathname]);

    useEffect(() => {
        if (!sections.length) return;
        setActiveSectionId(sections[0].id);

        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveSectionId(visible[0].target.id);
                }
            },
            { rootMargin: '-18% 0px -65% 0px', threshold: 0.05 }
        );

        sections.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sections]);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        setActiveSectionId(id);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const currentRoute = activePath || location.pathname;

    return (
        <div className="legal-root">
            <WebsiteNavbar />

            <header className="legal-header">
                <div className="legal-container">
                    <span className="legal-badge">{badge}</span>
                    <h1 className="legal-title">
                        {titlePrefix}{' '}
                        <span className="legal-gradient-text">{titleHighlight}</span>
                    </h1>
                    <p className="legal-subtitle">{subtitle}</p>

                    <div className="legal-meta-bar">
                        <span className="legal-meta-chip">
                            <Calendar size={14} /> Last Updated: {lastUpdated}
                        </span>
                        <span className="legal-meta-chip">
                            <Building2 size={14} /> Entity: {brandName}
                        </span>
                        <span className="legal-meta-chip">
                            <MapPin size={14} /> Jurisdiction: {jurisdiction}
                        </span>
                    </div>

                    <nav className="legal-switcher" aria-label="Legal Documents">
                        {LEGAL_DOCUMENTS.map((doc) => {
                            const Icon = doc.icon;
                            const isActive = currentRoute === doc.path;
                            return (
                                <Link
                                    key={doc.id}
                                    to={doc.path}
                                    className={`legal-switch-pill ${isActive ? 'active' : ''}`}
                                >
                                    <Icon size={15} />
                                    <span>{doc.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <section className="legal-main">
                <div className="legal-container">
                    <div className="legal-layout">
                        <aside className="legal-toc-card" aria-label="Table of Contents">
                            <div className="legal-toc-title">On This Page</div>
                            <ul className="legal-toc-list">
                                {sections.map((sec) => (
                                    <li key={sec.id}>
                                        <button
                                            type="button"
                                            className={`legal-toc-btn ${activeSectionId === sec.id ? 'active' : ''}`}
                                            onClick={() => scrollToSection(sec.id)}
                                        >
                                            <ChevronRight size={14} />
                                            <span>{sec.shortTitle || sec.heading}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="legal-toc-actions">
                                <button
                                    type="button"
                                    className="legal-action-btn outline"
                                    onClick={() => window.print()}
                                >
                                    <Printer size={15} /> Print / Save PDF
                                </button>
                                <Link to="/contact" className="legal-action-btn solid">
                                    <span>Ask Legal / Support</span>
                                    <ArrowRight size={15} />
                                </Link>
                            </div>
                        </aside>

                        <article className="legal-content">
                            {summaryText && (
                                <div className="legal-summary-box">
                                    <h4>{summaryTitle}</h4>
                                    <p>{summaryText}</p>
                                </div>
                            )}

                            {sections.map((sec) => (
                                <section key={sec.id} id={sec.id} className="legal-section">
                                    <h2>{sec.heading}</h2>

                                    {sec.paragraphs?.map((para, idx) => (
                                        <p key={idx}>{para}</p>
                                    ))}

                                    {sec.bullets && sec.bullets.length > 0 && (
                                        <ul>
                                            {sec.bullets.map((item, idx) => (
                                                <li key={idx}>
                                                    {typeof item === 'string' ? (
                                                        item
                                                    ) : (
                                                        <>
                                                            <strong>{item.title}:</strong> {item.text}
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {sec.note && <div className="legal-note">{sec.note}</div>}

                                    {sec.extra || sec.extraContent}
                                </section>
                            ))}

                            <div className="legal-contact-card">
                                <div>
                                    <h3>Questions about this policy?</h3>
                                    <p>
                                        Reach out to {brandName} directly for data requests, billing clarifications, or legal compliance inquiries.
                                    </p>
                                    {hasAnyChannel && (
                                        <div className="legal-contact-channels">
                                            {showEmail && (
                                                <a href={`mailto:${rawEmail}`}>
                                                    <Mail size={15} /> {rawEmail}
                                                </a>
                                            )}
                                            {showPhone && (
                                                primaryPhoneLink ? (
                                                    <a
                                                        href={primaryPhoneLink}
                                                        target={isWhatsappPreferred ? '_blank' : undefined}
                                                        rel={isWhatsappPreferred ? 'noreferrer' : undefined}
                                                    >
                                                        <Phone size={15} /> {phoneDisplay}
                                                    </a>
                                                ) : (
                                                    <span>
                                                        <Phone size={15} /> {phoneDisplay}
                                                    </span>
                                                )
                                            )}
                                            {showLocation && (
                                                <span>
                                                    <MapPin size={15} /> {rawLocation}
                                                </span>
                                            )}
                                            {showHours && (
                                                <span>
                                                    <Clock size={15} /> {rawHours}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Link to="/contact" className="legal-contact-cta">
                                    <span>Contact Us</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <WebsiteFooter />
        </div>
    );
}

