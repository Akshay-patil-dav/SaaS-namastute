import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import apiClient, { API } from '../api/config';
import { useAuth } from './AuthContext';

const CompanyContext = createContext(null);

/**
 * Provides the first company's name + logo (from Company Settings) to the entire app.
 * Any component can call `refreshCompany()` to re-fetch after a save, causing every
 * subscriber (sidebar, header, AI helper, etc.) to update instantly at runtime.
 */
export function CompanyProvider({ children }) {
    const { user } = useAuth();
    const [companyInfo, setCompanyInfo] = useState({ name: '', logo: '' });

    const refreshCompany = useCallback(() => {
        if (!user) {
            setCompanyInfo({ 
                name: 'Namastute Software', 
                logo: '',
                email: 'info@namastute.com',
                phone: '+91-0000000000',
                address: 'Business Avenue, Tech Park',
                vat: '',
                website: 'www.namastute.com'
            });
            return;
        }

        apiClient.get(API.SETTINGS)
            .then(res => {
                const data = res.data || {};
                if (data.companies_list) {
                    try {
                        const list = JSON.parse(data.companies_list);
                        if (Array.isArray(list) && list.length > 0) {
                            setCompanyInfo({
                                name: list[0].companyName || 'Namastute Software',
                                logo: list[0].companyLogo || '',
                                email: list[0].companyEmail || 'info@namastute.com',
                                phone: list[0].companyPhone || '+91-0000000000',
                                address: list[0].companyAddress || 'Business Avenue, Tech Park',
                                vat: list[0].companyVat || '',
                                website: list[0].companyWebsite || 'www.namastute.com'
                            });
                            return;
                        }
                    } catch { /* ignore parse error */ }
                }
                // No company configured → clear but use default placeholders
                setCompanyInfo({ 
                    name: 'Namastute Software', 
                    logo: '',
                    email: 'info@namastute.com',
                    phone: '+91-0000000000',
                    address: 'Business Avenue, Tech Park',
                    vat: '',
                    website: 'www.namastute.com'
                });
            })
            .catch(() => { /* ignore network errors */ });
    }, [user]);

    // Fetch once on app start or when user login state changes
    useEffect(() => {
        refreshCompany();
    }, [refreshCompany]);

    return (
        <CompanyContext.Provider value={{ companyInfo, refreshCompany }}>
            {children}
        </CompanyContext.Provider>
    );
}

/**
 * Hook to consume the company info and refresh trigger.
 * Usage:
 *   const { companyInfo, refreshCompany } = useCompany();
 */
export function useCompany() {
    const ctx = useContext(CompanyContext);
    if (!ctx) throw new Error('useCompany must be used inside <CompanyProvider>');
    return ctx;
}
