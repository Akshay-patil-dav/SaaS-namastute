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
        if (isNaN(num)) return '₹0.00';
        return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const overallIncome = Math.max(0, (salesSummary?.totalAmount ?? 0) - (returnSummary?.totalAmount ?? 0));
    const overallExpenses = Math.max(0, (purchaseSummary?.totalAmount ?? 0) - (purchaseReturnSummary?.totalAmount ?? 0));
    const _overallProfit = overallIncome - overallExpenses;
    const overallReturns = (returnSummary?.totalAmount ?? 0) + (purchaseReturnSummary?.totalAmount ?? 0);

    return (
        <div className="dashboard-wrapper">
            {/* Header Area */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1" style={{color: '#1e293b'}}>Welcome, {name}</h2>
                    <p className="text-muted small mb-0">
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
                <div className="d-flex gap-2 align-items-center bg-white border px-3 py-2 rounded-2 shadow-sm">
                    <Calendar size={16} className="text-muted" />
                    <span className="small fw-semibold text-secondary">
                        {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

                    {/* Top Cards Row 1 */}
                    <div className="row g-3 mb-3">
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card top-card-orange">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 fw-medium text-white-50 small">Today's Total Sales</p>
                                        <h3 className="mb-0 fw-bold">
                                                {fmt(totalAmount)}
                                        </h3>
                                        <h6 className="text-white-50"><b>Total Sales : </b>{totalCount}</h6>
                                    </div>
                                    <div className="icon-rounded-sm bg-white text-orange">
                                        <Wallet size={18} color="#ea580c" />
                                    </div>
                                </div>
                                {/* Mini breakdown inside the card */}
                                <div className="d-flex gap-3 mb-3" style={{fontSize:'12px'}}>
                                    <div className="d-flex align-items-center gap-1 text-white-50">
                                        <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,255,255,0.9)',display:'inline-block'}}></span>
                                        Online: <span className="text-white fw-bold ms-1">{loadingCount ? '…' : onlineCount}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-1 text-white-50">
                                        <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,255,255,0.5)',display:'inline-block'}}></span>
                                        POS: <span className="text-white fw-bold ms-1">{loadingCount ? '…' : posCount}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="pill-badge bg-white text-orange small"><ArrowUpRight size={12}/> Live</span>
                                    <span className="text-white-50" style={{fontSize:'11px'}}>Auto-refresh 60s</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card top-card-navy">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 fw-medium text-white-50 small">Total Sales Return</p>
                                        <h3 className="mb-0 fw-bold">
                                            {loadingReturn
                                                ? <span className="spinner-border spinner-border-sm text-light" role="status" style={{width:18,height:18}} />
                                                : fmt(returnSummary?.totalAmount ?? 0)}
                                        </h3>
                                        <h6 className="text-white-50"><b>Total Returns : </b>{loadingReturn ? '…' : (returnSummary?.totalCount ?? 0)}</h6>
                                    </div>
                                    <div className="icon-rounded-sm bg-white text-navy">
                                        <RefreshCcw size={18} color="#0f172a" />
                                    </div>
                                </div>
                                {/* Mini breakdown: Paid vs Due */}
                                <div className="d-flex gap-3 mb-3" style={{fontSize:'12px'}}>
                                    <div className="d-flex align-items-center gap-1 text-white-50">
                                        <span style={{width:8,height:8,borderRadius:'50%',background:'#4ade80',display:'inline-block'}}></span>
                                        Paid: <span className="text-white fw-bold ms-1">{loadingReturn ? '…' : fmt(returnSummary?.totalPaid ?? 0)}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-1 text-white-50">
                                        <span style={{width:8,height:8,borderRadius:'50%',background:'#f87171',display:'inline-block'}}></span>
                                        Due: <span className="text-white fw-bold ms-1">{loadingReturn ? '…' : fmt(returnSummary?.totalDue ?? 0)}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="pill-badge bg-white text-dark small"><ArrowUpRight size={12}/> Live</span>
                                    <span className="text-white-50" style={{fontSize:'11px'}}>Auto-refresh 60s</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card top-card-teal">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 fw-medium text-white-50 small">Total Purchase (Net)</p>
                                        <h3 className="mb-0 fw-bold">
                                            {loadingPurchase || loadingPurchaseReturn
                                                ? <span className="spinner-border spinner-border-sm text-light" role="status" style={{width:18,height:18}} />
                                                : fmt(Math.max(0, (purchaseSummary?.totalAmount ?? 0) - (purchaseReturnSummary?.totalAmount ?? 0)))}
                                        </h3>
                                        <h6 className="text-white-50" style={{marginTop: '4px'}}>
                                            <b>Total Purchases : </b>{loadingPurchase ? '…' : (purchaseSummary?.totalCount ?? 0)}
                                        </h6>
                                        <h6 className="text-white-50" style={{fontSize: '11px', marginTop: '2px'}}>
                                            Gross: {loadingPurchase ? '…' : fmt(purchaseSummary?.totalAmount ?? 0)}
                                        </h6>
                                    </div>
                                    <div className="icon-rounded-sm bg-white text-teal">
                                        <ShoppingBag size={18} color="#0d9488" />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="pill-badge bg-white text-dark small"><ArrowUpRight size={12}/> Live</span>
                                    <span className="text-white-50" style={{fontSize:'11px'}}>Auto-refresh 60s</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card top-card-blue">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 fw-medium text-white-50 small">Total Purchase Return</p>
                                        <h3 className="mb-0 fw-bold">
                                            {loadingPurchaseReturn
                                                ? <span className="spinner-border spinner-border-sm text-light" role="status" style={{width:18,height:18}} />
                                                : fmt(purchaseReturnSummary?.totalAmount ?? 0)}
                                        </h3>
                                        <h6 className="text-white-50" style={{marginTop: '4px'}}>
                                            <b>Total Returns : </b>{loadingPurchaseReturn ? '…' : (purchaseReturnSummary?.totalCount ?? 0)}
                                        </h6>
                                    </div>
                                    <div className="icon-rounded-sm bg-white text-blue">
                                        <Box size={18} color="#2563eb" />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="pill-badge bg-white text-dark small"><ArrowUpRight size={12}/> Live</span>
                                    <span className="text-white-50" style={{fontSize:'11px'}}>Auto-refresh 60s</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Cards Row 2 (White Cards) */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="fw-bold fs-5 mb-1 text-dark">
                                            {loadingAnalytics ? (
                                                <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{width:18,height:18}} />
                                            ) : (
                                                fmt(dashboardAnalytics?.totalStockProfit ?? 0)
                                            )}
                                        </h4>
                                        <p className="text-secondary small mb-0">Today's Profit</p>
                                    </div>
                                    <div className="icon-rounded-white bg-light-blue">
                                        <DollarSign size={20} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <small className="text-success fw-semibold">+22% vs Last Month</small>
                                    <a href="#" className="small fw-semibold text-primary text-decoration-none">View All</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="fw-bold fs-5 mb-1 text-dark">
                                            {loadingAnalytics ? (
                                                <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{width:18,height:18}} />
                                            ) : (
                                                fmt(dashboardAnalytics?.totalSellingStockValue ?? 0)
                                            )}
                                        </h4>
                                        <p className="text-secondary small mb-0">Today's Revenue</p>
                                    </div>
                                    <div className="icon-rounded-white bg-light-teal">
                                        <TrendingUp size={20} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <small className="text-success fw-semibold">+15% vs Last Month</small>
                                    <a href="#" className="small fw-semibold text-primary text-decoration-none">View All</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="fw-bold fs-5 mb-1 text-dark">
                                            {loadingAnalytics ? (
                                                <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{width:18,height:18}} />
                                            ) : (
                                                fmt(dashboardAnalytics?.totalPurchaseStockValue ?? 0)
                                            )}
                                        </h4>
                                        <p className="text-secondary small mb-0">Today's Purchase Cost</p>
                                    </div>
                                    <div className="icon-rounded-white bg-light-orange">
                                        <Activity size={20} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <small className="text-success fw-semibold">+42% vs Last Month</small>
                                    <a href="#" className="small fw-semibold text-primary text-decoration-none">View All</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="fw-bold fs-5 mb-1 text-dark">
                                            {loadingReturn || loadingPurchaseReturn ? (
                                                <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{width:18,height:18}} />
                                            ) : (
                                                fmt(overallReturns)
                                            )}
                                        </h4>
                                        <p className="text-secondary small mb-0">Total Payment Returns</p>
                                    </div>
                                    <div className="icon-rounded-white bg-light-purple">
                                        <RefreshCcw size={20} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <small className="text-danger fw-semibold">-20% vs Last Month</small>
                                    <a href="#" className="small fw-semibold text-primary text-decoration-none">View All</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Sales Breakdown */}
                    <div className="row g-3 mb-4">
                        <div className="col-12">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="dash-title mb-0">
                                        <ShoppingCart size={20} color="#f97316" className="me-2" />
                                        Today's Sales Breakdown
                                        <span className="ms-2" style={{
                                            fontSize: '11px', background: '#fef3c7', color: '#d97706',
                                            padding: '2px 9px', borderRadius: '20px', fontWeight: 600
                                        }}>● LIVE</span>
                                    </h5>
                                    <span className="small text-muted">
                                        {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>

                                {loadingCount ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-warning" role="status" style={{width:32,height:32}} />
                                        <p className="text-muted small mt-2 mb-0">Fetching today's data…</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center px-2 mb-2">
                                            <span className="small text-muted fw-semibold" style={{flex:1}}>Source</span>
                                            <span className="small text-muted fw-semibold text-end" style={{minWidth:80}}>Orders</span>
                                            <span className="small text-muted fw-semibold text-end" style={{minWidth:130}}>Amount</span>
                                        </div>

                                        <div className="dash-list-item">
                                            <div className="item-flex" style={{flex:1}}>
                                                <div className="item-img" style={{background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                                    <ShoppingCart size={18} color="#2563eb" />
                                                </div>
                                                <div>
                                                    <p className="item-title">Online Sales</p>
                                                    <p className="item-desc">Sale Orders (web)</p>
                                                </div>
                                            </div>
                                            <span className="fw-bold fs-5 text-end" style={{minWidth:80,color:'#2563eb'}}>
                                                {onlineCount}
                                            </span>
                                            <span className="fw-bold small text-end" style={{minWidth:130,color:'#2563eb'}}>
                                                {fmt(onlineAmount)}
                                            </span>
                                        </div>

                                        <div className="dash-list-item">
                                            <div className="item-flex" style={{flex:1}}>
                                                <div className="item-img" style={{background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                                    <DollarSign size={18} color="#16a34a" />
                                                </div>
                                                <div>
                                                    <p className="item-title">POS Sales</p>
                                                    <p className="item-desc">Point-of-Sale terminal</p>
                                                </div>
                                            </div>
                                            <span className="fw-bold fs-5 text-end" style={{minWidth:80,color:'#16a34a'}}>
                                                {posCount}
                                            </span>
                                            <span className="fw-bold small text-end" style={{minWidth:130,color:'#16a34a'}}>
                                                {fmt(posAmount)}
                                            </span>
                                        </div>

                                        <div className="dash-list-item" style={{background:'#fff7ed',borderRadius:10,marginTop:6}}>
                                            <div className="item-flex" style={{flex:1}}>
                                                <div className="item-img" style={{background:'#ea580c',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                                    <TrendingUp size={18} color="#fff" />
                                                </div>
                                                <div>
                                                    <p className="item-title fw-bold" style={{color:'#ea580c'}}>Total Today</p>
                                                    <p className="item-desc">Online + POS combined</p>
                                                </div>
                                            </div>
                                            <span className="fw-bold fs-4 text-end" style={{minWidth:80,color:'#ea580c'}}>
                                                {totalCount}
                                            </span>
                                            <span className="fw-bold text-end" style={{minWidth:130,color:'#ea580c',fontSize:'1rem'}}>
                                                {fmt(totalAmount)}
                                            </span>
                                        </div>

                                        {totalCount > 0 && (
                                            <div className="mt-4">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small className="text-muted fw-semibold">Order distribution</small>
                                                    <small className="text-muted">{onlinePct}% Online · {posPct}% POS</small>
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
                                                <div className="d-flex gap-3 mt-2">
                                                    <span className="small text-muted"><span style={{color:'#2563eb'}}>■</span> Online ({onlineCount} orders)</span>
                                                    <span className="small text-muted"><span style={{color:'#16a34a'}}>■</span> POS ({posCount} orders)</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Chart & Stats */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-xl-8">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="dash-title mb-0"><Activity size={20} className="text-orange" color="#ea580c"/> Sales & Purchase</h5>
                                    <div className="d-flex bg-light rounded-2 p-1">
                                        {['1D', '1W', '1M', '3M', '6M', '1Y'].map(period => (
                                            <button 
                                                key={period}
                                                onClick={() => setChartPeriod(period)}
                                                className={`btn btn-sm px-3 ${chartPeriod === period ? 'btn-warning text-white shadow-sm fw-medium' : 'text-secondary bg-transparent border-0'}`} 
                                                style={chartPeriod === period ? {backgroundColor: '#f97316', borderColor: '#f97316'} : {}}
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex gap-4 mb-4">
                                    <div className="px-3 border-start border-3 border-secondary border-opacity-25 form-check">
                                        <span className="small text-muted d-block"><span className="text-warning">●</span> Total Purchase</span>
                                        <span className="fw-bold fs-5">{fmt(chartTotals.purchase)}</span>
                                    </div>
                                    <div className="px-3 border-start border-3 border-secondary border-opacity-25 form-check">
                                        <span className="small text-muted d-block"><span className="text-dark">●</span> Total Sales</span>
                                        <span className="fw-bold fs-5">{fmt(chartTotals.sales)}</span>
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: 260 }}>
                                    {loadingChart ? (
                                        <div className="d-flex justify-content-center align-items-center h-100">
                                            <div className="spinner-border text-orange" role="status" />
                                        </div>
                                    ) : (
                                        <ResponsiveContainer>
                                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => val > 1000 ? (val/1000).toFixed(1) + 'k' : val} />
                                                <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => [fmt(value)]} />
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
                                <h5 className="dash-title mb-4"><Info size={20} className="text-primary"/> Overall Information</h5>
                                <div className="row g-2 mb-4">
                                    <div className="col-4 text-center">
                                        <div className="bg-light-blue p-2 rounded-2 mb-2 d-inline-block"><Users size={16}/></div>
                                        <h6 className="fw-bold mb-0">{dashboardAnalytics?.totalReception || 0}</h6>
                                        <p className="small text-muted mb-0">Reception</p>
                                    </div>
                                    <div className="col-4 text-center">
                                        <div className="bg-light-orange p-2 rounded-2 mb-2 d-inline-block"><Users size={16}/></div>
                                        <h6 className="fw-bold mb-0">{dashboardAnalytics?.totalCustomers || 0}</h6>
                                        <p className="small text-muted mb-0">Customer</p>
                                    </div>
                                    <div className="col-4 text-center">
                                        <div className="bg-light-teal p-2 rounded-2 mb-2 d-inline-block"><ShoppingCart size={16}/></div>
                                        <h6 className="fw-bold mb-0">{dashboardAnalytics?.totalOrders || 0}</h6>
                                        <p className="small text-muted mb-0">Orders</p>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
                                    <h6 className="fw-bold mb-0">Customers Overview</h6>
                                    <select className="dash-select"><option>Today</option></select>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div style={{width: 140, height: 140, marginLeft: '-15px'}}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie 
                                                    data={[
                                                        { name: 'Loss Time', value: dashboardAnalytics?.customerOverview?.lossTime || 0, color: '#f97316' },
                                                        { name: 'Return', value: dashboardAnalytics?.customerOverview?.returns || 0, color: '#0f172a' },
                                                        { name: 'Active', value: dashboardAnalytics?.customerOverview?.active || 0, color: '#20c997' }
                                                    ]} 
                                                    innerRadius={45} 
                                                    outerRadius={65} 
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
                                    <div>
                                        <div className="mb-3">
                                            <h5 className="fw-bold mb-1">{fmt(dashboardAnalytics?.customerOverview?.lossTime || 0).replace('₹', '')}</h5>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="small text-muted"><span className="text-orange">●</span> Loss Time</span>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">+{dashboardAnalytics?.customerOverview?.lossTimePercentage?.toFixed(0) || 0}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">{fmt(dashboardAnalytics?.customerOverview?.returns || 0).replace('₹', '')}</h5>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="small text-muted"><span className="text-dark">●</span> Return</span>
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">+{dashboardAnalytics?.customerOverview?.returnPercentage?.toFixed(0) || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Four Column Middle Row */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-xl-6">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dash-title mb-0"><TrendingUp size={20} className="text-pink-500" color="#ec4899"/> Top Selling Products</h5>
                                    <button className="dash-select text-primary bg-light border-0 fw-semibold">View All &gt;</button>
                                </div>
                                {loadingAnalytics ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status" style={{width:24,height:24}} />
                                    </div>
                                ) : (
                                    (dashboardAnalytics?.bestSellers || []).map((product, index) => (
                                        <div className="dash-list-item" key={index}>
                                            <div className="item-flex">
                                                <div className={`item-img bg-${['light-orange', 'dark', 'success', 'secondary', 'primary'][index % 5]}`}></div>
                                                <div>
                                                    <p className="item-title">{product.name}</p>
                                                    <p className="item-desc">{product.price} • <span className="text-primary">{product.sales} Sales</span></p>
                                                </div>
                                            </div>
                                            <span className="pill-badge pill-green">+ 10%</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dash-title mb-0"><Activity size={20} className="text-danger" color="#ef4444"/> Low Stock Products</h5>
                                    <button className="dash-select text-primary bg-light border-0 fw-semibold">View All &gt;</button>
                                </div>
                                {loadingAnalytics ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-danger" role="status" style={{width:24,height:24}} />
                                    </div>
                                ) : (
                                    (dashboardAnalytics?.lowStockProducts || []).map((product, index) => (
                                        <div className="dash-list-item" key={index}>
                                            <div className="item-flex">
                                                <div className={`item-img bg-${['dark', 'primary', 'warning', 'info', 'danger'][index % 5]}`}></div>
                                                <div>
                                                    <p className="item-title">{product.name}</p>
                                                    <p className="item-desc">SKU : {product.sku}</p>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <p className="small text-muted mb-0">Stock</p>
                                                <span className="text-danger fw-bold">{product.stock}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row 3: Order Statistics (Heatmap) */}
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="dash-title mb-0"><Activity size={20} className="text-purple-600" color="#9333ea"/> Order Statistics</h5>
                                    <select className="dash-select"><option>Weekly</option></select>
                                </div>
                                
                                <div className="d-flex w-100 overflow-auto pb-2">
                                    <div className="heatmap-row-labels me-2 pb-4">
                                        <span>12 PM</span>
                                        <span>10 PM</span>
                                        <span>8 PM</span>
                                        <span>6 PM</span>
                                        <span>4 PM</span>
                                        <span>2 PM</span>
                                        <span>12 AM</span>
                                        <span>10 AM</span>
                                        <span>8 AM</span>
                                        <span>6 AM</span>
                                    </div>
                                    
                                    <div className="flex-grow-1">
                                        <div className="heatmap-container mb-2">
                                            {Array.from({length: 10}).map((_, rowIndex) => (
                                                <React.Fragment key={rowIndex}>
                                                    <div className="heatmap-cell"></div>
                                                    <div className="heatmap-cell"></div>
                                                    <div className={`heatmap-cell ${rowIndex === 3 || rowIndex === 8 ? 'active-mid' : ''}`}></div>
                                                    <div className={`heatmap-cell ${rowIndex === 3 || rowIndex === 8 ? 'active-mid' : rowIndex === 0 || rowIndex === 1 ? 'active-low' : ''}`}></div>
                                                    <div className={`heatmap-cell ${rowIndex === 9 || rowIndex === 8 ? 'active-mid' : rowIndex === 0 ? 'active-low' : ''}`}></div>
                                                    <div className={`heatmap-cell ${rowIndex > 5 && rowIndex < 9 ? 'active-high' : ''}`}></div>
                                                    <div className={`heatmap-cell ${rowIndex > 5 && rowIndex < 9 ? 'active-high' : ''}`}></div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        <div className="heatmap-col-labels">
                                            <span>Mon</span>
                                            <span>Tue</span>
                                            <span>Wed</span>
                                            <span>Thu</span>
                                            <span>Fri</span>
                                            <span>Sat</span>
                                            <span>Sun</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    );
}
