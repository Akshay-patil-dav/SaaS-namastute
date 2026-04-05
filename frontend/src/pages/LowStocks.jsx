import React, { useState } from 'react';
import './Products.css';
import { 
    FileText, 
    FileSpreadsheet, 
    RefreshCw, 
    ChevronUp,
    Search,
    ChevronDown,
    Pencil,
    Trash2,
    Mail
} from 'lucide-react';

const mockData = [
    { id: 1, warehouse: "Lavish Warehouse", store: "Electro Mart", name: "Lenovo IdeaPad 3", category: "Computers", sku: "PT001", qty: 20, alert: 15, img: "https://placehold.co/40x40/e2e8f0/64748b?text=LP" },
    { id: 2, warehouse: "Quaint Warehouse", store: "Quantum Gadgets", name: "Beats Pro", category: "Electronics", sku: "PT002", qty: 25, alert: 20, img: "https://placehold.co/40x40/e2e8f0/64748b?text=BP" },
    { id: 3, warehouse: "Traditional Warehouse", store: "Prime Bazaar", name: "Nike Jordan", category: "Shoe", sku: "PT003", qty: 40, alert: 35, img: "https://placehold.co/40x40/e2e8f0/64748b?text=NJ" },
    { id: 4, warehouse: "Cool Warehouse", store: "Gadget World", name: "Apple Series 5 Watch", category: "Electronics", sku: "PT004", qty: 50, alert: 45, img: "https://placehold.co/40x40/e2e8f0/64748b?text=AW" },
    { id: 5, warehouse: "Overflow Warehouse", store: "Volt Vault", name: "Amazon Echo Dot", category: "Electronics", sku: "PT005", qty: 30, alert: 25, img: "https://placehold.co/40x40/e2e8f0/64748b?text=ED" },
    { id: 6, warehouse: "Nova Storage Hub", store: "Elite Retail", name: "Sanford Chair Sofa", category: "Furniture", sku: "PT006", qty: 10, alert: 8, img: "https://placehold.co/40x40/e2e8f0/64748b?text=SC" },
    { id: 7, warehouse: "Retail Supply Hub", store: "Prime Mart", name: "Red Premium Satchel", category: "Bags", sku: "PT007", qty: 70, alert: 60, img: "https://placehold.co/40x40/e2e8f0/64748b?text=RS" },
    { id: 8, warehouse: "EdgeWare Solutions", store: "NeoTech Store", name: "Iphone 14 Pro", category: "Phone", sku: "PT008", qty: 35, alert: 30, img: "https://placehold.co/40x40/e2e8f0/64748b?text=IP" },
    { id: 9, warehouse: "North Zone Warehouse", store: "Urban Mart", name: "Gaming Chair", category: "Furniture", sku: "PT009", qty: 15, alert: 10, img: "https://placehold.co/40x40/e2e8f0/64748b?text=GC" },
    { id: 10, warehouse: "Fulfillment Hub", store: "Travel Mart", name: "Borealis Backpack", category: "Bags", sku: "PT010", qty: 45, alert: 40, img: "https://placehold.co/40x40/e2e8f0/64748b?text=BB" },
];

const LowStocks = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('low');
    const [notify, setNotify] = useState(true);

    const filteredData = mockData.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.sku.toLowerCase().includes(term) ||
            item.warehouse.toLowerCase().includes(term) ||
            item.store.toLowerCase().includes(term)
        );
    });

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header mb-3">
                <div className="product-page-title">
                    <h4>Low Stocks</h4>
                    <p>Manage your low stocks</p>
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
                    <button className="btn-dark-blue">
                        <Mail size={16} /> Send Email
                    </button>
                </div>
            </div>

            {/* Tabs & Toggle Row */}
            <div className="ls-tabs-row">
                <div className="ls-tabs">
                    <button 
                        className={`ls-tab ${activeTab === 'low' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('low')}
                    >
                        Low Stocks
                    </button>
                    <button 
                        className={`ls-tab ${activeTab === 'out' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('out')}
                    >
                        Out of Stocks
                    </button>
                </div>
                <div className="ls-toggle-wrapper">
                    <label className="ls-switch">
                        <input 
                            type="checkbox" 
                            checked={notify} 
                            onChange={(e) => setNotify(e.target.checked)}
                        />
                        <span className="ls-slider"></span>
                    </label>
                    Notify
                </div>
            </div>

            {/* Table Card Area */}
            <div className="product-table-card">
                
                {/* Filter Row */}
                <div className="table-filter-row">
                    <div className="search-box">
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
                            Warehouse <ChevronDown size={16} />
                        </div>
                        <div className="filter-select">
                            Store <ChevronDown size={16} />
                        </div>
                        <div className="filter-select">
                            Category <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <table className="custom-table" style={{ minWidth: '950px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input type="checkbox" className="custom-checkbox" />
                            </th>
                            <th>Warehouse</th>
                            <th>Store</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>SKU</th>
                            <th>Qty</th>
                            <th>Qty Alert</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <input type="checkbox" className="custom-checkbox" />
                                </td>
                                <td>{item.warehouse}</td>
                                <td>{item.store}</td>
                                <td>
                                    <div className="product-name-cell">
                                        <img src={item.img} alt={item.name} className="product-img" />
                                        <span>{item.name}</span>
                                    </div>
                                </td>
                                <td>{item.category}</td>
                                <td>{item.sku}</td>
                                <td>{item.qty}</td>
                                <td>{item.alert}</td>
                                <td>
                                    <div className="action-buttons justify-content-center">
                                        <button className="action-btn" title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button className="action-btn" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                                    No matching low stocks found.
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
        </div>
    );
};

export default LowStocks;
