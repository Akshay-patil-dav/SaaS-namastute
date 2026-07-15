import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import apiClient, { API } from '../api/config';

const CompanyContext = createContext(null);

/**
 * Provides the first company's name + logo (from Company Settings) to the entire app.
 * Any component can call `refreshCompany()` to re-fetch after a save, causing every
 * subscriber (sidebar, header, AI helper, etc.) to update instantly at runtime.
 */
export function CompanyProvider({ children }) {
    const [companyInfo, setCompanyInfo] = useState({ name: '', logo: '' });

    const refreshCompany = useCallback(() => {
        apiClient.get(API.SETTINGS)
            .then(res => {
                const data = res.data || {};
                if (data.companies_list) {
                    try {
                        const list = JSON.parse(data.companies_list);
                        if (Array.isArray(list) && list.length > 0) {
                            setCompanyInfo({
                                name: list[0].companyName || '',
                                logo: list[0].companyLogo || '',
                            });
                            return;
                        }
                    } catch { /* ignore parse error */ }
                }
                // No company configured → clear
                setCompanyInfo({ name: '', logo: '' });
            })
            .catch(() => { /* ignore network errors */ });
    }, []);

    // Fetch once on app start
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
