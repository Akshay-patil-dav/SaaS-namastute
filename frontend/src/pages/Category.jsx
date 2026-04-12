import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './inventory-pages-custom.css';
import { 
    FileText, 
    FileSpreadsheet, 
    RefreshCw, 
    ChevronUp, 
    PlusCircle,
    Search,
    ChevronDown,
    Pencil,
    Trash2,
    CheckCircle,
    AlertCircle,
    X,
    Loader,
    Layers,
    TrendingUp,
    LayoutGrid,
    Tag
} from 'lucide-react';
import AddCategoryModal from '../components/AddCategoryModal';
import { useConfirm } from '../context/ConfirmContext';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/categories`;

const Category = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    
    const { confirm } = useConfirm();

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_BASE);
            if (res.data && Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                setCategories([]);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            showToast('error', 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Category',
            message: 'Are you sure you want to delete this category? All related sub-categories may be affected.'
        });

        if (!isConfirmed) return;

        try {
            await axios.delete(`${API_BASE}/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
            showToast('success', 'Category deleted successfully.');
        } catch {
            showToast('error', 'Failed to delete category.');
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Categories',
            message: `Are you sure you want to delete ${selectedIds.length} categories?`
        });
        if (!isConfirmed) return;

        try {
            await axios.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            showToast('success', `${selectedIds.length} categories deleted successfully.`);
            setSelectedIds([]);
            fetchCategories();
        } catch (err) {
            showToast('error', 'Failed to delete categories.');
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

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const filteredData = Array.isArray(categories) ? categories.filter(item => {
        if (!item) return false;
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (item.name || '').toLowerCase().includes(term) || (item.slug || '').toLowerCase().includes(term);
    }) : [];

    // Stats
    const totalCount = categories.length;
    const activeCount = categories.filter(c => c.status).length;
    const inactiveCount = totalCount - activeCount;

    return (
        <div className="sub-category-page">
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
                <div>
                    <h1 className="ss-page-title">Category</h1>
                    <p className="ss-page-subtitle">Manage your primary product categories</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" title="PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="ss-btn-icon-square" title="Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchCategories}>
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                    <button className="ss-btn-icon-square" title="Collapse">
                        <ChevronUp size={18} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 15px', height: '40px', borderRadius: '8px', border: '1px solid #ef4444', color: '#ef4444', background: '#fff', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}>
                        <PlusCircle size={18} /> Add Category
                    </button>
                </div>
            </div>

            {/* Stats Cards Area */}
            <div className="ss-stats-container">
                <div className="ss-stat-card">
                    <div className="ss-stat-top">
                        <div className="ss-stat-info">
                            <h4>Total Categories</h4>
                            <p>{totalCount}</p>
                        </div>
                        <div className="ss-btn-icon-square icon-blue">
                            <Layers size={20} />
                        </div>
                    </div>
                    <div className="ss-stat-bottom">
                        <TrendingUp size={14} /> Major product groups
                    </div>
                </div>

                <div className="ss-stat-card">
                    <div className="ss-stat-top">
                        <div className="ss-stat-info">
                            <h4>Active</h4>
                            <p>{activeCount}</p>
                        </div>
                        <div className="ss-btn-icon-square icon-green">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div className="ss-stat-bottom">
                        <TrendingUp size={14} /> Available in storefront
                    </div>
                </div>

                <div className="ss-stat-card">
                    <div className="ss-stat-top">
                        <div className="ss-stat-info">
                            <h4>Inactive</h4>
                            <p>{inactiveCount}</p>
                        </div>
                        <div className="ss-btn-icon-square icon-red">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="ss-stat-bottom" style={{ color: '#ef4444' }}>
                        Hidden from customers
                    </div>
                </div>

                <div className="ss-stat-card">
                    <div className="ss-stat-top">
                        <div className="ss-stat-info">
                            <h4>Quick Filter</h4>
                            <p>Recent</p>
                        </div>
                        <div className="ss-btn-icon-square icon-orange">
                            <Tag size={20} />
                        </div>
                    </div>
                    <div className="ss-stat-bottom">
                        <TrendingUp size={14} /> Updated recently
                    </div>
                </div>
            </div>

            {/* Main Panel Area */}
            <div className="ss-main-panel">
                
                {/* Table Controls */}
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={18} />
                        <input 
                            type="text" 
                            className="ss-search-input"
                            placeholder="Search categories..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="ss-filters-wrap">
                        <select className="ss-filter-select">
                            <option>Status</option>
                        </select>
                        <select className="ss-filter-select">
                            <option>Sort By: A-Z</option>
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
                                        checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th>Category</th>
                                <th>Category Slug</th>
                                <th>Created On</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        <Loader className="spin mx-auto mb-2" size={24} style={{ color: '#ff9b29' }} />
                                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading categories...</p>
                                    </td>
                                </tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            className="ss-checkbox" 
                                            checked={selectedIds.includes(item.id)}
                                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="ss-item-name">{item.name}</td>
                                    <td>
                                        <code style={{ background: '#f8fafc', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                                            {item.slug}
                                        </code>
                                    </td>
                                    <td>{formatDate(item.createdAt)}</td>
                                    <td>
                                        <span className={`ss-status-badge ${item.status ? "ss-status-active" : "ss-status-inactive"}`}>
                                            {item.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="ss-actions-group justify-content-center">
                                            <button className="ss-action-btn" title="Edit" onClick={() => { setEditingCategory(item); setIsModalOpen(true); }}>
                                                <Pencil size={14} />
                                            </button>
                                            <button className="ss-action-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ color: '#94a3b8' }}>
                                            <LayoutGrid size={40} strokeWidth={1} style={{ marginBottom: '12px', opacity: 0.5 }} />
                                            <p>No categories available</p>
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
                        Row Per Page 
                        <select defaultValue="10">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select> 
                        Entries
                    </div>
                    <div className="ss-page-controls">
                        <button className="ss-page-btn" disabled>&lt;</button>
                        <button className="ss-page-btn active">1</button>
                        <button className="ss-page-btn">&gt;</button>
                    </div>
                </div>
            </div>

            <AddCategoryModal 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setEditingCategory(null); }} 
                onCategoryAdded={fetchCategories}
                categoryData={editingCategory}
            />
        </div>
    );
};

export default Category;

