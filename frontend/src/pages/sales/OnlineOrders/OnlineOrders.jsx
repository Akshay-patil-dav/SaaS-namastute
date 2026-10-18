import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useConfirm } from '../../../context/ConfirmContext';
import {
    Search, FileText, Download, RotateCcw,
    ChevronUp, Plus, ChevronLeft, ChevronRight,
    Eye, Edit, Trash2, AlertCircle, Receipt,
    X, LayoutGrid, List, Calendar, User, DollarSign,
    CheckCircle2, Clock, Filter, ArrowUpRight
} from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import './online-orders.css';
import '../../inventory/Brands/inventory-pages-custom.css';
import AddSalesModal    from '../../../components/modals/sales/AddSalesModal/AddSalesModal';
import EditSalesModal   from '../../../components/modals/sales/EditSalesModal/EditSalesModal';
import ViewSalesModal   from '../../../components/modals/sales/ViewSalesModal/ViewSalesModal';
import DeleteConfirmModal from '../../../components/modals/common/DeleteConfirmModal/DeleteConfirmModal';
import InvoiceModal     from '../../../components/modals/sales/InvoiceModal/InvoiceModal';
import { useCurrency } from '../../../hooks/useCurrency';

const BASE_URL    = ENV.API_BASE_URL;
const ROWS_OPTIONS = [10, 25, 50];
const STATUSES    = ['Completed', 'Pending', 'Cancelled'];
const PAYMENTS    = ['Paid', 'Unpaid', 'Overdue'];

export default function OnlineOrders() {
    const { currencySymbol } = useCurrency();
    const { confirm } = useConfirm();

    /* ── Responsive detection ────────────────────────────── */
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
    const [mobileViewMode, setMobileViewMode] = useState('cards'); // 'cards' | 'table'
    const [showFiltersTray, setShowFiltersTray] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* ── data ────────────────────────────────────────────── */
    const [orders,     setOrders]     = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [fetchError, setFetchError] = useState('');

    /* ── filters ─────────────────────────────────────────── */
    const [searchTerm,          setSearchTerm]          = useState('');
    const [filterStatus,        setFilterStatus]        = useState('');
    const [filterPayment,       setFilterPayment]       = useState('');
    const [filterCustomer,      setFilterCustomer]      = useState('');
    const [activeQuickFilter,   setActiveQuickFilter]   = useState('ALL');

    /* ── table ───────────────────────────────────────────── */
    const [selectedRows, setSelectedRows]   = useState([]);
    const [rowsPerPage,  setRowsPerPage]    = useState(10);
    const [currentPage,  setCurrentPage]    = useState(1);

    /* ── modals ──────────────────────────────────────────── */
    const [addOpen,      setAddOpen]      = useState(false);
    const [editOpen,     setEditOpen]     = useState(false);
    const [viewOpen,     setViewOpen]     = useState(false);
    const [deleteOpen,   setDeleteOpen]   = useState(false);
    const [invoiceOpen,  setInvoiceOpen]  = useState(false);
    const [activeOrder,  setActiveOrder]  = useState(null);
    const [deleting,     setDeleting]     = useState(false);

    /* ── fetch ───────────────────────────────────────────── */
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setFetchError('');
        try {
            const res = await apiClient.get(`${BASE_URL}/sales`);
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch {
            setFetchError('Could not load sales orders. Check backend is running.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    /* ── filter / paginate ───────────────────────────────── */
    const filtered = useMemo(() => {
        return orders.filter(o => {
            const q = searchTerm.toLowerCase().trim();
            if (q && !(
                (o.customerName  || '').toLowerCase().includes(q) ||
                (o.referenceNo   || '').toLowerCase().includes(q) ||
                (o.status        || '').toLowerCase().includes(q) ||
                (o.paymentStatus || '').toLowerCase().includes(q) ||
                (o.biller        || '').toLowerCase().includes(q)
            )) return false;
            if (filterStatus   && o.status        !== filterStatus)   return false;
            if (filterPayment  && o.paymentStatus !== filterPayment)  return false;
            if (filterCustomer && o.customerName  !== filterCustomer) return false;
            return true;
        });
    }, [orders, searchTerm, filterStatus, filterPayment, filterCustomer]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const page       = Math.min(currentPage, totalPages);
    const rows       = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const resetPage  = () => setCurrentPage(1);

    /* ── KPI metrics for mobile ──────────────────────────── */
    const stats = useMemo(() => {
        let rev = 0;
        let due = 0;
        let completed = 0;
        let pending = 0;
        let cancelled = 0;
        let paid = 0;
        let unpaid = 0;

        orders.forEach(o => {
            rev += parseFloat(o.grandTotal) || 0;
            due += parseFloat(o.dueAmount) || 0;
            if (o.status === 'Completed') completed++;
            else if (o.status === 'Pending') pending++;
            else if (o.status === 'Cancelled') cancelled++;

            if (o.paymentStatus === 'Paid') paid++;
            else unpaid++;
        });

        return {
            total: orders.length,
            revenue: rev,
            due,
            completed,
            pending,
            cancelled,
            paid,
            unpaid,
        };
    }, [orders]);

    /* ── Quick Filter Pill Handler ───────────────────────── */
    const handleQuickFilter = (type) => {
        setActiveQuickFilter(type);
        resetPage();
        if (type === 'ALL') {
            setFilterStatus('');
            setFilterPayment('');
        } else if (type === 'Completed' || type === 'Pending' || type === 'Cancelled') {
            setFilterStatus(type);
            setFilterPayment('');
        } else if (type === 'Paid' || type === 'Unpaid' || type === 'Overdue') {
            setFilterPayment(type);
            setFilterStatus('');
        }
    };

    /* ── selection ───────────────────────────────────────── */
    const toggleRow = id =>
        setSelectedRows(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id]);
    const toggleAll = () =>
        setSelectedRows(p => p.length === rows.length ? [] : rows.map(r => r.id));

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Sales Orders',
            message: `Are you sure you want to delete ${selectedRows.length} sales orders? This cannot be undone.`
        });
        if (!isConfirmed) return;

        try {
            await apiClient.post(`${BASE_URL}/sales/delete-bulk`, { ids: selectedRows });
            setSelectedRows([]);
            fetchOrders();
        } catch (err) {
            console.error('Failed to delete sales orders:', err);
            alert('Failed to delete sales orders.');
        }
    };

    /* ── unique dropdown options ─────────────────────────── */
    const customers = [...new Set(orders.map(o => o.customerName).filter(Boolean))];

    /* ── modal helpers ───────────────────────────────────── */
    const openView    = o => { setActiveOrder(o); setViewOpen(true);    };
    const openEdit    = o => { setActiveOrder(o); setEditOpen(true);    };
    const openDelete  = o => { setActiveOrder(o); setDeleteOpen(true);  };
    const openInvoice = o => { setActiveOrder(o); setInvoiceOpen(true); };
    const closeAll    = () => {
        setViewOpen(false); setEditOpen(false); setDeleteOpen(false); setInvoiceOpen(false);
        setActiveOrder(null);
    };

    const confirmDelete = async () => {
        if (!activeOrder) return;
        setDeleting(true);
        try {
            await apiClient.delete(`${BASE_URL}/sales/${activeOrder.id}`);
            setDeleteOpen(false);
            setActiveOrder(null);
            fetchOrders();
        } finally {
            setDeleting(false);
        }
    };

    /* ── export CSV ──────────────────────────────────────── */
    const exportCSV = () => {
        const header = ['Reference','Customer','Date','Status','Grand Total','Paid','Due','Payment Status','Biller'];
        const body   = filtered.map(o => [
            o.referenceNo, o.customerName, o.formattedDate || o.date,
            o.status, o.grandTotal, o.paidAmount, o.dueAmount, o.paymentStatus, o.biller
        ]);
        const csv  = [header, ...body].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
        const link = Object.assign(document.createElement('a'), {
            href:     URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
            download: 'sales_orders.csv',
        });
        link.click();
    };

    /* ── helpers ─────────────────────────────────────────── */
    const money = v => {
        const n = parseFloat(v);
        return isNaN(n) ? `${currencySymbol}0.00` : `${currencySymbol}${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const avatarSrc = name =>
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'U')}&backgroundColor=fed7aa&textColor=ea580c&fontSize=42`;

    const statusClass = s => s === 'Completed' ? 'oo-badge-completed' : s === 'Cancelled' ? 'oo-badge-cancelled' : 'oo-badge-pending';
    const paymentClass = p => p === 'Paid' ? 'oo-pay-badge-paid' : p === 'Overdue' ? 'oo-pay-badge-overdue' : 'oo-pay-badge-unpaid';

    /* ── page number list (smart ellipsis) ───────────────── */
    const pageList = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
            acc.push(p);
            return acc;
        }, []);

    /* ─────────────────────────────────────────────────────── */
    return (
        <div className="online-orders-container">

            {/* Header */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Online Orders</h2>
                    <p className="ss-page-subtitle">Track, manage &amp; process your sales orders</p>
                </div>
                <div className="ss-header-actions">
                    <button
                        className="ss-btn-icon-square"
                        style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }}
                        title="Print"
                        onClick={() => window.print()}
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        className="ss-btn-icon-square"
                        style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }}
                        title="Export CSV"
                        onClick={exportCSV}
                    >
                        <Download size={16} />
                    </button>
                    <button
                        className="ss-btn-icon-square"
                        title="Refresh"
                        onClick={fetchOrders}
                    >
                        <RotateCcw size={16} />
                    </button>
                    {selectedRows.length > 0 && !isMobile && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedRows.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" onClick={() => setAddOpen(true)}>
                        <Plus size={16} /> Add Sale
                    </button>
                </div>
            </div>

            {/* Mobile Metrics Ribbon */}
            {isMobile && !loading && (
                <div className="oo-mobile-stats-scroll">
                    <div
                        className={`oo-stat-pill ${activeQuickFilter === 'ALL' ? 'active' : ''}`}
                        onClick={() => handleQuickFilter('ALL')}
                    >
                        <span className="oo-stat-pill-label">Total Orders</span>
                        <span className="oo-stat-pill-val">{stats.total}</span>
                    </div>

                    <div className="oo-stat-pill">
                        <span className="oo-stat-pill-label">Revenue</span>
                        <span className="oo-stat-pill-val revenue">{money(stats.revenue)}</span>
                    </div>

                    <div
                        className={`oo-stat-pill ${activeQuickFilter === 'Pending' ? 'active' : ''}`}
                        onClick={() => handleQuickFilter('Pending')}
                    >
                        <span className="oo-stat-pill-label">Pending</span>
                        <span className="oo-stat-pill-val pending">{stats.pending}</span>
                    </div>

                    <div
                        className={`oo-stat-pill ${activeQuickFilter === 'Completed' ? 'active' : ''}`}
                        onClick={() => handleQuickFilter('Completed')}
                    >
                        <span className="oo-stat-pill-label">Completed</span>
                        <span className="oo-stat-pill-val">{stats.completed}</span>
                    </div>

                    <div
                        className={`oo-stat-pill ${activeQuickFilter === 'Unpaid' ? 'active' : ''}`}
                        onClick={() => handleQuickFilter('Unpaid')}
                    >
                        <span className="oo-stat-pill-label">Due Amount</span>
                        <span className="oo-stat-pill-val due">{money(stats.due)}</span>
                    </div>
                </div>
            )}

            {/* Main Panel */}
            <div className="ss-main-panel">

                {/* Mobile Search & View Switcher Bar */}
                {isMobile ? (
                    <div style={{ padding: '12px 14px 6px 14px' }}>
                        <div className="oo-mobile-search-bar">
                            <div className="oo-search-box">
                                <Search size={16} className="oo-search-box-icon" />
                                <input
                                    type="text"
                                    className="oo-search-box-input"
                                    placeholder="Search customer, ref, status…"
                                    value={searchTerm}
                                    onChange={e => { setSearchTerm(e.target.value); resetPage(); }}
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="oo-search-clear-btn"
                                        onClick={() => { setSearchTerm(''); resetPage(); }}
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                className="ss-btn-icon-square"
                                style={{ background: showFiltersTray ? '#fff7ed' : '#fff', borderColor: showFiltersTray ? '#ff9b29' : '#cbd5e1', color: showFiltersTray ? '#ff9b29' : '#64748b' }}
                                title="Filters"
                                onClick={() => setShowFiltersTray(!showFiltersTray)}
                            >
                                <Filter size={16} />
                            </button>

                            <div className="oo-view-toggle-group">
                                <button
                                    type="button"
                                    className={`oo-view-toggle-btn ${mobileViewMode === 'cards' ? 'active' : ''}`}
                                    title="Card View"
                                    onClick={() => setMobileViewMode('cards')}
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button
                                    type="button"
                                    className={`oo-view-toggle-btn ${mobileViewMode === 'table' ? 'active' : ''}`}
                                    title="Table View"
                                    onClick={() => setMobileViewMode('table')}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Status Filter Pills */}
                        <div className="oo-quick-filters-bar">
                            <button
                                type="button"
                                className={`oo-qfilter-chip ${activeQuickFilter === 'ALL' ? 'active' : ''}`}
                                onClick={() => handleQuickFilter('ALL')}
                            >
                                All Orders <span className="oo-chip-count">{stats.total}</span>
                            </button>
                            <button
                                type="button"
                                className={`oo-qfilter-chip ${activeQuickFilter === 'Completed' ? 'active' : ''}`}
                                onClick={() => handleQuickFilter('Completed')}
                            >
                                Completed <span className="oo-chip-count">{stats.completed}</span>
                            </button>
                            <button
                                type="button"
                                className={`oo-qfilter-chip ${activeQuickFilter === 'Pending' ? 'active' : ''}`}
                                onClick={() => handleQuickFilter('Pending')}
                            >
                                Pending <span className="oo-chip-count">{stats.pending}</span>
                            </button>
                            <button
                                type="button"
                                className={`oo-qfilter-chip ${activeQuickFilter === 'Paid' ? 'active' : ''}`}
                                onClick={() => handleQuickFilter('Paid')}
                            >
                                Paid <span className="oo-chip-count">{stats.paid}</span>
                            </button>
                            <button
                                type="button"
                                className={`oo-qfilter-chip ${activeQuickFilter === 'Unpaid' ? 'active' : ''}`}
                                onClick={() => handleQuickFilter('Unpaid')}
                            >
                                Unpaid / Due
                            </button>
                            <button
                                type="button"
                                className={`oo-qfilter-chip ${activeQuickFilter === 'Cancelled' ? 'active' : ''}`}
                                onClick={() => handleQuickFilter('Cancelled')}
                            >
                                Cancelled
                            </button>
                        </div>

                        {/* Collapsible Dropdown Filters */}
                        {showFiltersTray && (
                            <div className="oo-mobile-dropdowns-row">
                                <select
                                    className="oo-mobile-select"
                                    value={filterCustomer}
                                    onChange={e => { setFilterCustomer(e.target.value); resetPage(); }}
                                >
                                    <option value="">All Customers</option>
                                    {customers.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>

                                <select
                                    className="oo-mobile-select"
                                    value={filterStatus}
                                    onChange={e => { setFilterStatus(e.target.value); setActiveQuickFilter(''); resetPage(); }}
                                >
                                    <option value="">All Statuses</option>
                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>

                                <select
                                    className="oo-mobile-select"
                                    value={filterPayment}
                                    onChange={e => { setFilterPayment(e.target.value); setActiveQuickFilter(''); resetPage(); }}
                                >
                                    <option value="">All Payments</option>
                                    {PAYMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Desktop Filter Bar */
                    <div className="ss-table-controls">
                        <div className="ss-search-wrap">
                            <Search size={16} />
                            <input
                                type="text"
                                className="ss-search-input"
                                placeholder="Search customer, ref, status…"
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); resetPage(); }}
                            />
                        </div>

                        <div className="ss-filters-wrap">
                            <select
                                className="ss-filter-select"
                                value={filterCustomer}
                                onChange={e => { setFilterCustomer(e.target.value); resetPage(); }}
                            >
                                <option value="">All Customers</option>
                                {customers.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select
                                className="ss-filter-select"
                                value={filterStatus}
                                onChange={e => { setFilterStatus(e.target.value); resetPage(); }}
                            >
                                <option value="">All Statuses</option>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>

                            <select
                                className="ss-filter-select"
                                value={filterPayment}
                                onChange={e => { setFilterPayment(e.target.value); resetPage(); }}
                            >
                                <option value="">All Payments</option>
                                {PAYMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="oo-state-row">
                        <div className="oo-spinner" />
                        <span>Loading sales orders…</span>
                    </div>
                )}

                {/* Error State */}
                {!loading && fetchError && (
                    <div className="oo-state-row oo-error">
                        <AlertCircle size={16} />
                        <span>{fetchError}</span>
                        <button className="oo-retry-btn" onClick={fetchOrders}>Retry</button>
                    </div>
                )}

                {/* ── Content View ── */}
                {!loading && !fetchError && (
                    <>
                        {/* Mobile Cards Mode (Active when isMobile && mobileViewMode === 'cards') */}
                        {isMobile && mobileViewMode === 'cards' ? (
                            <div className="oo-mobile-cards-wrap" style={{ padding: '0 12px' }}>
                                {rows.length > 0 ? (
                                    rows.map(item => {
                                        const isSelected = selectedRows.includes(item.id);
                                        const isPaidOnWeb = item.paymentStatus === 'Paid';
                                        const dueAmt = parseFloat(item.dueAmount) || 0;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`oo-mobile-card ${isSelected ? 'selected' : ''}`}
                                            >
                                                {/* Header */}
                                                <div className="oo-mc-header">
                                                    <div className="oo-mc-cust-info">
                                                        <input
                                                            type="checkbox"
                                                            className="oo-mc-cb"
                                                            checked={isSelected}
                                                            onChange={() => toggleRow(item.id)}
                                                        />
                                                        <img
                                                            src={avatarSrc(item.customerName)}
                                                            alt=""
                                                            className="oo-mc-avatar"
                                                        />
                                                        <div className="oo-mc-name-col">
                                                            <span className="oo-mc-name">
                                                                {item.customerName || 'Walk-in Customer'}
                                                            </span>
                                                            {item.userId && (
                                                                <span className="oo-mc-subtext">
                                                                    ID: {item.userId}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <span className={`ss-status-badge ${statusClass(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </div>

                                                {/* Meta Row: Ref & Date */}
                                                <div className="oo-mc-meta-row">
                                                    <span className="oo-mc-ref-badge">
                                                        {item.referenceNo}
                                                    </span>
                                                    <span className="oo-mc-date">
                                                        <Calendar size={12} />
                                                        {item.formattedDate || item.date || '—'}
                                                    </span>
                                                    <span className="oo-mc-biller">
                                                        {item.biller || 'Admin'}
                                                    </span>
                                                </div>

                                                {/* Financial Breakdown */}
                                                <div className="oo-mc-fin-grid">
                                                    <div className="oo-mc-fin-cell">
                                                        <span className="oo-mc-fin-label">Grand Total</span>
                                                        <span className="oo-mc-fin-val total">{money(item.grandTotal)}</span>
                                                    </div>
                                                    <div className="oo-mc-fin-cell">
                                                        <span className="oo-mc-fin-label">Paid</span>
                                                        <span className="oo-mc-fin-val">{money(item.paidAmount)}</span>
                                                    </div>
                                                    <div className="oo-mc-fin-cell">
                                                        <span className="oo-mc-fin-label">Due</span>
                                                        <span className={`oo-mc-fin-val ${dueAmt > 0 ? 'due-pos' : 'due-zero'}`}>
                                                            {money(item.dueAmount)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Payment Status row */}
                                                <div className="oo-mc-pay-row">
                                                    <span style={{ color: '#64748b' }}>Payment:</span>
                                                    {isPaidOnWeb ? (
                                                        <span style={{
                                                            color: '#059669',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            backgroundColor: '#d1fae5',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px'
                                                        }}>
                                                            Paid by him on website
                                                        </span>
                                                    ) : (
                                                        <span className={`ss-status-badge ${item.paymentStatus === 'Paid' ? 'ss-status-active' : item.paymentStatus === 'Overdue' ? 'ss-status-inactive' : 'ss-status-pending'}`}>
                                                            {item.paymentStatus}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Actions Row */}
                                                <div className="oo-mc-actions">
                                                    <button
                                                        type="button"
                                                        className="oo-mc-btn invoice"
                                                        onClick={() => openInvoice(item)}
                                                        title="Invoice"
                                                    >
                                                        <Receipt size={14} /> Invoice
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="oo-mc-btn view"
                                                        onClick={() => openView(item)}
                                                        title="View"
                                                    >
                                                        <Eye size={14} /> View
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="oo-mc-btn edit"
                                                        onClick={() => openEdit(item)}
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="oo-mc-btn delete"
                                                        onClick={() => openDelete(item)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="oo-empty-cell">
                                        <div className="oo-empty-inner">
                                            <FileText size={40} />
                                            <span>
                                                {(searchTerm || filterStatus || filterPayment || filterCustomer)
                                                    ? 'No sales orders match your filters.'
                                                    : 'No sales orders yet. Tap "Add Sale" to create one.'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Table Mode (Standard Desktop Table or Mobile Switch to Table) */
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th className="ss-cb-col" style={{ width: '40px' }}>
                                                <input
                                                    type="checkbox"
                                                    className="ss-checkbox"
                                                    checked={rows.length > 0 && selectedRows.length === rows.length}
                                                    onChange={toggleAll}
                                                />
                                            </th>
                                            <th>Customer</th>
                                            <th>Reference</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Grand Total</th>
                                            <th>Paid</th>
                                            <th>Due</th>
                                            <th>Payment</th>
                                            <th>Biller</th>
                                            <th style={{ textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.length > 0 ? rows.map(item => (
                                            <tr key={item.id} className={selectedRows.includes(item.id) ? 'row-selected' : ''}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="ss-checkbox"
                                                        checked={selectedRows.includes(item.id)}
                                                        onChange={() => toggleRow(item.id)}
                                                    />
                                                </td>

                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <img
                                                            src={avatarSrc(item.customerName)}
                                                            alt=""
                                                            style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span className="ss-item-name">{item.customerName || '—'}</span>
                                                            {item.userId && (
                                                                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'normal', marginTop: '2px' }}>
                                                                    UI ID: {item.userId}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td><span className="ss-code-badge">{item.referenceNo}</span></td>

                                                <td>{item.formattedDate || item.date || '—'}</td>

                                                <td>
                                                    <span className={`ss-status-badge ${statusClass(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>

                                                <td style={{ fontWeight: '600' }}>{money(item.grandTotal)}</td>
                                                <td>{money(item.paidAmount)}</td>

                                                <td style={{ color: parseFloat(item.dueAmount) > 0 ? '#ea5455' : '#28c76f', fontWeight: '500' }}>
                                                    {money(item.dueAmount)}
                                                </td>

                                                <td>
                                                    {item.paymentStatus === 'Paid' ? (
                                                        <span style={{ color: '#059669', fontSize: '11px', fontWeight: '600', backgroundColor: '#d1fae5', padding: '3px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                                            Paid by him on website
                                                        </span>
                                                    ) : (
                                                        <span className={`ss-status-badge ${item.paymentStatus === 'Paid' ? 'ss-status-active' : item.paymentStatus === 'Overdue' ? 'ss-status-inactive' : 'ss-status-pending'}`}>
                                                            {item.paymentStatus}
                                                        </span>
                                                    )}
                                                </td>

                                                <td>{item.biller || 'Admin'}</td>

                                                <td>
                                                    <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                        <button className="ss-action-btn view" title="View Detail" onClick={() => openView(item)}><Eye size={14} /></button>
                                                        <button className="ss-action-btn edit" style={{ background: '#f8f9fa', color: '#5b6670' }} title="View Invoice" onClick={() => openInvoice(item)}><Receipt size={14} /></button>
                                                        <button className="ss-action-btn edit" title="Edit" onClick={() => openEdit(item)}><Edit size={14} /></button>
                                                        <button className="ss-action-btn delete" title="Delete" onClick={() => openDelete(item)}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="11" className="oo-empty-cell">
                                                    <div className="oo-empty-inner">
                                                        <FileText size={40} />
                                                        <span>
                                                            {(searchTerm || filterStatus || filterPayment || filterCustomer)
                                                                ? 'No orders match your filters.'
                                                                : 'No sales yet. Click "Add Sale" to create one.'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                {!loading && !fetchError && filtered.length > 0 && (
                    <div className="ss-pagination-row">
                        <div className="ss-page-size">
                            <span>Rows per page</span>
                            <select
                                value={rowsPerPage}
                                onChange={e => { setRowsPerPage(Number(e.target.value)); resetPage(); }}
                            >
                                {ROWS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <span style={{ fontSize: '13px', color: '#5b6670', marginLeft: '10px' }}>
                                {Math.min((page - 1) * rowsPerPage + 1, filtered.length)}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length}
                            </span>
                        </div>

                        <div className="ss-page-controls">
                            <button className="ss-page-btn" disabled={page === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                <ChevronLeft size={16} />
                            </button>
                            {pageList.map((p, i) =>
                                p === '…'
                                    ? <span key={`e${i}`} className="ss-page-btn" style={{ cursor: 'default' }}>…</span>
                                    : <button
                                          key={p}
                                          className={`ss-page-btn ${p === page ? 'active' : ''}`}
                                          onClick={() => setCurrentPage(p)}
                                      >
                                          {p}
                                      </button>
                            )}
                            <button className="ss-page-btn" disabled={page === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Bulk Action Bar */}
            {isMobile && selectedRows.length > 0 && (
                <div className="oo-mobile-bulk-bar">
                    <div className="oo-bulk-info">
                        <span className="oo-bulk-count">{selectedRows.length}</span>
                        <span>selected</span>
                    </div>
                    <div className="oo-bulk-actions">
                        <button
                            type="button"
                            className="oo-bulk-btn-clear"
                            onClick={() => setSelectedRows([])}
                        >
                            Deselect All
                        </button>
                        <button
                            type="button"
                            className="oo-bulk-btn-delete"
                            onClick={handleBulkDelete}
                        >
                            <Trash2 size={14} /> Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="oo-footer">
                <div>2014 - 2026 © Samrajya Software. All Rights Reserved</div>
                <div>Designed &amp; Developed by <span>Samrajya Software</span></div>
            </footer>

            {/* ── Modals ────────────────────────────────────── */}
            <AddSalesModal
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                onSuccess={() => { fetchOrders(); resetPage(); }}
            />

            <EditSalesModal
                isOpen={editOpen}
                order={activeOrder}
                onClose={closeAll}
                onSuccess={fetchOrders}
            />

            <ViewSalesModal
                isOpen={viewOpen}
                order={activeOrder}
                onClose={closeAll}
            />

            <DeleteConfirmModal
                isOpen={deleteOpen}
                onClose={closeAll}
                onConfirm={confirmDelete}
                title="Delete Sale"
                message={`Delete sale ${activeOrder?.referenceNo} for ${activeOrder?.customerName}? This cannot be undone.`}
                isDeleting={deleting}
            />

            <InvoiceModal
                isOpen={invoiceOpen}
                order={activeOrder}
                onClose={closeAll}
                orderType="ONLINE"
            />
        </div>
    );
}
