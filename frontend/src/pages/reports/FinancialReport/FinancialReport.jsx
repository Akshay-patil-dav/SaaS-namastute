import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, TrendingDown, DollarSign, Activity, Printer } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import { useCurrency } from '../../../hooks/useCurrency';
import { useCompany } from '../../../context/CompanyContext';
import './FinancialReport.css';

const BASE_URL = ENV.API_BASE_URL;

export default function FinancialReport() {
    const { currencySymbol } = useCurrency();
    const { companyInfo } = useCompany();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Summary state
    const [salesSummary, setSalesSummary] = useState({ totalAmount: 0, totalCount: 0 });
    const [purchaseSummary, setPurchaseSummary] = useState({ totalAmount: 0, totalCount: 0 });

    // Data state
    const [allSales, setAllSales] = useState([]);
    const [allPurchases, setAllPurchases] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [dateFilter, setDateFilter] = useState('month'); // default to this month

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [dateFilter, allSales, allPurchases]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch All Sales
            const salesRes = await apiClient.get(`${BASE_URL}/sales`);
            const salesData = Array.isArray(salesRes.data) ? salesRes.data : [];
            setAllSales(salesData.sort((a, b) => b.id - a.id));

            // Fetch All Purchases
            const purchaseRes = await apiClient.get(`${BASE_URL}/purchases`);
            const purchasesData = Array.isArray(purchaseRes.data) ? purchaseRes.data : [];
            setAllPurchases(purchasesData.sort((a, b) => b.id - a.id));

        } catch (err) {
            console.error('Failed to fetch financial report data', err);
            setError('Could not load financial data. Please ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const isDateInRange = (dateStr) => {
            if (dateFilter === 'all') return true;
            if (!dateStr) return false;
            
            const d = new Date(dateStr);
            if (isNaN(d)) return false;

            if (dateFilter === 'today') return d >= startOfToday;
            if (dateFilter === 'week') return d >= startOfWeek;
            if (dateFilter === 'month') return d >= startOfMonth;
            return true;
        };

        const fSales = allSales.filter(s => isDateInRange(s.date || s.createdAt));
        const fPurchases = allPurchases.filter(p => isDateInRange(p.date || p.createdAt || p.purchaseDate));

        setFilteredSales(fSales);
        setFilteredPurchases(fPurchases);

        // Compute summaries dynamically
        const sTotal = fSales.reduce((sum, s) => sum + (parseFloat(s.grandTotal) || 0), 0);
        const pTotal = fPurchases.reduce((sum, p) => sum + (parseFloat(p.grandTotal) || 0), 0);

        setSalesSummary({
            totalAmount: sTotal,
            totalCount: fSales.length
        });

        setPurchaseSummary({
            totalAmount: pTotal,
            totalCount: fPurchases.length
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const formatMoney = (amount) => {
        const val = parseFloat(amount);
        return isNaN(val) ? `${currencySymbol}0.00` : `${currencySymbol}${val.toFixed(2)}`;
    };

    const extractItems = (jsonStr) => {
        try {
            const items = JSON.parse(jsonStr || '[]');
            if (items.length === 0) return '';
            return items.map(i => i.name || i.productName || i.title || 'Unknown Item').join(', ');
        } catch {
            return '';
        }
    };

    const sAmt = parseFloat(salesSummary.totalAmount) || 0;
    const pAmt = parseFloat(purchaseSummary.totalAmount) || 0;
    const netProfit = sAmt - pAmt;

    if (loading) {
        return (
            <div className="fr-container">
                <div className="fr-loading-state">
                    <div className="fr-spinner"></div>
                    <p>Generating Financial Report...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fr-container">
                <div className="fr-error-state">
                    <Activity size={48} color="#ef4444" />
                    <p>{error}</p>
                    <button className="fr-btn-print" onClick={fetchData}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fr-container">
            {/* Print Only Profit & Loss Summary */}
            <div className="print-only-pl">
                <h3 className="print-section-title">PROFIT AND LOSS SUMMARY</h3>
                <p className="print-subtitle">For the period: {dateFilter === 'all' ? 'All Time' : dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : 'This Month'}</p>

                <table className="print-pl-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style={{ textAlign: 'right' }}>Amount ({currencySymbol})</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Turnover (Total Sales)</td>
                            <td style={{ textAlign: 'right' }}>{formatMoney(sAmt)}</td>
                        </tr>
                        <tr>
                            <td>Cost of Sales (Total Purchases)</td>
                            <td style={{ textAlign: 'right' }}>({formatMoney(pAmt)})</td>
                        </tr>
                        <tr className="print-pl-total-row">
                            <td>GROSS PROFIT</td>
                            <td style={{ textAlign: 'right' }}>{formatMoney(sAmt - pAmt)}</td>
                        </tr>
                        {/* Assuming operating expenses could be added here later, for now Net = Gross */}
                        <tr className="print-pl-net-row">
                            <td>NET PROFIT FOR THE PERIOD</td>
                            <td style={{ textAlign: 'right' }}>{formatMoney(sAmt - pAmt)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Header */}
            <div className="fr-header-row">
                <div className="fr-page-title-area">
                    <h2 className="fr-page-title">Financial Report</h2>
                    <p className="fr-page-subtitle">Overview of sales, purchases, and net profit</p>
                </div>
                <div className="fr-header-actions">
                    <select 
                        className="fr-date-filter hide-on-print"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All Time</option>
                    </select>
                    <span className="fr-print-instruction hide-on-print">
                        <Printer size={16} style={{ marginRight: '6px' }} />
                        To print the Report use Ctrl + P shortcut key
                    </span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="fr-summary-cards">
                <div className="fr-card">
                    <div className="fr-icon-box fr-icon-green">
                        <TrendingUp size={28} />
                    </div>
                    <div className="fr-card-content">
                        <p className="fr-card-label">Total Sales Revenue</p>
                        <h3 className="fr-card-value">{formatMoney(sAmt)}</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                            {salesSummary.totalCount} Orders
                        </p>
                    </div>
                </div>

                <div className="fr-card">
                    <div className="fr-icon-box fr-icon-red">
                        <TrendingDown size={28} />
                    </div>
                    <div className="fr-card-content">
                        <p className="fr-card-label">Total Purchase Cost</p>
                        <h3 className="fr-card-value">{formatMoney(pAmt)}</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                            {purchaseSummary.totalCount} Purchases
                        </p>
                    </div>
                </div>

                <div className="fr-card">
                    <div className="fr-icon-box fr-icon-blue">
                        <DollarSign size={28} />
                    </div>
                    <div className="fr-card-content">
                        <p className="fr-card-label">Net Profit</p>
                        <h3 className={`fr-card-value ${netProfit >= 0 ? 'fr-profit-positive' : 'fr-profit-negative'}`}>
                            {formatMoney(netProfit)}
                        </h3>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                            Revenue - Cost
                        </p>
                    </div>
                </div>
            </div>

            {/* Tables */}
            <div className="fr-tables-container">
                {/* Sales Data */}
                <div className="fr-table-card">
                    <div className="fr-table-header">
                        <h3 className="fr-table-title">Sales Data</h3>
                    </div>
                    <div className="fr-table-wrap">
                        <table className="fr-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Reference</th>
                                    <th>Description (Customer)</th>
                                    <th style={{ textAlign: 'right' }}>Credit (Revenue)</th>
                                    <th className="hide-on-print">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales.length > 0 ? (
                                    <>
                                        {filteredSales.map((s) => (
                                            <tr key={s.id}>
                                                <td>{s.formattedDate || s.date || '—'}</td>
                                                <td>{s.referenceNo || '—'}</td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{s.customerName || 'Walk-in Customer'}</div>
                                                    <div className="fr-items-list" style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                                        {extractItems(s.productsJson)}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600, textAlign: 'right' }}>{formatMoney(s.grandTotal)}</td>
                                                <td className="hide-on-print">
                                                    <span className={`fr-badge ${s.status === 'Completed' ? 'fr-badge-completed' : s.status === 'Cancelled' ? 'fr-badge-cancelled' : 'fr-badge-pending'}`}>
                                                        {s.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Total Row */}
                                        <tr className="print-total-row" style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                                            <td colSpan="3" style={{ textAlign: 'right' }}>Total Sales Revenue:</td>
                                            <td style={{ textAlign: 'right' }}>{formatMoney(sAmt)}</td>
                                            <td className="hide-on-print"></td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>No sales found for this period</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Purchases Data */}
                <div className="fr-table-card">
                    <div className="fr-table-header">
                        <h3 className="fr-table-title">Purchases Data</h3>
                    </div>
                    <div className="fr-table-wrap">
                        <table className="fr-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Reference</th>
                                    <th>Description (Supplier)</th>
                                    <th style={{ textAlign: 'right' }}>Debit (Expense)</th>
                                    <th className="hide-on-print">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPurchases.length > 0 ? (
                                    <>
                                        {filteredPurchases.map((p) => (
                                            <tr key={p.id}>
                                                <td>{p.formattedDate || p.date || '—'}</td>
                                                <td>{p.referenceNo || '—'}</td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{p.supplierName || 'General Supplier'}</div>
                                                    <div className="fr-items-list" style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                                        {extractItems(p.productsJson)}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600, textAlign: 'right' }}>{formatMoney(p.grandTotal)}</td>
                                                <td className="hide-on-print">
                                                    <span className={`fr-badge ${p.status === 'Received' || p.status === 'Completed' ? 'fr-badge-received' : p.status === 'Cancelled' ? 'fr-badge-cancelled' : 'fr-badge-pending'}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Total Row */}
                                        <tr className="print-total-row" style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                                            <td colSpan="3" style={{ textAlign: 'right' }}>Total Purchase Expense:</td>
                                            <td style={{ textAlign: 'right' }}>{formatMoney(pAmt)}</td>
                                            <td className="hide-on-print"></td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>No purchases found for this period</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
