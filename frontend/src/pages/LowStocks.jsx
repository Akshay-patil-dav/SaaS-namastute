import React, { useState, useEffect, useCallback } from 'react';
import './Products.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FileText, 
    FileSpreadsheet, 
    RefreshCw, 
    ChevronUp,
    Search,
    ChevronDown,
    Pencil,
    Trash2,
    Mail,
    Package,
    AlertCircle
} from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products`;

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

    // ── Fetch products from backend ──────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_BASE);
            setDbProducts(res.data || []);
            setApiOnline(true);
        } catch {
            setApiOnline(false);
            setDbProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;

        try {
            await axios.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            // Local notification or toast logic could go here if toast state is added
            setSelectedIds([]);
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete products', err);
        }
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedIds(filteredData.map(item => item.id));
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

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header mb-3">
                <div className="product-page-title">
                    <h4>Low Stocks</h4>
                    <p>Manage your stocks below alert levels</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="btn-icon-action" title="Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="btn-icon-action" title="Refresh" onClick={fetchProducts}>
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                    <button className="btn-icon-action" title="Collapse">
                        <ChevronUp size={18} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="btn-red-outline" onClick={handleBulkDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 15px', height: '40px', borderRadius: '6px', border: '1px solid #ea5455', color: '#ea5455', background: '#fff', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s', textDecoration: 'none' }}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="btn-dark-blue">
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
            <div className="product-table-card">
                
                {/* Filter Row */}
                <div className="table-filter-row">
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, SKU, brand…" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <table className="custom-table" style={{ minWidth: '950px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input 
                                    type="checkbox" 
                                    className="custom-checkbox" 
                                    checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
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
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            className="custom-checkbox" 
                                            checked={selectedIds.includes(item.id)}
                                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                        />
                                    </td>
                                    <td>{item.warehouse || 'Primary'}</td>
                                    <td>{item.store || 'Main Store'}</td>
                                    <td>
                                        <div className="product-name-cell">
                                            {item.images && item.images.split(',')[0]?.trim() ? (
                                                <img 
                                                    src={item.images.split(',')[0].trim()} 
                                                    alt={item.name} 
                                                    className="product-thumb" 
                                                />
                                            ) : (
                                                <div 
                                                    className="product-avatar"
                                                    style={{ background: getAvatarColor(item.name) }}
                                                >
                                                    {getInitials(item.name)}
                                                </div>
                                            )}
                                            <span className="product-name-text ms-2">{item.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span 
                                            className="category-badge"
                                            style={{ background: `${getCategoryColor(item.category)}18`, color: getCategoryColor(item.category) }}
                                        >
                                            {item.category || '—'}
                                        </span>
                                    </td>
                                    <td><span className="sku-chip">{item.sku || '—'}</span></td>
                                    <td>
                                        <span className={`qty-badge ${item.quantity <= 0 ? 'badge-danger' : 'badge-warning'}`}>
                                            {item.quantity ?? 0}
                                        </span>
                                    </td>
                                    <td><span className="text-secondary fw-bold">{item.quantityAlert || 0}</span></td>
                                    <td>
                                        <div className="action-buttons justify-content-center">
                                            <Link to={`/edit-product/${item.id}`} className="action-btn edit-btn" title="Edit">
                                                <Pencil size={15} />
                                            </Link>
                                            <button className="action-btn delete-btn" title="Delete">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">
                                    <div className="empty-state py-5">
                                        <Package size={48} strokeWidth={1} className="text-muted mb-3" />
                                        <p className="text-muted">No products found matching your inventory concerns.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination (Static for now as filtering happens in-memory) */}
                <div className="pagination-row">
                    <div>
                        Row Per Page 
                        <select className="entries-select" defaultValue="10">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select> 
                        Entries
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LowStocks;
