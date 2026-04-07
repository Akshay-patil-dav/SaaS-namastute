import React, { useState, useEffect, useCallback } from 'react';
import './Products.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    FileText,
    FileSpreadsheet,
    RefreshCw,
    ChevronUp,
    PlusCircle,
    Download,
    Search,
    ChevronDown,
    Eye,
    Pencil,
    Trash2,
    Package,
    AlertCircle,
    CheckCircle,
    X
} from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products`;

// ── Fallback mock data (shown when DB is empty or API is offline) ──────────
const mockData = [];

// ── Colour mapping for category badges ────────────────────────────────────
const categoryColors = {
    'Electronics': '#3b82f6', 'Computers': '#6366f1', 'Phone': '#8b5cf6',
    'Shoe': '#10b981', 'Bags': '#f59e0b', 'Furnitures': '#0ea5e9',
    'Furniture': '#0ea5e9', 'Food & Beverages': '#22c55e', default: '#64748b',
};
const getCategoryColor = (cat) => categoryColors[cat] || categoryColors.default;

// ── Initials avatar (for DB rows that have no avatar image) ───────────────
const avatarColors = ['#f97316','#3b82f6','#10b981','#8b5cf6','#f43f5e','#eab308','#0ea5e9','#d946ef'];
const getAvatarColor = (str) => avatarColors[(str?.charCodeAt(0) || 0) % avatarColors.length];
const getInitials = (name) => (name || 'P').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const Products = () => {
    const [dbProducts, setDbProducts]   = useState([]);
    const [loading, setLoading]         = useState(true);
    const [apiOnline, setApiOnline]     = useState(true);
    const [searchTerm, setSearchTerm]   = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast]             = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // id to delete
    const [viewProduct, setViewProduct]     = useState(null);   // product to view
    const [activeImgIndex, setActiveImgIndex] = useState(0);    // for gallery

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

    // ── Merge: DB products first, then mock (only if DB is empty/offline) ─
    const allProducts = dbProducts;

    // ── Search filter ────────────────────────────────────────────────────
    const filtered = allProducts.filter(item => {
        if (!searchTerm) return true;
        const t = searchTerm.toLowerCase();
        return (
            (item.name        || '').toLowerCase().includes(t) ||
            (item.sku         || '').toLowerCase().includes(t) ||
            (item.brand       || '').toLowerCase().includes(t) ||
            (item.category    || '').toLowerCase().includes(t)
        );
    });

    // ── Pagination ───────────────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const paginated  = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

    // ── Delete ───────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (typeof id === 'string' && id.startsWith('m')) {
            showToast('error', 'Demo data cannot be deleted.');
            setDeleteConfirm(null);
            return;
        }
        try {
            await axios.delete(`${API_BASE}/${id}`);
            setDbProducts(prev => prev.filter(p => p.id !== id));
            showToast('success', 'Product deleted successfully.');
        } catch {
            showToast('error', 'Failed to delete product.');
        }
        setDeleteConfirm(null);
    };

    // ── Toast ────────────────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Format price ─────────────────────────────────────────────────────
    const formatPrice = (price) => {
        if (price == null) return '—';
        return `$${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // ── Format date ──────────────────────────────────────────────────────
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // ── Qty badge colour ─────────────────────────────────────────────────
    const getQtyBadge = (qty) => {
        if (qty <= 0)   return 'badge-danger';
        if (qty < 50)   return 'badge-warning';
        return 'badge-success';
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

            {/* Delete Confirm Modal */}
            {deleteConfirm !== null && (
                <div className="delete-overlay">
                    <div className="delete-modal">
                        <div className="delete-modal-icon"><Trash2 size={28} /></div>
                        <h5>Delete Product?</h5>
                        <p>This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                            <button className="btn-cancel-del" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn-confirm-del" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Product List</h4>
                    <p>
                        {loading ? 'Loading…' : (
                            <>
                                {dbProducts.length > 0
                                    ? <span className="db-badge"><span className="db-dot live" />  {dbProducts.length} from database</span>
                                    : <span className="db-badge"><span className="db-dot mock" />  Showing demo data</span>
                                }
                            </>
                        )}
                    </p>
                </div>
                <div className="page-actions">
                    <button className="btn-icon-action" title="PDF"><FileText size={18} className="icon-red" /></button>
                    <button className="btn-icon-action" title="Excel"><FileSpreadsheet size={18} className="icon-green" /></button>
                    <button className="btn-icon-action" title="Refresh" onClick={fetchProducts}>
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                    <button className="btn-icon-action" title="Collapse"><ChevronUp size={18} /></button>
                    <Link to="/create-product" className="btn-orange text-decoration-none">
                        <PlusCircle size={18} /> Add Product
                    </Link>
                    <button className="btn-dark-blue"><Download size={18} /> Import Product</button>
                </div>
            </div>

            {/* API Offline Banner */}
            {!apiOnline && !loading && (
                <div className="api-offline-banner">
                    <AlertCircle size={16} />
                    Backend API is offline — showing demo data. Start the Spring Boot server to load real products.
                </div>
            )}

            {/* Table Card */}
            <div className="product-table-card">

                {/* Filter Row */}
                <div className="table-filter-row">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, SKU, brand, category…"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                        {searchTerm && (
                            <button className="search-clear" onClick={() => setSearchTerm('')}><X size={14} /></button>
                        )}
                    </div>
                    <div className="filter-dropdowns">
                        <div className="filter-select">Category <ChevronDown size={16} /></div>
                        <div className="filter-select">Brand <ChevronDown size={16} /></div>
                    </div>
                </div>

                {/* Table */}
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}><input type="checkbox" className="custom-checkbox" /></th>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Unit</th>
                            <th>Qty</th>
                            <th>Added On</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Loading skeletons */}
                        {loading && Array.from({ length: 6 }).map((_, i) => (
                            <tr key={`skel-${i}`} className="skeleton-row">
                                <td><div className="skel skel-sm" /></td>
                                <td><div className="skel skel-md" /></td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div className="skel skel-circle" />
                                        <div className="skel skel-lg" />
                                    </div>
                                </td>
                                <td><div className="skel skel-sm" /></td>
                                <td><div className="skel skel-md" /></td>
                                <td><div className="skel skel-sm" /></td>
                                <td><div className="skel skel-sm" /></td>
                                <td><div className="skel skel-sm" /></td>
                                <td><div className="skel skel-md" /></td>
                                <td><div className="skel skel-md" /></td>
                            </tr>
                        ))}

                        {/* Actual rows */}
                        {!loading && paginated.length > 0 && paginated.map((item) => (
                            <tr key={item.id} className={item._isMock ? 'mock-row' : 'db-row'}>
                                <td><input type="checkbox" className="custom-checkbox" /></td>
                                <td>
                                    <span className="sku-chip">{item.sku || '—'}</span>
                                </td>
                                <td>
                                    <div className="product-name-cell">
                                        {/* Show real product image if available, else initials avatar */}
                                        {item.images && item.images.split(',')[0]?.trim() ? (
                                            <img
                                                src={item.images.split(',')[0].trim()}
                                                alt={item.name}
                                                className="product-thumb"
                                                onError={(e) => {
                                                    // Graceful fallback: hide broken image, show sibling avatar
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                                                }}
                                            />
                                        ) : null}
                                        {/* Initials avatar — shown when no image or image fails */}
                                        <div
                                            className="product-avatar"
                                            style={{
                                                background: getAvatarColor(item.name),
                                                display: (item.images && item.images.split(',')[0]?.trim()) ? 'none' : 'flex'
                                            }}
                                        >
                                            {getInitials(item.name)}
                                        </div>
                                        <div>
                                            <span className="product-name-text">{item.name}</span>
                                            {item._isMock && <span className="demo-tag">demo</span>}
                                        </div>
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
                                <td>{item.brand || '—'}</td>
                                <td className="price-cell">{formatPrice(item.price)}</td>
                                <td>{item.unit || 'Pc'}</td>
                                <td>
                                    <span className={`qty-badge ${getQtyBadge(item.quantity)}`}>
                                        {item.quantity ?? 0}
                                    </span>
                                </td>
                                <td className="date-cell">{formatDate(item.createdAt)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="action-btn view-btn" 
                                            title="View"
                                            onClick={() => { setViewProduct(item); setActiveImgIndex(0); }}
                                        >
                                            <Eye size={15} />
                                        </button>
                                        <Link to={`/edit-product/${item.id}`} className="action-btn edit-btn" title="Edit">
                                            <Pencil size={15} />
                                        </Link>
                                        <button
                                            className="action-btn delete-btn"
                                            title="Delete"
                                            onClick={() => setDeleteConfirm(item.id)}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {/* Empty state */}
                        {!loading && paginated.length === 0 && (
                            <tr>
                                <td colSpan="10">
                                    <div className="empty-state">
                                        <Package size={48} strokeWidth={1} />
                                        <p>{searchTerm ? 'No products match your search.' : 'No product Avalable tehre'}</p>
                                        {!searchTerm && (
                                            <Link to="/create-product" className="btn-orange text-decoration-none" style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
                                                <PlusCircle size={16} /> Add Product
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {!loading && filtered.length > 0 && (
                    <div className="pagination-row">
                        <div className="rows-per-page">
                            Row Per Page&nbsp;
                            <select
                                className="entries-select"
                                value={rowsPerPage}
                                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            &nbsp;| Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length}
                        </div>
                        <div className="pagination-controls">
                            <button className="page-btn bg-light" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .reduce((acc, p, i, arr) => {
                                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === '...'
                                        ? <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                                        : <button key={p} className={`page-btn ${p === currentPage ? 'active' : 'bg-light'}`} onClick={() => goToPage(p)}>{p}</button>
                                )
                            }
                            <button className="page-btn bg-light" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    </div>
                )}
            </div>
            {/* Enhanced Product View Modal */}
            {viewProduct && (
                <div className="view-overlay" onClick={() => setViewProduct(null)}>
                    <div className="view-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="view-modal-close" onClick={() => setViewProduct(null)}>
                            <X size={20} />
                        </button>
                        
                        <div className="view-modal-content">
                            {/* Left Side: Image Gallery */}
                            <div className="view-modal-left">
                                <div className="view-image-container">
                                    {viewProduct.images && viewProduct.images.split(',')[activeImgIndex]?.trim() ? (
                                        <img 
                                            src={viewProduct.images.split(',')[activeImgIndex].trim()} 
                                            alt={viewProduct.name} 
                                            className="view-main-img" 
                                        />
                                    ) : (
                                        <div 
                                            className="view-img-placeholder"
                                            style={{ background: getAvatarColor(viewProduct.name) }}
                                        >
                                            {getInitials(viewProduct.name)}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Thumbnails Gallery */}
                                {viewProduct.images && viewProduct.images.split(',').length > 1 && (
                                    <div className="view-thumbnails">
                                        {viewProduct.images.split(',').map((imgUrl, idx) => (
                                            <div 
                                                key={`thumb-${idx}`}
                                                className={`view-thumb-item ${idx === activeImgIndex ? 'active' : ''}`}
                                                onClick={() => setActiveImgIndex(idx)}
                                            >
                                                <img src={imgUrl.trim()} alt="thumbnail" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Right Side: Tabular Details */}
                            <div className="view-modal-right">
                                <div className="view-modal-scroll">
                                    <div className="view-header">
                                        <div className="view-header-top">
                                            <span className="view-category-tag" style={{ background: `${getCategoryColor(viewProduct.category)}15`, color: getCategoryColor(viewProduct.category) }}>
                                                {viewProduct.category || 'Uncategorized'} » {viewProduct.subCategory || '---'}
                                            </span>
                                            {viewProduct.sellingType && <span className="selling-tag">{viewProduct.sellingType}</span>}
                                        </div>
                                        <h2 className="view-title text-truncate" title={viewProduct.name}>{viewProduct.name}</h2>
                                        <div className="view-sku-row">
                                            <span className="view-label">SKU:</span>
                                            <span className="view-value-sku">{viewProduct.sku || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    {viewProduct.description && (
                                        <div className="info-section">
                                            <h6 className="section-title">Product Description</h6>
                                            <p className="view-desc">{viewProduct.description}</p>
                                        </div>
                                    )}

                                    {/* Section 1: Stock & Warehouse */}
                                    <div className="info-section">
                                        <h6 className="section-title">Inventory & Placement</h6>
                                        <div className="view-grid">
                                            <div className="view-item">
                                                <span className="view-label">Store</span>
                                                <span className="view-value text-truncate">{viewProduct.store || 'Main Store'}</span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Warehouse</span>
                                                <span className="view-value text-truncate">{viewProduct.warehouse || 'Primary'}</span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Current Stock</span>
                                                <span className={`qty-badge ${getQtyBadge(viewProduct.quantity)}`}>
                                                    {viewProduct.quantity ?? 0} {viewProduct.unit || 'Pc'}
                                                </span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Stock Alert Level</span>
                                                <span className="view-value text-danger fw-bold">{viewProduct.quantityAlert || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Pricing & Tax */}
                                    <div className="info-section">
                                        <h6 className="section-title">Pricing & Taxation</h6>
                                        <div className="view-grid">
                                            <div className="view-item">
                                                <span className="view-label">Net Selling Price</span>
                                                <span className="view-value-price">{formatPrice(viewProduct.price)}</span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Discount</span>
                                                <span className="view-value">
                                                    {viewProduct.discountValue ? `${viewProduct.discountValue} ${viewProduct.discountType === 'PERCENT' ? '%' : ''}` : '---'}
                                                </span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Tax</span>
                                                <span className="view-value">{viewProduct.tax || '0%'} ({viewProduct.taxType || 'Exclusive'})</span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Brand</span>
                                                <span className="view-value">{viewProduct.brand || '---'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Manufacturing & Barcode */}
                                    <div className="info-section no-border">
                                        <h6 className="section-title">Manufacturing & Traceability</h6>
                                        <div className="view-grid">
                                            <div className="view-item">
                                                <span className="view-label">Manufacturer</span>
                                                <span className="view-value">{viewProduct.manufacturer || '---'}</span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Warranty</span>
                                                <span className="view-value">{viewProduct.warranty || 'No Warranty'}</span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Barcode Type</span>
                                                <span className="view-value">{viewProduct.barcodeSymbology || 'CODE128'}</span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Manufactured Date</span>
                                                <span className="view-value">{formatDate(viewProduct.manufacturedDate)}</span>
                                            </div>
                                            <div className="view-item">
                                                <span className="view-label">Expiry Date</span>
                                                <span className="view-value text-danger">{formatDate(viewProduct.expiryDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="view-footer">
                                    <div className="view-meta">
                                        <AlertCircle size={14} />
                                        <span>Last modified: {formatDate(viewProduct.updatedAt || viewProduct.createdAt)}</span>
                                    </div>
                                    <button className="view-btn-close" onClick={() => setViewProduct(null)}>Close Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
