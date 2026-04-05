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
    Trash2
} from 'lucide-react';

const mockData = [
    { id: 1, sku: "PT001", name: "Lenovo 3rd Generation", mfgDate: "24 Dec 2024", expDate: "20 Dec 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=LP" },
    { id: 2, sku: "PT002", name: "Beats Pro", mfgDate: "10 Dec 2024", expDate: "07 Dec 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=BP" },
    { id: 3, sku: "PT003", name: "Nike Jordan", mfgDate: "27 Nov 2024", expDate: "20 Nov 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=NJ" },
    { id: 4, sku: "PT004", name: "Apple Series 5 Watch", mfgDate: "18 Nov 2024", expDate: "15 Nov 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=AW" },
    { id: 5, sku: "PT005", name: "Amazon Echo Dot", mfgDate: "06 Nov 2024", expDate: "04 Nov 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=ED" },
    { id: 6, sku: "PT006", name: "Sanford Chair Sofa", mfgDate: "25 Oct 2024", expDate: "20 Oct 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=SC" },
    { id: 7, sku: "PT007", name: "Red Premium Satchel", mfgDate: "14 Oct 2024", expDate: "10 Oct 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=RS" },
    { id: 8, sku: "PT008", name: "Iphone 14 Pro", mfgDate: "03 Oct 2024", expDate: "01 Oct 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=IP" },
    { id: 9, sku: "PT009", name: "Gaming Chair", mfgDate: "20 Sep 2024", expDate: "16 Sep 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=GC" },
    { id: 10, sku: "PT010", name: "Borealis Backpack", mfgDate: "10 Sep 2024", expDate: "06 Sep 2026", img: "https://placehold.co/40x40/e2e8f0/64748b?text=BB" },
];

const ExpiredProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = mockData.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.sku.toLowerCase().includes(term)
        );
    });

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Expired Products</h4>
                    <p>Manage your expired products</p>
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
                            Product <ChevronDown size={16} />
                        </div>
                        <div className="filter-select">
                            Sort By : Last 7 Days <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <table className="custom-table" style={{ minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input type="checkbox" className="custom-checkbox" />
                            </th>
                            <th>SKU</th>
                            <th>Product</th>
                            <th>Manufactured Date</th>
                            <th>Expired Date</th>
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
                                <td>{item.sku}</td>
                                <td>
                                    <div className="product-name-cell">
                                        <img src={item.img} alt={item.name} className="product-img" />
                                        <span>{item.name}</span>
                                    </div>
                                </td>
                                <td>{item.mfgDate}</td>
                                <td>{item.expDate}</td>
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
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    No matching expired products found.
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

export default ExpiredProducts;
