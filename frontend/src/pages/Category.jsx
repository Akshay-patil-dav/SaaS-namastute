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

const mockData = [
    { id: 1, name: "Computers", slug: "computers", date: "24 Dec 2024", status: "Active" },
    { id: 2, name: "Electronics", slug: "electronics", date: "10 Dec 2024", status: "Active" },
    { id: 3, name: "Shoe", slug: "shoe", date: "27 Nov 2024", status: "Active" },
    { id: 4, name: "Cosmetics", slug: "cosmetics", date: "18 Nov 2024", status: "Active" },
    { id: 5, name: "Groceries", slug: "groceries", date: "06 Nov 2024", status: "Active" },
    { id: 6, name: "Furniture", slug: "furniture", date: "25 Oct 2024", status: "Active" },
    { id: 7, name: "Bags", slug: "bags", date: "14 Oct 2024", status: "Active" },
    { id: 8, name: "Phone", slug: "phone", date: "03 Oct 2024", status: "Active" },
    { id: 9, name: "Appliances", slug: "appliances", date: "20 Sep 2024", status: "Active" },
    { id: 10, name: "Clothing", slug: "clothing", date: "10 Sep 2024", status: "Active" },
];

const Category = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = mockData.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.slug.toLowerCase().includes(term)
        );
    });

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Category</h4>
                    <p>Manage your categories</p>
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
                    <button className="btn-orange">
                        <PlusCircle size={18} /> Add Category
                    </button>
                </div>
            </div>

            {/* Table Card Area */}
            <div className="product-table-card">
                
                {/* Filter Row */}
                <div className="table-filter-row">
                    <div className="search-box" style={{ maxWidth: '400px' }}>
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
                            Status <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <table className="custom-table" style={{ minWidth: '700px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input type="checkbox" className="custom-checkbox" />
                            </th>
                            <th>Category</th>
                            <th>Category slug</th>
                            <th>Created On</th>
                            <th>Status</th>
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
                                <td>{item.name}</td>
                                <td>{item.slug}</td>
                                <td>{item.date}</td>
                                <td>
                                    <span className="badge-active">{item.status}</span>
                                </td>
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
                                    No matching categories found.
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

export default Category;
