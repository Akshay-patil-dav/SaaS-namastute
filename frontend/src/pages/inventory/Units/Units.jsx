import React, { useState } from 'react';
import '../Brands/Products.css';
import '../Brands/inventory-pages-custom.css';
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
import apiClient, { API } from '../../../api/config';
import { useConfirm } from '../../../context/ConfirmContext';
import AddUnitModal from '../../../components/modals/inventory/AddUnitModal/AddUnitModal';

const API_BASE = API.UNITS;

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
            const res = await apiClient.get(API_BASE);
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
            await apiClient.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
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
            await apiClient.delete(`${API_BASE}/${id}`);
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
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Units</h2>
                    <p className="ss-page-subtitle">Manage your units</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="PDF">
                        <FileText size={16} />
                    </button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel">
                        <FileSpreadsheet size={16} />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchUnits} disabled={loading}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" onClick={handleAddUnitClick}>
                        <PlusCircle size={18} /> Add Unit
                    </button>
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
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                                    <td className="ss-item-name">{item.name}</td>
                                    <td>{item.shortName}</td>
                                    <td>{item.products || 0}</td>
                                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <span className={item.status ? "ss-status-badge ss-status-active" : "ss-status-badge ss-status-inactive"}>
                                            {item.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                            <button className="ss-action-btn edit" title="Edit" onClick={() => handleEdit(item)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="ss-action-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>
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

                {/* Pagination Section */}
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
                        <button className="ss-page-btn">&lt;</button>
                        <button className="ss-page-btn active">1</button>
                        <button className="ss-page-btn">&gt;</button>
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
