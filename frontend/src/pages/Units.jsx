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
import { useConfirm } from '../context/ConfirmContext';
import AddUnitModal from '../components/AddUnitModal';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/units`;

const Units = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const { confirm } = useConfirm();

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_BASE);
            if (res.data && Array.isArray(res.data)) {
                setData(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch units:', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUnits();
    }, []);

    const filteredData = data.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (item.name || '').toLowerCase().includes(term) ||
            (item.shortName || '').toLowerCase().includes(term)
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
            title: 'Delete Units',
            message: `Are you sure you want to delete ${selectedIds.length} units?`
        });
        if (!isConfirmed) return;
        
        try {
            await axios.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            setSelectedIds([]);
            fetchUnits();
        } catch (err) {
            console.error('Failed to delete units:', err);
            alert('Failed to delete units.');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Unit',
            message: 'Are you sure you want to delete this unit?'
        });
        if (!isConfirmed) return;
        
        try {
            await axios.delete(`${API_BASE}/${id}`);
            fetchUnits();
        } catch (err) {
            console.error(err);
            alert('Failed to delete unit');
        }
    };

    const handleEdit = (item) => {
        setCurrentEditItem(item);
        setIsAddModalOpen(true);
    };

    const handleAddUnitClick = () => {
        setCurrentEditItem(null);
        setIsAddModalOpen(true);
    };

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Units</h4>
                    <p>Manage your units</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="btn-icon-action" title="Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="btn-icon-action" title="Refresh" onClick={fetchUnits} disabled={loading}>
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
                    <button className="btn-orange" onClick={handleAddUnitClick}>
                        <PlusCircle size={18} /> Add Unit
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
                </div>

                {/* Data Table */}
                <div className="table-responsive">
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
                                <th>Unit</th>
                                <th>Short name</th>
                                <th>No of Products</th>
                                <th>Created Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div className="d-flex flex-column align-items-center">
                                            <RefreshCw size={32} className="spin text-orange mb-2" />
                                            <p>Loading units...</p>
                                        </div>
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
                                    <td>{item.shortName}</td>
                                    <td>{item.products || 0}</td>
                                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <span className={item.status ? "badge-active" : "badge-inactive"}>
                                            {item.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons justify-content-center">
                                            <button className="action-btn" title="Edit" onClick={() => handleEdit(item)}>
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
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        No units available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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
            
            {/* Add/Edit Unit Modal */}
            <AddUnitModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onUnitAdded={() => {
                    setIsAddModalOpen(false);
                    fetchUnits();
                }} 
                unitData={currentEditItem} 
            />
        </div>
    );
};

export default Units;
