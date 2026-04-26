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
    Eye,
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';
import axios from 'axios';
import './manage-stock.css';
import './inventory-pages-custom.css';
import AddStockModal from '../components/AddStockModal';
import ViewStockModal from '../components/ViewStockModal';
import EditStockModal from '../components/EditStockModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';



export default function ManageStock() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/stocks`);
            setStocks(response.data);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const toggleRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedRows(prev => 
            prev.length === stocks.length ? [] : stocks.map(d => d.id)
        );
    };

    const handleView = (stock) => {
        setSelectedStock(stock);
        setIsViewModalOpen(true);
    };

    const handleEdit = (stock) => {
        setSelectedStock(stock);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (stock) => {
        setSelectedStock(stock);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/stocks/${selectedStock.id}`);
            fetchStocks();
            setIsDeleteModalOpen(false);
            setSelectedStock(null);
        } catch (error) {
            console.error('Error deleting stock:', error);
            alert('Failed to delete stock. Please try again.');
        }
    };

    const filteredData = stocks.filter(item => 
        (item.warehouse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.responsiblePerson?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="manage-stock-container">
            {/* Page Header */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Manage Stock</h2>
                    <p className="ss-page-subtitle">Manage your stock</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="Export PDF"><FileText size={16} /></button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Export Excel"><Download size={16} /></button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchStocks}><RotateCcw size={16} /></button>
                    <button className="ss-btn-orange" onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} />
                        Add Stock
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="ss-main-panel">
                {/* Filters */}
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={16} />
                        <input 
                            type="text" 
                            className="ss-search-input" 
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="ss-filters-wrap">
                        <select className="ss-filter-select">
                            <option>Warehouse</option>
                            <option>Lavish Warehouse</option>
                            <option>Quaint Warehouse</option>
                        </select>
                        <select className="ss-filter-select">
                            <option>Store</option>
                            <option>Electro Mart</option>
                            <option>Quantum Gadgets</option>
                        </select>
                        <select className="ss-filter-select">
                            <option>Product</option>
                            <option>Lenovo IdeaPad 3</option>
                            <option>Beats Pro</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="ss-table-wrapper">
                    <table className="ss-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col" style={{ width: '40px' }}>
                                    <input 
                                        type="checkbox" 
                                        className="ss-checkbox"
                                        checked={stocks.length > 0 && selectedRows.length === stocks.length}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>Warehouse</th>
                                <th>Store</th>
                                <th>Product</th>
                                <th>Date</th>
                                <th>Person</th>
                                <th>Qty</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className={selectedRows.includes(item.id) ? 'row-selected' : ''}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                className="ss-checkbox"
                                                checked={selectedRows.includes(item.id)}
                                                onChange={() => toggleRow(item.id)}
                                            />
                                        </td>
                                        <td className="ss-item-name">{item.warehouse}</td>
                                        <td>{item.store}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="ss-table-img-wrapper">
                                                    <img src={item.productImg || 'https://via.placeholder.com/40'} alt={item.productName} className="ss-table-img" />
                                                </div>
                                                <span className="ss-item-name">{item.productName}</span>
                                            </div>
                                        </td>
                                        <td>{item.date}</td>
                                        <td>{item.responsiblePerson}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                <button className="ss-action-btn view" onClick={() => handleView(item)} title="View Detail"><Eye size={14} /></button>
                                                <button className="ss-action-btn edit" onClick={() => handleEdit(item)} title="Edit Entry"><Edit size={14} /></button>
                                                <button className="ss-action-btn delete" onClick={() => handleDeleteClick(item)} title="Delete Entry"><Trash2 size={14} /></button>
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
                <div className="ss-pagination-row">
                    <div className="ss-page-size">
                        <span>Row Per Page</span>
                        <select>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span>Entries</span>
                    </div>
                    <div className="ss-page-controls">
                        <button className="ss-page-btn" disabled><ChevronLeft size={16} /></button>
                        <button className="ss-page-btn active">1</button>
                        <button className="ss-page-btn" disabled><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="manage-stock-footer">
                <div className="footer-copyright">
                    2014 - 2026 © DreamsPOS. All Rights Reserved
                </div>
                <div className="footer-designer">
                    Designed & Developed by <span>Dreams</span>
                </div>
            </footer>

            <AddStockModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchStocks}
            />

            <ViewStockModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                stock={selectedStock}
            />

            <EditStockModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                stock={selectedStock}
                onSuccess={fetchStocks}
            />

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Stock Entry"
                message="Are you sure you want to delete this stock entry? This will reverse the stock quantity for this product."
            />
        </div>
    );
}
