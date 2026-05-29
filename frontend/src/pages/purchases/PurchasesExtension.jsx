import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, ShoppingCart, User, 
    FileText, DollarSign, CheckCircle2, RotateCcw, AlertCircle
} from 'lucide-react';
import '../inventory-pages-custom.css';

// Initial Mock Datasets
const initialSuppliers = [
    { id: 'SPL-001', name: 'Avantha Poly Chem Ltd', contact: 'Anil Avantha', phone: '+91 98810 44021', email: 'orders@avanthachem.com', rawType: 'Polypropylene Resin' },
    { id: 'SPL-002', name: 'Matrix Additives Ltd', contact: 'Sarah Abraham', phone: '+91 99230 11402', email: 'sales@matrixchem.co.in', rawType: 'Titanium Dioxide' },
    { id: 'SPL-003', name: 'Hindalco Industrial Corp', contact: 'Vijay Kirloskar', phone: '+91 88770 09881', email: 'extrusion@hindalco.com', rawType: 'Aluminium Framing' },
];

const initialPOs = [
    { id: 'PO-2026-001', supplier: 'Avantha Poly Chem Ltd', items: 'Polypropylene Granules (2,000 kg)', totalAmount: 240000, date: '2026-05-18', status: 'Received' },
    { id: 'PO-2026-002', supplier: 'Matrix Additives Ltd', items: 'Titanium Dioxide Pigment (500 kg)', totalAmount: 175000, date: '2026-05-22', status: 'Pending' },
    { id: 'PO-2026-003', supplier: 'Hindalco Industrial Corp', items: 'Aluminium Extrusion Bars (300 m)', totalAmount: 54000, date: '2026-05-24', status: 'Staged' },
];

const initialPayments = [
    { id: 'TXN-9981', supplier: 'Avantha Poly Chem Ltd', poId: 'PO-2026-001', amount: 240000, method: 'NEFT Transfer', status: 'Fully Paid', date: '2026-05-19' },
    { id: 'TXN-9982', supplier: 'Matrix Additives Ltd', poId: 'PO-2026-002', amount: 87500, method: 'RTGS Advance', status: 'Partially Paid', date: '2026-05-23' },
];

const initialGRNs = [
    { id: 'GRN-4412', poId: 'PO-2026-001', supplier: 'Avantha Poly Chem Ltd', receivedDate: '2026-05-21', acceptedQty: '2,000 kg', rejectedQty: '0 kg', status: 'Passed QA' },
];

export default function PurchasesExtension() {
    const [subTab, setSubTab] = useState('suppliers'); // 'suppliers', 'pos', 'payments', 'grn'
    const [searchTerm, setSearchTerm] = useState('');

    // Core states
    const [suppliers, setSuppliers] = useState(initialSuppliers);
    const [pos, setPOs] = useState(initialPOs);
    const [payments, setPayments] = useState(initialPayments);
    const [grns, setGRNs] = useState(initialGRNs);

    // Form inputs
    const [newSupName, setNewSupName] = useState('');
    const [newSupContact, setNewSupContact] = useState('');
    const [newSupPhone, setNewSupPhone] = useState('');
    const [newSupEmail, setNewSupEmail] = useState('');
    const [newSupRaw, setNewSupRaw] = useState('Polypropylene Resin');

    const [newPOTarget, setNewPOTarget] = useState('Avantha Poly Chem Ltd');
    const [newPOItems, setNewPOItems] = useState('');
    const [newPOAmount, setNewPOAmount] = useState('');

    const [newPayTarget, setNewPayTarget] = useState('Avantha Poly Chem Ltd');
    const [newPayPO, setNewPayPO] = useState('PO-2026-001');
    const [newPayAmount, setNewPayAmount] = useState('');
    const [newPayMethod, setNewPayMethod] = useState('NEFT Transfer');

    const [newGRN_PO, setNewGRN_PO] = useState('PO-2026-002');
    const [newGRNQty, setNewGRNQty] = useState('');
    const [newGRNRejections, setNewGRNRejections] = useState('0 kg');

    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Add handlers
    const handleAddSupplier = (e) => {
        e.preventDefault();
        if (!newSupName || !newSupContact) return;
        const newObj = {
            id: `SPL-00${suppliers.length + 1}`,
            name: newSupName,
            contact: newSupContact,
            phone: newSupPhone || '+91 99999 00000',
            email: newSupEmail || 'info@supplier.com',
            rawType: newSupRaw
        };
        setSuppliers([newObj, ...suppliers]);
        setNewSupName('');
        setNewSupContact('');
        setNewSupPhone('');
        setNewSupEmail('');
        showToast(`Vendor ${newSupName} registered successfully!`);
    };

    const handleAddPO = (e) => {
        e.preventDefault();
        if (!newPOItems || !newPOAmount) return;
        const newObj = {
            id: `PO-2026-00${pos.length + 1}`,
            supplier: newPOTarget,
            items: newPOItems,
            totalAmount: parseFloat(newPOAmount) || 0,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending'
        };
        setPOs([newObj, ...pos]);
        setNewPOItems('');
        setNewPOAmount('');
        showToast(`Purchase Order ${newObj.id} created successfully!`);
    };

    const handleAddPayment = (e) => {
        e.preventDefault();
        if (!newPayAmount) return;
        const newObj = {
            id: `TXN-99${payments.length + 83}`,
            supplier: newPayTarget,
            poId: newPayPO,
            amount: parseFloat(newPayAmount) || 0,
            method: newPayMethod,
            status: 'Fully Paid',
            date: new Date().toISOString().split('T')[0]
        };
        setPayments([newObj, ...payments]);
        setNewPayAmount('');
        showToast(`Payment invoice of ₹${parseFloat(newPayAmount).toFixed(2)} compiled!`);
    };

    const handleAddGRN = (e) => {
        e.preventDefault();
        if (!newGRNQty) return;
        const poObj = pos.find(p => p.id === newGRN_PO);
        const newObj = {
            id: `GRN-44${grns.length + 13}`,
            poId: newGRN_PO,
            supplier: poObj ? poObj.supplier : 'General Supplier',
            receivedDate: new Date().toISOString().split('T')[0],
            acceptedQty: newGRNQty,
            rejectedQty: newGRNRejections || '0 kg',
            status: 'Passed QA'
        };
        setGRNs([newObj, ...grns]);
        setNewGRNQty('');
        setNewGRNRejections('0 kg');
        showToast(`GRN ${newObj.id} issued successfully! Raw stock incremented.`);
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
                    <h2 className="ss-page-title">Purchases ERP additions</h2>
                    <p className="ss-page-subtitle">Track raw material suppliers, draft purchase orders, dispatch RTGS payments, and issue GRNs</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => { setSubTab('suppliers'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'suppliers' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Suppliers Directory</button>
                <button onClick={() => { setSubTab('pos'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'pos' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Purchase Orders (PO)</button>
                <button onClick={() => { setSubTab('payments'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'payments' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Supplier Payments</button>
                <button onClick={() => { setSubTab('grn'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'grn' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>GRN Receipts Note</button>
            </div>

            {/* TAB CONTENT: Suppliers */}
            {subTab === 'suppliers' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="ss-table-controls">
                                <div className="ss-search-wrap">
                                    <Search size={16} />
                                    <input 
                                        type="text" 
                                        className="ss-search-input" 
                                        placeholder="Search Suppliers..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Supplier ID</th>
                                            <th>Vendor Name</th>
                                            <th>Contact Person</th>
                                            <th>Phone Number</th>
                                            <th>Email Address</th>
                                            <th>Assigned Materials</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {suppliers.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td className="ss-item-name">{item.name}</td>
                                                <td>{item.contact}</td>
                                                <td>{item.phone}</td>
                                                <td className="small">{item.email}</td>
                                                <td><span className="badge bg-indigo-subtle text-indigo px-2 rounded">{item.rawType}</span></td>
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
                                Add Supplier Vendor
                            </h4>
                            <form onSubmit={handleAddSupplier}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Vendor Company Name *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Avantha Poly Chem Ltd" value={newSupName} onChange={(e) => setNewSupName(e.target.value)} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Contact Person Name *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Anil Avantha" value={newSupContact} onChange={(e) => setNewSupContact(e.target.value)} required />
                                </div>
                                <div className="row g-2 mb-2">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Phone Number</label>
                                        <input type="text" className="form-control form-control-sm p-2" placeholder="+91 98..." value={newSupPhone} onChange={(e) => setNewSupPhone(e.target.value)} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Email Address</label>
                                        <input type="email" className="form-control form-control-sm p-2" placeholder="orders@..." value={newSupEmail} onChange={(e) => setNewSupEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Supplied Materials</label>
                                    <select className="form-select form-select-sm p-2" value={newSupRaw} onChange={(e) => setNewSupRaw(e.target.value)}>
                                        <option value="Polypropylene Resin">Polypropylene Resin</option>
                                        <option value="Titanium Dioxide">Titanium Dioxide Pigment</option>
                                        <option value="Chemical Agent Base">Chemical Agent Base</option>
                                        <option value="Aluminium Framing">Aluminium Extrusion Bars</option>
                                        <option value="Corrugated Box packaging">Corrugated Box packaging</option>
                                    </select>
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Register Vendor
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Purchase Orders */}
            {subTab === 'pos' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="ss-table-controls">
                                <div className="ss-search-wrap">
                                    <Search size={16} />
                                    <input 
                                        type="text" 
                                        className="ss-search-input" 
                                        placeholder="Search POs..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>PO ID</th>
                                            <th>Vendor Supplier</th>
                                            <th>Items Requested</th>
                                            <th>Total PO Amount</th>
                                            <th>Draft Date</th>
                                            <th>Dispatch Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pos.filter(o => o.supplier.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td className="ss-item-name">{item.supplier}</td>
                                                <td className="small text-muted">{item.items}</td>
                                                <td className="fw-bold text-dark">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                                                <td className="small">{item.date}</td>
                                                <td>
                                                    <span className={`badge py-1.5 px-3 rounded-pill text-white ${
                                                        item.status === 'Received' ? 'bg-success' : 
                                                        item.status === 'Staged' ? 'bg-primary' : 'bg-warning text-dark'
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
                    </div>
                    {/* Add Form */}
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2" style={{ fontSize: '18px' }}>
                                <ShoppingCart size={18} className="text-indigo" color="#6366f1" />
                                Draft Purchase Order
                            </h4>
                            <form onSubmit={handleAddPO}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Select Vendor *</label>
                                    <select className="form-select form-select-sm p-2" value={newPOTarget} onChange={(e) => setNewPOTarget(e.target.value)}>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Items & Qty *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Polypropylene Granules (1,000 kg)" value={newPOItems} onChange={(e) => setNewPOItems(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Estimated PO Price (INR) *</label>
                                    <input type="number" className="form-control form-control-sm p-2" placeholder="e.g. 120000" value={newPOAmount} onChange={(e) => setNewPOAmount(e.target.value)} required />
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Draft & Print PO
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Payments */}
            {subTab === 'payments' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="p-3 border-bottom">
                                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2"><DollarSign size={18} /> Payments Ledger</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>Supplier Company</th>
                                            <th>PO Reference</th>
                                            <th>Amount Dispatched</th>
                                            <th>RTGS / NEFT Method</th>
                                            <th>Invoice State</th>
                                            <th>Transaction Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td className="ss-item-name">{item.supplier}</td>
                                                <td><code>{item.poId}</code></td>
                                                <td className="fw-bold text-dark">₹{item.amount.toLocaleString('en-IN')}</td>
                                                <td className="small">{item.method}</td>
                                                <td>
                                                    <span className={`badge py-1.5 px-3 rounded-pill text-white ${item.status === 'Fully Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
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
                                <DollarSign size={18} className="text-indigo" color="#6366f1" />
                                Record Vendor Payment
                            </h4>
                            <form onSubmit={handleAddPayment}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Vendor Company *</label>
                                    <select className="form-select form-select-sm p-2" value={newPayTarget} onChange={(e) => setNewPayTarget(e.target.value)}>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row g-2 mb-2">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">PO Reference *</label>
                                        <select className="form-select form-select-sm p-2" value={newPayPO} onChange={(e) => setNewPayPO(e.target.value)}>
                                            {pos.map(p => (
                                                <option key={p.id} value={p.id}>{p.id}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Payment Method</label>
                                        <select className="form-select form-select-sm p-2" value={newPayMethod} onChange={(e) => setNewPayMethod(e.target.value)}>
                                            <option value="NEFT Transfer">NEFT Bank Transfer</option>
                                            <option value="RTGS Transfer">RTGS Corporate</option>
                                            <option value="Letter of Credit">Letter of Credit</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Amount Dispatched (INR) *</label>
                                    <input type="number" className="form-control form-control-sm p-2" placeholder="e.g. 80000" value={newPayAmount} onChange={(e) => setNewPayAmount(e.target.value)} required />
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <DollarSign size={16} /> Disburse Payment Invoice
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Goods Receipt Note (GRN) */}
            {subTab === 'grn' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="p-3 border-bottom">
                                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2"><FileText size={18} /> Issued Goods Receipt Notes (GRN)</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>GRN Slip ID</th>
                                            <th>PO Reference</th>
                                            <th>Supplier Vendor</th>
                                            <th>Accepted Qty</th>
                                            <th>Rejected Qty</th>
                                            <th>Inspection Passed</th>
                                            <th>Record Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grns.map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td><code>{item.poId}</code></td>
                                                <td className="ss-item-name">{item.supplier}</td>
                                                <td className="fw-bold text-success">{item.acceptedQty}</td>
                                                <td className="text-danger fw-semibold">{item.rejectedQty}</td>
                                                <td><span className="badge bg-success text-white py-1 px-2.5 rounded">{item.status}</span></td>
                                                <td className="small">{item.receivedDate}</td>
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
                                File Goods Receipt Note
                            </h4>
                            <form onSubmit={handleAddGRN}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Related PO Code *</label>
                                    <select className="form-select form-select-sm p-2" value={newGRN_PO} onChange={(e) => setNewGRN_PO(e.target.value)}>
                                        {pos.map(p => (
                                            <option key={p.id} value={p.id}>{p.id} ({p.supplier.split(' ')[0]})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Accepted Qty *</label>
                                        <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. 1000 kg" value={newGRNQty} onChange={(e) => setNewGRNQty(e.target.value)} required />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Rejected Qty</label>
                                        <input type="text" className="form-control form-control-sm p-2" placeholder="0 kg" value={newGRNRejections} onChange={(e) => setNewGRNRejections(e.target.value)} />
                                    </div>
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Issue GRN Slip
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
