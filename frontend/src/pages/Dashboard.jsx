import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import apiClient, { API } from '../api/config';
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

// Chart Data
const salesPurchaseData = [
  { name: '2 Jan', purchase: 35, sales: 10 },
  { name: '4 Jan', purchase: 28, sales: 8 },
  { name: '6 Jan', purchase: 28, sales: 12 },
  { name: '8 Jan', purchase: 45, sales: 25 },
  { name: '10 Jan', purchase: 45, sales: 25 },
  { name: '12 Jan', purchase: 42, sales: 22 },
  { name: '14 Jan', purchase: 20, sales: 5 },
  { name: '16 Jan', purchase: 30, sales: 15 },
  { name: '18 Jan', purchase: 50, sales: 30 },
  { name: '20 Jan', purchase: 38, sales: 18 },
  { name: '22 Jan', purchase: 45, sales: 20 },
  { name: '24 Jan', purchase: 30, sales: 10 },
];

const salesStatisticsData = [
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

const customerOverviewData = [
  { name: 'Loss Time', value: 5500, color: '#f97316' },
  { name: 'Return', value: 3500, color: '#0f172a' },
  { name: 'Active', value: 1000, color: '#20c997' }
];

const categoryStatisticsData = [
    { name: 'Electronics', value: 40, color: '#f97316' },
    { name: 'Fashion', value: 30, color: '#0f172a' },
    { name: 'Groceries', value: 20, color: '#20c997' },
    { name: 'Sports', value: 10, color: '#e2e8f0' }
];

export default function Dashboard() {
    const { user } = useAuth();
    const name = user?.identifier?.split('@')[0] || 'Admin';
    const [dashboardView, setDashboardView] = useState('sales'); // 'sales' or 'operations'

    // { onlineCount, posCount, total } — fetched from /api/sales/today/summary
    const [todaySummary, setTodaySummary] = useState(null);
    const [loadingCount, setLoadingCount] = useState(true);

    // Sales Return summary — fetched from /api/sales-returns/summary
    const [returnSummary, setReturnSummary] = useState(null);
    const [loadingReturn, setLoadingReturn] = useState(true);

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

            {/* View Switcher Pill Header */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 align-self-start" style={{ maxWidth: 'fit-content', border: '1px solid #e2e8f0', gap: '4px' }}>
                <button 
                    onClick={() => setDashboardView('sales')}
                    className={`btn btn-sm px-4 py-2 rounded-2 fw-semibold transition-all ${dashboardView === 'sales' ? 'text-white' : 'text-secondary'}`}
                    style={dashboardView === 'sales' ? { background: 'linear-gradient(135deg, #ff9b29, #ea580c)', border: 'none', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)' } : { border: 'none', background: 'transparent' }}
                >
                    Retail & Sales Overview
                </button>
                <button 
                    onClick={() => setDashboardView('operations')}
                    className={`btn btn-sm px-4 py-2 rounded-2 fw-semibold transition-all ${dashboardView === 'operations' ? 'text-white' : 'text-secondary'}`}
                    style={dashboardView === 'operations' ? { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' } : { border: 'none', background: 'transparent' }}
                >
                    Manufacturing & Operations ERP
                </button>
            </div>

            {dashboardView === 'sales' ? (
                <>
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
                                                : fmt((purchaseSummary?.totalAmount ?? 0) - (purchaseReturnSummary?.totalAmount ?? 0))}
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
                                        <h4 className="fw-bold fs-5 mb-1 text-dark">$8,458,758</h4>
                                        <p className="text-secondary small mb-0">Profit</p>
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
                                        <h4 className="fw-bold fs-5 mb-1 text-dark">$48,988,78</h4>
                                        <p className="text-secondary small mb-0">Income Use</p>
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
                                        <h4 className="fw-bold fs-5 mb-1 text-dark">$8,980,097</h4>
                                        <p className="text-secondary small mb-0">Total Expenses</p>
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
                                        <h4 className="fw-bold fs-5 mb-1 text-dark">$78,458,758</h4>
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
                                        <button className="btn btn-sm btn-light bg-white shadow-sm px-3">1D</button>
                                        <button className="btn btn-sm text-secondary px-3">1W</button>
                                        <button className="btn btn-sm text-secondary px-3">1M</button>
                                        <button className="btn btn-sm text-secondary px-3">3M</button>
                                        <button className="btn btn-sm text-secondary px-3">6M</button>
                                        <button className="btn btn-sm btn-warning text-white px-3 fw-medium" style={{backgroundColor: '#f97316', borderColor: '#f97316'}}>1Y</button>
                                    </div>
                                </div>
                                <div className="d-flex gap-4 mb-4">
                                    <div className="px-3 border-start border-3 border-secondary border-opacity-25 form-check">
                                        <span className="small text-muted d-block"><span className="text-warning">●</span> Total Purchase</span>
                                        <span className="fw-bold fs-5">3K</span>
                                    </div>
                                    <div className="px-3 border-start border-3 border-secondary border-opacity-25 form-check">
                                        <span className="small text-muted d-block"><span className="text-dark">●</span> Total Sales</span>
                                        <span className="fw-bold fs-5">1K</span>
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: 260 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={salesPurchaseData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <Tooltip cursor={{fill: 'transparent'}} />
                                            <Bar dataKey="purchase" stackId="a" fill="#fed7aa" radius={[0, 0, 4, 4]} />
                                            <Bar dataKey="sales" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 col-xl-4">
                            <div className="dash-card">
                                <h5 className="dash-title mb-4"><Info size={20} className="text-primary"/> Overall Information</h5>
                                <div className="row g-2 mb-4">
                                    <div className="col-4 text-center">
                                        <div className="bg-light-blue p-2 rounded-2 mb-2 d-inline-block"><Users size={16}/></div>
                                        <h6 className="fw-bold mb-0">6897</h6>
                                        <p className="small text-muted mb-0">Reception</p>
                                    </div>
                                    <div className="col-4 text-center">
                                        <div className="bg-light-orange p-2 rounded-2 mb-2 d-inline-block"><Users size={16}/></div>
                                        <h6 className="fw-bold mb-0">4895</h6>
                                        <p className="small text-muted mb-0">Customer</p>
                                    </div>
                                    <div className="col-4 text-center">
                                        <div className="bg-light-teal p-2 rounded-2 mb-2 d-inline-block"><ShoppingCart size={16}/></div>
                                        <h6 className="fw-bold mb-0">487</h6>
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
                                                <Pie data={customerOverviewData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                                                    {customerOverviewData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div>
                                        <div className="mb-3">
                                            <h4 className="fw-bold mb-0">5.5K</h4>
                                            <p className="small text-muted mb-1"><span className="text-orange fw-bold">●</span> Loss Time</p>
                                            <span className="pill-badge pill-green">+22%</span>
                                        </div>
                                        <div>
                                            <h4 className="fw-bold mb-0">3.5K</h4>
                                            <p className="small text-muted mb-1"><span className="text-dark fw-bold">●</span> Return</p>
                                            <span className="pill-badge pill-green">+10%</span>
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
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-light-orange"></div>
                                        <div><p className="item-title">Oculus Quest 2 VR Headset</p><p className="item-desc">$299.00 • <span className="text-primary">342 Sales</span></p></div>
                                    </div>
                                    <span className="pill-badge pill-green">+ 15%</span>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-dark"></div>
                                        <div><p className="item-title">Sony WF-1000XM4 P-Earbuds</p><p className="item-desc">$278.00 • <span className="text-primary">284 Sales</span></p></div>
                                    </div>
                                    <span className="pill-badge pill-green">+ 10%</span>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-success"></div>
                                        <div><p className="item-title">Apple AirPods 3</p><p className="item-desc">$400.00 • <span className="text-primary">200 Sales</span></p></div>
                                    </div>
                                    <span className="pill-badge pill-green">+ 10%</span>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-secondary"></div>
                                        <div><p className="item-title">Vacuum Cleaner</p><p className="item-desc">$199.00 • <span className="text-primary">150 Sales</span></p></div>
                                    </div>
                                    <span className="pill-badge pill-red">- 22%</span>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-primary"></div>
                                        <div><p className="item-title">Samsung Galaxy S22 Ultra</p><p className="item-desc">$899.00 • <span className="text-primary">100 Sales</span></p></div>
                                    </div>
                                    <span className="pill-badge pill-green">+ 08%</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dash-title mb-0"><Activity size={20} className="text-danger" color="#ef4444"/> Low Stock Products</h5>
                                    <button className="dash-select text-primary bg-light border-0 fw-semibold">View All &gt;</button>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-dark"></div>
                                        <div><p className="item-title">Dell XPS 13</p><p className="item-desc">ID : #01243A</p></div>
                                    </div>
                                    <div className="text-end"><p className="small text-muted mb-0">Stock</p><span className="text-danger fw-bold">10</span></div>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-primary"></div>
                                        <div><p className="item-title">Vacuum Cleaner Robot</p><p className="item-desc">ID : #53245B</p></div>
                                    </div>
                                    <div className="text-end"><p className="small text-muted mb-0">Stock</p><span className="text-danger fw-bold">14</span></div>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-warning"></div>
                                        <div><p className="item-title">Kitchenaid Stand Mixer</p><p className="item-desc">ID : #12245C</p></div>
                                    </div>
                                    <div className="text-end"><p className="small text-muted mb-0">Stock</p><span className="text-danger fw-bold">21</span></div>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-info"></div>
                                        <div><p className="item-title">Levi's Trucker Jacket</p><p className="item-desc">ID : #12445D</p></div>
                                    </div>
                                    <div className="text-end"><p className="small text-muted mb-0">Stock</p><span className="text-danger fw-bold">12</span></div>
                                </div>
                                <div className="dash-list-item">
                                    <div className="item-flex">
                                        <div className="item-img bg-danger"></div>
                                        <div><p className="item-title">Lay's Classic</p><p className="item-desc">ID : #33445E</p></div>
                                    </div>
                                    <div className="text-end"><p className="small text-muted mb-0">Stock</p><span className="text-danger fw-bold">13</span></div>
                                </div>
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
                </>
            ) : (
                /* ─── MANUFACTURING & OPERATIONS ERP VIEW ─── */
                <>
                    {/* Top Row: ERP KPI Cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff' }}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 fw-medium text-white-50 small">Total Production Today</p>
                                        <h3 className="mb-0 fw-bold">8,450 Units</h3>
                                        <h6 className="text-white-50 small mt-1">Target: 10,000 Units (84%)</h6>
                                    </div>
                                    <div className="icon-rounded-sm bg-white text-indigo">
                                        <Cpu size={18} color="#4f46e5" />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="pill-badge bg-white text-indigo small">+5.2% vs Yesterday</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card" style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff' }}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 fw-medium text-white-50 small">Active Production Orders</p>
                                        <h3 className="mb-0 fw-bold">12 Active</h3>
                                        <h6 className="text-white-50 small mt-1">4 Pending • 8 In-Progress</h6>
                                    </div>
                                    <div className="icon-rounded-sm bg-white text-sky">
                                        <Clock size={18} color="#0ea5e9" />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="pill-badge bg-white text-sky small">All Shift Scheduled</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff' }}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 fw-medium text-white-50 small">Production Efficiency</p>
                                        <h3 className="mb-0 fw-bold">94.2%</h3>
                                        <h6 className="text-white-50 small mt-1">OEE Target: 92.0%</h6>
                                    </div>
                                    <div className="icon-rounded-sm bg-white text-emerald">
                                        <Activity size={18} color="#10b981" />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="pill-badge bg-white text-emerald small"><ArrowUpRight size={12}/> Premium</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="dash-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff' }}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 fw-medium text-white-50 small">Active Machines Status</p>
                                        <h3 className="mb-0 fw-bold">14 / 16 Online</h3>
                                        <h6 className="text-white-50 small mt-1">1 Idle • 1 Maintenance</h6>
                                    </div>
                                    <div className="icon-rounded-sm bg-white text-amber">
                                        <Cpu size={18} color="#d97706" />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="pill-badge bg-white text-amber small">OEE Optimized</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Live Activity & Analytics */}
                    <div className="row g-3 mb-4">
                        {/* Weekly Efficiency & Production Volume Chart */}
                        <div className="col-12 col-xl-8">
                            <div className="dash-card">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="dash-title mb-0"><Activity size={20} className="text-indigo" color="#6366f1"/> Weekly ERP Output & Efficiency</h5>
                                    <span className="badge bg-indigo-subtle text-indigo px-3 py-2 rounded-pill small" style={{background: '#eff6ff', color: '#4f46e5'}}>OEE Tracker</span>
                                </div>
                                <div style={{ width: '100%', height: 280 }}>
                                    <ResponsiveContainer>
                                        <BarChart 
                                            data={[
                                                { name: 'Mon', output: 7800, efficiency: 91 },
                                                { name: 'Tue', output: 8200, efficiency: 93 },
                                                { name: 'Wed', output: 8500, efficiency: 95 },
                                                { name: 'Thu', output: 8900, efficiency: 94 },
                                                { name: 'Fri', output: 8400, efficiency: 92 },
                                                { name: 'Sat', output: 7200, efficiency: 89 },
                                                { name: 'Sun', output: 6500, efficiency: 90 },
                                            ]}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                            barSize={16}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <Tooltip />
                                            <Bar dataKey="output" fill="#a5b4fc" radius={[4, 4, 0, 0]} name="Units Produced" />
                                            <Bar dataKey="efficiency" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Efficiency %" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Live Machine Telemetry Grid */}
                        <div className="col-12 col-xl-4">
                            <div className="dash-card">
                                <h5 className="dash-title mb-4"><Cpu size={20} className="text-indigo" color="#6366f1" /> Live Machine Status</h5>
                                <div className="d-flex flex-column gap-3">
                                    <div className="p-3 border rounded-3 bg-light-subtle d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 fw-bold text-dark">Injection Molding A</h6>
                                            <span className="small text-muted">Aisle 2 • Plastic Chairs</span>
                                        </div>
                                        <span className="badge bg-success text-white py-1 px-3 rounded-pill small">Running</span>
                                    </div>
                                    <div className="p-3 border rounded-3 bg-light-subtle d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 fw-bold text-dark">CNC Extruder B</h6>
                                            <span className="small text-muted">Aisle 1 • Raw Resin</span>
                                        </div>
                                        <span className="badge bg-success text-white py-1 px-3 rounded-pill small">Running</span>
                                    </div>
                                    <div className="p-3 border rounded-3 bg-light-subtle d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 fw-bold text-dark">Assembly Robot C</h6>
                                            <span className="small text-muted">Aisle 3 • Packaging</span>
                                        </div>
                                        <span className="badge bg-warning text-dark py-1 px-3 rounded-pill small">Idle</span>
                                    </div>
                                    <div className="p-3 border rounded-3 bg-light-subtle d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 fw-bold text-dark">Hydraulic Press D</h6>
                                            <span className="small text-muted">Aisle 2 • Metal Frames</span>
                                        </div>
                                        <span className="badge bg-danger text-white py-1 px-3 rounded-pill small">Offline</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Stock Alerts & Deliveries */}
                    <div className="row g-3 mb-4">
                        {/* Stock Alerts Panel */}
                        <div className="col-12 col-xl-6">
                            <div className="dash-card h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dash-title mb-0"><AlertTriangle size={20} className="text-danger" color="#ef4444"/> Critical Stock Alerts</h5>
                                    <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded small">4 Actions Required</span>
                                </div>
                                <div className="d-flex flex-column gap-2 mt-3">
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                        <div>
                                            <p className="mb-0 fw-semibold text-dark">Polypropylene Raw Resin</p>
                                            <span className="small text-muted">Category: Raw Materials</span>
                                        </div>
                                        <div className="text-end">
                                            <span className="text-danger fw-bold d-block">120 kg left</span>
                                            <span className="small text-muted">Reorder Min: 500 kg</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                        <div>
                                            <p className="mb-0 fw-semibold text-dark">Red Colorant additive</p>
                                            <span className="small text-muted">Category: Chemical Agents</span>
                                        </div>
                                        <div className="text-end">
                                            <span className="text-danger fw-bold d-block">5 kg left</span>
                                            <span className="small text-muted">Reorder Min: 50 kg</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                        <div>
                                            <p className="mb-0 fw-semibold text-dark">Cardboard Packaging Box L</p>
                                            <span className="small text-muted">Category: Packaging</span>
                                        </div>
                                        <div className="text-end">
                                            <span className="text-warning fw-bold d-block">42 Units left</span>
                                            <span className="small text-muted">Reorder Min: 200 Units</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="mb-0 fw-semibold text-dark">Color Chemical Additive</p>
                                            <span className="small text-muted">Category: Chemical Agents</span>
                                        </div>
                                        <div className="text-end">
                                            <span className="text-danger fw-bold d-block">2 Liters left</span>
                                            <span className="small text-muted">Reorder Min: 20 Liters</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Deliveries & Shipments Panel */}
                        <div className="col-12 col-xl-6">
                            <div className="dash-card h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dash-title mb-0"><Truck size={20} className="text-indigo" color="#4338ca"/> Pending ERP Deliveries</h5>
                                    <span className="badge bg-indigo-subtle text-indigo px-2.5 py-1 rounded small">3 Shipments In-Transit</span>
                                </div>
                                <div className="d-flex flex-column gap-3 mt-3">
                                    <div className="d-flex align-items-center gap-3 border-bottom pb-2">
                                        <div className="p-2 bg-warning-subtle text-warning rounded" style={{background: '#fff7ed', color: '#ea580c'}}>
                                            <Clock size={16} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 fw-semibold text-dark">Plastic Chairs Wholesale Order</p>
                                            <span className="small text-muted">Client: Somesh Distributors Ltd • Qty: 400</span>
                                        </div>
                                        <span className="badge bg-warning text-dark px-2.5 py-1 rounded-pill small">In-Assembly</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 border-bottom pb-2">
                                        <div className="p-2 bg-indigo-subtle text-indigo rounded" style={{background: '#eff6ff', color: '#4f46e5'}}>
                                            <Truck size={16} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 fw-semibold text-dark">Steel Frame Bench Dispatch</p>
                                            <span className="small text-muted">Client: Maharashtra Education Society • Qty: 50</span>
                                        </div>
                                        <span className="badge bg-info text-white px-2.5 py-1 rounded-pill small">In-Transit</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 bg-success-subtle text-success rounded" style={{background: '#ecfdf5', color: '#10b981'}}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="mb-0 fw-semibold text-dark">Premium Office Chairs Delivery</p>
                                            <span className="small text-muted">Client: Apex Co-Working Spaces • Qty: 150</span>
                                        </div>
                                        <span className="badge bg-success text-white px-2.5 py-1 rounded-pill small">Delivered</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
