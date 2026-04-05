import React, { useState } from 'react';
import './Products.css';
import { 
    FileText, 
    FileSpreadsheet, 
    RefreshCw, 
    ChevronUp, 
    PlusCircle, 
    Download,
    Search,
    ChevronDown,
    Eye,
    Pencil,
    Trash2
} from 'lucide-react';

const mockData = [
    { id: 1, sku: "PT001", name: "Lenovo IdeaPad 3", category: "Computers", brand: "Lenovo", price: "$600", unit: "Pc", qty: 100, creator: "James Kirwin", img: "https://placehold.co/40x40/e2e8f0/64748b?text=LP", avatar: "https://placehold.co/40x40/f97316/ffffff?text=JK" },
    { id: 2, sku: "PT002", name: "Beats Pro", category: "Electronics", brand: "Beats", price: "$160", unit: "Pc", qty: 140, creator: "Francis Chang", img: "https://placehold.co/40x40/e2e8f0/64748b?text=BP", avatar: "https://placehold.co/40x40/3b82f6/ffffff?text=FC" },
    { id: 3, sku: "PT003", name: "Nike Jordan", category: "Shoe", brand: "Nike", price: "$110", unit: "Pc", qty: 300, creator: "Antonio Engle", img: "https://placehold.co/40x40/e2e8f0/64748b?text=NJ", avatar: "https://placehold.co/40x40/10b981/ffffff?text=AE" },
    { id: 4, sku: "PT004", name: "Apple Series 5 Watch", category: "Electronics", brand: "Apple", price: "$120", unit: "Pc", qty: 450, creator: "Leo Kelly", img: "https://placehold.co/40x40/e2e8f0/64748b?text=AW", avatar: "https://placehold.co/40x40/f43f5e/ffffff?text=LK" },
    { id: 5, sku: "PT005", name: "Amazon Echo Dot", category: "Electronics", brand: "Amazon", price: "$80", unit: "Pc", qty: 320, creator: "Annette Walker", img: "https://placehold.co/40x40/e2e8f0/64748b?text=ED", avatar: "https://placehold.co/40x40/8b5cf6/ffffff?text=AW" },
    { id: 6, sku: "PT006", name: "Sanford Chair Sofa", category: "Furnitures", brand: "Modern Wave", price: "$320", unit: "Pc", qty: 650, creator: "John Weaver", img: "https://placehold.co/40x40/e2e8f0/64748b?text=SC", avatar: "https://placehold.co/40x40/0ea5e9/ffffff?text=JW" },
    { id: 7, sku: "PT007", name: "Red Premium Satchel", category: "Bags", brand: "Dior", price: "$60", unit: "Pc", qty: 700, creator: "Gary Hennessy", img: "https://placehold.co/40x40/e2e8f0/64748b?text=RS", avatar: "https://placehold.co/40x40/64748b/ffffff?text=GH" },
    { id: 8, sku: "PT008", name: "Iphone 14 Pro", category: "Phone", brand: "Apple", price: "$540", unit: "Pc", qty: 630, creator: "Eleanor Panek", img: "https://placehold.co/40x40/e2e8f0/64748b?text=IP", avatar: "https://placehold.co/40x40/d946ef/ffffff?text=EP" },
    { id: 9, sku: "PT009", name: "Gaming Chair", category: "Furniture", brand: "Arlime", price: "$200", unit: "Pc", qty: 410, creator: "William Levy", img: "https://placehold.co/40x40/e2e8f0/64748b?text=GC", avatar: "https://placehold.co/40x40/06b6d4/ffffff?text=WL" },
    { id: 10, sku: "PT010", name: "Borealis Backpack", category: "Bags", brand: "The North Face", price: "$45", unit: "Pc", qty: 550, creator: "Charlotte Klotz", img: "https://placehold.co/40x40/e2e8f0/64748b?text=BB", avatar: "https://placehold.co/40x40/eab308/ffffff?text=CK" },
];

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = mockData.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.sku.toLowerCase().includes(term) ||
            item.brand.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term) ||
            item.creator.toLowerCase().includes(term)
        );
    });

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Product List</h4>
                    <p>Manage your products</p>
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
                        <PlusCircle size={18} /> Add Product
                    </button>
                    <button className="btn-dark-blue">
                        <Download size={18} /> Import Product
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
                            Category <ChevronDown size={16} />
                        </div>
                        <div className="filter-select">
                            Brand <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input type="checkbox" className="custom-checkbox" />
                            </th>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Unit</th>
                            <th>Qty</th>
                            <th>Created By</th>
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
                                <td>{item.category}</td>
                                <td>{item.brand}</td>
                                <td>{item.price}</td>
                                <td>{item.unit}</td>
                                <td>{item.qty}</td>
                                <td>
                                    <div className="created-by-cell">
                                        <img src={item.avatar} alt={item.creator} className="avatar-img" />
                                        <span>{item.creator}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn" title="View">
                                            <Eye size={16} />
                                        </button>
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
                                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                                    No matching products found.
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
                        <button className="page-btn bg-light">2</button>
                        <button className="page-btn bg-light">&gt;</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Products;
