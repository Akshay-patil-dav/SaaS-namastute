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
    ListTree,
    TrendingUp,
    LayoutGrid
} from 'lucide-react';
import AddSubCategoryModal from '../components/AddSubCategoryModal';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/subcategories`;

const SubCategory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchSubCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_BASE);
            setData(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching sub categories:', err);
            showToast('error', 'Failed to fetch sub-categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubCategories();
    }, [fetchSubCategories]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    const filteredData = data.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (item.name || '').toLowerCase().includes(term) ||
            (item.categoryCode || '').toLowerCase().includes(term) ||
            (item.description || '').toLowerCase().includes(term) ||
            (item.category?.name || '').toLowerCase().includes(term)
        );
    });

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

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} sub-categories?`)) return;
        
        try {
            await axios.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            showToast('success', `${selectedIds.length} sub-categories deleted successfully`);
            fetchSubCategories();
            setSelectedIds([]);
        } catch (err) {
            console.error('Bulk delete failed:', err);
            showToast('error', 'Failed to delete sub-categories');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE}/${id}`);
            showToast('success', 'Sub-category deleted successfully');
            fetchSubCategories();
        } catch (err) {
            console.error('Delete failed:', err);
            showToast('error', 'Failed to delete sub-category');
        }
        setDeleteConfirm(null);
    };

    const handleEdit = (item) => {
        setEditingSubCategory(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingSubCategory(null);
        setIsModalOpen(true);
    };

    // Stats calculation
    const totalCount = data.length;
    const activeCount = data.filter(i => i.status).length;
    const inactiveCount = totalCount - activeCount;

    return (
        <div className="sub-category-page">
            {/* Toast Notifications */}
            {toast && (
                <div className={`prod-toast prod-toast-${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="toast-close"><X size={14} /></button>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="delete-overlay">
                    <div className="delete-modal">
                        <div className="delete-modal-icon"><Trash2 size={28} /></div>
                        <h5>Delete Sub-category?</h5>
                        <p>This action cannot be undone. All related data will be removed.</p>
                        <div className="delete-modal-actions">
                            <button className="btn-cancel-del" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn-confirm-del" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="ss-header-row">
                <div>
                    <h1 className="ss-page-title">Sub Category</h1>
                    <p className="ss-page-subtitle">Manage and organize your product sub-categories</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" title="Export PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="ss-btn-icon-square" title="Export Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchSubCategories}>
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
                    <button className="ss-btn-orange" onClick={handleAddNew}>
                        <PlusCircle size={18} /> Add Sub Category
                    </button>
                </div>
            </div>

            {/* Stats Cards Area */}
            <div className="ss-stats-container">
                <div className="ss-stat-card">
                    <div className="ss-stat-top">
                        <div className="ss-stat-info">
                            <h4>Total Sub Categories</h4>
                            <p>{totalCount}</p>
                        </div>
                        <div className="ss-btn-icon-square icon-blue">
                            <ListTree size={20} />
                        </div>
                    </div>
                    <div className="ss-stat-bottom">
                        <TrendingUp size={14} /> Overall inventory structure
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
                        <TrendingUp size={14} /> Currently visible in POS
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
                        Hidden from storefront
                    </div>
                </div>

                <div className="ss-stat-card">
                    <div className="ss-stat-top">
                        <div className="ss-stat-info">
                            <h4>Recent Growth</h4>
                            <p>+12%</p>
                        </div>
                        <div className="ss-btn-icon-square icon-orange">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="ss-stat-bottom">
                        <TrendingUp size={14} /> Compared to last month
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
                            placeholder="Search sub categories..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="ss-filters-wrap">
                        <select className="ss-filter-select">
                            <option>Category</option>
                        </select>
                        <select className="ss-filter-select">
                            <option>Status</option>
                        </select>
                        <select className="ss-filter-select">
                            <option>Sort By: Newest</option>
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
                                <th style={{ width: '80px' }}>Image</th>
                                <th>Sub Category</th>
                                <th>Category</th>
                                <th>Category Code</th>
                                <th>Description</th>
                                <th style={{ width: '100px' }}>Status</th>
                                <th style={{ textAlign: 'center', width: '100px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                                        <Loader className="spin mx-auto mb-2" size={24} style={{ color: '#ff9b29' }} />
                                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading data...</p>
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
                                    <td>
                                        <div className="ss-table-img-wrapper">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="ss-table-img" />
                                            ) : (
                                                <div className="ss-table-img-placeholder">
                                                    <LayoutGrid size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="ss-item-name">{item.name}</td>
                                    <td>
                                        <span className="ss-category-tag">{item.category?.name || 'Uncategorized'}</span>
                                    </td>
                                    <td>
                                        <code className="ss-code-badge">
                                            {item.categoryCode}
                                        </code>
                                    </td>
                                    <td className="ss-description-cell">
                                        {item.description}
                                    </td>
                                    <td>
                                        <span className={`ss-status-badge ${item.status ? "ss-status-active" : "ss-status-inactive"}`}>
                                            {item.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="ss-actions-group justify-content-center">
                                            <button className="ss-action-btn" title="Edit" onClick={() => handleEdit(item)}>
                                                <Pencil size={14} />
                                            </button>
                                            <button className="ss-action-btn delete" title="Delete" onClick={() => setDeleteConfirm(item.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ color: '#94a3b8' }}>
                                            <LayoutGrid size={40} strokeWidth={1} style={{ marginBottom: '12px', opacity: 0.5 }} />
                                            <p>No sub categories available</p>
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
                        <button className="ss-page-btn">2</button>
                        <button className="ss-page-btn">&gt;</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AddSubCategoryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubCategoryAdded={fetchSubCategories}
                subCategoryData={editingSubCategory}
            />
        </div>
    );
};

export default SubCategory;

