import { useMemo } from 'react';
import LegalPageLayout from '../Legal/LegalPageLayout';
import { useLandingPage } from '../../../context/LandingPageContext';
import { resolvePolicyData } from '../../../utils/legalPolicyHelper';

export default function RefundPolicy() {
    const { landingData } = useLandingPage();

    const policyData = useMemo(() => {
        return resolvePolicyData('refunds', landingData);
    }, [landingData]);

    const { title, subtitle, sections, brandName, refundReviewDays } = policyData;

    return (
        <LegalPageLayout
            badge="Legal • Billing"
            titlePrefix={title || 'Refund Policy'}
            titleHighlight=""
            subtitle={subtitle || `Clear, transparent refund and cancellation guidelines for ${brandName} monthly POS plans and engineering services.`}
            summaryText={`${brandName} POS Software operates on flexible 30-day monthly plans with no annual lock-in. Cancel anytime before your renewal date, or request a billing review within ${refundReviewDays} days of purchase.`}
            sections={sections}
            activePath="/refund-policy"
        />
    );
}
