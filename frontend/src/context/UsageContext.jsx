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

    return (
        <UsageContext.Provider value={{ usage, loading, refreshUsage: fetchUsage }}>
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
            refreshUsage: () => {}
        };
    }
    return context;
}
