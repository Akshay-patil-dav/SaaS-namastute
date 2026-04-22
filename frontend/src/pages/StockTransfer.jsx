import React, { useState, useEffect } from 'react';
import { 
    Search, 
    FileText, 
    Download, 
    RotateCcw, 
    ChevronUp, 
    Plus, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Upload,
    Eye
} from 'lucide-react';
import axios from 'axios';
import './stock-transfer.css';
import AddTransferModal from '../components/AddTransferModal';
import ImportTransferModal from '../components/ImportTransferModal';
import EditTransferModal from '../components/EditTransferModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function StockTransfer() {
    const [transfers, setTransfers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    
    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transferToDelete, setTransferToDelete] = useState(null);
    
    // Edit/View state
    const [editModalData, setEditModalData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const fetchTransfers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/transfers`);
            setTransfers(response.data);
        } catch (error) {
            console.error('Error fetching transfers:', error);
        }
    };

    useEffect(() => {
        fetchTransfers();
    }, []);

    const openDeleteModal = (id) => {
        setTransferToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!transferToDelete) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/transfers/${transferToDelete}`);
            fetchTransfers();
            setIsDeleteModalOpen(false);
            setTransferToDelete(null);
        } catch (error) {
            console.error('Error deleting transfer:', error);
            alert('Failed to delete transfer');
        }
    };

    const handleEdit = (transfer, viewMode = false) => {
        setEditModalData(transfer);
        setIsViewMode(viewMode);
        setIsEditModalOpen(true);
    };

    const toggleRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedRows(prev => 
            prev.length === transfers.length ? [] : transfers.map(d => d.id)
        );
    };

    const filteredData = transfers.filter(item => {
        const fromWarehouse = item.fromWarehouse || '';
        const toWarehouse = item.toWarehouse || '';
        const refNo = item.referenceNo || '';
        const st = searchTerm.toLowerCase();
        
        return fromWarehouse.toLowerCase().includes(st) ||
               toWarehouse.toLowerCase().includes(st) ||
               refNo.toLowerCase().includes(st);
    });

    return (
        <div className="stock-transfer-container">
            {/* Page Header */}
            <div className="page-header-flex">
                <div className="page-title-area">
                    <h5>Stock Transfer</h5>
                    <p className="page-subtitle">Manage your stock transfer</p>
                </div>
                <div className="header-action-buttons">
                    <button className="action-icon-btn btn-pdf" title="Export PDF"><FileText size={16} /></button>
                    <button className="action-icon-btn btn-excel" title="Export Excel"><Download size={16} /></button>
                    <button className="action-icon-btn" title="Refresh"><RotateCcw size={16} /></button>
                    <button className="action-icon-btn" title="Collapse"><ChevronUp size={16} /></button>
                    <button className="btn-add-new" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} />
                        Add New
                    </button>
                    <button className="btn-import" onClick={() => setIsImportModalOpen(true)}>
                        <Upload size={16} />
                        Import Transfer
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="transfer-card">
                {/* Filters */}
                <div className="filter-bar">
                    <div className="search-wrapper">
                        <Search className="search-icon" size={16} />
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-dropdowns">
                        <select className="filter-select">
                            <option>From Warehouse</option>
                            <option>Lavish Warehouse</option>
                            <option>Lobar Handy</option>
                        </select>
                        <select className="filter-select">
                            <option>To Warehouse</option>
                            <option>North Zone</option>
                            <option>Nova Storage</option>
                        </select>
                        <select className="filter-select" style={{ minWidth: '160px' }}>
                            <option>Sort By : Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="transfer-table-wrapper">
                    <table className="transfer-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedRows.length === transfers.length && transfers.length > 0}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>From Warehouse</th>
                                <th>To Warehouse</th>
                                <th>No of Products</th>
                                <th>Quantity Transferred</th>
                                <th>Ref Number</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className={selectedRows.includes(item.id) ? 'row-selected' : ''}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedRows.includes(item.id)}
                                                onChange={() => toggleRow(item.id)}
                                            />
                                        </td>
                                        <td>{item.fromWarehouse}</td>
                                        <td>{item.toWarehouse}</td>
                                        <td>{item.noOfProducts || 0}</td>
                                        <td>{item.quantityTransferred || 0}</td>
                                        <td><span className="ref-badge">{item.referenceNo}</span></td>
                                        <td>{item.formattedDate || item.date}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn btn-view" onClick={() => handleEdit(item, true)}><Eye size={14} /></button>
                                                <button className="action-btn btn-edit" onClick={() => handleEdit(item, false)}><Edit size={14} /></button>
                                                <button className="action-btn btn-delete" onClick={() => openDeleteModal(item.id)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#5b6670' }}>
                                        No matching records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-wrap">
                    <div className="entries-info">
                        <span>Row Per Page</span>
                        <select className="filter-select" style={{ minWidth: '70px', padding: '5px 25px 5px 10px' }}>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span>Entries</span>
                    </div>
                    <div className="pagination-nav">
                        <button className="page-btn" disabled><ChevronLeft size={16} /></button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="manage-stock-footer">
                <div className="footer-copyright">
                    2014 - 2026 © DreamsPOS. All Right Reserved
                </div>
                <div className="footer-designer">
                    Designed & Developed by <span>Dreams</span>
                </div>
            </footer>

            <AddTransferModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={fetchTransfers}
            />
            <ImportTransferModal 
                isOpen={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)} 
                onSuccess={fetchTransfers}
            />
            <EditTransferModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchTransfers}
                initialData={editModalData}
                isView={isViewMode}
            />
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Transfer"
                message="Are you sure you want to delete this transfer?"
            />
        </div>
    );
}
