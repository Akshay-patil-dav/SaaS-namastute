/**
 * domainConfig.js — Domain Detection & Admin Access Management
 * ─────────────────────────────────────────────────────────────────────────────
 * Controls domain-specific feature flags and guards.
 *
 * Condition:
 * When running on "https://namustutam.vercel.app/" (production live URL),
 * the Admin Panel is strictly disabled:
 * 1. Admin navigation and footer links are hidden.
 * 2. Admin routes (/admin, /admin/*, /admin/login, /login) are not accessible
 *    and render a 404 Page Not Found error instead.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Checks if the current browser window is running on the production Vercel domain:
 * https://namustutam.vercel.app
 */
export const isNamustutamProduction = () => {
    if (typeof window === 'undefined') return false;

    try {
        const hostname = (window.location.hostname || '').toLowerCase();
        const origin = (window.location.origin || '').toLowerCase();

        return (
            hostname === 'namustutam.vercel.app' ||
            hostname === 'www.namustutam.vercel.app' ||
            origin === 'https://namustutam.vercel.app' ||
            origin === 'http://namustutam.vercel.app'
        );
    } catch {
        return false;
    }
};

/**
 * Determines whether the Admin Panel and its associated routes should be disabled.
 * Returns true if running on https://namustutam.vercel.app or if explicitly disabled.
 */
export const isAdminPanelDisabled = () => {
    if (typeof window === 'undefined') return false;

    // Optional debug override for testing in dev: ?disable_admin=true or ?mock_namustutam=true
    try {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('disable_admin') === 'true' || searchParams.get('mock_namustutam') === 'true') {
            return true;
        }
    } catch {
        // ignore
    }

    // Explicit environment variable toggle if defined
    if (import.meta.env.VITE_DISABLE_ADMIN_PANEL === 'true') {
        return true;
    }

    // Default rule: Disabled when running on https://namustutam.vercel.app
    return isNamustutamProduction();
};
