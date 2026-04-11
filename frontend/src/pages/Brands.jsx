import React, { useState } from 'react';
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
    Trash2
} from 'lucide-react';
import axios from 'axios';
import AddBrandModal from '../components/AddBrandModal';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/brands`;

const Brands = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    const fetchBrands = async () => {
        try {
            const res = await axios.get(API_BASE);
            if (res.data && Array.isArray(res.data)) {
                setData(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch brands:', err);
        }
    };

    React.useEffect(() => {
        fetchBrands();
    }, []);

    const handleBrandAdded = () => {
        fetchBrands();
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
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} brands?`)) return;
        
        try {
            await axios.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            setSelectedIds([]);
            fetchBrands();
        } catch (err) {
            console.error('Failed to delete brands:', err);
            alert('Failed to delete brands.');
        }
    };

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Brands</h4>
                    <p>Manage your brands</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="btn-icon-action" title="Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="btn-icon-action" title="Refresh" onClick={fetchBrands}>
                        <RefreshCw size={18} />
                    </button>
                    <button className="btn-icon-action" title="Collapse">
                        <ChevronUp size={18} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="btn-red-outline" onClick={handleBulkDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 15px', height: '40px', borderRadius: '6px', border: '1px solid #ea5455', color: '#ea5455', background: '#fff', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="btn-orange" onClick={() => { setEditingBrand(null); setIsAddModalOpen(true); }}>
                        <PlusCircle size={18} /> Add Brand
                    </button>
                </div>
            </div>

            {/* Table Card Area */}
            <div className="product-table-card">
                
                {/* Filter Row */}
                <div className="table-filter-row justify-content-end">
                    <div className="search-box me-auto" style={{ maxWidth: '400px' }}>
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
                            <th>Brand</th>
                            <th>Logo</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
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
                                <td>
                                    <div className="product-name-cell p-0 py-1">
                                        <img src={item.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`} alt={item.name} className="product-img m-0" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                    </div>
                                </td>
                                <td>{item.desc}</td>
                                <td>
                                    <span className={item.status ? "badge-active" : "badge-inactive"}>
                                        {item.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons justify-content-center">
                                        <button className="action-btn" title="Edit" onClick={() => { setEditingBrand(item); setIsAddModalOpen(true); }}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="action-btn" title="Delete" onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this brand?')) {
                                                try {
                                                    await axios.delete(`${API_BASE}/${item.id}`);
                                                    fetchBrands();
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Failed to delete brand');
                                                }
                                            }
                                        }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    No product Avalable tehre
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
