import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import apiClient, { API } from '../../../api/config';
import { 
    Wallet, ShoppingCart, ShoppingBag, ArrowUpRight, ArrowDownRight, 
    MoreVertical, Info, Package, Users, Activity,
    Calendar, TrendingUp, RefreshCcw, DollarSign, Box, ShieldCheck,
    Cpu, AlertTriangle, Truck, CheckCircle2, Clock
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Rectangle
} from 'recharts';
import './Dashboard.css';
import NotesWidget from '../NotesWidget';
import { useCurrency } from '../../../hooks/useCurrency';


// Dynamic Chart Data State will replace static salesPurchaseData

const _salesStatisticsData = [
    { name: 'Jan', revenue: 70, returns: -50 },
    { name: 'Feb', revenue: 50, returns: -30 },
    { name: 'Mar', revenue: 65, returns: -45 },
    { name: 'Apr', revenue: 60, returns: -35 },
    { name: 'May', revenue: 50, returns: -50 },
    { name: 'Jun', revenue: 70, returns: -30 },
    { name: 'Jul', revenue: 75, returns: -45 },
    { name: 'Aug', revenue: 50, returns: -35 },
    { name: 'Sep', revenue: 60, returns: -25 },
    { name: 'Oct', revenue: 40, returns: -30 },
    { name: 'Nov', revenue: 50, returns: -35 },
    { name: 'Dec', revenue: 60, returns: -20 },
];

const _customerOverviewData = [
  { name: 'Loss Time', value: 5500, color: '#f97316' },
  { name: 'Return', value: 3500, color: '#0f172a' },
  { name: 'Active', value: 1000, color: '#20c997' }
];

const _categoryStatisticsData = [
    { name: 'Electronics', value: 40, color: '#f97316' },
    { name: 'Fashion', value: 30, color: '#0f172a' },
    { name: 'Groceries', value: 20, color: '#20c997' },
    { name: 'Sports', value: 10, color: '#e2e8f0' }
];

export default function Dashboard() {
    const { currencySymbol } = useCurrency();

    const { user } = useAuth();
    const name = user?.identifier?.split('@')[0] || 'Admin';

    // { onlineCount, posCount, total } — fetched from /api/sales/today/summary
    const [todaySummary, setTodaySummary] = useState(null);
    const [loadingCount, setLoadingCount] = useState(true);

    // Sales Return summary — fetched from /api/sales-returns/summary
    const [returnSummary, setReturnSummary] = useState(null);
    const [loadingReturn, setLoadingReturn] = useState(true);

    // Sales summary (all time) — fetched from /api/sales/summary
    const [salesSummary, setSalesSummary] = useState(null);
    const [_loadingSales, setLoadingSales] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchTodaySummary = async () => {
            try {
                const res = await apiClient.get(`${API.SALES}/today/summary`);
                if (!cancelled) setTodaySummary(res.data);
            } catch (err) {
                console.error('Failed to fetch today\'s sales summary:', err);
                if (!cancelled) setTodaySummary({ onlineCount: 0, posCount: 0, total: 0 });
            } finally {
                if (!cancelled) setLoadingCount(false);
            }
        };
        fetchTodaySummary();
        // Poll every 60 s so numbers stay fresh without a manual reload
        const interval = setInterval(fetchTodaySummary, 60_000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fetchSalesSummary = async () => {
            try {
                const res = await apiClient.get(`${API.SALES}/summary`);
                if (!cancelled) setSalesSummary(res.data);
            } catch (err) {
                console.error('Failed to fetch sales summary:', err);
                if (!cancelled) setSalesSummary({ totalCount: 0, totalAmount: 0 });
            } finally {
                if (!cancelled) setLoadingSales(false);
            }
        };
        fetchSalesSummary();
        const interval = setInterval(fetchSalesSummary, 60_000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fetchReturnSummary = async () => {
            try {
                const res = await apiClient.get(`${API.SALES_RETURNS}/summary`);
                if (!cancelled) setReturnSummary(res.data);
            } catch (err) {
                console.error('Failed to fetch sales return summary:', err);
                if (!cancelled) setReturnSummary({ totalCount: 0, totalAmount: 0, totalPaid: 0, totalDue: 0 });
            } finally {
                if (!cancelled) setLoadingReturn(false);
            }
        };
        fetchReturnSummary();
        const interval = setInterval(fetchReturnSummary, 60_000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    // Purchase summary
    const [purchaseSummary, setPurchaseSummary] = useState(null);
    const [loadingPurchase, setLoadingPurchase] = useState(true);

    // Purchase Return summary
    const [purchaseReturnSummary, setPurchaseReturnSummary] = useState(null);
    const [loadingPurchaseReturn, setLoadingPurchaseReturn] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchPurchaseSummary = async () => {
            try {
                const res = await apiClient.get('/purchases/summary');
                if (!cancelled) setPurchaseSummary(res.data);
            } catch (err) {
                console.error('Failed to fetch purchase summary:', err);
                if (!cancelled) setPurchaseSummary({ totalAmount: 0 });
            } finally {
                if (!cancelled) setLoadingPurchase(false);
            }
        };
        fetchPurchaseSummary();
        const interval = setInterval(fetchPurchaseSummary, 60_000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fetchPurchaseReturnSummary = async () => {
            try {
                const res = await apiClient.get('/purchase-returns/summary');
                if (!cancelled) setPurchaseReturnSummary(res.data);
            } catch (err) {
                console.error('Failed to fetch purchase return summary:', err);
                if (!cancelled) setPurchaseReturnSummary({ totalAmount: 0 });
            } finally {
                if (!cancelled) setLoadingPurchaseReturn(false);
            }
        };
        fetchPurchaseReturnSummary();
        const interval = setInterval(fetchPurchaseReturnSummary, 60_000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    // Analytics from Dashboard Service
    const [dashboardAnalytics, setDashboardAnalytics] = useState({ bestSellers: [], lowStockProducts: [] });
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchDashboardAnalytics = async () => {
            try {
                const res = await apiClient.get('/dashboard/sales');
                if (!cancelled) setDashboardAnalytics(res.data);
            } catch (err) {
                console.error('Failed to fetch dashboard analytics:', err);
            } finally {
                if (!cancelled) setLoadingAnalytics(false);
            }
        };
        fetchDashboardAnalytics();
        const interval = setInterval(fetchDashboardAnalytics, 60_000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    // Sales & Purchase Chart Data
    const [chartPeriod, setChartPeriod] = useState('1W');
    const [chartData, setChartData] = useState([]);
    const [loadingChart, setLoadingChart] = useState(true);
    const [chartTotals, setChartTotals] = useState({ purchase: 0, sales: 0 });

    useEffect(() => {
        let cancelled = false;
        const fetchChartData = async () => {
            setLoadingChart(true);
            try {
                const res = await apiClient.get(`/dashboard/chart?period=${chartPeriod}`);
                if (!cancelled) {
                    const data = res.data;
                    setChartData(data);
                    
                    let tPurchase = 0;
                    let tSales = 0;
                    data.forEach(item => {
                        tPurchase += Number(item.purchase || 0);
                        tSales += Number(item.sales || 0);
                    });
                    setChartTotals({ purchase: tPurchase, sales: tSales });
                }
            } catch (err) {
                console.error('Failed to fetch chart data:', err);
            } finally {
                if (!cancelled) setLoadingChart(false);
            }
        };
        fetchChartData();
    }, [chartPeriod]);


    const totalCount   = todaySummary?.totalCount   ?? 0;
    const onlineCount  = todaySummary?.onlineCount  ?? 0;
    const posCount     = todaySummary?.posCount     ?? 0;
    const totalAmount  = todaySummary?.totalAmount  ?? 0;
    const onlineAmount = todaySummary?.onlineAmount ?? 0;
    const posAmount    = todaySummary?.posAmount    ?? 0;
    const onlinePct    = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;
    const posPct       = totalCount > 0 ? Math.round((posCount    / totalCount) * 100) : 0;

    const fmt = (n) => {
        const num = Number(n);
        if (isNaN(num)) return `${currencySymbol}0.00`;
        return `${currencySymbol}` + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const overallIncome = Math.max(0, (salesSummary?.totalAmount ?? 0) - (returnSummary?.totalAmount ?? 0));
    const overallExpenses = Math.max(0, (purchaseSummary?.totalAmount ?? 0) - (purchaseReturnSummary?.totalAmount ?? 0));
    const _overallProfit = overallIncome - overallExpenses;
    const overallReturns = (returnSummary?.totalAmount ?? 0) + (purchaseReturnSummary?.totalAmount ?? 0);

    return (
        <div className="dashboard-wrapper">
            {/* Header Area */}
            <div className="d-flex justify-content-between align-items-center mb-3 mb-sm-4 flex-wrap gap-2">
                <div>
                    <h2 className="fw-bold mb-1 dash-header-title" style={{color: '#1e293b'}}>Welcome, {name}</h2>
                    <p className="text-muted small mb-0 dash-header-subtitle">
                        You have{' '}
                        <span className="text-warning fw-bold">
                            {loadingCount
                                ? <span className="spinner-border spinner-border-sm text-warning" role="status" style={{width:'14px',height:'14px'}} />
                                : totalCount}
                        </span>{' '}
                        sale{totalCount !== 1 ? 's' : ''} today
                        {!loadingCount && totalCount > 0 && (
                            <span className="text-muted ms-1">(
                                <span className="text-primary fw-semibold">{onlineCount} online</span>
                                {' + '}
                                <span className="text-success fw-semibold">{posCount} POS</span>
                            )</span>
                        )}
                    </p>
                </div>
                <div className="d-flex gap-2 align-items-center bg-white border px-2.5 py-1.5 rounded-2 shadow-sm dash-header-date">
                    <Calendar size={15} className="text-muted" />
                    <span className="small fw-semibold text-secondary">
                        {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Top Cards Row 1 */}
            <div className="row g-2 g-sm-3 mb-3">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="dash-card top-card-orange">
                        <div className="d-flex justify-content-between align-items-start mb-2 mb-sm-3">
                            <div>
                                <p className="mb-1 fw-medium text-white-50 small top-kpi-label">Today's Total Sales</p>
                                <h3 className="mb-0 fw-bold top-kpi-amount">
                                    {fmt(totalAmount)}
                                </h3>
                                <h6 className="text-white-50 top-kpi-sub mt-1"><b>Total Sales: </b>{totalCount}</h6>
                            </div>
                            <div className="top-kpi-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.2" d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z" fill="#ea580c"/>
                                    <path d="M15 12C15 13.1046 14.1046 14 13 14C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10C14.1046 10 15 10.8954 15 12Z" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 9H21" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        {/* Mini breakdown inside the card */}
                        <div className="d-flex gap-2 gap-sm-3 mb-1" style={{fontSize:'12px'}}>
                            <div className="d-flex align-items-center gap-1 text-white-50">
                                <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(255,255,255,0.9)',display:'inline-block'}}></span>
                                Online: <span className="text-white fw-bold ms-1">{loadingCount ? '…' : onlineCount}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1 text-white-50">
                                <span style={{width:7,height:7,borderRadius:'50%',background:'rgba(255,255,255,0.5)',display:'inline-block'}}></span>
                                POS: <span className="text-white fw-bold ms-1">{loadingCount ? '…' : posCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="dash-card top-card-navy">
                        <div className="d-flex justify-content-between align-items-start mb-2 mb-sm-3">
                            <div>
                                <p className="mb-1 fw-medium text-white-50 small top-kpi-label">Total Sales Return</p>
                                <h3 className="mb-0 fw-bold top-kpi-amount">
                                    {loadingReturn
                                        ? <span className="spinner-border spinner-border-sm text-light" role="status" style={{width:18,height:18}} />
                                        : fmt(returnSummary?.totalAmount ?? 0)}
                                </h3>
                                <h6 className="text-white-50 top-kpi-sub mt-1"><b>Total Returns: </b>{loadingReturn ? '…' : (returnSummary?.totalCount ?? 0)}</h6>
                            </div>
                            <div className="top-kpi-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.2" d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" fill="#0f172a"/>
                                    <path d="M8 12L12 8M8 12L12 16M8 12H16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="12" r="10" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        {/* Mini breakdown: Paid vs Due */}
                        <div className="d-flex gap-2 gap-sm-3 mb-1" style={{fontSize:'12px'}}>
                            <div className="d-flex align-items-center gap-1 text-white-50">
                                <span style={{width:7,height:7,borderRadius:'50%',background:'#4ade80',display:'inline-block'}}></span>
                                Paid: <span className="text-white fw-bold ms-1">{loadingReturn ? '…' : fmt(returnSummary?.totalPaid ?? 0)}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1 text-white-50">
                                <span style={{width:7,height:7,borderRadius:'50%',background:'#f87171',display:'inline-block'}}></span>
                                Due: <span className="text-white fw-bold ms-1">{loadingReturn ? '…' : fmt(returnSummary?.totalDue ?? 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="dash-card top-card-teal">
                        <div className="d-flex justify-content-between align-items-start mb-2 mb-sm-3">
                            <div>
                                <p className="mb-1 fw-medium text-white-50 small top-kpi-label">Total Purchase (Net)</p>
                                <h3 className="mb-0 fw-bold top-kpi-amount">
                                    {loadingPurchase || loadingPurchaseReturn
                                        ? <span className="spinner-border spinner-border-sm text-light" role="status" style={{width:18,height:18}} />
                                        : fmt(Math.max(0, (purchaseSummary?.totalAmount ?? 0) - (purchaseReturnSummary?.totalAmount ?? 0)))}
                                </h3>
                                <h6 className="text-white-50 top-kpi-sub mt-1">
                                    <b>Purchases: </b>{loadingPurchase ? '…' : (purchaseSummary?.totalCount ?? 0)}
                                    <span className="ms-1" style={{opacity: 0.8}}>({loadingPurchase ? '…' : fmt(purchaseSummary?.totalAmount ?? 0)})</span>
                                </h6>
                            </div>
                            <div className="top-kpi-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.2" d="M5 8L6.5 19C6.63807 19.5523 7.12781 20 7.69736 20H16.3026C16.8722 20 17.3619 19.5523 17.5 19L19 8H5Z" fill="#0d9488"/>
                                    <path d="M9 11V7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7V11" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 8H19L17.5 19C17.3619 19.5523 16.8722 20 16.3026 20H7.69736C7.12781 20 6.63807 19.5523 6.5 19L5 8Z" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="dash-card top-card-blue">
                        <div className="d-flex justify-content-between align-items-start mb-2 mb-sm-3">
                            <div>
                                <p className="mb-1 fw-medium text-white-50 small top-kpi-label">Total Purchase Return</p>
                                <h3 className="mb-0 fw-bold top-kpi-amount">
                                    {loadingPurchaseReturn
                                        ? <span className="spinner-border spinner-border-sm text-light" role="status" style={{width:18,height:18}} />
                                        : fmt(purchaseReturnSummary?.totalAmount ?? 0)}
                                </h3>
                                <h6 className="text-white-50 top-kpi-sub mt-1">
                                    <b>Total Returns: </b>{loadingPurchaseReturn ? '…' : (purchaseReturnSummary?.totalCount ?? 0)}
                                </h6>
                            </div>
                            <div className="top-kpi-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.2" d="M12 3L4 7V17L12 21L20 17V7L12 3Z" fill="#2563eb"/>
                                    <path d="M12 3L4 7V17L12 21L20 17V7L12 3Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M4 7L12 11M20 7L12 11M12 11V21" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15 4.5L9 8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                    {/* Top Cards Row 2 (White Cards) */}
                    <div className="row g-2 g-sm-3 mb-3 mb-sm-4">
                        <div className="col-6 col-md-6 col-xl-3">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-start mb-2 mb-sm-3">
                                    <div style={{minWidth: 0}}>
                                        <h4 className="fw-bold fs-5 mb-0 text-dark top-kpi-amount text-truncate">
                                            {loadingAnalytics ? (
                                                <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{width:16,height:16}} />
                                            ) : (
                                                fmt(dashboardAnalytics?.totalStockProfit ?? 0)
                                            )}
                                        </h4>
                                        <p className="text-secondary small mb-0 top-kpi-label text-truncate">Today's Profit</p>
                                    </div>
                                    <div className="icon-rounded-white bg-light-blue flex-shrink-0 ms-1" style={{width:36, height:36}}>
                                        <DollarSign size={18} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                                    <small className="text-success fw-semibold" style={{fontSize:'11px'}}>+22% <span className="d-none d-sm-inline">vs Last Mo.</span></small>
                                    <a href="#" className="small fw-semibold text-primary text-decoration-none" style={{fontSize:'11px'}}>View</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-xl-3">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-start mb-2 mb-sm-3">
                                    <div style={{minWidth: 0}}>
                                        <h4 className="fw-bold fs-5 mb-0 text-dark top-kpi-amount text-truncate">
                                            {loadingAnalytics ? (
                                                <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{width:16,height:16}} />
                                            ) : (
                                                fmt(dashboardAnalytics?.totalSellingStockValue ?? 0)
                                            )}
                                        </h4>
                                        <p className="text-secondary small mb-0 top-kpi-label text-truncate">Today's Revenue</p>
                                    </div>
                                    <div className="icon-rounded-white bg-light-teal flex-shrink-0 ms-1" style={{width:36, height:36}}>
                                        <TrendingUp size={18} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                                    <small className="text-success fw-semibold" style={{fontSize:'11px'}}>+15% <span className="d-none d-sm-inline">vs Last Mo.</span></small>
                                    <a href="#" className="small fw-semibold text-primary text-decoration-none" style={{fontSize:'11px'}}>View</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-xl-3">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-start mb-2 mb-sm-3">
                                    <div style={{minWidth: 0}}>
                                        <h4 className="fw-bold fs-5 mb-0 text-dark top-kpi-amount text-truncate">
                                            {loadingAnalytics ? (
                                                <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{width:16,height:16}} />
                                            ) : (
                                                fmt(dashboardAnalytics?.totalPurchaseStockValue ?? 0)
                                            )}
                                        </h4>
                                        <p className="text-secondary small mb-0 top-kpi-label text-truncate">Purchase Cost</p>
                                    </div>
                                    <div className="icon-rounded-white bg-light-orange flex-shrink-0 ms-1" style={{width:36, height:36}}>
                                        <Activity size={18} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                                    <small className="text-success fw-semibold" style={{fontSize:'11px'}}>+42% <span className="d-none d-sm-inline">vs Last Mo.</span></small>
                                    <a href="#" className="small fw-semibold text-primary text-decoration-none" style={{fontSize:'11px'}}>View</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-xl-3">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-start mb-2 mb-sm-3">
                                    <div style={{minWidth: 0}}>
                                        <h4 className="fw-bold fs-5 mb-0 text-dark top-kpi-amount text-truncate">
                                            {loadingReturn || loadingPurchaseReturn ? (
                                                <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{width:16,height:16}} />
                                            ) : (
                                                fmt(overallReturns)
                                            )}
                                        </h4>
                                        <p className="text-secondary small mb-0 top-kpi-label text-truncate">Payment Returns</p>
                                    </div>
                                    <div className="icon-rounded-white bg-light-purple flex-shrink-0 ms-1" style={{width:36, height:36}}>
                                        <RefreshCcw size={18} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                                    <small className="text-danger fw-semibold" style={{fontSize:'11px'}}>-20% <span className="d-none d-sm-inline">vs Last Mo.</span></small>
                                    <a href="#" className="small fw-semibold text-primary text-decoration-none" style={{fontSize:'11px'}}>View</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Sales Breakdown */}
                    <div className="row g-3 mb-3 mb-sm-4">
                        <div className="col-12">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3 mb-sm-4 flex-wrap gap-2">
                                    <h5 className="dash-title mb-0">
                                        <ShoppingCart size={20} color="#f97316" className="me-1 me-sm-2" />
                                        Today's Sales Breakdown
                                        <span className="ms-2" style={{
                                            fontSize: '10.5px', background: '#fef3c7', color: '#d97706',
                                            padding: '2px 8px', borderRadius: '20px', fontWeight: 600
                                        }}>● LIVE</span>
                                    </h5>
                                    <span className="small text-muted" style={{fontSize:'11.5px'}}>
                                        {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>

                                {loadingCount ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-warning" role="status" style={{width:32,height:32}} />
                                        <p className="text-muted small mt-2 mb-0">Fetching today's data…</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center px-2 mb-2 text-muted small fw-semibold">
                                            <span>Source</span>
                                            <div className="d-flex align-items-center gap-3 gap-sm-4">
                                                <span className="d-none d-sm-inline">Orders</span>
                                                <span>Amount</span>
                                            </div>
                                        </div>

                                        <div className="dash-breakdown-row">
                                            <div className="dash-breakdown-info">
                                                <div className="item-img" style={{background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                                    <ShoppingCart size={18} color="#2563eb" />
                                                </div>
                                                <div style={{minWidth:0}}>
                                                    <p className="dash-breakdown-title">Online Sales</p>
                                                    <p className="dash-breakdown-desc">Sale Orders (web)</p>
                                                </div>
                                            </div>
                                            <div className="dash-breakdown-stats">
                                                <span className="dash-breakdown-orders" style={{color:'#2563eb'}}>
                                                    {onlineCount} <span className="small fw-normal text-muted d-inline d-sm-none" style={{fontSize:'10px'}}>ord</span>
                                                </span>
                                                <span className="dash-breakdown-amount" style={{color:'#2563eb'}}>
                                                    {fmt(onlineAmount)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="dash-breakdown-row">
                                            <div className="dash-breakdown-info">
                                                <div className="item-img" style={{background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                                    <DollarSign size={18} color="#16a34a" />
                                                </div>
                                                <div style={{minWidth:0}}>
                                                    <p className="dash-breakdown-title">POS Sales</p>
                                                    <p className="dash-breakdown-desc">Point-of-Sale terminal</p>
                                                </div>
                                            </div>
                                            <div className="dash-breakdown-stats">
                                                <span className="dash-breakdown-orders" style={{color:'#16a34a'}}>
                                                    {posCount} <span className="small fw-normal text-muted d-inline d-sm-none" style={{fontSize:'10px'}}>ord</span>
                                                </span>
                                                <span className="dash-breakdown-amount" style={{color:'#16a34a'}}>
                                                    {fmt(posAmount)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="dash-breakdown-row" style={{background:'#fff7ed',borderRadius:10,marginTop:6}}>
                                            <div className="dash-breakdown-info">
                                                <div className="item-img" style={{background:'#ea580c',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                                    <TrendingUp size={18} color="#fff" />
                                                </div>
                                                <div style={{minWidth:0}}>
                                                    <p className="dash-breakdown-title fw-bold" style={{color:'#ea580c'}}>Total Today</p>
                                                    <p className="dash-breakdown-desc">Online + POS combined</p>
                                                </div>
                                            </div>
                                            <div className="dash-breakdown-stats">
                                                <span className="dash-breakdown-orders" style={{color:'#ea580c'}}>
                                                    {totalCount} <span className="small fw-normal text-muted d-inline d-sm-none" style={{fontSize:'10px'}}>ord</span>
                                                </span>
                                                <span className="dash-breakdown-amount" style={{color:'#ea580c',fontWeight:800}}>
                                                    {fmt(totalAmount)}
                                                </span>
                                            </div>
                                        </div>

                                        {totalCount > 0 && (
                                            <div className="mt-3 mt-sm-4">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small className="text-muted fw-semibold" style={{fontSize:'11px'}}>Order distribution</small>
                                                    <small className="text-muted" style={{fontSize:'11px'}}>{onlinePct}% Online · {posPct}% POS</small>
                                                </div>
                                                <div className="w-100 rounded-pill overflow-hidden" style={{height:10,background:'#f1f5f9'}}>
                                                    <div className="d-flex h-100">
                                                        <div style={{
                                                            width:`${onlinePct}%`,
                                                            background:'linear-gradient(90deg,#60a5fa,#2563eb)',
                                                            transition:'width 0.6s ease',
                                                            borderRadius: onlinePct === 100 ? '9999px' : '9999px 0 0 9999px'
                                                        }} />
                                                        <div style={{
                                                            width:`${posPct}%`,
                                                            background:'linear-gradient(90deg,#4ade80,#16a34a)',
                                                            transition:'width 0.6s ease',
                                                            borderRadius: posPct === 100 ? '9999px' : '0 9999px 9999px 0'
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-2 gap-sm-3 mt-2 flex-wrap">
                                                    <span className="small text-muted" style={{fontSize:'11px'}}><span style={{color:'#2563eb'}}>■</span> Online ({onlineCount} orders)</span>
                                                    <span className="small text-muted" style={{fontSize:'11px'}}><span style={{color:'#16a34a'}}>■</span> POS ({posCount} orders)</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Chart & Stats */}
                    <div className="row g-3 mb-3 mb-sm-4">
                        <div className="col-12 col-xl-8">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3 mb-sm-4 flex-wrap gap-2">
                                    <h5 className="dash-title mb-0"><Activity size={20} className="text-orange" color="#ea580c"/> Sales &amp; Purchase</h5>
                                    <div className="dash-period-scroll bg-light rounded-2 p-1">
                                        {['1D', '1W', '1M', '3M', '6M', '1Y'].map(period => (
                                            <button 
                                                key={period}
                                                onClick={() => setChartPeriod(period)}
                                                className={`btn btn-sm px-2.5 py-1 ${chartPeriod === period ? 'btn-warning text-white shadow-sm fw-semibold' : 'text-secondary bg-transparent border-0'}`} 
                                                style={chartPeriod === period ? {backgroundColor: '#f97316', borderColor: '#f97316', fontSize:'12px'} : {fontSize:'12px'}}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex gap-3 gap-sm-4 mb-3 flex-wrap">
                                    <div className="px-2 px-sm-3 border-start border-3 border-warning form-check">
                                        <span className="small text-muted d-block" style={{fontSize:'11px'}}><span className="text-warning">●</span> Total Purchase</span>
                                        <span className="fw-bold fs-5">{fmt(chartTotals.purchase)}</span>
                                    </div>
                                    <div className="px-2 px-sm-3 border-start border-3 border-dark form-check">
                                        <span className="small text-muted d-block" style={{fontSize:'11px'}}><span className="text-dark">●</span> Total Sales</span>
                                        <span className="fw-bold fs-5">{fmt(chartTotals.sales)}</span>
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: 260 }}>
                                    {loadingChart ? (
                                        <div className="d-flex justify-content-center align-items-center h-100">
                                            <div className="spinner-border text-orange" role="status" />
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }} barSize={14}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(val) => val > 1000 ? (val/1000).toFixed(1) + 'k' : val} />
                                                <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} formatter={(value) => [fmt(value)]} />
                                                <Bar dataKey="purchase" stackId="a" fill="#fed7aa" radius={[0, 0, 4, 4]} />
                                                <Bar dataKey="sales" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 col-xl-4">
                            <div className="dash-card">
                                <h5 className="dash-title mb-3"><Info size={20} className="text-primary"/> Overall Information</h5>
                                <div className="row g-2 mb-3">
                                    <div className="col-4 text-center">
                                        <div className="bg-light-blue p-2 rounded-2 mb-1 d-inline-block"><Users size={16}/></div>
                                        <h6 className="fw-bold mb-0">{dashboardAnalytics?.totalReception || 0}</h6>
                                        <p className="small text-muted mb-0" style={{fontSize:'11px'}}>Reception</p>
                                    </div>
                                    <div className="col-4 text-center">
                                        <div className="bg-light-orange p-2 rounded-2 mb-1 d-inline-block"><Users size={16}/></div>
                                        <h6 className="fw-bold mb-0">{dashboardAnalytics?.totalCustomers || 0}</h6>
                                        <p className="small text-muted mb-0" style={{fontSize:'11px'}}>Customer</p>
                                    </div>
                                    <div className="col-4 text-center">
                                        <div className="bg-light-teal p-2 rounded-2 mb-1 d-inline-block"><ShoppingCart size={16}/></div>
                                        <h6 className="fw-bold mb-0">{dashboardAnalytics?.totalOrders || 0}</h6>
                                        <p className="small text-muted mb-0" style={{fontSize:'11px'}}>Orders</p>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
                                    <h6 className="fw-bold mb-0" style={{fontSize:'0.9rem'}}>Customers Overview</h6>
                                    <select className="dash-select"><option>Today</option></select>
                                </div>
                                <div className="customer-pie-container">
                                    <div className="customer-pie-chart">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie 
                                                    data={[
                                                        { name: 'Loss Time', value: dashboardAnalytics?.customerOverview?.lossTime || 0, color: '#f97316' },
                                                        { name: 'Return', value: dashboardAnalytics?.customerOverview?.returns || 0, color: '#0f172a' },
                                                        { name: 'Active', value: dashboardAnalytics?.customerOverview?.active || 0, color: '#20c997' }
                                                    ]} 
                                                    innerRadius={42} 
                                                    outerRadius={62} 
                                                    paddingAngle={2} 
                                                    dataKey="value" 
                                                    stroke="none"
                                                >
                                                    {[
                                                        { name: 'Loss Time', value: dashboardAnalytics?.customerOverview?.lossTime || 0, color: '#f97316' },
                                                        { name: 'Return', value: dashboardAnalytics?.customerOverview?.returns || 0, color: '#0f172a' },
                                                        { name: 'Active', value: dashboardAnalytics?.customerOverview?.active || 0, color: '#20c997' }
                                                    ].map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="customer-pie-details">
                                        <div className="mb-2">
                                            <h5 className="fw-bold mb-0 fs-6">{fmt(dashboardAnalytics?.customerOverview?.lossTime || 0).replace(`${currencySymbol}`, '')}</h5>
                                            <div className="d-flex align-items-center gap-1.5 justify-content-center justify-content-sm-start">
                                                <span className="small text-muted" style={{fontSize:'11px'}}><span className="text-orange">●</span> Loss Time</span>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-1.5 py-0.5" style={{fontSize:'10px'}}>+{dashboardAnalytics?.customerOverview?.lossTimePercentage?.toFixed(0) || 0}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0 fs-6">{fmt(dashboardAnalytics?.customerOverview?.returns || 0).replace(`${currencySymbol}`, '')}</h5>
                                            <div className="d-flex align-items-center gap-1.5 justify-content-center justify-content-sm-start">
                                                <span className="small text-muted" style={{fontSize:'11px'}}><span className="text-dark">●</span> Return</span>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-1.5 py-0.5" style={{fontSize:'10px'}}>+{dashboardAnalytics?.customerOverview?.returnPercentage?.toFixed(0) || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Three Column Middle Row */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-xl-4">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dash-title mb-0"><TrendingUp size={20} className="text-pink-500" color="#ec4899"/> Top Selling</h5>
                                    <button className="dash-select text-primary bg-light border-0 fw-semibold">View All &gt;</button>
                                </div>
                                {loadingAnalytics ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status" style={{width:24,height:24}} />
                                    </div>
                                ) : (
                                    (dashboardAnalytics?.bestSellers || []).map((product, index) => (
                                        <div className="dash-list-item" key={index}>
                                            <div className="item-flex" style={{minWidth: 0, flex: 1}}>
                                                <div className={`item-img bg-${['light-orange', 'dark', 'success', 'secondary', 'primary'][index % 5]}`} style={{flexShrink:0}}></div>
                                                <div style={{minWidth: 0}}>
                                                    <p className="item-title text-truncate">{product.name}</p>
                                                    <p className="item-desc text-truncate">{product.price} {currencySymbol} <span className="text-primary">{product.sales} Sales</span></p>
                                                </div>
                                            </div>
                                            <span className="pill-badge pill-green ms-2 flex-shrink-0">+ 10%</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-xl-4">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dash-title mb-0"><Activity size={20} className="text-danger" color="#ef4444"/> Low Stock</h5>
                                    <button className="dash-select text-primary bg-light border-0 fw-semibold">View All &gt;</button>
                                </div>
                                {loadingAnalytics ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-danger" role="status" style={{width:24,height:24}} />
                                    </div>
                                ) : (
                                    (dashboardAnalytics?.lowStockProducts || []).map((product, index) => (
                                        <div className="dash-list-item" key={index}>
                                            <div className="item-flex" style={{minWidth: 0, flex: 1}}>
                                                <div className={`item-img bg-${['dark', 'primary', 'warning', 'info', 'danger'][index % 5]}`} style={{flexShrink:0}}></div>
                                                <div style={{minWidth: 0}}>
                                                    <p className="item-title text-truncate">{product.name}</p>
                                                    <p className="item-desc text-truncate">SKU : {product.sku}</p>
                                                </div>
                                            </div>
                                            <div className="text-end ms-2 flex-shrink-0">
                                                <p className="small text-muted mb-0" style={{fontSize:'10px'}}>Stock</p>
                                                <span className="text-danger fw-bold">{product.stock}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-xl-4">
                            <NotesWidget />
                        </div>
                    
                    </div>



        </div>
    );
}
