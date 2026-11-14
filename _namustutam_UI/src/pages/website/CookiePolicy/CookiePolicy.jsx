import { useMemo, useState, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import LegalPageLayout from '../Legal/LegalPageLayout';
import { useLandingPage } from '../../../context/LandingPageContext';
import { resolvePolicyData } from '../../../utils/legalPolicyHelper';

const COOKIE_PREF_KEY = 'namustutam_cookie_preferences';

const loadCookiePrefs = () => {
    try {
        const raw = localStorage.getItem(COOKIE_PREF_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                essential: true,
                preferences: parsed.preferences !== false,
                analytics: parsed.analytics !== false,
            };
        }
    } catch {
        // Ignore storage errors
    }
    return { essential: true, preferences: true, analytics: true };
};

export default function CookiePolicy() {
    const { landingData } = useLandingPage();

    const [prefs, setPrefs] = useState(loadCookiePrefs);
    const [savedToast, setSavedToast] = useState(false);

    const handleToggle = (key) => {
        if (key === 'essential') return;
        setSavedToast(false);
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSavePrefs = useCallback(() => {
        try {
            localStorage.setItem(COOKIE_PREF_KEY, JSON.stringify({
                ...prefs,
                updatedAt: new Date().toISOString()
            }));
        } catch {
            // Ignore storage errors
        }
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3500);
    }, [prefs]);

    const policyData = useMemo(() => {
        return resolvePolicyData('cookies', landingData);
    }, [landingData]);

    const { title, subtitle, brandName } = policyData;

    // Merge policy sections with interactive preference switcher
    const sections = useMemo(() => {
        const base = [...policyData.sections];
        // Inject or append interactive preferences widget to preferences section
        const prefIdx = base.findIndex(s => s.id === 'manage-cookies' || s.shortTitle.toLowerCase().includes('manage') || s.shortTitle.toLowerCase().includes('preference'));

        const prefWidget = (
            <div className="cookie-pref-card" key="cookie-preferences-widget" style={{ marginTop: '16px' }}>
                <div className="cookie-pref-row">
                    <div className="cookie-pref-info">
                        <h4>Strictly Necessary &amp; Security</h4>
                        <p>Essential for sign-in tokens, CSRF protection, and keeping your store cart/counter active.</p>
                    </div>
                    <span className="cookie-always-active">Always Active</span>
                </div>

                <div className="cookie-pref-row">
                    <div className="cookie-pref-info">
                        <h4>Preferences &amp; Customization</h4>
                        <p>Remembers table row counts, dark/light theme, and active POS billing currency.</p>
                    </div>
                    <button
                        type="button"
                        className={`cookie-toggle ${prefs.preferences ? 'on' : ''}`}
                        onClick={() => handleToggle('preferences')}
                        aria-pressed={prefs.preferences}
                        aria-label="Toggle preference cookies"
                    >
                        <span className="cookie-toggle-knob" />
                    </button>
                </div>

                <div className="cookie-pref-row">
                    <div className="cookie-pref-info">
                        <h4>Performance &amp; Diagnostics</h4>
                        <p>Helps us monitor page speed, navigation reliability, and error diagnostics.</p>
                    </div>
                    <button
                        type="button"
                        className={`cookie-toggle ${prefs.analytics ? 'on' : ''}`}
                        onClick={() => handleToggle('analytics')}
                        aria-pressed={prefs.analytics}
                        aria-label="Toggle performance analytics cookies"
                    >
                        <span className="cookie-toggle-knob" />
                    </button>
                </div>

                <div className="cookie-pref-footer">
                    <button
                        type="button"
                        className="legal-action-btn solid"
                        style={{ width: 'auto', padding: '11px 22px' }}
                        onClick={handleSavePrefs}
                    >
                        Save Cookie Preferences
                    </button>

                    {savedToast && (
                        <span className="cookie-saved-pill">
                            <CheckCircle2 size={15} /> Preferences saved to your browser
                        </span>
                    )}
                </div>
            </div>
        );

        if (prefIdx !== -1) {
            base[prefIdx] = {
                ...base[prefIdx],
                extraContent: prefWidget
            };
        } else {
            base.push({
                id: 'manage-preferences',
                shortTitle: 'Preferences Control',
                heading: 'Manage Your Cookie Preferences',
                paragraphs: ['Adjust and save your device storage preferences in real-time:'],
                extraContent: prefWidget
            });
        }
        return base;
    }, [policyData.sections, prefs, savedToast, handleSavePrefs]);

    return (
        <LegalPageLayout
            badge="Legal • Cookies"
            titlePrefix={title || 'Cookie Policy'}
            titleHighlight=""
            subtitle={subtitle || `Learn how ${brandName} uses essential cookies and browser storage, and manage your preferences directly on this page.`}
            summaryText={`${brandName} uses minimal cookies and localStorage primarily for secure authentication, currency/UI preferences, and payment verification — never for intrusive third-party ad tracking.`}
            sections={sections}
            activePath="/cookie-policy"
        />
    );
}
