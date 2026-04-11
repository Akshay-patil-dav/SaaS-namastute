import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Products.css';
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
    Loader
} from 'lucide-react';
import AddCategoryModal from '../components/AddCategoryModal';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/categories`;


const Category = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_BASE);
            if (res.data && Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                console.warn('Backend did not return an array of categories:', res.data);
                setCategories([]);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
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
        try {
            await axios.delete(`${API_BASE}/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
            showToast('success', 'Category deleted successfully.');
        } catch {
            showToast('error', 'Failed to delete category.');
        }
        setDeleteConfirm(null);
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} categories?`)) return;

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
        const name = (item.name || '').toLowerCase();
        const slug = (item.slug || '').toLowerCase();
        return name.includes(term) || slug.includes(term);
    }) : [];

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
                        <h5>Delete Category?</h5>
                        <p>This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                            <button className="btn-cancel-del" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn-confirm-del" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Category</h4>
                    <p>Manage your categories</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="btn-icon-action" title="Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="btn-icon-action" title="Refresh" onClick={fetchCategories}>
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                    <button className="btn-icon-action" title="Collapse">
                        <ChevronUp size={18} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="btn-red-outline" onClick={handleBulkDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 15px', height: '40px', borderRadius: '6px', border: '1px solid #ea5455', color: '#ea5455', background: '#fff', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="btn-orange" onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}>
                        <PlusCircle size={18} /> Add Category
                    </button>
                </div>
            </div>

            {/* Table Card Area */}
            <div className="product-table-card">
                
                {/* Filter Row */}
                <div className="table-filter-row">
                    <div className="search-box" style={{ maxWidth: '400px' }}>
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-dropdowns">
                        <div className="filter-select">
                            Status <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <table className="custom-table" style={{ minWidth: '700px' }}>
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
                            <th>Category</th>
                            <th>Category slug</th>
                            <th>Created On</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    <Loader className="spin" size={24} style={{ color: '#ff9b29' }} />
                                </td>
                            </tr>
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
                                <td>{item.name}</td>
                                <td>{item.slug}</td>
                                <td>{formatDate(item.createdAt)}</td>
                                <td>
                                    <span className={item.status ? "badge-success" : "badge-danger"} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                        {item.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons justify-content-center">
                                        <button className="action-btn" title="Edit" onClick={() => { setEditingCategory(item); setIsModalOpen(true); }}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="action-btn" title="Delete" onClick={() => setDeleteConfirm(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                                    No categories available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
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
                    <div className="pagination-controls">
                        <button className="page-btn bg-light">&lt;</button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn bg-light">&gt;</button>
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
