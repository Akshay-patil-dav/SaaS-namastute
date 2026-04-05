import React, { useState } from 'react';
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
    Upload
} from 'lucide-react';
import './stock-transfer.css';

const transferData = [
    { id: 1, from: 'Lavish Warehouse', to: 'North Zone Warehouse', products: '20', qty: '15', ref: '#458924', date: '24 Dec 2024' },
    { id: 2, from: 'Lobar Handy', to: 'Nova Storage Hub', products: '04', qty: '14', ref: '#145445', date: '25 Jul 2023' },
    { id: 3, from: 'Quaint Warehouse', to: 'Cool Warehouse', products: '21', qty: '10', ref: '#135478', date: '28 Jul 2023' },
    { id: 4, from: 'Traditional Warehouse', to: 'Retail Supply Hub', products: '15', qty: '14', ref: '#145124', date: '24 Jul 2023' },
    { id: 5, from: 'Cool Warehouse', to: 'EdgeWare Solutions', products: '14', qty: '74', ref: '#474541', date: '15 Jul 2023' },
    { id: 6, from: 'Overflow Warehouse', to: 'Quaint Warehouse', products: '30', qty: '20', ref: '#366713', date: '06 Nov 2024' },
    { id: 7, from: 'Nova Storage Hub', to: 'Traditional Warehouse', products: '10', qty: '06', ref: '#327814', date: '25 Oct 2024' },
    { id: 8, from: 'Retail Supply Hub', to: 'Overflow Warehouse', products: '70', qty: '60', ref: '#274509', date: '14 Oct 2024' },
    { id: 9, from: 'EdgeWare Solutions', to: 'Lavish Warehouse', products: '35', qty: '30', ref: '#239073', date: '03 Oct 2024' },
    { id: 10, from: 'North Zone Warehouse', to: 'Fulfillment Hub', products: '15', qty: '10', ref: '#187204', date: '20 Sep 2024' },
];

export default function StockTransfer() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);

    const toggleRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedRows(prev => 
            prev.length === transferData.length ? [] : transferData.map(d => d.id)
        );
    };

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
                    <button className="btn-add-new">
                        <Plus size={16} />
                        Add New
                    </button>
                    <button className="btn-import">
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
                                        checked={selectedRows.length === transferData.length}
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
                            {transferData.map((item) => (
                                <tr key={item.id} className={selectedRows.includes(item.id) ? 'row-selected' : ''}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRows.includes(item.id)}
                                            onChange={() => toggleRow(item.id)}
                                        />
                                    </td>
                                    <td>{item.from}</td>
                                    <td>{item.to}</td>
                                    <td>{item.products}</td>
                                    <td>{item.qty}</td>
                                    <td><span className="ref-badge">{item.ref}</span></td>
                                    <td>{item.date}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn btn-edit"><Edit size={14} /></button>
                                            <button className="action-btn btn-delete"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
        </div>
    );
}
