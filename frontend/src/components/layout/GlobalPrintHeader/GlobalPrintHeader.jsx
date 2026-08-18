import React from 'react';
import { useCompany } from '../../../context/CompanyContext';
import './GlobalPrintHeader.css';

export default function GlobalPrintHeader() {
    const { companyInfo } = useCompany();

    return (
        <div className="global-print-header">
            <div className="gph-top">
                <div className="gph-company-details">
                    {companyInfo.logo && <img src={companyInfo.logo} alt="Logo" className="gph-logo" />}
                    <div className="gph-company-text">
                        <h1 className="gph-name">{companyInfo.name}</h1>
                        {companyInfo.address && <p>{companyInfo.address}</p>}
                        {(companyInfo.email || companyInfo.phone) && (
                            <p>
                                {companyInfo.phone && <span>{companyInfo.phone}</span>}
                                {companyInfo.phone && companyInfo.email && <span> | </span>}
                                {companyInfo.email && <span>{companyInfo.email}</span>}
                            </p>
                        )}
                        {companyInfo.vat && <p>VAT/GST: {companyInfo.vat}</p>}
                        {companyInfo.website && <p>{companyInfo.website}</p>}
                    </div>
                </div>
                <div className="gph-meta">
                    <p>Printed on: {new Date().toLocaleString()}</p>
                </div>
            </div>
            <div className="gph-divider"></div>
        </div>
    );
}
