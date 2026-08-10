import React, { useState, useEffect, useMemo } from 'react';
import './WorkOrders.css';
import apiClient, { ENV } from '@/api/config';
import {
    PlayCircle,
    CheckCircle2,
    Clock,
    XCircle,
    PlusCircle,
    Search,
    Trash2,
    Cpu,
    CheckCircle,
    AlertCircle,
    Layers,
    Grid,
    List,
    X,
    Package,
    Boxes,
    FileText,
    Sparkles,
    Check
} from 'lucide-react';
import { useConfirm } from '../../../context/ConfirmContext';

const WorkOrders = () => {
    const confirm = useConfirm();
    
    // Core data state
    const [workOrders, setWorkOrders] = useState([]);
    const [boms, setBoms] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtering & View state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        productId: '',
        bomId: '',
        quantityToProduce: 1
    });

    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [woRes, bomRes, prodRes] = await Promise.all([
                apiClient.get(`${ENV.API_BASE_URL}/manufacturing/work-orders`),
                apiClient.get(`${ENV.API_BASE_URL}/manufacturing/bom`),
                apiClient.get(`${ENV.API_BASE_URL}/products`)
            ]);
            setWorkOrders(woRes.data || []);
            setBoms(bomRes.data || []);
            setProducts(prodRes.data || []);
        } catch (err) {
            console.error('Failed to load work order data', err);
            showToast('Failed to load manufacturing work orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const availableBoms = formData.productId
        ? boms.filter(b => b.product?.id === Number(formData.productId))
        : boms;

    const handleProductChange = (productId) => {
        const matchingBoms = boms.filter(b => b.product?.id === Number(productId));
        setFormData({
            ...formData,
            productId,
            bomId: matchingBoms.length > 0 ? matchingBoms[0].id : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productId || !formData.bomId || formData.quantityToProduce <= 0) {
            showToast('Please complete all required fields with valid quantities', 'error');
            return;
        }

        try {
            await apiClient.post(`${ENV.API_BASE_URL}/manufacturing/work-orders`, {
                productId: Number(formData.productId),
                bomId: Number(formData.bomId),
                quantityToProduce: Number(formData.quantityToProduce)
            });
            showToast('Work Order created in DRAFT state');
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            showToast(err.response?.data || 'Failed to create Work Order', 'error');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus, confirmMsg) => {
        if (confirmMsg) {
            const ok = await confirm({
                title: 'Update Work Order Status',
                message: confirmMsg,
                confirmText: 'Proceed',
                cancelText: 'Cancel'
            });
            if (!ok) return;
        }

        try {
            await apiClient.patch(`${ENV.API_BASE_URL}/manufacturing/work-orders/${orderId}/status`, {
                status: newStatus
            });
            if (newStatus === 'COMPLETED') {
                showToast('🎉 Production Batch Completed! Raw materials deducted and finished good stock added to inventory.');
            } else {
                showToast(`Work Order status updated to ${newStatus}`);
            }
            fetchData();
        } catch (err) {
            const msg = err.response?.data || 'Failed to update work order status';
            showToast(typeof msg === 'string' ? msg : 'Stock conversion error', 'error');
        }
    };

    const handleDelete = async (order) => {
        const ok = await confirm({
            title: 'Delete Work Order',
            message: `Are you sure you want to delete Work Order ${order.orderNumber}?`,
            confirmText: 'Delete Order',
            cancelText: 'Cancel'
        });
        if (!ok) return;

        try {
            await apiClient.delete(`${ENV.API_BASE_URL}/manufacturing/work-orders/${order.id}`);
            showToast('Work Order deleted');
            fetchData();
        } catch (err) {
            showToast(err.response?.data || 'Failed to delete work order', 'error');
        }
    };

    // Calculate Analytics & Status Counts
    const analytics = useMemo(() => {
        const total = workOrders.length;
        const inProgress = workOrders.filter(w => w.status === 'IN_PROGRESS').length;
        const completed = workOrders.filter(w => w.status === 'COMPLETED').length;
        const draft = workOrders.filter(w => w.status === 'DRAFT').length;
        const cancelled = workOrders.filter(w => w.status === 'CANCELLED').length;

        return { total, inProgress, completed, draft, cancelled };
    }, [workOrders]);

    // Process Search, Status Filter & Sorting
    const processedOrders = useMemo(() => {
        let result = workOrders.filter(wo => {
            const matchesSearch =
                (wo.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (wo.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (wo.billOfMaterial?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || wo.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        result.sort((a, b) => {
            if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            if (sortBy === 'qtyDesc') return (Number(b.quantityToProduce) || 0) - (Number(a.quantityToProduce) || 0);
            if (sortBy === 'product') return (a.product?.name || '').localeCompare(b.product?.name || '');
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        return result;
    }, [workOrders, searchTerm, statusFilter, sortBy]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'DRAFT':
                return (
                    <span className="wo-status-badge draft">
                        <FileText size={13} /> DRAFT
                    </span>
                );
            case 'IN_PROGRESS':
                return (
                    <span className="wo-status-badge in_progress">
                        <Clock size={13} /> IN PROGRESS
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="wo-status-badge completed">
                        <CheckCircle2 size={13} /> COMPLETED
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="wo-status-badge cancelled">
                        <XCircle size={13} /> CANCELLED
                    </span>
                );
            default:
                return <span className="wo-status-badge draft">{status}</span>;
        }
    };

    const selectedProduct = useMemo(() => {
        return products.find(p => p.id === Number(formData.productId));
    }, [products, formData.productId]);

    const selectedBom = useMemo(() => {
        return boms.find(b => b.id === Number(formData.bomId));
    }, [boms, formData.bomId]);

    return (
        <div className="work-orders-page container-fluid p-4">
            {/* Toast Alert */}
            {toast && (
                <div className={`wo-toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    <div className="mfg-header-badge">
                        <Cpu size={26} />
                    </div>
                    <div>
                        <h4 className="mfg-page-title mb-1">Production Work Orders</h4>
                        <p className="mfg-page-subtitle mb-0">
                            Manage batch orders, track real-time shop floor status, and automatically convert raw materials into finished inventory.
                        </p>
                    </div>
                </div>
                <button
                    className="btn-mfg-orange"
                    onClick={() => {
                        setFormData({ productId: '', bomId: '', quantityToProduce: 1 });
                        setIsModalOpen(true);
                    }}
                >
                    <PlusCircle size={18} />
                    <span>Create Work Order</span>
                </button>
            </div>

            {/* Stat Analytics Cards Grid */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="wo-stat-card blue">
                        <div className="wo-stat-icon blue">
                            <Layers size={24} />
                        </div>
                        <div>
                            <div className="wo-stat-label">Total Work Orders</div>
                            <div className="wo-stat-value">{analytics.total}</div>
                            <div className="wo-stat-subtext">All Batch Requests</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="wo-stat-card amber">
                        <div className="wo-stat-icon amber">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="wo-stat-label">In Production</div>
                            <div className="wo-stat-value">{analytics.inProgress}</div>
                            <div className="wo-stat-subtext">Active Shop Floor Batches</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="wo-stat-card emerald">
                        <div className="wo-stat-icon emerald">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <div className="wo-stat-label">Completed Batches</div>
                            <div className="wo-stat-value">{analytics.completed}</div>
                            <div className="wo-stat-subtext">Stock Converted to Inventory</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="wo-stat-card purple">
                        <div className="wo-stat-icon purple">
                            <FileText size={24} />
                        </div>
                        <div>
                            <div className="wo-stat-label">Draft Orders</div>
                            <div className="wo-stat-value">{analytics.draft}</div>
                            <div className="wo-stat-subtext">Awaiting Batch Release</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Toolbar (Search, Filter Tabs, Sort, View Toggle) */}
            <div className="mfg-control-card mb-4">
                <div className="row g-3 align-items-center">
                    {/* Search Field */}
                    <div className="col-12 col-md-4">
                        <div className="mfg-search-input">
                            <Search size={18} className="mfg-search-icon" />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Order #, product or recipe..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <X size={16} className="mfg-clear-icon" onClick={() => setSearchTerm('')} />
                            )}
                        </div>
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                        {[
                            { key: 'ALL', label: 'All', count: analytics.total },
                            { key: 'DRAFT', label: 'Draft', count: analytics.draft },
                            { key: 'IN_PROGRESS', label: 'In Progress', count: analytics.inProgress },
                            { key: 'COMPLETED', label: 'Completed', count: analytics.completed },
                            { key: 'CANCELLED', label: 'Cancelled', count: analytics.cancelled }
                        ].map(st => (
                            <button
                                key={st.key}
                                className={`btn-filter-tab ${statusFilter === st.key ? 'active' : ''}`}
                                onClick={() => setStatusFilter(st.key)}
                            >
                                <span>{st.label}</span>
                                <span className="badge-count">{st.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Sorting & View Mode Switcher */}
                    <div className="col-12 col-md-3 d-flex align-items-center justify-content-end gap-2">
                        <select
                            className="form-select mfg-filter-select"
                            style={{ maxWidth: '170px' }}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="qtyDesc">Highest Quantity</option>
                            <option value="product">Product Name</option>
                        </select>

                        <div className="d-flex align-items-center gap-1 bg-light p-1 rounded-3 border">
                            <button
                                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Grid View"
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                                onClick={() => setViewMode('table')}
                                title="Table View"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                    <p className="text-muted fw-medium">Loading Production Work Orders...</p>
                </div>
            ) : processedOrders.length === 0 ? (
                <div className="mfg-empty-state">
                    <div className="mfg-empty-icon">
                        <Boxes size={32} />
                    </div>
                    <h5 className="fw-bold text-dark mb-2">No Work Orders Found</h5>
                    <p className="text-muted mb-4" style={{ maxWidth: '440px', margin: '0 auto' }}>
                        {searchTerm || statusFilter !== 'ALL'
                            ? 'No production work orders match your search or filter settings. Try resetting your criteria.'
                            : 'No manufacturing work orders have been created yet. Click below to start a production batch.'}
                    </p>
                    {searchTerm || statusFilter !== 'ALL' ? (
                        <button
                            className="btn btn-outline-secondary rounded-3 px-4 fw-semibold"
                            onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                        >
                            Reset Filters
                        </button>
                    ) : (
                        <button
                            className="btn-mfg-orange"
                            onClick={() => {
                                setFormData({ productId: '', bomId: '', quantityToProduce: 1 });
                                setIsModalOpen(true);
                            }}
                        >
                            <PlusCircle size={18} />
                            <span>Create First Work Order</span>
                        </button>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid Card View */
                <div className="wo-grid-container">
                    {processedOrders.map(order => (
                        <div className="wo-card" key={order.id}>
                            <div>
                                {/* Card Header */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="wo-order-badge">{order.orderNumber}</span>
                                    {getStatusBadge(order.status)}
                                </div>

                                {/* Target Product */}
                                <h5 className="wo-product-title">{order.product?.name || 'N/A'}</h5>

                                {/* BOM Recipe Box */}
                                <div className="wo-bom-box d-flex align-items-center gap-2">
                                    <Layers size={15} className="text-warning flex-shrink-0" />
                                    <span className="text-truncate">
                                        Recipe: <strong>{order.billOfMaterial?.name || 'Standard Recipe'}</strong>
                                    </span>
                                </div>

                                {/* Batch Details Grid */}
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <div className="p-2 bg-light rounded-3 border">
                                            <div className="small text-muted" style={{ fontSize: '11px' }}>Target Batch</div>
                                            <div className="fw-bold text-dark fs-6">
                                                {order.quantityToProduce} <span className="small font-normal text-muted">{order.product?.unit || 'units'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-2 bg-light rounded-3 border">
                                            <div className="small text-muted" style={{ fontSize: '11px' }}>Created Date</div>
                                            <div className="fw-bold text-dark fs-6" style={{ fontSize: '13px' }}>
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Batch Meter Bar */}
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="small text-muted fw-semibold" style={{ fontSize: '11px' }}>Batch Progress</span>
                                        <span className="small fw-bold text-dark" style={{ fontSize: '11px' }}>
                                            {order.status === 'COMPLETED' ? 'Stock Converted' : order.status === 'IN_PROGRESS' ? 'In Shop Floor' : order.status === 'CANCELLED' ? 'Cancelled' : 'Draft Queued'}
                                        </span>
                                    </div>
                                    <div className="wo-progress-meter">
                                        <div className={`wo-progress-fill ${order.status.toLowerCase()}`}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="pt-3 border-top mt-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
                                {order.status === 'DRAFT' && (
                                    <>
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <button
                                                className="btn-wo-start"
                                                onClick={() => handleUpdateStatus(order.id, 'IN_PROGRESS')}
                                                title="Start Production Batch"
                                            >
                                                <PlayCircle size={15} /> Start Batch
                                            </button>
                                            <button
                                                className="btn-wo-complete"
                                                onClick={() => handleUpdateStatus(
                                                    order.id,
                                                    'COMPLETED',
                                                    `Complete Work Order ${order.orderNumber}? This will deduct raw materials and add ${order.quantityToProduce} units of finished product to inventory.`
                                                )}
                                                title="Complete & Convert Stock"
                                            >
                                                <CheckCircle2 size={15} /> Complete
                                            </button>
                                        </div>
                                        <button
                                            className="btn-wo-delete"
                                            onClick={() => handleDelete(order)}
                                            title="Delete Order"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </>
                                )}

                                {order.status === 'IN_PROGRESS' && (
                                    <div className="w-100 d-flex align-items-center justify-content-between gap-2">
                                        <button
                                            className="btn-wo-complete"
                                            onClick={() => handleUpdateStatus(
                                                order.id,
                                                'COMPLETED',
                                                `Complete Work Order ${order.orderNumber}? This will deduct raw materials and add ${order.quantityToProduce} units of finished product to inventory.`
                                            )}
                                            title="Complete Batch & Convert Inventory"
                                        >
                                            <CheckCircle2 size={15} /> Complete & Convert Stock
                                        </button>
                                        <button
                                            className="btn-wo-cancel"
                                            onClick={() => handleUpdateStatus(
                                                order.id,
                                                'CANCELLED',
                                                `Cancel Work Order ${order.orderNumber}?`
                                            )}
                                            title="Cancel Order"
                                        >
                                            <XCircle size={15} /> Cancel
                                        </button>
                                    </div>
                                )}

                                {order.status === 'COMPLETED' && (
                                    <div className="w-100 d-flex justify-content-between align-items-center">
                                        <span className="small text-success fw-bold d-inline-flex align-items-center gap-1">
                                            <CheckCircle size={15} /> Stock Converted & Added
                                        </span>
                                        <span className="small text-muted" style={{ fontSize: '11px' }}>
                                            Finished Good Ready
                                        </span>
                                    </div>
                                )}

                                {order.status === 'CANCELLED' && (
                                    <div className="w-100 d-flex justify-content-between align-items-center">
                                        <span className="small text-muted fw-medium">Order Cancelled</span>
                                        <button
                                            className="btn-wo-delete"
                                            onClick={() => handleDelete(order)}
                                            title="Delete Cancelled Order"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Table View */
                <div className="mfg-table-card">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Target Product</th>
                                    <th>BOM Recipe</th>
                                    <th>Target Quantity</th>
                                    <th>Status</th>
                                    <th>Created Date</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="wo-order-badge">{order.orderNumber}</span>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{order.product?.name || 'N/A'}</div>
                                            <span className="small text-muted">
                                                Current Stock: {order.product?.quantity || 0} {order.product?.unit || ''}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="small text-secondary d-flex align-items-center gap-1">
                                                <Layers size={14} className="text-warning" /> {order.billOfMaterial?.name || 'Standard Recipe'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="fw-bold text-dark fs-6">{order.quantityToProduce}</span>{' '}
                                            <span className="small text-muted">{order.product?.unit || 'units'}</span>
                                        </td>
                                        <td>{getStatusBadge(order.status)}</td>
                                        <td className="small text-muted">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="text-end">
                                            {order.status === 'DRAFT' && (
                                                <div className="d-inline-flex gap-2 align-items-center">
                                                    <button
                                                        className="btn-wo-start"
                                                        onClick={() => handleUpdateStatus(order.id, 'IN_PROGRESS')}
                                                        title="Start Production Batch"
                                                    >
                                                        <PlayCircle size={14} /> Start
                                                    </button>
                                                    <button
                                                        className="btn-wo-complete"
                                                        onClick={() => handleUpdateStatus(
                                                            order.id,
                                                            'COMPLETED',
                                                            `Complete Work Order ${order.orderNumber}? This will deduct raw materials and add ${order.quantityToProduce} units of finished product to inventory.`
                                                        )}
                                                        title="Complete & Convert Stock"
                                                    >
                                                        <CheckCircle2 size={14} /> Complete
                                                    </button>
                                                    <button
                                                        className="btn-wo-delete"
                                                        onClick={() => handleDelete(order)}
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            )}

                                            {order.status === 'IN_PROGRESS' && (
                                                <div className="d-inline-flex gap-2 align-items-center">
                                                    <button
                                                        className="btn-wo-complete"
                                                        onClick={() => handleUpdateStatus(
                                                            order.id,
                                                            'COMPLETED',
                                                            `Complete Work Order ${order.orderNumber}? This will deduct raw materials and add ${order.quantityToProduce} units of finished product to inventory.`
                                                        )}
                                                        title="Complete Batch & Convert Inventory"
                                                    >
                                                        <CheckCircle2 size={14} /> Complete & Convert Stock
                                                    </button>
                                                    <button
                                                        className="btn-wo-cancel"
                                                        onClick={() => handleUpdateStatus(
                                                            order.id,
                                                            'CANCELLED',
                                                            `Cancel Work Order ${order.orderNumber}?`
                                                        )}
                                                        title="Cancel Order"
                                                    >
                                                        <XCircle size={14} /> Cancel
                                                    </button>
                                                </div>
                                            )}

                                            {order.status === 'COMPLETED' && (
                                                <span className="small text-success fw-semibold px-3 py-1 bg-success bg-opacity-10 rounded-2 border border-success d-inline-flex align-items-center gap-1">
                                                    Stock Converted <CheckCircle size={14} />
                                                </span>
                                            )}

                                            {order.status === 'CANCELLED' && (
                                                <div className="d-inline-flex gap-2 align-items-center">
                                                    <span className="small text-muted">Cancelled</span>
                                                    <button
                                                        className="btn-wo-delete"
                                                        onClick={() => handleDelete(order)}
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Production Work Order Modal */}
            {isModalOpen && (
                <div className="modal-backdrop-custom">
                    <div className="modal-content-custom card border-0 p-4" style={{ maxWidth: '560px', width: '100%' }}>
                        {/* Modal Header */}
                        <div className="wo-modal-header d-flex justify-content-between align-items-center mb-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="modal-icon-badge">
                                    <Cpu size={22} />
                                </div>
                                <div>
                                    <h5 className="fw-bold text-dark mb-0">Create Work Order</h5>
                                    <span className="small text-muted">Configure new manufacturing production batch</span>
                                </div>
                            </div>
                            <button className="wo-modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Product Selection */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark mb-1">
                                    Target Manufactured Good *
                                </label>
                                <div className="input-icon-group">
                                    <Package size={16} className="input-icon" />
                                    <select
                                        className="form-select"
                                        value={formData.productId}
                                        onChange={(e) => handleProductChange(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Select Finished Product to Produce --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (Current Stock: {p.quantity || 0} {p.unit || ''})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* BOM Selection */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark mb-1">
                                    BOM Recipe to Apply *
                                </label>
                                <div className="input-icon-group">
                                    <Layers size={16} className="input-icon" />
                                    <select
                                        className="form-select"
                                        value={formData.bomId}
                                        onChange={(e) => setFormData({ ...formData, bomId: e.target.value })}
                                        required
                                        disabled={!formData.productId}
                                    >
                                        <option value="">-- Select BOM Recipe --</option>
                                        {availableBoms.map(b => (
                                            <option key={b.id} value={b.id}>
                                                {b.name} ({b.items?.length || 0} ingredients)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {formData.productId && availableBoms.length === 0 && (
                                    <div className="alert alert-warning p-2 mt-2 small d-flex align-items-center gap-2">
                                        <AlertCircle size={16} className="text-warning flex-shrink-0" />
                                        <span>No BOM recipe exists for this product. Please create a BOM Recipe first.</span>
                                    </div>
                                )}
                            </div>

                            {/* Batch Quantity */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold small text-dark mb-1">
                                    Batch Quantity to Produce *
                                </label>
                                <div className="input-icon-group">
                                    <Boxes size={16} className="input-icon" />
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control"
                                        placeholder="Enter quantity"
                                        value={formData.quantityToProduce}
                                        onChange={(e) => setFormData({ ...formData, quantityToProduce: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Stock Impact Live Preview */}
                            {selectedProduct && selectedBom && (
                                <div className="wo-conversion-preview mb-4">
                                    <div className="d-flex align-items-center gap-1 text-success font-semibold small mb-2">
                                        <Sparkles size={14} /> <span>Automatic Stock Transformation Preview</span>
                                    </div>
                                    <div className="small text-dark mb-1">
                                        Produce: <strong>{formData.quantityToProduce} x {selectedProduct.name}</strong>
                                    </div>
                                    <div className="small text-muted">
                                        Recipe: <strong>{selectedBom.name}</strong> ({selectedBom.items?.length || 0} raw material ingredients)
                                    </div>
                                    <div className="small text-success mt-2 d-flex align-items-center gap-1">
                                        <Check size={14} /> Upon batch completion, raw material inventory will be auto-deducted and finished good stock will increase by {formData.quantityToProduce} {selectedProduct.unit || 'units'}.
                                    </div>
                                </div>
                            )}

                            {/* Modal Buttons */}
                            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                                <button
                                    type="button"
                                    className="btn btn-light rounded-3 px-4 fw-semibold"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-mfg-orange border-0 px-4"
                                    disabled={availableBoms.length === 0}
                                >
                                    Create Work Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkOrders;
