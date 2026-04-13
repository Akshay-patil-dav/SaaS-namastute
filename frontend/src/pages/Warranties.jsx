import React, { useState, useEffect } from 'react';
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
import { useConfirm } from '../context/ConfirmContext';
import AddWarrantyModal from '../components/AddWarrantyModal';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/warranties`;

const Warranties = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { confirm } = useConfirm();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWarranty, setEditingWarranty] = useState(null);

    const fetchWarranties = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(API_BASE);
            setData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWarranties();
    }, []);

    const filteredData = data.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (item.name || '').toLowerCase().includes(term) ||
            (item.description || item.desc || '').toLowerCase().includes(term)
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
            title: 'Delete Warranties',
            message: `Are you sure you want to delete ${selectedIds.length} warranties?`
        });
        if (!isConfirmed) return;
        
        try {
            await axios.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            setSelectedIds([]);
            fetchWarranties();
        } catch (err) {
            console.error('Bulk delete error:', err);
            alert('Failed to delete warranties');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Warranty',
            message: 'Are you sure you want to delete this warranty?'
        });
        if (!isConfirmed) return;
        
        try {
            await axios.delete(`${API_BASE}/${id}`);
            fetchWarranties();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete warranty');
        }
    };

    const handleAddClick = () => {
        setEditingWarranty(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (warranty) => {
        setEditingWarranty(warranty);
        setIsModalOpen(true);
    };

    const handleWarrantyAdded = () => {
        fetchWarranties();
    };

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Warranties</h4>
                    <p>Manage your warranties</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="btn-icon-action" title="Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="btn-icon-action" title="Refresh">
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
                    <button className="btn-orange" onClick={handleAddClick}>
                        <PlusCircle size={18} /> Add Warranty
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
                            <th>Name</th>
                            <th>Description</th>
                            <th>Duration</th>
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
                                <td>{item.description || item.desc}</td>
                                <td>{item.duration}</td>
                                <td>
                                    <span className={(item.status === 'Active' || item.status === true) ? 'badge-active' : 'badge-inactive'}>
                                        &#8226; {(item.status === 'Active' || item.status === true) ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons justify-content-center">
                                        <button className="action-btn" title="Edit" onClick={() => handleEditClick(item)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="action-btn" title="Delete" onClick={() => handleDelete(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    No warranty available.
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

            {/* Add/Edit Modal */}
            <AddWarrantyModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onWarrantyAdded={handleWarrantyAdded}
                warrantyData={editingWarranty}
            />
        </div>
    );
};

export default Warranties;
