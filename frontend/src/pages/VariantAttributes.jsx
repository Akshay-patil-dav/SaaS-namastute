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
import { useConfirm } from '../context/ConfirmContext';
import AddVariantModal from '../components/AddVariantModal';

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
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Variant Attributes</h4>
                    <p>Manage your variant attributes</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="PDF">
                        <FileText size={18} className="icon-red" />
                    </button>
                    <button className="btn-icon-action" title="Excel">
                        <FileSpreadsheet size={18} className="icon-green" />
                    </button>
                    <button className="btn-icon-action" title="Refresh" onClick={() => window.location.reload()}>
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
                        <PlusCircle size={18} /> Add Variant
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
                                <td>{item.variant}</td>
                                <td>{item.values}</td>
                                <td>{item.date}</td>
                                <td>
                                    <span className={item.status === 'Active' ? 'badge-active' : 'badge-inactive'}>
                                        &#8226; {item.status}
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
                                    No variants available
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
