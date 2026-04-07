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

const mockData = [];

const Brands = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = mockData.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.desc.toLowerCase().includes(term)
        );
    });

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Brands</h4>
                    <p>Manage your brands</p>
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
                        <PlusCircle size={18} /> Add Brand
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
                            <th>Brand</th>
                            <th>Logo</th>
                            <th>Description</th>
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
                                <td>
                                    <div className="product-name-cell p-0 py-1">
                                        <img src={item.img} alt={item.name} className="product-img m-0" />
                                    </div>
                                </td>
                                <td>{item.desc}</td>
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
                                    No product Avalable tehre
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

export default Brands;
