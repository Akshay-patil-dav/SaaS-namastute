import React, { useState, useEffect } from 'react';
import apiClient, { ENV } from '@/api/config';
import InvoiceModal from '../../../components/modals/sales/InvoiceModal/InvoiceModal';
import AddSalesModal from '../../../components/modals/sales/AddSalesModal/AddSalesModal';
import { useCurrency } from '../../../hooks/useCurrency';
import {
    FileText,
    Search,
    Filter,
    Printer,
    Eye,
    Download,
    DollarSign,
    CheckCircle2,
    Clock,
    ShoppingBag,
    Monitor,
    RefreshCw,
    Plus,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Receipt,
    User
} from 'lucide-react';
import './Invoices.css';

export default function Invoices() {
    const { currencySymbol } = useCurrency();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Filters & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('ALL'); // ALL, POS, ONLINE
    const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, Paid, Pending, Partial
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Modal state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderType, setSelectedOrderType] = useState('ONLINE');
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const [posRes, onlineRes] = await Promise.all([
                apiClient.get(`${ENV.API_BASE_URL}/pos-sales`).catch(() => ({ data: [] })),
                apiClient.get(`${ENV.API_BASE_URL}/sales`).catch(() => ({ data: [] }))
            ]);

            const posOrders = (posRes.data || []).map(order => ({
                ...order,
                invoiceType: 'POS',
                invoiceNo: order.invoiceNo || `INV-POS-${order.id}`,
                formattedDate: order.orderDate || order.createdAt || new Date().toISOString(),
                customerName: order.customerName || order.customer?.name || 'Walk-in Customer',
                grandTotalNum: parseFloat(order.grandTotal || order.totalAmount || 0),
                paymentStatusText: (order.paymentStatus || 'PAID').toUpperCase()
            }));

            const onlineOrders = (onlineRes.data || []).map(order => ({
                ...order,
                invoiceType: 'ONLINE',
                invoiceNo: order.orderId ? `INV-${order.orderId}` : `INV-SLS-${order.id}`,
                formattedDate: order.orderDate || order.createdAt || new Date().toISOString(),
                customerName: order.customerName || order.customer?.name || 'Online Customer',
                grandTotalNum: parseFloat(order.grandTotal || order.totalAmount || 0),
                paymentStatusText: (order.paymentStatus || 'PAID').toUpperCase()
            }));

            // Combine and sort by date descending
            const combined = [...posOrders, ...onlineOrders].sort((a, b) => {
                return new Date(b.formattedDate) - new Date(a.formattedDate);
            });

            setInvoices(combined);
        } catch (err) {
            showToast('Failed to load invoices', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Filter logic
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch =
            inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inv.phone && inv.phone.includes(searchTerm));

        const matchesSource =
            sourceFilter === 'ALL' || inv.invoiceType === sourceFilter;

        const matchesStatus =
            statusFilter === 'ALL' || inv.paymentStatusText.includes(statusFilter);

        return matchesSearch && matchesSource && matchesStatus;
    });

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / rowsPerPage));
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Statistics
    const totalCount = invoices.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotalNum, 0);
    const paidCount = invoices.filter(inv => inv.paymentStatusText === 'PAID').length;
    const pendingCount = invoices.filter(inv => inv.paymentStatusText !== 'PAID').length;

    const handleViewInvoice = (inv) => {
        setSelectedOrder(inv);
        setSelectedOrderType(inv.invoiceType);
        setIsInvoiceOpen(true);
    };

    const handleExportCSV = () => {
        if (filteredInvoices.length === 0) {
            showToast('No invoices to export', 'error');
            return;
        }

        const headers = ['Invoice #', 'Type', 'Customer', 'Date', 'Amount', 'Status'];
        const rows = filteredInvoices.map(inv => [
            inv.invoiceNo,
            inv.invoiceType,
            `"${inv.customerName}"`,
            new Date(inv.formattedDate).toLocaleDateString(),
            inv.grandTotalNum.toFixed(2),
            inv.paymentStatusText
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Selling_Invoices_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Invoices exported successfully');
    };

    const formatMoney = (amount) => {
        return `${currencySymbol}${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="inv-page-wrapper">
            {/* Top Bar Header */}
            <div className="inv-header-card">
                <div className="inv-header-left">
                    <div className="inv-title-icon-box">
                        <Receipt size={24} className="inv-title-icon" />
                    </div>
                    <div>
                        <h2 className="inv-header-title">Selling Product Invoices</h2>
                        <p className="inv-header-subtitle">
                            Manage, aggregate, and print sales invoices across POS Terminals &amp; Manufacturing Sales
                        </p>
                    </div>
                </div>
                <div className="inv-header-actions">
                    <button
                        className="inv-btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus size={18} /> Create Billing Invoice
                    </button>
                    <button className="inv-btn-secondary" onClick={fetchInvoices} title="Refresh Data">
                        <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                    <button className="inv-btn-dark" onClick={handleExportCSV}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stat Summary Cards */}
            <div className="inv-stats-grid">
                <div className="inv-stat-card border-orange">
                    <div className="inv-stat-top">
                        <div className="inv-stat-icon bg-orange-light text-orange">
                            <Receipt size={22} />
                        </div>
                        <span className="inv-stat-badge bg-orange-light text-orange">All Channels</span>
                    </div>
                    <div className="inv-stat-value">{totalCount}</div>
                    <div className="inv-stat-label">Total Invoices Generated</div>
                </div>

                <div className="inv-stat-card border-green">
                    <div className="inv-stat-top">
                        <div className="inv-stat-icon bg-green-light text-green">
                            <TrendingUp size={22} />
                        </div>
                        <span className="inv-stat-badge bg-green-light text-green">Gross Sales</span>
                    </div>
                    <div className="inv-stat-value">{formatMoney(totalRevenue)}</div>
                    <div className="inv-stat-label">Total Revenue Billed</div>
                </div>

                <div className="inv-stat-card border-blue">
                    <div className="inv-stat-top">
                        <div className="inv-stat-icon bg-blue-light text-blue">
                            <CheckCircle2 size={22} />
                        </div>
                        <span className="inv-stat-badge bg-blue-light text-blue">Settled</span>
                    </div>
                    <div className="inv-stat-value">{paidCount}</div>
                    <div className="inv-stat-label">Paid Invoices</div>
                </div>

                <div className="inv-stat-card border-red">
                    <div className="inv-stat-top">
                        <div className="inv-stat-icon bg-red-light text-red">
                            <Clock size={22} />
                        </div>
                        <span className="inv-stat-badge bg-red-light text-red">Action Needed</span>
                    </div>
                    <div className="inv-stat-value">{pendingCount}</div>
                    <div className="inv-stat-label">Pending / Unpaid</div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="inv-filter-panel">
                <div className="inv-search-wrap">
                    <Search size={18} className="inv-search-icon" />
                    <input
                        type="text"
                        className="inv-search-input"
                        placeholder="Search invoice number, customer name, phone..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <div className="inv-filter-selectors">
                    <div className="inv-channel-tabs">
                        {[
                            { id: 'ALL', label: 'All Channels' },
                            { id: 'POS', label: 'POS Sales' },
                            { id: 'ONLINE', label: 'Online Sales' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                className={`inv-tab-btn ${sourceFilter === tab.id ? 'active' : ''}`}
                                onClick={() => { setSourceFilter(tab.id); setCurrentPage(1); }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <select
                        className="inv-select"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="ALL">All Payment Statuses</option>
                        <option value="PAID">Paid Only</option>
                        <option value="PENDING">Pending / Unpaid</option>
                    </select>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="inv-table-card">
                <div className="table-responsive">
                    <table className="inv-table">
                        <thead>
                            <tr>
                                <th>Invoice No.</th>
                                <th>Channel</th>
                                <th>Customer Name</th>
                                <th>Date &amp; Time</th>
                                <th>Total Amount</th>
                                <th>Payment Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={`skel-${idx}`} className="inv-skel-row">
                                        <td><div className="inv-skel-line" style={{ width: '100px' }} /></td>
                                        <td><div className="inv-skel-line" style={{ width: '80px' }} /></td>
                                        <td><div className="inv-skel-line" style={{ width: '140px' }} /></td>
                                        <td><div className="inv-skel-line" style={{ width: '120px' }} /></td>
                                        <td><div className="inv-skel-line" style={{ width: '90px' }} /></td>
                                        <td><div className="inv-skel-line" style={{ width: '70px' }} /></td>
                                        <td><div className="inv-skel-line" style={{ width: '110px', margin: '0 auto' }} /></td>
                                    </tr>
                                ))
                            ) : paginatedInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="inv-empty-cell">
                                        <FileText size={42} className="text-muted mb-2" strokeWidth={1.2} />
                                        <p className="fw-semibold text-dark mb-1">No sales invoices found</p>
                                        <span className="small text-muted">Try clearing search filters or create a new invoice</span>
                                    </td>
                                </tr>
                            ) : (
                                paginatedInvoices.map((inv, idx) => (
                                    <tr key={`${inv.invoiceType}-${inv.id}-${idx}`}>
                                        <td>
                                            <button
                                                className="inv-code-badge"
                                                onClick={() => handleViewInvoice(inv)}
                                                title="View Billing Invoice"
                                            >
                                                {inv.invoiceNo}
                                            </button>
                                        </td>
                                        <td>
                                            {inv.invoiceType === 'POS' ? (
                                                <span className="inv-badge inv-badge-pos">
                                                    <Monitor size={12} /> POS Sale
                                                </span>
                                            ) : (
                                                <span className="inv-badge inv-badge-online">
                                                    <ShoppingBag size={12} /> Direct Sale
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="inv-customer-cell">
                                                <div className="inv-customer-avatar">
                                                    <User size={13} />
                                                </div>
                                                <span className="inv-customer-name">{inv.customerName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="inv-date-text">
                                                {new Date(inv.formattedDate).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="inv-amount-text">
                                                {formatMoney(inv.grandTotalNum)}
                                            </span>
                                        </td>
                                        <td>
                                            {inv.paymentStatusText === 'PAID' ? (
                                                <span className="inv-status-pill status-paid">
                                                    <CheckCircle2 size={12} /> Paid
                                                </span>
                                            ) : (
                                                <span className="inv-status-pill status-pending">
                                                    <Clock size={12} /> {inv.paymentStatusText}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="inv-action-wrap">
                                                <button
                                                    className="inv-action-btn"
                                                    onClick={() => handleViewInvoice(inv)}
                                                    title="View & Print Invoice"
                                                >
                                                    <Eye size={14} /> View Invoice
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {!loading && filteredInvoices.length > 0 && (
                    <div className="inv-pagination-bar">
                        <div className="inv-page-size">
                            <span>Rows per page:</span>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="inv-page-select"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="inv-showing-text">
                                Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
                            </span>
                        </div>

                        <div className="inv-page-nav">
                            <button
                                className="inv-nav-btn"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="inv-page-number">
                                Page <strong>{currentPage}</strong> of {totalPages}
                            </span>
                            <button
                                className="inv-nav-btn"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Alert */}
            {toast && (
                <div className={`inv-toast inv-toast-${toast.type}`}>
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Create Invoice Modal Integration */}
            {isCreateModalOpen && (
                <AddSalesModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={(newOrder) => {
                        setIsCreateModalOpen(false);
                        showToast('🎉 Sales Invoice created successfully!');
                        fetchInvoices();
                        if (newOrder) {
                            setSelectedOrder({
                                ...newOrder,
                                invoiceType: 'ONLINE',
                                invoiceNo: newOrder.orderId ? `INV-${newOrder.orderId}` : `INV-SLS-${newOrder.id}`,
                                formattedDate: newOrder.orderDate || newOrder.createdAt || new Date().toISOString(),
                                customerName: newOrder.customerName || 'Customer',
                                grandTotalNum: parseFloat(newOrder.grandTotal || newOrder.totalAmount || 0),
                                paymentStatusText: (newOrder.paymentStatus || 'PAID').toUpperCase()
                            });
                            setSelectedOrderType('ONLINE');
                            setIsInvoiceOpen(true);
                        }
                    }}
                />
            )}

            {/* Invoice Printable View Modal */}
            {isInvoiceOpen && selectedOrder && (
                <InvoiceModal
                    isOpen={isInvoiceOpen}
                    order={selectedOrder}
                    orderType={selectedOrderType}
                    onClose={() => {
                        setIsInvoiceOpen(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
}
