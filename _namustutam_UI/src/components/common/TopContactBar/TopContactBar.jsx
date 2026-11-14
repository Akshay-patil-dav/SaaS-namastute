import React from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLandingPage } from '../../../context/LandingPageContext';
import { resolveContactChannels } from '../../../utils/contactChannels';
import './TopContactBar.css';

export default function TopContactBar({ top = 0 }) {
    const location = useLocation();
    const { landingData } = useLandingPage();

    // Do not render inside the Admin Studio to keep dashboard clean
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    const visibility = landingData?.sectionVisibility || {};
    // Visible by default unless explicitly disabled
    const isSectionVisible = visibility.topContactBar !== false;
    if (!isSectionVisible) {
        return null;
    }

    const contact = landingData?.contact || {};
    const {
        rawEmail,
        phoneDisplay,
        rawLocation,
        showEmail,
        showPhone,
        showLocation,
        primaryPhoneLink
    } = resolveContactChannels(contact);

    // If all channels are turned off or empty, do not show empty bar
    if (!showEmail && !showPhone && !showLocation) {
        return null;
    }

    return (
        <aside
            className="nm-top-contact-bar"
            style={{ top: `${top}px` }}
            aria-label="Official Namustutam Contact Information"
        >
            <div className="nm-top-contact-inner">
                {showEmail && (
                    <a
                        href={`mailto:${rawEmail}`}
                        className="nm-top-contact-item"
                        title={`Send email to ${rawEmail}`}
                    >
                        <Mail size={15} className="nm-top-contact-icon" />
                        <span>{rawEmail}</span>
                    </a>
                )}

                {showPhone && (
                    <a
                        href={primaryPhoneLink || `tel:${phoneDisplay}`}
                        className="nm-top-contact-item"
                        title={`Call or message ${phoneDisplay}`}
                    >
                        <Phone size={15} className="nm-top-contact-icon" />
                        <span>{phoneDisplay}</span>
                    </a>
                )}

                {showLocation && (
                    <div
                        className="nm-top-contact-item nm-top-contact-location"
                        title="Primary Operating Presence"
                    >
                        <MapPin size={15} className="nm-top-contact-icon" />
                        <span>{rawLocation}</span>
                    </div>
                )}
            </div>
        </aside>
    );
}

