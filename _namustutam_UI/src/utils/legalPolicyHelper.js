import { DEFAULT_LANDING_DATA } from '../data/landingPageDefaultData';

/**
 * Resolves dynamic legal policy data with template string variable interpolation.
 * Supports {brandName}, {lastUpdated}, {jurisdiction}, {refundReviewDays}, {refundProcessingDays}, {email}, {phone}.
 */
export const resolvePolicyData = (policyKey, landingData) => {
    const contact = landingData?.contact || {};
    const legal = landingData?.legal || {};
    const brandName = (contact.brandName || 'Namustutam').trim();
    const lastUpdated = (legal.lastUpdated || DEFAULT_LANDING_DATA.legal.lastUpdated || 'November 12, 2026').trim();
    const jurisdiction = (legal.jurisdiction || DEFAULT_LANDING_DATA.legal.jurisdiction || 'Maharashtra, India').trim();
    const refundReviewDays = (legal.refundReviewDays || DEFAULT_LANDING_DATA.legal.refundReviewDays || '7').trim();
    const refundProcessingDays = (legal.refundProcessingDays || DEFAULT_LANDING_DATA.legal.refundProcessingDays || '5–7 business days').trim();

    const vars = {
        brandName,
        lastUpdated,
        jurisdiction,
        refundReviewDays,
        refundProcessingDays,
        email: contact.email || 'namustutam@gmail.com',
        phone: contact.phone || '+91 98765 43210'
    };

    const interpolate = (val) => {
        if (!val) return val;
        if (typeof val === 'string') {
            return val.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
        }
        return val;
    };

    const defaultPolicy = DEFAULT_LANDING_DATA.legal[policyKey] || { sections: [] };
    const configuredPolicy = legal[policyKey] || {};

    const rawSections = Array.isArray(configuredPolicy.sections) && configuredPolicy.sections.length > 0
        ? configuredPolicy.sections
        : defaultPolicy.sections || [];

    const processedSections = rawSections.map((sec, idx) => ({
        id: sec.id || `section-${idx + 1}`,
        shortTitle: interpolate(sec.shortTitle || sec.heading || `Section ${idx + 1}`),
        heading: interpolate(sec.heading || `Section ${idx + 1}`),
        paragraphs: (Array.isArray(sec.paragraphs) ? sec.paragraphs : [sec.paragraphs || '']).map(interpolate),
        bullets: Array.isArray(sec.bullets) ? sec.bullets.map(b => {
            if (typeof b === 'object' && b !== null) {
                return {
                    title: interpolate(b.title || ''),
                    text: interpolate(b.text || '')
                };
            }
            return interpolate(b);
        }) : [],
        note: interpolate(sec.note || '')
    }));

    return {
        title: interpolate(configuredPolicy.title || defaultPolicy.title),
        subtitle: interpolate(configuredPolicy.subtitle || defaultPolicy.subtitle),
        sections: processedSections,
        brandName,
        lastUpdated,
        jurisdiction,
        refundReviewDays,
        refundProcessingDays
    };
};

