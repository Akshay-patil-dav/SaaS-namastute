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
    FileSearch
} from 'lucide-react';
import './stock-adjustment.css';

const adjustmentData = [
    { id: 1, warehouse: 'Lavish Warehouse', store: 'Electro Mart', product: 'Lenovo IdeaPad 3', date: '24 Dec 2024', person: 'James Kirwin', qty: 100, productImg: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    { id: 2, warehouse: 'Quaint Warehouse', store: 'Quantum Gadgets', product: 'Beats Pro', date: '10 Dec 2024', person: 'Francis Chang', qty: 140, productImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Francis' },
    { id: 3, warehouse: 'Overflow Warehouse', store: 'Prime Bazaar', product: 'Nike Jordan', date: '25 Jul 2023', person: 'Antonio Engle', qty: 120, productImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Antonio' },
    { id: 4, warehouse: 'Quaint Warehouse', store: 'Gadget World', product: 'Apple Series 5 Watch', date: '28 Jul 2023', person: 'Leo Kelly', qty: 130, productImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' },
    { id: 5, warehouse: 'Traditional Warehouse', store: 'Volt Vault', product: 'Amazon Echo Dot', date: '24 Jul 2023', person: 'Annette Walker', qty: 140, productImg: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annette' },
    { id: 6, warehouse: 'Cool Warehouse', store: 'Elite Retail', product: 'Lobar Handy', date: '15 Jul 2023', person: 'John Weaver', qty: 150, productImg: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 7, warehouse: 'Retail Supply Hub', store: 'Prime Mart', product: 'Red Premium Satchel', date: '14 Oct 2024', person: 'Gary Hennessy', qty: 700, productImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gary' },
    { id: 8, warehouse: 'EdgeWare Solutions', store: 'NeoTech Store', product: 'Iphone 14 Pro', date: '03 Oct 2024', person: 'Eleanor Panek', qty: 630, productImg: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor' },
    { id: 9, warehouse: 'North Zone Warehouse', store: 'Urban Mart', product: 'Gaming Chair', date: '20 Sep 2024', person: 'William Levy', qty: 410, productImg: 'https://images.unsplash.com/photo-1598550874175-4d0fe4a2c906?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William' },
    { id: 10, warehouse: 'Fulfillment Hub', store: 'Travel Mart', product: 'Borealis Backpack', date: '10 Sep 2024', person: 'Charlotte Klotz', qty: 550, productImg: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte' },
];

export default function StockAdjustment() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);

    const toggleRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedRows(prev => 
            prev.length === adjustmentData.length ? [] : adjustmentData.map(d => d.id)
        );
    };

    return (
        <div className="stock-adjustment-container">
            {/* Page Header */}
            <div className="page-header-flex">
                <div className="page-title-area">
                    <h5>Stock Adjustment</h5>
                    <p className="page-subtitle">Manage your stock adjustment</p>
                </div>
                <div className="header-action-buttons">
                    <button className="action-icon-btn btn-pdf" title="Export PDF"><FileText size={16} /></button>
                    <button className="action-icon-btn btn-excel" title="Export Excel"><Download size={16} /></button>
                    <button className="action-icon-btn" title="Refresh"><RotateCcw size={16} /></button>
                    <button className="action-icon-btn" title="Collapse"><ChevronUp size={16} /></button>
                    <button className="btn-add-adjustment">
                        <Plus size={16} />
                        Add Adjustment
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="adjustment-card">
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
                            <option>Warehouse</option>
                            <option>Lavish Warehouse</option>
                            <option>Quaint Warehouse</option>
                        </select>
                        <select className="filter-select" style={{ minWidth: '160px' }}>
                            <option>Sort By : Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Month</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="adjustment-table-wrapper">
                    <table className="adjustment-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedRows.length === adjustmentData.length}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>Warehouse</th>
                                <th>Store</th>
                                <th>Product</th>
                                <th>Date</th>
                                <th>Person</th>
                                <th>Qty</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustmentData.map((item) => (
                                <tr key={item.id} className={selectedRows.includes(item.id) ? 'row-selected' : ''}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRows.includes(item.id)}
                                            onChange={() => toggleRow(item.id)}
                                        />
                                    </td>
                                    <td>{item.warehouse}</td>
                                    <td>{item.store}</td>
                                    <td>
                                        <div className="product-cell">
                                            <img src={item.productImg} alt={item.product} className="product-img" />
                                            <span>{item.product}</span>
                                        </div>
                                    </td>
                                    <td>{item.date}</td>
                                    <td>
                                        <div className="person-cell">
                                            <img src={item.personImg} alt={item.person} className="person-img" />
                                            <span>{item.person}</span>
                                        </div>
                                    </td>
                                    <td>{item.qty}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn btn-view"><FileSearch size={14} /></button>
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
                        <button className="page-btn" disabled><ChevronRight size={16} /></button>
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
