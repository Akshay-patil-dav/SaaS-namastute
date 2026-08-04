import React, { useState, useEffect, useCallback } from 'react';
import { 
    Package, 
    ChevronDown, 
    Calendar, 
    Search, 
    Columns,
    ArrowDown,
    RotateCcw,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    Trash2,
    Receipt
} from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import { useConfirm } from '../../../context/ConfirmContext';
import AddSalesModal    from '../../../components/modals/sales/AddSalesModal/AddSalesModal';
import EditSalesModal   from '../../../components/modals/sales/EditSalesModal/EditSalesModal';
import ViewSalesModal   from '../../../components/modals/sales/ViewSalesModal/ViewSalesModal';
import DeleteConfirmModal from '../../../components/modals/common/DeleteConfirmModal/DeleteConfirmModal';
import InvoiceModal     from '../../../components/modals/sales/InvoiceModal/InvoiceModal';
import './orders.css';
import { useCurrency } from '../../../hooks/useCurrency';


const BASE_URL = ENV.API_BASE_URL;

export default function Orders() {
    const { currencySymbol } = useCurrency();

    const { confirm } = useConfirm();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Modals
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(`${BASE_URL}/sales`);
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError('Could not load orders. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const toggleRow = id =>
        setSelectedRows(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id]);
    const toggleAll = () =>
        setSelectedRows(p => p.length === paginatedRows.length ? [] : paginatedRows.map(r => r.id));

    const exportCSV = () => {
        const header = ['Reference','Customer','Date','Status','Total','Payment Status','Items'];
        const body = filteredOrders.map(o => {
            let itemsCount = 1;
            try { if (o.productsJson) itemsCount = JSON.parse(o.productsJson).length; } catch(e){}
            return [
                o.referenceNo, o.customerName, o.formattedDate || o.date,
                o.status, o.grandTotal, o.paymentStatus, itemsCount
            ];
        });
        const csv = [header, ...body].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
        const link = Object.assign(document.createElement('a'), {
            href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
            download: 'orders.csv',
        });
        link.click();
    };

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Sales Orders',
            message: `Are you sure you want to delete ${selectedRows.length} sales orders?`
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

    const renderStatusBadge = (status) => {
        let styleClass = 'shop-badge-default';
        if (status === 'Paid' || status === 'Fulfilled' || status === 'Delivered' || status === 'Completed') {
            styleClass = 'shop-badge-success';
        } else if (status === 'Cancelled' || status === 'Overdue') {
            styleClass = 'shop-badge-default'; // Can be styled red in CSS if needed
        }
        return (
            <span className={`shop-badge ${styleClass}`}>
                <span className="shop-badge-dot"></span>
                {status}
            </span>
        );
    };

    const money = v => { const n = parseFloat(v); return isNaN(n) ? `${currencySymbol}0.00` : `${currencySymbol}${n.toFixed(2)}`; };

    const filteredOrders = orders.filter(order => {
        if (activeTab !== 'All' && order.status !== activeTab) return false;
        
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            const customerMatch = (order.customerName || '').toLowerCase().includes(q);
            const refMatch = (order.referenceNo || '').toLowerCase().includes(q);
            if (!customerMatch && !refMatch) return false;
        }
        return true;
    });

    const today = new Date().toISOString().split('T')[0];
    let todayOrdersCount = 0;
    let todayItemsCount = 0;
    let todayFulfilledCount = 0;
    let todayReturnsAmount = 0;
    
    orders.forEach(o => {
        if (o.date === today || (o.createdAt && o.createdAt.startsWith(today))) {
            todayOrdersCount++;
            let count = 1;
            try { if (o.productsJson) count = JSON.parse(o.productsJson).length; } catch(e){}
            todayItemsCount += count;
            if (o.status === 'Completed' || o.status === 'Fulfilled') {
                todayFulfilledCount++;
            }
        }
    });

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));
    const page = Math.min(currentPage, totalPages);
    const paginatedRows = filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="shopify-orders-container">
            {/* Header */}
            <div className="shop-header">
                <div className="shop-header-title">
                    <Package size={24} strokeWidth={1.5} />
                    <h1>Orders</h1>
                </div>
                <div className="shop-header-actions">
                    <button className="shop-btn shop-btn-secondary" onClick={exportCSV}>Export</button>
                    {selectedRows.length > 0 && (
                        <button className="shop-btn shop-btn-secondary" style={{color: '#ea5455'}} onClick={handleBulkDelete}>
                            <Trash2 size={14} style={{marginRight: '6px', marginBottom: '-2px'}}/> Delete ({selectedRows.length})
                        </button>
                    )}
                    <button className="shop-btn shop-btn-primary" onClick={() => setAddOpen(true)}>Create order</button>
                </div>
            </div>

            {/* KPI Bar */}
            <div className="shop-kpi-card">
                <div className="shop-kpi-left">
                    <Calendar size={14} className="shop-kpi-icon" />
                    <span>Today</span>
                </div>
                <div className="shop-kpi-metrics">
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Orders</div>
                        <div className="kpi-value">
                            {loading ? <span className="kpi-dash">—</span> : (todayOrdersCount > 0 ? todayOrdersCount : <span>0 <span className="kpi-dash">—</span></span>)}
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Items ordered</div>
                        <div className="kpi-value">
                            {loading ? <span className="kpi-dash">—</span> : (todayItemsCount > 0 ? todayItemsCount : <span>0 <span className="kpi-dash">—</span></span>)}
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Returns</div>
                        <div className="kpi-value">
                            {currencySymbol}0 <span className="kpi-dash">—</span>
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Orders fulfilled</div>
                        <div className="kpi-value">
                            {loading ? <span className="kpi-dash">—</span> : (todayFulfilledCount > 0 ? todayFulfilledCount : <span>0 <span className="kpi-dash">—</span></span>)}
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Orders delivered</div>
                        <div className="kpi-value">
                            0 <span className="kpi-dash">—</span>
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Order to fulfillment time</div>
                        <div className="kpi-value empty-space">
                            &nbsp;
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-time"></div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="shop-table-card">
                {/* Search & Filter Bar */}
                <div className="shop-table-toolbar">
                    <div className="shop-tabs">
                        {['All', 'Completed', 'Pending', 'Cancelled'].map(tab => (
                            <button 
                                key={tab}
                                className={`shop-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="shop-search-wrapper">
                        <Search size={16} className="shop-search-icon" />
                        <input 
                            type="text" 
                            className="shop-search-input" 
                            placeholder="Search and filter" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="shop-toolbar-actions">
                        <button className="shop-btn-icon" title="Columns">
                            <Columns size={16} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="shop-table-wrapper">
                    <table className="shop-table">
                        <thead>
                            <tr>
                                <th className="shop-col-cb">
                                    <input 
                                        type="checkbox" 
                                        className="shop-checkbox" 
                                        checked={filteredOrders.length > 0 && selectedRows.length === filteredOrders.length}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>Order</th>
                                <th>
                                    Date <ArrowDown size={12} className="sort-icon active" />
                                </th>
                                <th>Customer</th>
                                <th>Fulfill by</th>
                                <th>Channel</th>
                                <th className="text-right">Total</th>
                                <th>Payment status</th>
                                <th>Fulfillment status</th>
                                <th>Items</th>
                                <th>Delivery status</th>
                                <th>Delivery method</th>
                                <th>Tags</th>
                                <th style={{textAlign: 'center'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="14" className="shop-table-footer-text" style={{textAlign: 'center', padding: '40px'}}>
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="14" className="shop-table-footer-text" style={{textAlign: 'center', padding: '40px', color: '#ea5455'}}>
                                        <AlertCircle size={20} style={{display: 'inline', marginBottom: '-4px', marginRight: '8px'}} />
                                        {error}
                                        <div style={{marginTop: '10px'}}>
                                            <button className="shop-btn shop-btn-secondary" onClick={fetchOrders}>Retry</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedRows.length > 0 ? (
                                paginatedRows.map(order => {
                                    let itemsCount = 1;
                                    try {
                                        if (order.productsJson) {
                                            itemsCount = JSON.parse(order.productsJson).length;
                                        }
                                    } catch (e) {}

                                    return (
                                        <tr key={order.id} className={selectedRows.includes(order.id) ? 'selected-row' : ''}>
                                            <td className="shop-col-cb">
                                                <input 
                                                    type="checkbox" 
                                                    className="shop-checkbox"
                                                    checked={selectedRows.includes(order.id)}
                                                    onChange={() => toggleRow(order.id)}
                                                />
                                            </td>
                                            <td className="font-semibold text-gray-900">{order.referenceNo}</td>
                                            <td>{order.formattedDate || order.date || '—'}</td>
                                            <td>
                                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                                    <span>{order.customerName || '—'}</span>
                                                    {order.userId && <span style={{fontSize: '11px', color: '#6b7280'}}>UI ID: {order.userId}</span>}
                                                </div>
                                            </td>
                                            <td>—</td>
                                            <td>Online Store</td>
                                            <td className="text-right">{money(order.grandTotal)}</td>
                                            <td>
                                                {order.paymentStatus === 'Paid' ? (
                                                    <span style={{color: '#059669', fontSize: '12px', fontWeight: '600', backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: '12px'}}>Paid by him on website</span>
                                                ) : (
                                                    renderStatusBadge(order.paymentStatus || 'Pending')
                                                )}
                                            </td>
                                            <td>{renderStatusBadge(order.status || 'Pending')}</td>
                                            <td>{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</td>
                                            <td>—</td>
                                            <td>—</td>
                                            <td>—</td>
                                            <td>
                                                <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                                                    <button onClick={() => openView(order)} title="View" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', padding: 0}}><Eye size={16} /></button>
                                                    <button onClick={() => openInvoice(order)} title="Invoice" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#5b6670', padding: 0}}><Receipt size={16} /></button>
                                                    <button onClick={() => openEdit(order)} title="Edit" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#f59e0b', padding: 0}}><Edit size={16} /></button>
                                                    <button onClick={() => openDelete(order)} title="Delete" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#ea5455', padding: 0}}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="14" className="shop-table-footer-text" style={{textAlign: 'center', padding: '40px'}}>
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && !error && filteredOrders.length > 0 && (
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid #e1e3e5'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span style={{fontSize: '13px', color: '#5b6670'}}>Rows per page</span>
                            <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} style={{padding: '4px 8px', borderRadius: '4px', border: '1px solid #e1e3e5', fontSize: '13px'}}>
                                {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <span style={{fontSize: '13px', color: '#5b6670', marginLeft: '10px'}}>
                                {Math.min((page - 1) * rowsPerPage + 1, filteredOrders.length)}–{Math.min(page * rowsPerPage, filteredOrders.length)} of {filteredOrders.length}
                            </span>
                        </div>
                        <div style={{display: 'flex', gap: '8px'}}>
                            <button disabled={page === 1} onClick={() => setCurrentPage(p => p - 1)} style={{padding: '6px', background: '#fff', border: '1px solid #c9cccf', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1}}>
                                <ChevronLeft size={16} />
                            </button>
                            <button disabled={page === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{padding: '6px', background: '#fff', border: '1px solid #c9cccf', borderRadius: '4px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1}}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddSalesModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSuccess={() => { fetchOrders(); setCurrentPage(1); }} />
            <EditSalesModal isOpen={editOpen} order={activeOrder} onClose={closeAll} onSuccess={fetchOrders} />
            <ViewSalesModal isOpen={viewOpen} order={activeOrder} onClose={closeAll} />
            <DeleteConfirmModal isOpen={deleteOpen} onClose={closeAll} onConfirm={confirmDelete} title="Delete Sale" message={`Delete sale ${activeOrder?.referenceNo}?`} isDeleting={deleting} />
            <InvoiceModal isOpen={invoiceOpen} order={activeOrder} onClose={closeAll} orderType="ONLINE" />
        </div>
    );
}
