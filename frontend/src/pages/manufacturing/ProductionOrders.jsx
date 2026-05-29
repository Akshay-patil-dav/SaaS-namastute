import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, Calendar, 
    User, CheckCircle2, Sliders, AlertCircle, Clock
} from 'lucide-react';
import '../inventory-pages-custom.css';

// Initial Mock Orders
const initialOrders = [
    { id: 'PR-9081', product: 'Classic Plastic Chair (Red)', qty: 500, factory: 'Lavish Factory Branch A', worker: 'Ramesh Patil', deadline: '2026-06-01', status: 'In Progress' },
    { id: 'PR-9082', product: 'Premium Office Ergonomic Chair', qty: 150, factory: 'Quaint Manufacturing B', worker: 'Sanjay Deshmukh', deadline: '2026-06-05', status: 'Pending' },
    { id: 'PR-9083', product: 'Plastic Dining Table (Oval)', qty: 80, factory: 'Lavish Factory Branch A', worker: 'Vikram Joshi', deadline: '2026-05-30', status: 'Completed' },
    { id: 'PR-9084', product: 'Steel Frame Folding Bench', qty: 25, factory: 'Quaint Manufacturing B', worker: 'Amit Kulkarni', deadline: '2026-05-20', status: 'Cancelled' },
];

export default function ProductionOrders() {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form inputs
    const [newProduct, setNewProduct] = useState('Classic Plastic Chair (Red)');
    const [newQty, setNewQty] = useState('');
    const [newFactory, setNewFactory] = useState('Lavish Factory Branch A');
    const [newWorker, setNewWorker] = useState('');
    const [newDeadline, setNewDeadline] = useState('');

    const [toastMsg, setToastMsg] = useState('');
    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const handleAddOrder = (e) => {
        e.preventDefault();
        if (!newQty || !newDeadline) {
            showToast('Please specify quantity and production deadline', 'error');
            return;
        }
        const newObj = {
            id: `PR-90${orders.length + 81}`,
            product: newProduct,
            qty: parseInt(newQty) || 100,
            factory: newFactory,
            worker: newWorker || 'Unassigned Supervisor',
            deadline: newDeadline,
            status: 'Pending'
        };
        setOrders([newObj, ...orders]);
        setNewQty('');
        setNewWorker('');
        setNewDeadline('');
        setIsAddOpen(false);
        showToast(`Production request ${newObj.id} created successfully!`);
    };

    const handleStatusCycle = (id) => {
        const statusFlow = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
        setOrders(orders.map(o => {
            if (o.id === id) {
                const nextIndex = (statusFlow.indexOf(o.status) + 1) % statusFlow.length;
                return { ...o, status: statusFlow[nextIndex] };
            }
            return o;
        }));
        showToast(`Order status updated successfully!`);
    };

    const handleDelete = (id) => {
        setOrders(orders.filter(o => o.id !== id));
        showToast('Production order deleted successfully');
    };

    return (
        <div className="sub-category-page px-3 py-2">
            {toastMsg && (
                <div className="prod-toast prod-toast-success">
                    <CheckCircle2 size={16} />
                    <span>{toastMsg}</span>
                    <button className="toast-close" onClick={() => setToastMsg('')}>×</button>
                </div>
            )}

            {/* Header Row */}
            <div className="ss-header-row mb-4">
                <div>
                    <h2 className="ss-page-title">Production Orders</h2>
                    <p className="ss-page-subtitle">Track manufacturing requests, assign factory workers, and monitor completion deadlines</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-orange" onClick={() => setIsAddOpen(!isAddOpen)}>
                        <Plus size={16} />
                        Create Production Request
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Form Expansion Toggle */}
                {isAddOpen && (
                    <div className="col-12">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h4 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2" style={{ fontSize: '18px' }}>
                                <Plus size={18} className="text-orange" color="#ff9b29" />
                                Create New Production Request
                            </h4>
                            <form onSubmit={handleAddOrder} className="row g-3">
                                <div className="col-12 col-md-3">
                                    <label className="form-label small fw-bold text-secondary">Product to Manufacture</label>
                                    <select className="form-select border p-2 text-dark fw-semibold" value={newProduct} onChange={(e) => setNewProduct(e.target.value)}>
                                        <option value="Classic Plastic Chair (Red)">Classic Plastic Chair (Red)</option>
                                        <option value="Premium Office Ergonomic Chair">Premium Office Ergonomic Chair</option>
                                        <option value="Plastic Dining Table (Oval)">Plastic Dining Table (Oval)</option>
                                        <option value="Steel Frame Folding Bench">Steel Frame Folding Bench</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label small fw-bold text-secondary">Target Quantity (Units)</label>
                                    <input type="number" className="form-control border p-2" placeholder="e.g. 500" value={newQty} onChange={(e) => setNewQty(e.target.value)} required />
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small fw-bold text-secondary">Assigned Factory Branch</label>
                                    <select className="form-select border p-2" value={newFactory} onChange={(e) => setNewFactory(e.target.value)}>
                                        <option value="Lavish Factory Branch A">Lavish Factory Branch A</option>
                                        <option value="Quaint Manufacturing B">Quaint Manufacturing B</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label small fw-bold text-secondary">Responsible Supervisor</label>
                                    <input type="text" className="form-control border p-2" placeholder="e.g. Ramesh Patil" value={newWorker} onChange={(e) => setNewWorker(e.target.value)} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <label className="form-label small fw-bold text-secondary">Production Deadline</label>
                                    <input type="date" className="form-control border p-2" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} required />
                                </div>
                                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                                    <button type="button" className="btn btn-light" onClick={() => setIsAddOpen(false)}>Cancel</button>
                                    <button type="submit" className="ss-btn-orange" style={{ background: '#ff9b29' }}>Submit Launch Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Orders List */}
                <div className="col-12">
                    <div className="ss-main-panel shadow-sm">
                        <div className="ss-table-controls">
                            <div className="ss-search-wrap">
                                <Search size={16} />
                                <input 
                                    type="text" 
                                    className="ss-search-input" 
                                    placeholder="Search Production Requests..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="ss-table-wrapper">
                            <table className="ss-table">
                                <thead>
                                    <tr>
                                        <th>Request ID</th>
                                        <th>Target Product</th>
                                        <th>Quantity</th>
                                        <th>Assigned Factory</th>
                                        <th>Supervisor</th>
                                        <th>Production Deadline</th>
                                        <th>Status Tracker</th>
                                        <th style={{ textAlign: 'center' }}>Cycle Status / Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.filter(o => o.product.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                        <tr key={item.id} className={item.status === 'Completed' ? 'row-selected' : ''}>
                                            <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                            <td className="ss-item-name">{item.product}</td>
                                            <td className="fw-bold text-dark">{item.qty} Units</td>
                                            <td className="small text-muted">{item.factory}</td>
                                            <td className="small">
                                                <div className="d-flex align-items-center gap-1">
                                                    <User size={14} className="text-secondary" />
                                                    {item.worker}
                                                </div>
                                            </td>
                                            <td className="small">
                                                <div className="d-flex align-items-center gap-1">
                                                    <Calendar size={14} className="text-secondary" />
                                                    {item.deadline}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`ss-status-badge py-1.5 px-3 rounded-pill text-white fw-semibold small ${
                                                    item.status === 'Completed' ? 'bg-success' : 
                                                    item.status === 'In Progress' ? 'bg-primary' : 
                                                    item.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                    <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 text-nowrap" style={{ fontSize: '11px' }} onClick={() => handleStatusCycle(item.id)} title="Switch Status">
                                                        <Clock size={12} /> Cycle Status
                                                    </button>
                                                    <button className="ss-action-btn delete" onClick={() => handleDelete(item.id)} title="Delete Order"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
