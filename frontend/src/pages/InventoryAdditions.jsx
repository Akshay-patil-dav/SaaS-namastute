import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, Layers, Barcode, 
    AlertTriangle, ShieldCheck, CheckCircle2, RotateCcw,
    FileText, Download, TrendingDown
} from 'lucide-react';
import './inventory-pages-custom.css';

// Initial Mock Datasets
const initialRawMaterials = [
    { id: 'RM001', name: 'Polypropylene Granules', code: 'PP-102', category: 'Plastics', stock: '2,450 kg', reorderLevel: '500 kg', supplier: 'Avantha Poly Chem' },
    { id: 'RM002', name: 'Titanium Dioxide (White Pigment)', code: 'TI-405', category: 'Chemicals', stock: '480 kg', reorderLevel: '100 kg', supplier: 'Matrix Additives Ltd' },
    { id: 'RM003', name: 'Red Dye Liquid Base', code: 'CH-890', category: 'Chemicals', stock: '35 Litres', reorderLevel: '15 Litres', supplier: 'Indo Color Corp' },
    { id: 'RM004', name: 'Aluminium Framing Extrusion', code: 'AL-550', category: 'Metal Parts', stock: '1,200 m', reorderLevel: '300 m', supplier: 'Hindalco Industrial' },
    { id: 'RM005', name: 'Corrugated Packaging Boxes (L)', code: 'BX-12', category: 'Packaging', stock: '120 Units', reorderLevel: '200 Units', supplier: 'Sardar Packagers' },
];

const initialFinishedGoods = [
    { id: 'FG001', name: 'Classic Plastic Chair (Red)', sku: 'PC-RED-1', weight: '2.1 kg', stock: '1,450 Units', status: 'In Stock' },
    { id: 'FG002', name: 'Premium Office Ergonomic Chair', sku: 'OC-ERGO-9', weight: '8.4 kg', stock: '340 Units', status: 'Low Stock' },
    { id: 'FG003', name: 'Plastic Dining Table (Oval)', sku: 'PT-OVAL-2', weight: '12.0 kg', stock: '85 Units', status: 'In Stock' },
    { id: 'FG004', name: 'Steel Frame Folding Bench', sku: 'FB-STL-0', weight: '15.5 kg', stock: '14 Units', status: 'Out of Stock' },
];

const initialSemiFinished = [
    { id: 'SF001', name: 'Molded Red Chair Seat Shell', stage: 'Cooling / QA Trim', qty: '450 Units', nextProcess: 'Assembly' },
    { id: 'SF002', name: 'Welded Aluminium Legs Set', stage: 'Powder Coating', qty: '210 Sets', nextProcess: 'Assembly' },
    { id: 'SF003', name: 'Unfinished Hydraulic Lift Cylinders', stage: 'Valving Inspection', qty: '180 Units', nextProcess: 'Core Component' },
];

const initialBatches = [
    { id: 'BCH-2026-05A', productName: 'Polypropylene Granules', date: '2026-05-10', expiry: '2028-05-10', qty: '10,000 kg', status: 'Certified' },
    { id: 'BCH-2026-05B', productName: 'Red Dye Liquid Base', date: '2026-05-14', expiry: '2027-05-14', qty: '200 Litres', status: 'Certified' },
    { id: 'BCH-2026-05C', productName: 'Titanium Dioxide', date: '2026-05-20', expiry: '2029-05-20', qty: '1,500 kg', status: 'Pending QA' },
];

const initialSerials = [
    { serial: 'SN-PC-26A-09881', product: 'Premium Office Ergonomic Chair', batch: 'BCH-2026-05A', qcStatus: 'Passed', warrantyYears: 3 },
    { serial: 'SN-PC-26A-09882', product: 'Premium Office Ergonomic Chair', batch: 'BCH-2026-05A', qcStatus: 'Passed', warrantyYears: 3 },
    { serial: 'SN-PC-26A-09883', product: 'Premium Office Ergonomic Chair', batch: 'BCH-2026-05A', qcStatus: 'Passed', warrantyYears: 3 },
    { serial: 'SN-PT-26B-11402', product: 'Plastic Dining Table (Oval)', batch: 'BCH-2026-05B', qcStatus: 'Passed', warrantyYears: 5 },
];

const initialDamages = [
    { id: 'DM011', productName: 'Polypropylene Granules', qty: '45 kg', reason: 'Water leakage in storage aisle 2B', status: 'Deducted', date: '2026-05-18' },
    { id: 'DM012', productName: 'Classic Plastic Chair (Red)', qty: '12 Units', reason: 'Molding flash defect / deformation', status: 'Scrapped', date: '2026-05-21' },
    { id: 'DM013', productName: 'Corrugated Packaging Boxes (L)', qty: '50 Units', reason: 'Forklift impact tearing', status: 'Pending Review', date: '2026-05-24' },
];

export default function InventoryAdditions() {
    const [activeTab, setActiveTab] = useState('raw'); // 'raw', 'finished', 'semifinished', 'tracking', 'damage', 'reorder'
    const [searchTerm, setSearchTerm] = useState('');
    
    // Core states
    const [rawMaterials, setRawMaterials] = useState(initialRawMaterials);
    const [finishedGoods, setFinishedGoods] = useState(initialFinishedGoods);
    const [semiFinished, setSemiFinished] = useState(initialSemiFinished);
    const [batches, setBatches] = useState(initialBatches);
    const [serials, setSerials] = useState(initialSerials);
    const [damages, setDamages] = useState(initialDamages);

    // Form inputs for new item additions
    const [newRawName, setNewRawName] = useState('');
    const [newRawCode, setNewRawCode] = useState('');
    const [newRawStock, setNewRawStock] = useState('');
    const [newRawReorder, setNewRawReorder] = useState('');
    
    const [newDamageProduct, setNewDamageProduct] = useState('');
    const [newDamageQty, setNewDamageQty] = useState('');
    const [newDamageReason, setNewDamageReason] = useState('');

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const showToast = (msg, type = 'success') => {
        setToastMessage(msg);
        setToastType(type);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Add handlers
    const handleAddRawMaterial = (e) => {
        e.preventDefault();
        if (!newRawName || !newRawCode) {
            showToast('Please enter a valid Material Name and Product Code', 'error');
            return;
        }
        const newObj = {
            id: `RM00${rawMaterials.length + 1}`,
            name: newRawName,
            code: newRawCode,
            category: 'Raw Material',
            stock: newRawStock ? `${newRawStock} kg` : '0 kg',
            reorderLevel: newRawReorder ? `${newRawReorder} kg` : '100 kg',
            supplier: 'General Vendor Allocation'
        };
        setRawMaterials([newObj, ...rawMaterials]);
        setNewRawName('');
        setNewRawCode('');
        setNewRawStock('');
        setNewRawReorder('');
        showToast(`Successfully added ${newRawName} to Raw Materials`);
    };

    const handleAddDamageLog = (e) => {
        e.preventDefault();
        if (!newDamageProduct || !newDamageQty) {
            showToast('Please enter a product name and damage quantity', 'error');
            return;
        }
        const newObj = {
            id: `DM0${damages.length + 12}`,
            productName: newDamageProduct,
            qty: newDamageQty,
            reason: newDamageReason || 'Undocumented damage',
            status: 'Pending Review',
            date: new Date().toISOString().split('T')[0]
        };
        setDamages([newObj, ...damages]);
        setNewDamageProduct('');
        setNewDamageQty('');
        setNewDamageReason('');
        showToast(`Logged ${newDamageQty} of damaged ${newDamageProduct}`);
    };

    const handleDeleteDamage = (id) => {
        setDamages(damages.filter(d => d.id !== id));
        showToast('Damaged record deleted successfully', 'success');
    };

    return (
        <div className="sub-category-page px-3 py-2">
            {toastMessage && (
                <div className={`prod-toast prod-toast-${toastType}`}>
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                    <button className="toast-close" onClick={() => setToastMessage('')}>×</button>
                </div>
            )}

            {/* Header Row */}
            <div className="ss-header-row mb-4">
                <div>
                    <h2 className="ss-page-title">Inventory ERP Additions</h2>
                    <p className="ss-page-subtitle">Warehouse & Raw Materials, Batch Serials, Damage Stock Control</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel Report"><Download size={16} /></button>
                    <button className="ss-btn-icon-square" title="Refresh Logs" onClick={() => showToast('Data synced successfully!')}><RotateCcw size={16} /></button>
                </div>
            </div>

            {/* Premium Navigation Tabs */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => { setActiveTab('raw'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${activeTab === 'raw' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Raw Materials</button>
                <button onClick={() => { setActiveTab('finished'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${activeTab === 'finished' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Finished Goods</button>
                <button onClick={() => { setActiveTab('semifinished'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${activeTab === 'semifinished' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Semi-Finished Goods</button>
                <button onClick={() => { setActiveTab('tracking'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${activeTab === 'tracking' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Batch & Serial Tracking</button>
                <button onClick={() => { setActiveTab('damage'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${activeTab === 'damage' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Damage Stock Logs</button>
                <button onClick={() => { setActiveTab('reorder'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${activeTab === 'reorder' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Reorder Level Alerts</button>
            </div>

            {/* TAB CONTENT: Raw Materials */}
            {activeTab === 'raw' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="ss-table-controls">
                                <div className="ss-search-wrap">
                                    <Search size={16} />
                                    <input 
                                        type="text" 
                                        className="ss-search-input" 
                                        placeholder="Search Raw Materials..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Material Code</th>
                                            <th>Material Name</th>
                                            <th>Category</th>
                                            <th>On-Hand Stock</th>
                                            <th>Reorder Alert Level</th>
                                            <th>Assigned Supplier</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rawMaterials.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge">{item.code}</span></td>
                                                <td className="ss-item-name">{item.name}</td>
                                                <td><span className="ss-category-tag">{item.category}</span></td>
                                                <td className="fw-bold text-dark">{item.stock}</td>
                                                <td><span className="badge bg-warning-subtle text-warning px-2.5 py-1.5 rounded">{item.reorderLevel}</span></td>
                                                <td className="small text-muted">{item.supplier}</td>
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
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1a1a1a', fontSize: '18px' }}>
                                <Plus size={18} className="text-orange" color="#ff9b29" />
                                Add Raw Material
                            </h4>
                            <form onSubmit={handleAddRawMaterial}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Material Name *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Polyethylene Sheet" value={newRawName} onChange={(e) => setNewRawName(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Material Code *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. PE-4402" value={newRawCode} onChange={(e) => setNewRawCode(e.target.value)} required />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Initial Stock (kg)</label>
                                        <input type="number" className="form-control form-control-sm p-2" placeholder="e.g. 500" value={newRawStock} onChange={(e) => setNewRawStock(e.target.value)} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Reorder Pt (kg)</label>
                                        <input type="number" className="form-control form-control-sm p-2" placeholder="e.g. 100" value={newRawReorder} onChange={(e) => setNewRawReorder(e.target.value)} />
                                    </div>
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Save Material
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Finished Goods */}
            {activeTab === 'finished' && (
                <div className="ss-main-panel shadow-sm">
                    <div className="ss-table-controls">
                        <div className="ss-search-wrap">
                            <Search size={16} />
                            <input 
                                type="text" 
                                className="ss-search-input" 
                                placeholder="Search Finished Goods..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="ss-table-wrapper">
                        <table className="ss-table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Finished Product Name</th>
                                    <th>SKU Identifier</th>
                                    <th>Finished Weight</th>
                                    <th>On-Hand Stock</th>
                                    <th>Quality Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finishedGoods.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                    <tr key={item.id}>
                                        <td><span className="ss-code-badge">{item.id}</span></td>
                                        <td className="ss-item-name">{item.name}</td>
                                        <td><code>{item.sku}</code></td>
                                        <td>{item.weight}</td>
                                        <td className="fw-bold text-dark">{item.stock}</td>
                                        <td>
                                            <span className={`badge py-1.5 px-3 rounded-pill text-white ${item.status === 'In Stock' ? 'bg-success' : item.status === 'Low Stock' ? 'bg-warning' : 'bg-danger'}`}>
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

            {/* TAB CONTENT: Semi-Finished Goods */}
            {activeTab === 'semifinished' && (
                <div className="ss-main-panel shadow-sm">
                    <div className="ss-table-controls">
                        <div className="ss-search-wrap">
                            <Search size={16} />
                            <input 
                                type="text" 
                                className="ss-search-input" 
                                placeholder="Search Semi-Finished Goods..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="ss-table-wrapper">
                        <table className="ss-table">
                            <thead>
                                <tr>
                                    <th>Internal ID</th>
                                    <th>Sub-Assembly Components</th>
                                    <th>Current State / Aisle Location</th>
                                    <th>Waiting Quantity</th>
                                    <th>Next Scheduled Step</th>
                                </tr>
                            </thead>
                            <tbody>
                                {semiFinished.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                    <tr key={item.id}>
                                        <td><span className="ss-code-badge">{item.id}</span></td>
                                        <td className="ss-item-name">{item.name}</td>
                                        <td><span className="badge bg-light text-dark border p-2">{item.stage}</span></td>
                                        <td className="fw-bold text-dark">{item.qty}</td>
                                        <td><span className="badge bg-primary text-white py-1 px-3 rounded">{item.nextProcess}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Batch & Serial Tracking */}
            {activeTab === 'tracking' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-6">
                        <div className="ss-main-panel shadow-sm h-100">
                            <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0 text-dark"><Barcode size={18} className="me-2" /> Active Production Batches</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Batch Number</th>
                                            <th>Product Name</th>
                                            <th>Manufactured</th>
                                            <th>Certified QA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {batches.map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge bg-warning-subtle">{item.id}</span></td>
                                                <td className="fw-semibold text-dark small">{item.productName}</td>
                                                <td className="small">{item.date}</td>
                                                <td>
                                                    <span className={`badge py-1 px-2.5 rounded ${item.status === 'Certified' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
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

                    <div className="col-12 col-xl-6">
                        <div className="ss-main-panel shadow-sm h-100">
                            <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0 text-dark"><Barcode size={18} className="me-2" /> Registered Serial Numbers</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Serial Number</th>
                                            <th>Assigned Product</th>
                                            <th>Inspection</th>
                                            <th>Warranty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serials.map((item) => (
                                            <tr key={item.serial}>
                                                <td className="small"><code>{item.serial}</code></td>
                                                <td className="fw-semibold text-dark small">{item.product}</td>
                                                <td><span className="badge bg-success-subtle text-success py-1 px-2 rounded">{item.qcStatus}</span></td>
                                                <td className="small">{item.warrantyYears} Years Warranty</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Damage Stock Logs */}
            {activeTab === 'damage' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="ss-table-controls">
                                <h5 className="fw-bold mb-0 text-danger"><AlertTriangle size={18} className="me-2" /> Damaged Stock Register</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Log ID</th>
                                            <th>Product / Material</th>
                                            <th>Damaged Qty</th>
                                            <th>Reported Reason / Occurrence</th>
                                            <th>Inventory Status</th>
                                            <th>Report Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {damages.map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge bg-danger-subtle text-danger">{item.id}</span></td>
                                                <td className="ss-item-name">{item.productName}</td>
                                                <td className="text-danger fw-bold">{item.qty}</td>
                                                <td className="small text-muted">{item.reason}</td>
                                                <td>
                                                    <span className={`badge py-1 px-2 rounded ${item.status === 'Pending Review' ? 'bg-warning text-dark' : 'bg-secondary text-white'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="small">{item.date}</td>
                                                <td>
                                                    <button className="ss-action-btn delete" onClick={() => handleDeleteDamage(item.id)} title="Delete Log"><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#ef4444', fontSize: '18px' }}>
                                <AlertTriangle size={18} className="text-danger" color="#ef4444" />
                                Report Damaged Stock
                            </h4>
                            <form onSubmit={handleAddDamageLog}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Material / Product Name *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Classic Plastic Chair" value={newDamageProduct} onChange={(e) => setNewDamageProduct(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Damaged Quantity *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. 15 Units or 10 kg" value={newDamageQty} onChange={(e) => setNewDamageQty(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Defect / Accident Reason</label>
                                    <textarea className="form-control form-control-sm p-2" rows="3" placeholder="e.g. Mold overheating distortion, storage roof leak..." value={newDamageReason} onChange={(e) => setNewDamageReason(e.target.value)}></textarea>
                                </div>
                                <button type="submit" className="btn btn-danger w-100 d-flex justify-content-center align-items-center gap-2 mt-2" style={{ background: '#ef4444', border:'none', padding: '10px' }}>
                                    <AlertTriangle size={16} /> File Damage Report
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Reorder Alerts */}
            {activeTab === 'reorder' && (
                <div className="ss-main-panel shadow-sm">
                    <div className="p-3 border-bottom bg-light-subtle d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0 text-warning d-flex align-items-center gap-2"><TrendingDown size={18} /> Reorder Level Configuration & Alerts</h5>
                    </div>
                    <div className="ss-table-wrapper">
                        <table className="ss-table">
                            <thead>
                                <tr>
                                    <th>Material Code</th>
                                    <th>Item Name</th>
                                    <th>Minimum Level</th>
                                    <th>Current Available</th>
                                    <th>Procurement Alert</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span className="ss-code-badge">RM001</span></td>
                                    <td className="ss-item-name">Polypropylene Granules</td>
                                    <td>500 kg</td>
                                    <td className="fw-bold text-success">2,450 kg</td>
                                    <td><span className="badge bg-success-subtle text-success py-1 px-3 rounded">Adequate Stock</span></td>
                                </tr>
                                <tr className="row-selected">
                                    <td><span className="ss-code-badge bg-danger-subtle text-danger">RM005</span></td>
                                    <td className="ss-item-name">Corrugated Packaging Boxes (L)</td>
                                    <td>200 Units</td>
                                    <td className="fw-bold text-danger">120 Units</td>
                                    <td><span className="badge bg-danger text-white py-1 px-3 rounded">REORDER IMMEDIATELY</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
