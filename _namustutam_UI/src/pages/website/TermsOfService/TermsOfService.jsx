import { useMemo } from 'react';
import LegalPageLayout from '../Legal/LegalPageLayout';
import { useLandingPage } from '../../../context/LandingPageContext';
import { resolvePolicyData } from '../../../utils/legalPolicyHelper';

export default function TermsOfService() {
    const { landingData } = useLandingPage();

    const policyData = useMemo(() => {
        return resolvePolicyData('terms', landingData);
    }, [landingData]);

    const { title, subtitle, sections, brandName, jurisdiction } = policyData;

    return (
        <LegalPageLayout
            badge="Legal • Agreement"
            titlePrefix={title || 'Terms of Service'}
            titleHighlight=""
            subtitle={subtitle || `The legal terms and operational conditions governing your use of ${brandName} services and cloud POS platforms.`}
            summaryText={`By using ${brandName} services or POS software, you agree to these transparent terms. You retain 100% full ownership of your store data and catalog under the laws of ${jurisdiction}.`}
            sections={sections}
            activePath="/terms-of-service"
        />
    );
}
