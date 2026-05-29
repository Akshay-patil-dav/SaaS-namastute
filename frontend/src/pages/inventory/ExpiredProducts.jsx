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
    Pencil,
    Trash2,
    AlertCircle,
    CheckCircle,
    X,
    Package
} from 'lucide-react';
import { useConfirm } from '../../context/ConfirmContext';

const API_BASE = `${ENV.API_BASE_URL}/products`;
const EXPIRED_API = `${API_BASE}/expired`;

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

// ── Initials avatar ───────────────────────────────────────────────────────
const avatarColors = ['#f97316','#3b82f6','#10b981','#8b5cf6','#f43f5e','#eab308','#0ea5e9','#d946ef'];
const getAvatarColor = (str) => avatarColors[(str?.charCodeAt(0) || 0) % avatarColors.length];
const getInitials = (name) => (name || 'P').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

const ExpiredProducts = () => {
    const [dbProducts, setDbProducts]   = useState([]);
    const [loading, setLoading]         = useState(true);
    const [apiOnline, setApiOnline]     = useState(true);
    const [searchTerm, setSearchTerm]   = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast]             = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const { confirm } = useConfirm();

    // ── Fetch products from backend ──────────────────────────────────────
    const fetchExpiredProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(EXPIRED_API);
            setDbProducts(res.data || []);
            setApiOnline(true);
        } catch (error) {
            console.error("Error fetching expired products:", error);
            setApiOnline(false);
            setDbProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchExpiredProducts(); }, [fetchExpiredProducts]);

    // ── Search filter ────────────────────────────────────────────────────
    const filtered = dbProducts.filter(item => {
        if (!searchTerm) return true;
        const t = searchTerm.toLowerCase();
        return (
            (item.name || '').toLowerCase().includes(t) ||
            (item.sku || '').toLowerCase().includes(t)
        );
    });

    // ── Pagination ───────────────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const paginated  = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

    // ── Delete ───────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Expired Product',
            message: 'Are you sure you want to delete this expired product?'
        });
        if (!isConfirmed) return;
        try {
            await apiClient.delete(`${API_BASE}/${id}`);
            setDbProducts(prev => prev.filter(p => p.id !== id));
            showToast('success', 'Product deleted successfully.');
        } catch {
            showToast('error', 'Failed to delete product.');
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Expired Products',
            message: `Are you sure you want to delete ${selectedIds.length} expired products?`
        });
        if (!isConfirmed) return;

        try {
            await apiClient.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            showToast('success', `${selectedIds.length} products deleted successfully.`);
            setSelectedIds([]);
            fetchExpiredProducts();
        } catch (err) {
            showToast('error', 'Failed to delete products.');
        }
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedIds(paginated.map(item => item.id));
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

    // ── Toast ────────────────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Format date ──────────────────────────────────────────────────────
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="product-page-container">

            {/* Toast */}
            {toast && (
                <div className={`prod-toast prod-toast-${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="toast-close"><X size={14} /></button>
                </div>
            )}

            {/* Header Section */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Expired Products</h2>
                    <p className="ss-page-subtitle">
                        {loading ? 'Loading…' : (
                            apiOnline ? `${dbProducts.length} expired items found` : 'Backend API is offline'
                        )}
                    </p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="PDF">
                        <FileText size={16} />
                    </button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel">
                        <FileSpreadsheet size={16} />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchExpiredProducts}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                </div>
            </div>

            {/* API Offline Banner */}
            {!apiOnline && !loading && (
                <div className="api-offline-banner">
                    <AlertCircle size={16} />
                    Backend API is offline. Start the Spring Boot server to load real products.
                </div>
            )}

            {/* Table Card Area */}
            <div className="ss-main-panel">
                
                {/* Filter Row */}
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={18} />
                        <input 
                            type="text" 
                            className="ss-search-input"
                            placeholder="Search by name or SKU…" 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="ss-filters-wrap">
                        <select className="ss-filter-select">
                            <option>Product</option>
                        </select>
                        <select className="ss-filter-select">
                            <option>Sort By : Expired Date</option>
                        </select>
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
                                        checked={paginated.length > 0 && selectedIds.length === paginated.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th>SKU</th>
                                <th>Product</th>
                                <th>Manufactured Date</th>
                                <th className="text-danger">Expired Date</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && Array.from({ length: 5 }).map((_, i) => (
                                <tr key={`skel-${i}`} className="skeleton-row">
                                    <td><div className="skel skel-sm" /></td>
                                    <td><div className="skel skel-md" /></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="skel skel-circle" />
                                            <div className="skel skel-lg" />
                                        </div>
                                    </td>
                                    <td><div className="skel skel-md" /></td>
                                    <td><div className="skel skel-md" /></td>
                                    <td><div className="skel skel-md" /></td>
                                </tr>
                            ))}

                            {!loading && paginated.length > 0 && paginated.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            className="ss-checkbox" 
                                            checked={selectedIds.includes(item.id)}
                                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                        />
                                    </td>
                                    <td>
                                        <span className="ss-code-badge">{item.sku || '—'}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {item.images && item.images.split(',')[0]?.trim() ? (
                                                <img
                                                    src={item.images.split(',')[0].trim()}
                                                    alt={item.name}
                                                    style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                style={{
                                                    width: '28px', height: '28px', borderRadius: '4px',
                                                    background: getAvatarColor(item.name),
                                                    display: (item.images && item.images.split(',')[0]?.trim()) ? 'none' : 'flex',
                                                    alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '600'
                                                }}
                                            >
                                                {getInitials(item.name)}
                                            </div>
                                            <span className="ss-item-name">{item.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: '#5b6670', fontSize: '13px' }}>{formatDate(item.manufacturedDate)}</td>
                                    <td style={{ color: '#ea5455', fontWeight: '600', fontSize: '13px' }}>{formatDate(item.expiryDate)}</td>
                                    <td>
                                        <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                            <Link to={`/edit-product/${item.id}`} className="ss-action-btn edit" title="Edit">
                                                <Pencil size={15} />
                                            </Link>
                                            <button 
                                                className="ss-action-btn delete" 
                                                title="Delete"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && paginated.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div className="empty-state">
                                            <Package size={48} strokeWidth={1} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                            <p style={{ color: '#94a3b8' }}>{searchTerm ? 'No expired products match your search.' : 'No expired products found.'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filtered.length > 0 && (
                    <div className="ss-pagination-row">
                        <div className="ss-page-size">
                            Row Per Page&nbsp;
                            <select 
                                value={rowsPerPage}
                                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select> 
                            &nbsp;| Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length}
                        </div>
                        <div className="ss-page-controls">
                            <button className="ss-page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .reduce((acc, p, i, arr) => {
                                    if (i > 0 && p - arr[i-1] > 1) acc.push('...');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) => 
                                    p === '...' 
                                        ? <span key={`ellipsis-${i}`} style={{ color: '#adb5bd', margin: '0 5px' }}>…</span>
                                        : <button key={p} className={`ss-page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => goToPage(p)}>{p}</button>
                                )
                            }
                            <button className="ss-page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ExpiredProducts;
