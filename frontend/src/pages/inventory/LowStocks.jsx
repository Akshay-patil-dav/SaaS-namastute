import React, { useState, useEffect, useCallback } from 'react';
import './Products.css';
import './inventory-pages-custom.css';
import { Link } from 'react-router-dom';
import apiClient, { API, ENV } from '@/api/config';
import { 
    FileText, 
    FileSpreadsheet, 
    RefreshCw, 
    ChevronUp,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Mail,
    Package,
    AlertCircle
} from 'lucide-react';
import { useConfirm } from '../../context/ConfirmContext';

const API_BASE = `${ENV.API_BASE_URL}/products`;

// ── Colour mapping for category badges ────────────────────────────────────
const categoryColors = {
    'Electronics': '#3b82f6', 'Computers': '#6366f1', 'Phone': '#8b5cf6',
    'Shoe': '#10b981', 'Bags': '#f59e0b', 'Furnitures': '#0ea5e9',
    'Furniture': '#0ea5e9', 'Food & Beverages': '#22c55e', default: '#64748b',
};
const getCategoryColor = (cat) => categoryColors[cat] || categoryColors.default;

// ── Initials avatar ────────────────────────────────────────────────────────
const avatarColors = ['#f97316','#3b82f6','#10b981','#8b5cf6','#f43f5e','#eab308','#0ea5e9','#d946ef'];
const getAvatarColor = (str) => avatarColors[(str?.charCodeAt(0) || 0) % avatarColors.length];
const getInitials = (name) => (name || 'P').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

const LowStocks = () => {
    const [dbProducts, setDbProducts]   = useState([]);
    const [loading, setLoading]         = useState(true);
    const [apiOnline, setApiOnline]     = useState(true);
    const [searchTerm, setSearchTerm]   = useState('');
    const [activeTab, setActiveTab]     = useState('low'); // 'low' or 'out'
    const [notify, setNotify]           = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const { confirm } = useConfirm();

    // ── Fetch products from backend ──────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_BASE);
            setDbProducts(Array.isArray(res.data) ? res.data : []);
            setApiOnline(true);
        } catch {
            setApiOnline(false);
            setDbProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // ── Filtering Logic ──────────────────────────────────────────────────
    const getFilteredData = () => {
        return dbProducts.filter(item => {
            const qty = item.quantity || 0;
            const alert = item.quantityAlert || 0;

            // Tab filter
            if (activeTab === 'low') {
                if (qty <= 0 || qty > alert) return false;
            } else if (activeTab === 'out') {
                if (qty > 0) return false;
            }

            // Search filter
            if (searchTerm) {
                const t = searchTerm.toLowerCase();
                return (
                    (item.name     || '').toLowerCase().includes(t) ||
                    (item.sku      || '').toLowerCase().includes(t) ||
                    (item.brand    || '').toLowerCase().includes(t) ||
                    (item.category || '').toLowerCase().includes(t)
                );
            }

            return true;
        });
    };

    const filteredData = getFilteredData();
    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const pagedData = filteredData.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab, rowsPerPage]);

    // ── Handlers ────────────────────────────────────────────────────────
    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Products',
            message: `Are you sure you want to delete ${selectedIds.length} products?`
        });
        if (!isConfirmed) return;

        try {
            await apiClient.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            setSelectedIds([]);
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete products', err);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product?'
        });
        if (!isConfirmed) return;
        try {
            await apiClient.delete(`${API_BASE}/${id}`);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedIds(pagedData.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id, isChecked) => {
        if (isChecked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Low Stocks</h2>
                    <p className="ss-page-subtitle">Manage your stocks below alert levels</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="PDF">
                        <FileText size={16} />
                    </button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel">
                        <FileSpreadsheet size={16} />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchProducts}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" style={{ background: '#5b6670', borderColor: '#5b6670' }}>
                        <Mail size={16} /> Send Email
                    </button>
                </div>
            </div>

            {/* API Offline Banner */}
            {!apiOnline && !loading && (
                <div className="api-offline-banner mb-3">
                    <AlertCircle size={16} />
                    Backend API is offline — unable to load live inventory data.
                </div>
            )}

            {/* Tabs & Toggle Row */}
            <div className="ls-tabs-row">
                <div className="ls-tabs">
                    <button 
                        className={`ls-tab ${activeTab === 'low' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('low')}
                    >
                        Low Stocks
                    </button>
                    <button 
                        className={`ls-tab ${activeTab === 'out' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('out')}
                    >
                        Out of Stocks
                    </button>
                </div>
                <div className="ls-toggle-wrapper">
                    <label className="ls-switch">
                        <input 
                            type="checkbox" 
                            checked={notify} 
                            onChange={(e) => setNotify(e.target.checked)}
                        />
                        <span className="ls-slider"></span>
                    </label>
                    <span className="ms-2">Notify</span>
                </div>
            </div>

            {/* Table Card Area */}
            <div className="ss-main-panel">
                
                {/* Filter Row */}
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={18} />
                        <input 
                            type="text" 
                            className="ss-search-input"
                            placeholder="Search by name, SKU, brand…" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="ss-table-wrapper">
                    <table className="ss-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input 
                                        type="checkbox" 
                                        className="ss-checkbox" 
                                        checked={pagedData.length > 0 && selectedIds.length === pagedData.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th>Warehouse</th>
                                <th>Store</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>SKU</th>
                                <th>Qty</th>
                                <th>Qty Alert</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={`skel-${i}`} className="skeleton-row">
                                        <td colSpan="9"><div className="skel skel-lg" /></td>
                                    </tr>
                                ))
                            ) : pagedData.length > 0 ? (
                                pagedData.map((item) => (
                                    <tr key={item.id} className={selectedIds.includes(item.id) ? 'row-selected' : ''}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                className="ss-checkbox" 
                                                checked={selectedIds.includes(item.id)}
                                                onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                            />
                                        </td>
                                        <td>{item.warehouse || 'Primary'}</td>
                                        <td>{item.store || 'Main Store'}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {item.images && item.images.split(',')[0]?.trim() ? (
                                                    <img 
                                                        src={item.images.split(',')[0].trim()} 
                                                        alt={item.name} 
                                                        style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div 
                                                        style={{
                                                            width: '28px', height: '28px', borderRadius: '4px',
                                                            background: getAvatarColor(item.name),
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '600'
                                                        }}
                                                    >
                                                        {getInitials(item.name)}
                                                    </div>
                                                )}
                                                <span className="ss-item-name ms-2">{item.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span 
                                                className="ss-status-badge ss-status-active"
                                                style={{ background: `${getCategoryColor(item.category)}18`, color: getCategoryColor(item.category), borderColor: 'transparent' }}
                                            >
                                                {item.category || '—'}
                                            </span>
                                        </td>
                                        <td><span className="ss-code-badge">{item.sku || '—'}</span></td>
                                        <td>
                                            <span className={`ss-status-badge ${item.quantity <= 0 ? 'ss-status-inactive' : 'ss-status-pending'}`}>
                                                {item.quantity ?? 0}
                                            </span>
                                        </td>
                                        <td style={{ color: '#5b6670', fontWeight: '600' }}>{item.quantityAlert || 0}</td>
                                        <td>
                                            <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                <Link to={`/edit-product/${item.id}`} className="ss-action-btn edit" title="Edit">
                                                    <Pencil size={15} />
                                                </Link>
                                                <button className="ss-action-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div className="empty-state">
                                            <Package size={48} strokeWidth={1} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                            <p style={{ color: '#94a3b8' }}>No products found matching your inventory concerns.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="ss-pagination-row">
                    <div className="ss-page-size">
                        Row Per Page&nbsp;
                        <select 
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select> 
                        &nbsp;| Showing {(safePage - 1) * rowsPerPage + 1}–{Math.min(safePage * rowsPerPage, filteredData.length)} of {filteredData.length}
                    </div>
                    <div className="ss-page-controls">
                        <button className="ss-page-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={safePage === 1}>
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                            .reduce((acc, p, i, arr) => {
                                if (i > 0 && p - arr[i-1] > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, i) => (
                                p === '...' 
                                ? <span key={`ellipsis-${i}`} className="ss-page-btn" style={{ border: 'none', cursor: 'default' }}>…</span>
                                : <button 
                                    key={p} 
                                    className={`ss-page-btn ${p === safePage ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(p)}
                                  >
                                    {p}
                                  </button>
                            ))
                        }
                        <button className="ss-page-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={safePage === totalPages}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LowStocks;
