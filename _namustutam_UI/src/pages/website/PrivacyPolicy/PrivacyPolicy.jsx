import { useMemo } from 'react';
import LegalPageLayout from '../Legal/LegalPageLayout';
import { useLandingPage } from '../../../context/LandingPageContext';
import { resolvePolicyData } from '../../../utils/legalPolicyHelper';

export default function PrivacyPolicy() {
    const { landingData } = useLandingPage();

    const policyData = useMemo(() => {
        return resolvePolicyData('privacy', landingData);
    }, [landingData]);

    const { title, subtitle, sections, brandName } = policyData;

    return (
        <LegalPageLayout
            badge="Legal • Compliance"
            titlePrefix={title || 'Privacy Policy'}
            titleHighlight=""
            subtitle={subtitle || `How ${brandName} collects, protects, and respects your personal and retail business data across our website and cloud POS platform.`}
            summaryText={`${brandName} collects only the data needed to run your website inquiries, custom projects, and POS store operations. Your store data belongs to you and is never sold to third parties.`}
            sections={sections}
            activePath="/privacy-policy"
        />
    );
}
