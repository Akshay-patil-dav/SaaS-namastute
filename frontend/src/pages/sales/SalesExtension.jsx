import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, ShoppingBag, User, 
    FileText, DollarSign, CheckCircle2, RotateCcw, Truck, Printer
} from 'lucide-react';
import '../inventory-pages-custom.css';

// Initial Mock Datasets
const initialCustomers = [
    { id: 'CUST-001', name: 'Somesh Distributors Ltd', contact: 'Somesh Gupta', phone: '+91 98822 55011', email: 'billing@somesh.com', balance: '₹45,000 Due' },
    { id: 'CUST-002', name: 'Piyush Plastics Corp', contact: 'Piyush Shah', phone: '+91 99311 00445', email: 'sales@piyushplastics.com', balance: '₹0 (Clear)' },
    { id: 'CUST-003', name: 'Namaste Retail Stores', contact: 'Akshay Patil', phone: '+91 88900 11224', email: 'info@namasteretail.in', balance: '₹12,500 Due' },
];

const initialSalesOrders = [
    { id: 'SO-2026-901', customer: 'Somesh Distributors Ltd', items: 'Classic Plastic Chair (500 Units)', amount: 150000, status: 'Shipped', date: '2026-05-20' },
    { id: 'SO-2026-902', customer: 'Namaste Retail Stores', items: 'Premium Office Ergonomic Chair (10 Units)', amount: 125000, status: 'Processing', date: '2026-05-24' },
];

const initialQuotations = [
    { id: 'QT-5501', customer: 'Piyush Plastics Corp', items: 'Classic Plastic Chair (1,000 Units)', total: 280000, validity: '2026-06-25', status: 'Approved' },
    { id: 'QT-5502', customer: 'Somesh Distributors Ltd', items: 'Plastic Dining Table (50 Units)', total: 160000, validity: '2026-06-30', status: 'Sent' },
];

const initialChallans = [
    { id: 'DC-8801', soId: 'SO-2026-901', customer: 'Somesh Distributors Ltd', vehicleNo: 'MH-12-GQ-5504', status: 'Delivered', date: '2026-05-21' },
];

export default function SalesExtension() {
    const [subTab, setSubTab] = useState('customers'); // 'customers', 'orders', 'quotes', 'challan'
    const [searchTerm, setSearchTerm] = useState('');

    // Core states
    const [customers, setCustomers] = useState(initialCustomers);
    const [orders, setOrders] = useState(initialSalesOrders);
    const [quotes, setQuotes] = useState(initialQuotations);
    const [challans, setChallans] = useState(initialChallans);

    // Form inputs
    const [newCustName, setNewCustName] = useState('');
    const [newCustContact, setNewCustContact] = useState('');
    const [newCustPhone, setNewCustPhone] = useState('');
    const [newCustEmail, setNewCustEmail] = useState('');

    const [newQuoteTarget, setNewQuoteTarget] = useState('Somesh Distributors Ltd');
    const [newQuoteItems, setNewQuoteItems] = useState('');
    const [newQuotePrice, setNewQuotePrice] = useState('');

    const [newChallanSO, setNewChallanSO] = useState('SO-2026-902');
    const [newChallanVehicle, setNewChallanVehicle] = useState('');

    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Add handlers
    const handleAddCustomer = (e) => {
        e.preventDefault();
        if (!newCustName || !newCustContact) return;
        const newObj = {
            id: `CUST-00${customers.length + 1}`,
            name: newCustName,
            contact: newCustContact,
            phone: newCustPhone || '+91 99999 00000',
            email: newCustEmail || 'billing@client.com',
            balance: '₹0 (Clear)'
        };
        setCustomers([newObj, ...customers]);
        setNewCustName('');
        setNewCustContact('');
        setNewCustPhone('');
        setNewCustEmail('');
        showToast(`Customer account ${newCustName} registered!`);
    };

    const handleAddQuote = (e) => {
        e.preventDefault();
        if (!newQuoteItems || !newQuotePrice) return;
        const newObj = {
            id: `QT-550${quotes.length + 3}`,
            customer: newQuoteTarget,
            items: newQuoteItems,
            total: parseFloat(newQuotePrice) || 0,
            validity: '2026-06-30',
            status: 'Sent'
        };
        setQuotes([newObj, ...quotes]);
        setNewQuoteItems('');
        setNewQuotePrice('');
        showToast(`Quotation ${newObj.id} formulated & compiled!`);
    };

    const handleAddChallan = (e) => {
        e.preventDefault();
        if (!newChallanVehicle) return;
        const soObj = orders.find(o => o.id === newChallanSO);
        const newObj = {
            id: `DC-880${challans.length + 2}`,
            soId: newChallanSO,
            customer: soObj ? soObj.customer : 'Namaste Retail Stores',
            vehicleNo: newChallanVehicle,
            status: 'Dispatched',
            date: new Date().toISOString().split('T')[0]
        };
        setChallans([newObj, ...challans]);
        setNewChallanVehicle('');
        showToast(`Delivery Challan ${newObj.id} issued successfully! Cargo out of warehouse gate.`);
    };

    return (
        <div className="sub-category-page px-3 py-2">
            {toastMessage && (
                <div className="prod-toast prod-toast-success">
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                    <button className="toast-close" onClick={() => setToastMessage('')}>×</button>
                </div>
            )}

            {/* Header Row */}
            <div className="ss-header-row mb-4">
                <div>
                    <h2 className="ss-page-title">Sales & Quotations ERP additions</h2>
                    <p className="ss-page-subtitle">Manage customer catalogs, wholesale sales orders, price quotes, and delivery challans</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => { setSubTab('customers'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'customers' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Customers Directory</button>
                <button onClick={() => { setSubTab('orders'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'orders' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Wholesale Sales Orders</button>
                <button onClick={() => { setSubTab('quotes'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'quotes' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Quotations Builder</button>
                <button onClick={() => { setSubTab('challan'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'challan' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Delivery Challans</button>
            </div>

            {/* TAB CONTENT: Customers */}
            {subTab === 'customers' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="ss-table-controls">
                                <div className="ss-search-wrap">
                                    <Search size={16} />
                                    <input 
                                        type="text" 
                                        className="ss-search-input" 
                                        placeholder="Search Customers..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Customer ID</th>
                                            <th>Client Company Name</th>
                                            <th>Primary Contact</th>
                                            <th>Phone Number</th>
                                            <th>Email Address</th>
                                            <th>Outstanding Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td className="ss-item-name">{item.name}</td>
                                                <td>{item.contact}</td>
                                                <td>{item.phone}</td>
                                                <td className="small">{item.email}</td>
                                                <td>
                                                    <span className={`badge py-1.5 px-3 rounded ${
                                                        item.balance.includes('Due') ? 'bg-warning text-dark' : 'bg-success text-white'
                                                    }`}>
                                                        {item.balance}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Add Form */}
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2" style={{ fontSize: '18px' }}>
                                <User size={18} className="text-orange" color="#ff9b29" />
                                Add Customer Account
                            </h4>
                            <form onSubmit={handleAddCustomer}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Client Company Name *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Somesh Distributors Ltd" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Contact Manager Name *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Somesh Gupta" value={newCustContact} onChange={(e) => setNewCustContact(e.target.value)} required />
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Phone Number</label>
                                        <input type="text" className="form-control form-control-sm p-2" placeholder="+91 98..." value={newCustPhone} onChange={(e) => setNewCustPhone(e.target.value)} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Email Address</label>
                                        <input type="email" className="form-control form-control-sm p-2" placeholder="billing@..." value={newCustEmail} onChange={(e) => setNewCustEmail(e.target.value)} />
                                    </div>
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Register Client
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Wholesale Sales Orders */}
            {subTab === 'orders' && (
                <div className="ss-main-panel shadow-sm">
                    <div className="ss-table-controls">
                        <div className="ss-search-wrap">
                            <Search size={16} />
                            <input 
                                type="text" 
                                className="ss-search-input" 
                                placeholder="Search Sales Orders..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="ss-table-wrapper">
                        <table className="ss-table">
                            <thead>
                                <tr>
                                    <th>SO ID</th>
                                    <th>Customer Client</th>
                                    <th>Requested Wholesale Items</th>
                                    <th>Total Order Value</th>
                                    <th>Order Date</th>
                                    <th>Carrier Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.filter(o => o.customer.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                    <tr key={item.id}>
                                        <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                        <td className="ss-item-name">{item.customer}</td>
                                        <td className="small text-muted">{item.items}</td>
                                        <td className="fw-bold text-dark">₹{item.amount.toLocaleString('en-IN')}</td>
                                        <td className="small">{item.date}</td>
                                        <td>
                                            <span className={`badge py-1.5 px-3 rounded-pill text-white ${
                                                item.status === 'Shipped' ? 'bg-success' : 'bg-warning text-dark'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Quotations Builder */}
            {subTab === 'quotes' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="ss-table-controls">
                                <div className="ss-search-wrap">
                                    <Search size={16} />
                                    <input 
                                        type="text" 
                                        className="ss-search-input" 
                                        placeholder="Search Quotations..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Quote ID</th>
                                            <th>Prospect Customer</th>
                                            <th>Proposed Products</th>
                                            <th>Price Quoted</th>
                                            <th>Validity Date</th>
                                            <th>Proposal Status</th>
                                            <th style={{ textAlign: 'center' }}>PDF Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotes.filter(q => q.customer.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td className="ss-item-name">{item.customer}</td>
                                                <td className="small text-muted">{item.items}</td>
                                                <td className="fw-bold text-dark">₹{item.total.toLocaleString('en-IN')}</td>
                                                <td className="small">{item.validity}</td>
                                                <td>
                                                    <span className={`badge py-1.5 px-3 rounded ${
                                                        item.status === 'Approved' ? 'bg-success-subtle text-success' : 'bg-indigo-subtle text-indigo'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-outline-secondary p-1 rounded" onClick={() => showToast('PDF Quotation generated!')} title="Print Quote">
                                                        <Printer size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Add Form */}
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2" style={{ fontSize: '18px' }}>
                                <FileText size={18} className="text-indigo" color="#6366f1" />
                                Formulate Price Quote
                            </h4>
                            <form onSubmit={handleAddQuote}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Prospect Customer *</label>
                                    <select className="form-select form-select-sm p-2" value={newQuoteTarget} onChange={(e) => setNewQuoteTarget(e.target.value)}>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Proposed Products & Qty *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Classic Plastic Chair (500 Units)" value={newQuoteItems} onChange={(e) => setNewQuoteItems(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Proposed Price Quotation (INR) *</label>
                                    <input type="number" className="form-control form-control-sm p-2" placeholder="e.g. 150000" value={newQuotePrice} onChange={(e) => setNewQuotePrice(e.target.value)} required />
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Save & Dispatch Quote
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Delivery Challan */}
            {subTab === 'challan' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="p-3 border-bottom">
                                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2"><Truck size={18} /> Issued Delivery Challans</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Challan ID</th>
                                            <th>SO Reference</th>
                                            <th>Customer Client</th>
                                            <th>Shipping Vehicle</th>
                                            <th>Dispatch status</th>
                                            <th>Issued Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {challans.map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td><code>{item.soId}</code></td>
                                                <td className="ss-item-name">{item.customer}</td>
                                                <td><span className="badge bg-light text-dark border p-1.5">{item.vehicleNo}</span></td>
                                                <td>
                                                    <span className={`badge py-1.5 px-3 rounded-pill text-white ${
                                                        item.status === 'Delivered' ? 'bg-success' : 'bg-primary'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="small">{item.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Add Form */}
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2" style={{ fontSize: '18px' }}>
                                <Truck size={18} className="text-indigo" color="#6366f1" />
                                Dispatch Delivery Challan
                            </h4>
                            <form onSubmit={handleAddChallan}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Sales Order Code *</label>
                                    <select className="form-select form-select-sm p-2" value={newChallanSO} onChange={(e) => setNewChallanSO(e.target.value)}>
                                        {orders.map(o => (
                                            <option key={o.id} value={o.id}>{o.id} ({o.customer.split(' ')[0]})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Shipping Vehicle Plate Number *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. MH-12-GQ-5504" value={newChallanVehicle} onChange={(e) => setNewChallanVehicle(e.target.value)} required />
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Dispatched Gate Pass
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
