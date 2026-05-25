import React, { useState, useCallback, useEffect } from 'react';
import './Products.css';
import './inventory-pages-custom.css';
import { 
    FileText, 
    FileSpreadsheet, 
    RefreshCw, 
    PlusCircle,
    Search,
    Pencil,
    Trash2,
    CheckCircle,
    AlertCircle,
    X,
    Loader,
    Tag,
    TrendingUp,
    Award
} from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import AddBrandModal from '../components/AddBrandModal';
import { useConfirm } from '../context/ConfirmContext';

const API_BASE = `${ENV.API_BASE_URL}/brands`;

const Brands = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const { confirm } = useConfirm();

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchBrands = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_BASE);
            if (res.data && Array.isArray(res.data)) {
                setData(res.data);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error('Failed to fetch brands:', err);
            showToast('error', 'Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const handleBrandAdded = () => {
        fetchBrands();
        showToast('success', editingBrand ? 'Brand updated successfully.' : 'Brand added successfully.');
    };

    const filteredData = data.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (item.name || '').toLowerCase().includes(term) ||
            (item.desc || '').toLowerCase().includes(term)
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
        const isConfirmed = await confirm({
            title: 'Delete Brands',
            message: `Are you sure you want to delete ${selectedIds.length} brand${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`
        });
        if (!isConfirmed) return;
        
        try {
            await apiClient.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            showToast('success', `${selectedIds.length} brand${selectedIds.length > 1 ? 's' : ''} deleted successfully.`);
            setSelectedIds([]);
            fetchBrands();
        } catch (err) {
            console.error('Failed to delete brands:', err);
            showToast('error', 'Failed to delete selected brands.');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Brand',
            message: 'Are you sure you want to delete this brand? Products using this brand will be unaffected.'
        });
        if (!isConfirmed) return;
        try {
            await apiClient.delete(`${API_BASE}/${id}`);
            showToast('success', 'Brand deleted successfully.');
            fetchBrands();
        } catch (err) {
            console.error(err);
            showToast('error', 'Failed to delete brand.');
        }
    };

    // Stats
    const totalCount = data.length;
    const activeCount = data.filter(b => b.status).length;
    const inactiveCount = totalCount - activeCount;

    return (
        <div className="sub-category-page">
            {/* Toast Notification */}
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
                    <h1 className="ss-page-title">Brands</h1>
                    <p className="ss-page-subtitle">Manage your product brands and manufacturers</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" title="Export PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="ss-btn-icon-square" title="Export Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchBrands}>
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" onClick={() => { setEditingBrand(null); setIsAddModalOpen(true); }}>
                        <PlusCircle size={18} /> Add Brand
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="ss-stats-container">
                <div className="ss-stat-card">
                    <div className="ss-stat-top">
                        <div className="ss-stat-info">
                            <h4>Total Brands</h4>
                            <p>{totalCount}</p>
                        </div>
                        <div className="ss-btn-icon-square icon-blue">
                            <Award size={20} />
                        </div>
                    </div>
                    <div className="ss-stat-bottom">
                        <TrendingUp size={14} /> All registered brands
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
                        <TrendingUp size={14} /> Visible in products
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
                            <h4>With Logo</h4>
                            <p>{data.filter(b => b.img).length}</p>
                        </div>
                        <div className="ss-btn-icon-square icon-orange">
                            <Tag size={20} />
                        </div>
                    </div>
                    <div className="ss-stat-bottom">
                        <TrendingUp size={14} /> Brands with logos uploaded
                    </div>
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
                            placeholder="Search brands..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="ss-filters-wrap">
                        <select className="ss-filter-select">
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
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
                                <th>Brand</th>
                                <th>Logo</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '50px' }}>
                                        <Loader className="spin" size={26} style={{ color: '#ff9b29', display: 'block', margin: '0 auto 12px' }} />
                                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Loading brands...</p>
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
                                            <div className="ss-table-img-wrapper">
                                                <img 
                                                    src={item.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=fff7ed&color=f97316&bold=true`} 
                                                    alt={item.name} 
                                                    className="ss-table-img" 
                                                />
                                            </div>
                                        </td>
                                        <td className="ss-description-cell">{item.desc || '—'}</td>
                                        <td>
                                            <span className={item.status ? "ss-status-badge ss-status-active" : "ss-status-badge ss-status-inactive"}>
                                                {item.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                <button 
                                                    className="ss-action-btn edit" 
                                                    title="Edit Brand" 
                                                    onClick={() => { setEditingBrand(item); setIsAddModalOpen(true); }}
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button 
                                                    className="ss-action-btn delete" 
                                                    title="Delete Brand" 
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '50px' }}>
                                        <div style={{ color: '#94a3b8' }}>
                                            <Award size={44} strokeWidth={1} style={{ marginBottom: '12px', opacity: 0.4, display: 'block', margin: '0 auto 12px' }} />
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#64748b' }}>No brands found</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
                                                {searchTerm ? `No results for "${searchTerm}"` : 'Add your first brand to get started'}
                                            </p>
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

            {/* Modal — rendered outside the table panels but inside the page root */}
            <AddBrandModal 
                isOpen={isAddModalOpen} 
                onClose={() => { setIsAddModalOpen(false); setEditingBrand(null); }}
                onBrandAdded={handleBrandAdded}
                brandData={editingBrand}
            />
        </div>
    );
};

export default Brands;
