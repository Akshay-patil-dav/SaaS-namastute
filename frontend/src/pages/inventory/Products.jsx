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
    X,
    UploadCloud
} from 'lucide-react';
import { useConfirm } from '../../context/ConfirmContext';

const API_BASE = `${ENV.API_BASE_URL}/products`;

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
    const [viewProduct, setViewProduct]     = useState(null);   // product to view
    const [activeImgIndex, setActiveImgIndex] = useState(0);    // for gallery
    const [selectedIds, setSelectedIds]       = useState([]);

    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile]           = useState(null);
    const [importing, setImporting]             = useState(false);
    const [dragActive, setDragActive]           = useState(false);
    const [importError, setImportError]         = useState('');
    
    const { confirm } = useConfirm();

    // ── Fetch products from backend ──────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_BASE);
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

    // ── CSV Import Handlers ──────────────────────────────────────────────────
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.csv')) {
                setImportFile(file);
                setImportError('');
            } else {
                setImportError('Please upload a valid CSV file.');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.name.endsWith('.csv')) {
                setImportFile(file);
                setImportError('');
            } else {
                setImportError('Please upload a valid CSV file.');
            }
        }
    };

    const handleImportSubmit = async (e) => {
        e.preventDefault();
        if (!importFile) return;
        setImporting(true);
        setImportError('');

        const formData = new FormData();
        formData.append('file', importFile);

        try {
            const res = await apiClient.post(`${API_BASE}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showToast('success', res.data.message || 'Products imported successfully.');
            setShowImportModal(false);
            setImportFile(null);
            fetchProducts();
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || 'Failed to import products.';
            setImportError(errMsg);
            showToast('error', errMsg);
        } finally {
            setImporting(false);
        }
    };

    const downloadSampleCsv = () => {
        const headers = 'name,sku,category,brand,price,quantity,unit,barcode,description,store,warehouse,selling_type,sub_category,barcode_symbology,product_type,tax_type,tax,discount_type,discount_value,quantity_alert,warranty,manufacturer,manufactured_date,expiry_date,images\n';
        const sampleData = '"Sample Laptop","SKU-LAP123","Electronics","Dell",1200.00,50,"Pc","8901234567890","Powerful developer laptop","Main Store","Primary","RETAIL","Computers","CODE128","SINGLE","Exclusive","18%","PERCENT",5.00,10,"1 Year Warranty","Dell Inc","2026-01-01","2028-01-01","https://images.unsplash.com/photo-1593642632823-8f785ba67e45"\n';
        const blob = new Blob([headers + sampleData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "products_import_sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
            return;
        }

        const isConfirmed = await confirm({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product?'
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
            title: 'Delete Products',
            message: `Are you sure you want to delete ${selectedIds.length} products?`
        });
        if (!isConfirmed) return;

        try {
            await apiClient.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            showToast('success', `${selectedIds.length} products deleted successfully.`);
            setSelectedIds([]);
            fetchProducts();
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


            {/* Header */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Product List</h2>
                    <p className="ss-page-subtitle">
                        {loading ? 'Loading…' : (
                            <>
                                {dbProducts.length > 0
                                    ? <span>{dbProducts.length} from database</span>
                                    : <span>Showing demo data</span>
                                }
                            </>
                        )}
                    </p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="PDF"><FileText size={16} /></button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel"><FileSpreadsheet size={16} /></button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchProducts}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <Link to="/create-product" className="ss-btn-orange" style={{ textDecoration: 'none' }}>
                        <PlusCircle size={18} /> Add Product
                    </Link>
                    <button 
                        className="ss-btn-orange" 
                        style={{ background: '#5b6670', borderColor: '#5b6670' }}
                        onClick={() => setShowImportModal(true)}
                    >
                        <Download size={18} /> Import Product
                    </button>
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
            <div className="ss-main-panel">

                {/* Filter Row */}
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={18} />
                        <input
                            type="text"
                            className="ss-search-input"
                            placeholder="Search by name, SKU, brand, category…"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="ss-filters-wrap">
                        <select className="ss-filter-select">
                            <option value="">Category</option>
                        </select>
                        <select className="ss-filter-select">
                            <option value="">Brand</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
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
                                        {/* Show real product image if available, else initials avatar */}
                                        {item.images && item.images.split(',')[0]?.trim() ? (
                                            <img
                                                src={item.images.split(',')[0].trim()}
                                                alt={item.name}
                                                style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                                                }}
                                            />
                                        ) : null}
                                        {/* Initials avatar — shown when no image or image fails */}
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
                                        <div>
                                            <span className="ss-item-name">{item.name}</span>
                                            {item._isMock && <span style={{ marginLeft: '5px', fontSize: '10px', color: '#999', fontStyle: 'italic' }}>demo</span>}
                                        </div>
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
                                <td>{item.brand || '—'}</td>
                                <td style={{ fontWeight: '600' }}>{formatPrice(item.price)}</td>
                                <td>{item.unit || 'Pc'}</td>
                                <td>
                                    <span className={`ss-status-badge ${item.quantity <= 0 ? 'ss-status-inactive' : item.quantity < 50 ? 'ss-status-pending' : 'ss-status-active'}`}>
                                        {item.quantity ?? 0}
                                    </span>
                                </td>
                                <td style={{ color: '#5b6670', fontSize: '13px' }}>{formatDate(item.createdAt)}</td>
                                <td>
                                    <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                        <button 
                                            className="ss-action-btn view" 
                                            title="View"
                                            onClick={() => { setViewProduct(item); setActiveImgIndex(0); }}
                                        >
                                            <Eye size={15} />
                                        </button>
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

                        {/* Empty state */}
                        {!loading && paginated.length === 0 && (
                            <tr>
                                <td colSpan="10">
                                    <div className="empty-state">
                                        <Package size={48} strokeWidth={1} />
                                        <p>{searchTerm ? 'No products match your search.' : 'No products available.'}</p>
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
                                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
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

            {/* CSV Import Modal */}
            {showImportModal && (
                <div className="import-overlay" onClick={() => !importing && setShowImportModal(false)}>
                    <div className="import-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="import-modal-header">
                            <h3 className="import-modal-title">Import Products from CSV</h3>
                            <button className="import-modal-close" onClick={() => !importing && setShowImportModal(false)} disabled={importing}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="import-modal-body">
                            {importError && (
                                <div className="prod-toast prod-toast-error" style={{ position: 'static', minWidth: 'auto', marginBottom: '10px', maxWidth: 'none' }}>
                                    <AlertCircle size={17} />
                                    <span>{importError}</span>
                                </div>
                            )}

                            {/* Drag and Drop Zone */}
                            {!importFile ? (
                                <div 
                                    className={`import-drag-zone ${dragActive ? 'active' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('csv-file-input').click()}
                                >
                                    <input 
                                        type="file" 
                                        id="csv-file-input" 
                                        accept=".csv" 
                                        style={{ display: 'none' }} 
                                        onChange={handleFileChange}
                                    />
                                    <div className="import-drag-icon">
                                        <UploadCloud size={24} />
                                    </div>
                                    <p className="import-drag-text">Drag & drop your CSV file here or click to browse</p>
                                    <p className="import-drag-subtext">Supported format: .csv up to 10MB</p>
                                </div>
                            ) : (
                                <div className="import-file-info">
                                    <div className="import-file-icon">
                                        <FileSpreadsheet size={32} style={{ color: '#28c76f' }} />
                                    </div>
                                    <div className="import-file-details">
                                        <span className="import-file-name">{importFile.name}</span>
                                        <span className="import-file-size">{(importFile.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                    <button 
                                        className="import-file-remove" 
                                        onClick={() => setImportFile(null)}
                                        disabled={importing}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Standard sample format helper button */}
                            <button className="import-btn-sample" onClick={downloadSampleCsv}>
                                <Download size={14} /> Download Sample CSV Template
                            </button>

                            {/* Instructions Box */}
                            <div className="import-instructions">
                                <h4 className="import-instructions-title">
                                    <AlertCircle size={16} /> Column Requirements:
                                </h4>
                                <ul className="import-instructions-list">
                                    <li><strong>Required headers:</strong> name, price.</li>
                                    <li><strong>Optional headers:</strong> sku, category, brand, quantity, unit, barcode, description, store, warehouse, discount_type, discount_value, images, warranty, etc.</li>
                                    <li>Make sure values for price and quantity are numerical.</li>
                                    <li>Date fields should be formatted as YYYY-MM-DD.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="import-modal-footer">
                            <button 
                                className="import-btn-cancel" 
                                onClick={() => setShowImportModal(false)}
                                disabled={importing}
                            >
                                Cancel
                            </button>
                            <button 
                                className="import-btn-submit" 
                                onClick={handleImportSubmit}
                                disabled={!importFile || importing}
                            >
                                {importing ? 'Importing...' : 'Upload & Import'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
