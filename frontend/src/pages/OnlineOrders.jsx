import React, { useState, useEffect, useCallback } from 'react';
import { useConfirm } from '../context/ConfirmContext';
import {
    Search, FileText, Download, RotateCcw,
    ChevronUp, Plus, ChevronLeft, ChevronRight,
    Eye, Edit, Trash2, AlertCircle, Receipt,
} from 'lucide-react';
import axios from 'axios';
import './online-orders.css';
import './inventory-pages-custom.css';
import AddSalesModal    from '../components/AddSalesModal';
import EditSalesModal   from '../components/EditSalesModal';
import ViewSalesModal   from '../components/ViewSalesModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import InvoiceModal     from '../components/InvoiceModal';

const BASE_URL    = import.meta.env.VITE_API_BASE_URL;
const ROWS_OPTIONS = [10, 25, 50];
const STATUSES    = ['Completed', 'Pending', 'Cancelled'];
const PAYMENTS    = ['Paid', 'Unpaid', 'Overdue'];

export default function OnlineOrders() {
    const { confirm } = useConfirm();

    /* ── data ────────────────────────────────────────────── */
    const [orders,     setOrders]     = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [fetchError, setFetchError] = useState('');

    /* ── filters ─────────────────────────────────────────── */
    const [searchTerm,      setSearchTerm]      = useState('');
    const [filterStatus,    setFilterStatus]    = useState('');
    const [filterPayment,   setFilterPayment]   = useState('');
    const [filterCustomer,  setFilterCustomer]  = useState('');

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
            const res = await axios.get(`${BASE_URL}/sales`);
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch {
            setFetchError('Could not load sales orders. Check backend is running.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    /* ── filter / paginate ───────────────────────────────── */
    const filtered = orders.filter(o => {
        const q = searchTerm.toLowerCase();
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

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const page       = Math.min(currentPage, totalPages);
    const rows       = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const resetPage  = () => setCurrentPage(1);

    /* ── selection ───────────────────────────────────────── */
    const toggleRow = id =>
        setSelectedRows(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id]);
    const toggleAll = () =>
        setSelectedRows(p => p.length === rows.length ? [] : rows.map(r => r.id));

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Sales Orders',
            message: `Are you sure you want to delete ${selectedRows.length} sales orders?`
        });
        if (!isConfirmed) return;
        
        try {
            await axios.post(`${BASE_URL}/sales/delete-bulk`, { ids: selectedRows });
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
            await axios.delete(`${BASE_URL}/sales/${activeOrder.id}`);
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
    const money = v => { const n = parseFloat(v); return isNaN(n) ? '$0.00' : `$${n.toFixed(2)}`; };

    const avatarSrc = name =>
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name||'U')}&backgroundColor=e2e8f0&textColor=374151&fontSize=40`;

    const statusClass   = s => s === 'Completed' ? 'oo-badge-completed' : s === 'Cancelled' ? 'oo-badge-cancelled' : 'oo-badge-pending';
    const paymentClass  = p => p === 'Paid' ? 'oo-pay-badge-paid' : p === 'Overdue' ? 'oo-pay-badge-overdue' : 'oo-pay-badge-unpaid';

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
                    <h2 className="ss-page-title">Sales</h2>
                    <p className="ss-page-subtitle">Manage Your Sales Orders</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="Print" onClick={() => window.print()}><FileText size={16} /></button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Export CSV" onClick={exportCSV}><Download size={16} /></button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchOrders}><RotateCcw size={16} /></button>
                    {selectedRows.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedRows.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" onClick={() => setAddOpen(true)}>
                        <Plus size={16} /> Add Sales
                    </button>
                </div>
            </div>

            {/* Card */}
            <div className="ss-main-panel">

                {/* Filter bar */}
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
                        <select className="ss-filter-select" value={filterCustomer} onChange={e => { setFilterCustomer(e.target.value); resetPage(); }}>
                            <option value="">All Customers</option>
                            {customers.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <select className="ss-filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); resetPage(); }}>
                            <option value="">All Statuses</option>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select className="ss-filter-select" value={filterPayment} onChange={e => { setFilterPayment(e.target.value); resetPage(); }}>
                            <option value="">All Payments</option>
                            {PAYMENTS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="oo-state-row">
                        <div className="oo-spinner" />
                        <span>Loading sales orders…</span>
                    </div>
                )}

                {/* Error */}
                {!loading && fetchError && (
                    <div className="oo-state-row oo-error">
                        <AlertCircle size={16} />
                        <span>{fetchError}</span>
                        <button className="oo-retry-btn" onClick={fetchOrders}>Retry</button>
                    </div>
                )}

                {/* Table */}
                {!loading && !fetchError && (
                    <div className="ss-table-wrapper">
                        <table className="ss-table">
                            <thead>
                                <tr>
                                    <th className="ss-cb-col" style={{ width: '40px' }}>
                                        <input type="checkbox"
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
                                            <input type="checkbox"
                                                className="ss-checkbox"
                                                checked={selectedRows.includes(item.id)}
                                                onChange={() => toggleRow(item.id)}
                                            />
                                        </td>

                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={avatarSrc(item.customerName)} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                                                <span className="ss-item-name">{item.customerName || '—'}</span>
                                            </div>
                                        </td>

                                        <td><span className="ss-code-badge">{item.referenceNo}</span></td>

                                        <td>{item.formattedDate || item.date || '—'}</td>

                                        <td>
                                            <span className={`ss-status-badge ${item.status === 'Completed' ? 'ss-status-active' : item.status === 'Cancelled' ? 'ss-status-inactive' : 'ss-status-pending'}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td style={{ fontWeight: '600' }}>{money(item.grandTotal)}</td>
                                        <td>{money(item.paidAmount)}</td>

                                        <td style={{ color: parseFloat(item.dueAmount) > 0 ? '#ea5455' : '#28c76f', fontWeight: '500' }}>
                                            {money(item.dueAmount)}
                                        </td>

                                        <td>
                                            <span className={`ss-status-badge ${item.paymentStatus === 'Paid' ? 'ss-status-active' : item.paymentStatus === 'Overdue' ? 'ss-status-inactive' : 'ss-status-pending'}`}>
                                                {item.paymentStatus}
                                            </span>
                                        </td>

                                        <td>{item.biller || 'Admin'}</td>

                                        <td>
                                            <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                <button className="ss-action-btn view"    title="View Detail" onClick={() => openView(item)}><Eye     size={14} /></button>
                                                <button className="ss-action-btn edit"    style={{ background: '#f8f9fa', color: '#5b6670' }} title="View Invoice" onClick={() => openInvoice(item)}><Receipt size={14} /></button>
                                                <button className="ss-action-btn edit"    title="Edit"        onClick={() => openEdit(item)}><Edit    size={14} /></button>
                                                <button className="ss-action-btn delete"  title="Delete"      onClick={() => openDelete(item)}><Trash2  size={14} /></button>
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
                                                        : 'No sales yet. Click "Add Sales" to create one.'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                                    : <button key={p} className={`ss-page-btn ${p === page ? 'active' : ''}`}
                                              onClick={() => setCurrentPage(p)}>{p}</button>
                            )}
                            <button className="ss-page-btn" disabled={page === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="oo-footer">
                <div>2014 - 2026 © Namastute. All Rights Reserved</div>
                <div>Designed &amp; Developed by <span>Namastute</span></div>
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
