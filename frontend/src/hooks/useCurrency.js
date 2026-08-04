import { useSettings } from './useSettings';

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

export const useCurrency = () => {
    const { settings, loading } = useSettings();
    const currencyCode = settings.currency || 'INR';
    const currencySymbol = currencySymbols[currencyCode] || '₹';

    const formatCurrency = (amount) => {
        return `${currencySymbol}${amount}`;
    };

    return { currencyCode, currencySymbol, formatCurrency, loading };
};
