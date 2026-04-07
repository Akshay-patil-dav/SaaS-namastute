import React, { useState } from 'react';
import { 
    Search, 
    FileText, 
    Download, 
    RotateCcw, 
    ChevronUp, 
    Plus, 
    ChevronLeft, 
    ChevronRight,
    MoreVertical,
    Eye,
    Edit,
    DollarSign,
    PlusCircle,
    Trash2
} from 'lucide-react';
import './online-orders.css';
import AddSalesModal from '../components/AddSalesModal';

const posOrdersData = [
    { id: 1, customer: 'Carl Evans', ref: 'SL001', date: '24 Dec 2024', status: 'Completed', total: '$1000', paid: '$1000', due: '$0.00', payment: 'Paid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carl' },
    { id: 2, customer: 'Minerva Rameriz', ref: 'SL002', date: '10 Dec 2024', status: 'Pending', total: '$1500', paid: '$0.00', due: '$1500', payment: 'Unpaid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minerva' },
    { id: 3, customer: 'Robert Lamon', ref: 'SL003', date: '08 Feb 2023', status: 'Completed', total: '$1500', paid: '$0.00', due: '$1500', payment: 'Paid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
    { id: 4, customer: 'Patricia Lewis', ref: 'SL004', date: '12 Feb 2023', status: 'Completed', total: '$2000', paid: '$1000', due: '$1000', payment: 'Overdue', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia' },
    { id: 5, customer: 'Mark Joslyn', ref: 'SL005', date: '17 Mar 2023', status: 'Completed', total: '$800', paid: '$800', due: '$0.00', payment: 'Paid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark' },
    { id: 6, customer: 'Marsha Betts', ref: 'SL006', date: '24 Mar 2023', status: 'Pending', total: '$750', paid: '$0.00', due: '$750', payment: 'Unpaid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marsha' },
    { id: 7, customer: 'Daniel Jude', ref: 'SL007', date: '06 Apr 2023', status: 'Completed', total: '$1300', paid: '$1300', due: '$0.00', payment: 'Paid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel' },
    { id: 8, customer: 'Emma Bates', ref: 'SL008', date: '16 Apr 2023', status: 'Completed', total: '$1100', paid: '$1100', due: '$0.00', payment: 'Paid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
    { id: 9, customer: 'Richard Fralick', ref: 'SL009', date: '04 May 2023', status: 'Pending', total: '$2300', paid: '$2300', due: '$0.00', payment: 'Paid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Richard' },
    { id: 10, customer: 'Michelle Robison', ref: 'SL010', date: '29 May 2023', status: 'Pending', total: '$1700', paid: '$1700', due: '$0.00', payment: 'Paid', biller: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle' },
];

export default function PosOrders() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Close dropdown on outside click
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest('.action-dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    const toggleDropdown = (id) => {
        setActiveDropdown(prev => (prev === id ? null : id));
    };

    const toggleRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedRows(prev => 
            prev.length === posOrdersData.length ? [] : posOrdersData.map(d => d.id)
        );
    };

    const filteredData = posOrdersData.filter(item => 
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.biller.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="online-orders-container">
            {/* Page Header */}
            <div className="page-header-flex">
                <div className="page-title-area">
                    <h5>POS Orders</h5>
                    <p className="page-subtitle">Manage Your pos orders</p>
                </div>
                <div className="header-action-buttons">
                    <button className="action-icon-btn btn-pdf" title="Export PDF"><FileText size={16} /></button>
                    <button className="action-icon-btn btn-excel" title="Export Excel"><Download size={16} /></button>
                    <button className="action-icon-btn" title="Refresh"><RotateCcw size={16} /></button>
                    <button className="action-icon-btn" title="Collapse"><ChevronUp size={16} /></button>
                    <button className="btn-add-sales" onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} />
                        Add Sales
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="orders-card">
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
                        <select className="filter-select"><option>Customer</option></select>
                        <select className="filter-select"><option>Status</option></select>
                        <select className="filter-select"><option>Payment Status</option></select>
                        <select className="filter-select" style={{ minWidth: '160px' }}>
                            <option>Sort By : Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedRows.length === posOrdersData.length}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>Customer</th>
                                <th>Reference</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Grand Total</th>
                                <th>Paid</th>
                                <th>Due</th>
                                <th>Payment Status</th>
                                <th>Biller</th>
                                <th style={{textAlign: 'center'}}>Action</th>
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
                                        <td>
                                            <div className="customer-cell">
                                                <img src={item.avatar} alt="" className="customer-avatar" />
                                                <span>{item.customer}</span>
                                            </div>
                                        </td>
                                        <td>{item.ref}</td>
                                        <td>{item.date}</td>
                                        <td>
                                            <span className={`badge-status ${item.status === 'Completed' ? 'status-completed' : 'status-pending'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.total}</td>
                                        <td>{item.paid}</td>
                                        <td>{item.due}</td>
                                        <td>
                                            <span className={`badge-payment ${item.payment === 'Paid' ? 'payment-paid' : item.payment === 'Unpaid' ? 'payment-unpaid' : 'payment-overdue'}`}>
                                                <span className={`dot ${item.payment === 'Paid' ? 'dot-green' : item.payment === 'Unpaid' ? 'dot-red' : 'dot-orange'}`}></span>
                                                {item.payment}
                                            </span>
                                        </td>
                                        <td>{item.biller}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <div className="action-dropdown-container">
                                                <button 
                                                    className={`action-btn-dots ${activeDropdown === item.id ? 'active' : ''}`}
                                                    onClick={() => toggleDropdown(item.id)}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                                {activeDropdown === item.id && (
                                                    <div className="action-dropdown-menu">
                                                        <button className="dropdown-item">
                                                            <Eye size={14} /> Sale Detail
                                                        </button>
                                                        <button className="dropdown-item">
                                                            <Edit size={14} /> Edit Sale
                                                        </button>
                                                        <button className="dropdown-item">
                                                            <DollarSign size={14} /> Show Payments
                                                        </button>
                                                        <button className="dropdown-item">
                                                            <PlusCircle size={14} /> Create Payment
                                                        </button>
                                                        <button className="dropdown-item">
                                                            <Download size={14} /> Download pdf
                                                        </button>
                                                        <button className="dropdown-item delete">
                                                            <Trash2 size={14} /> Delete Sale
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#5b6670' }}>
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

            <AddSalesModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}
