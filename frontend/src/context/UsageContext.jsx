import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/config';
import { useAuth } from './AuthContext';

const UsageContext = createContext(null);

export const dispatchUsageRefresh = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('data-usage-refresh'));
    }
};

export function UsageProvider({ children }) {
    const { user } = useAuth();
    const [usage, setUsage] = useState({
        isFreePlan: !user?.plan || user?.plan === 'NONE',
        plan: user?.plan || 'NONE',
        totalUsed: 0,
        limit: 50,
        remaining: 50,
        percentage: 0,
        subscriptionEndDate: user?.subscriptionEndDate || null,
        breakdown: {}
    });
    const [loading, setLoading] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [upgradeModalReason, setUpgradeModalReason] = useState('');

    const openUpgradeModal = useCallback((reason = '') => {
        setUpgradeModalReason(reason);
        setIsUpgradeModalOpen(true);
    }, []);

    const closeUpgradeModal = useCallback(() => {
        setIsUpgradeModalOpen(false);
    }, []);

    const fetchUsage = useCallback(async () => {
        if (!user?.id && !user?.email) return;
        try {
            setLoading(true);
            const res = await apiClient.get('/users/current/usage');
            if (res?.data) {
                setUsage(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch data usage summary:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.id, user?.email]);

    useEffect(() => {
        fetchUsage();
    }, [fetchUsage, user?.plan, user?.subscriptionEndDate]);

    useEffect(() => {
        const handleRefresh = () => {
            fetchUsage();
        };

        window.addEventListener('data-usage-refresh', handleRefresh);
        return () => window.removeEventListener('data-usage-refresh', handleRefresh);
    }, [fetchUsage]);

    // Listen for custom event triggered globally (e.g. from axios interceptor or actions)
    useEffect(() => {
        const handleOpenModal = (event) => {
            const reason = event?.detail?.message || event?.detail?.error || '50 Records Max limit reached! Please upgrade your plan.';
            openUpgradeModal(reason);
        };

        window.addEventListener('open-upgrade-plan-modal', handleOpenModal);
        return () => window.removeEventListener('open-upgrade-plan-modal', handleOpenModal);
    }, [openUpgradeModal]);

    // Auto-open modal on first detection of 50 records max limit completion
    useEffect(() => {
        const isFree = !user?.plan || user?.plan === 'NONE';
        const limit = usage?.limit && usage.limit > 0 ? usage.limit : 50;
        const isLimitReached = isFree && usage?.totalUsed >= limit;

        if (isLimitReached) {
            const alreadyShown = sessionStorage.getItem('upgrade_modal_auto_shown_50');
            if (!alreadyShown) {
                sessionStorage.setItem('upgrade_modal_auto_shown_50', 'true');
                openUpgradeModal(`You have completed the ${limit} Records Max free plan limit. Upgrade your plan to continue adding records.`);
            }
        }
    }, [usage?.totalUsed, usage?.limit, user?.plan, openUpgradeModal]);

    return (
        <UsageContext.Provider value={{
            usage,
            loading,
            refreshUsage: fetchUsage,
            isUpgradeModalOpen,
            openUpgradeModal,
            closeUpgradeModal,
            upgradeModalReason
        }}>
            {children}
        </UsageContext.Provider>
    );
}

export function useDataUsage() {
    const context = useContext(UsageContext);
    if (!context) {
        return {
            usage: {
                isFreePlan: true,
                plan: 'NONE',
                totalUsed: 0,
                limit: 50,
                remaining: 50,
                percentage: 0,
                breakdown: {}
            },
            loading: false,
            refreshUsage: () => {},
            isUpgradeModalOpen: false,
            openUpgradeModal: () => {},
            closeUpgradeModal: () => {},
            upgradeModalReason: ''
        };
    }
    return context;
}
