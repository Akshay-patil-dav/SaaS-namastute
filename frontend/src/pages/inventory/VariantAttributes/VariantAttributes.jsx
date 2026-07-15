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
import { useConfirm } from '../../../context/ConfirmContext';
import AddVariantModal from '../../../components/modals/inventory/AddVariantModal/AddVariantModal';

const mockData = [
    { id: 1, variant: 'Size', values: 'S, M, L, XL', date: '12-04-2024', status: 'Active' },
    { id: 2, variant: 'Color', values: 'Red, Blue, Green, Black', date: '11-04-2024', status: 'Active' },
    { id: 3, variant: 'Material', values: 'Cotton, Polyester, Silk', date: '10-04-2024', status: 'Inactive' }
];

const VariantAttributes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [data, setData] = useState(mockData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    const { confirm } = useConfirm();

    const filteredData = data.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (item.variant || '').toLowerCase().includes(term) ||
            (item.values || '').toLowerCase().includes(term)
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
            title: 'Delete Attributes',
            message: `Are you sure you want to delete ${selectedIds.length} attributes?`
        });
        if (!isConfirmed) return;
        
        setData(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Attribute',
            message: 'Are you sure you want to delete this attribute?'
        });
        if (!isConfirmed) return;
        
        setData(prev => prev.filter(item => item.id !== id));
    };

    const handleAddClick = () => {
        setEditingVariant(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (variant) => {
        setEditingVariant(variant);
        setIsModalOpen(true);
    };

    const handleVariantSaved = (variant) => {
        if (editingVariant) {
            setData(prev => prev.map(item => item.id === variant.id ? variant : item));
        } else {
            setData(prev => [variant, ...prev]);
        }
    };

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Variant Attributes</h2>
                    <p className="ss-page-subtitle">Manage your variant attributes</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="PDF">
                        <FileText size={16} />
                    </button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel">
                        <FileSpreadsheet size={16} />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={() => window.location.reload()}>
                        <RefreshCw size={16} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" onClick={handleAddClick}>
                        <PlusCircle size={18} /> Add Variant
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
                                <th>Variant</th>
                                <th>Values</th>
                                <th>Created Date</th>
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
                                    <td className="ss-item-name">{item.variant}</td>
                                    <td>{item.values}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <span className={item.status === 'Active' ? 'ss-status-badge ss-status-active' : 'ss-status-badge ss-status-inactive'}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                            <button className="ss-action-btn edit" title="Edit" onClick={() => handleEditClick(item)}>
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
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    No variants available
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

            <AddVariantModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVariantSaved={handleVariantSaved}
                variantData={editingVariant}
            />
        </div>
    );
};

export default VariantAttributes;
