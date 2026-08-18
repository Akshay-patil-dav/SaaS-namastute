import React, { useState, useEffect } from 'react';
import '../Brands/Products.css';
import '../Brands/inventory-pages-custom.css';
import { 
    FileText, 
    FileSpreadsheet, 
    RefreshCw, 
    PlusCircle,
    Search,
    Pencil,
    Trash2
} from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import AddStoreModal from '../../../components/modals/inventory/AddStoreModal/AddStoreModal';
import { useConfirm } from '../../../context/ConfirmContext';

const API_BASE = `${ENV.API_BASE_URL}/stores`;

const Store = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState(null);
    const { confirm } = useConfirm();

    const fetchStores = async () => {
        try {
            const res = await apiClient.get(API_BASE);
            if (res.data && Array.isArray(res.data)) {
                setData(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch stores:', err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleStoreAdded = () => {
        fetchStores();
    };

    const filteredData = data.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (item.name || '').toLowerCase().includes(term) ||
            (item.location || '').toLowerCase().includes(term)
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
            title: 'Delete Stores',
            message: `Are you sure you want to delete ${selectedIds.length} stores?`
        });
        if (!isConfirmed) return;
        
        try {
            await apiClient.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
            setSelectedIds([]);
            fetchStores();
        } catch (err) {
            console.error('Failed to delete stores:', err);
            alert('Failed to delete stores.');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Store',
            message: 'Are you sure you want to delete this store?'
        });
        if (!isConfirmed) return;
        try {
            await apiClient.delete(`${API_BASE}/${id}`);
            fetchStores();
        } catch (err) {
            console.error(err);
            alert('Failed to delete store');
        }
    };

    return (
        <div className="product-page-container">
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Stores</h2>
                    <p className="ss-page-subtitle">Manage your stores</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="PDF">
                        <FileText size={16} />
                    </button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel">
                        <FileSpreadsheet size={16} />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchStores}>
                        <RefreshCw size={16} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" onClick={() => { setEditingStore(null); setIsAddModalOpen(true); }}>
                        <PlusCircle size={18} /> Add Store
                    </button>
                </div>
            </div>

            <div className="ss-main-panel">
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={18} />
                        <input 
                            type="text" 
                            className="ss-search-input"
                            placeholder="Search Store..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

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
                                <th>Store Name</th>
                                <th>Location</th>
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
                                            className="ss-checkbox" 
                                            checked={selectedIds.includes(item.id)}
                                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="ss-item-name">{item.name}</td>
                                    <td>{item.location || '-'}</td>
                                    <td>
                                        <span className={item.status ? "ss-status-badge ss-status-active" : "ss-status-badge ss-status-inactive"}>
                                            {item.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                            <button className="ss-action-btn edit" title="Edit" onClick={() => { setEditingStore(item); setIsAddModalOpen(true); }}>
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
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        No store available here
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

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
            </div>

            <AddStoreModal 
                isOpen={isAddModalOpen} 
                onClose={() => { setIsAddModalOpen(false); setEditingStore(null); }}
                onStoreAdded={handleStoreAdded}
                storeData={editingStore}
            />
        </div>
    );
};

export default Store;
