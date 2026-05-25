import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, Box, ArrowRightLeft,
    CheckCircle2, RotateCcw, AlertTriangle, Layers, Percent
} from 'lucide-react';
import '../inventory-pages-custom.css';

// Initial Mock Datasets
const initialWarehouses = [
    { id: 'WH001', name: 'Lavish Warehouse A', location: 'Industrial Zone A, Pune', capacity: '72% Full', totalItems: '14,250 kg' },
    { id: 'WH002', name: 'Quaint Warehouse B', location: 'Logistics Hub, Mumbai', capacity: '35% Full', totalItems: '6,800 Units' },
    { id: 'WH003', name: 'Raw Material Cold Storage C', location: 'Industrial Zone A, Pune', capacity: '12% Full', totalItems: '450 Litres' },
];

const initialAisles = [
    { aisle: 'Aisle A1 (Resins)', racks: [
        { label: 'Rack 1', shelves: ['Shelf A: PP-102 (500kg)', 'Shelf B: PP-102 (800kg)', 'Shelf C: Empty'] },
        { label: 'Rack 2', shelves: ['Shelf A: TI-405 (200kg)', 'Shelf B: Empty', 'Shelf C: Empty'] }
    ]},
    { aisle: 'Aisle B2 (Metal Parts)', racks: [
        { label: 'Rack 1', shelves: ['Shelf A: AL-550 (400m)', 'Shelf B: AL-550 (800m)', 'Shelf C: Empty'] },
        { label: 'Rack 2', shelves: ['Shelf A: Bolts M10 (1200u)', 'Shelf B: Empty', 'Shelf C: Empty'] }
    ]},
];

const initialTransfers = [
    { id: 'TRF-1021', item: 'Polypropylene Granules', qty: '500 kg', fromWH: 'Lavish Warehouse A', toWH: 'Quaint Warehouse B', date: '2026-05-24', status: 'Completed' },
];

export default function WarehouseModule() {
    const [subTab, setSubTab] = useState('list'); // 'list', 'transfer', 'racks'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAisle, setSelectedAisle] = useState('Aisle A1 (Resins)');

    // Core states
    const [warehouses, setWarehouses] = useState(initialWarehouses);
    const [transfers, setTransfers] = useState(initialTransfers);

    // Form inputs
    const [newWHName, setNewWHName] = useState('');
    const [newWHLocation, setNewWHLocation] = useState('');
    const [newWHCapacity, setNewWHCapacity] = useState('10% Full');

    const [newTrfItem, setNewTrfItem] = useState('Polypropylene Granules');
    const [newTrfQty, setNewTrfQty] = useState('');
    const [newTrfFrom, setNewTrfFrom] = useState('Lavish Warehouse A');
    const [newTrfTo, setNewTrfTo] = useState('Quaint Warehouse B');

    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Add handlers
    const handleAddWarehouse = (e) => {
        e.preventDefault();
        if (!newWHName || !newWHLocation) return;
        const newObj = {
            id: `WH00${warehouses.length + 1}`,
            name: newWHName,
            location: newWHLocation,
            capacity: newWHCapacity,
            totalItems: '0 Items'
        };
        setWarehouses([...warehouses, newObj]);
        setNewWHName('');
        setNewWHLocation('');
        showToast(`Warehouse branch ${newWHName} created successfully!`);
    };

    const handleAddTransfer = (e) => {
        e.preventDefault();
        if (!newTrfQty) return;
        if (newTrfFrom === newTrfTo) {
            showToast('Transfer error: From and To warehouses must be different!', 'error');
            return;
        }
        const newObj = {
            id: `TRF-10${transfers.length + 22}`,
            item: newTrfItem,
            qty: newTrfQty,
            fromWH: newTrfFrom,
            toWH: newTrfTo,
            date: new Date().toISOString().split('T')[0],
            status: 'In Transit'
        };
        setTransfers([newObj, ...transfers]);
        setNewTrfQty('');
        showToast(`Stock transfer ${newObj.id} dispatched successfully!`);
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
                    <h2 className="ss-page-title">Warehouse & Depot Management</h2>
                    <p className="ss-page-subtitle">Track multiple storage warehouses, dispatch inter-depot transfers, and configure rack placement grids</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => { setSubTab('list'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'list' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Multiple Warehouses</button>
                <button onClick={() => { setSubTab('transfer'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'transfer' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Inter-Warehouse Transfers</button>
                <button onClick={() => { setSubTab('racks'); setSearchTerm(''); }} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'racks' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Rack & Shelf Map</button>
            </div>

            {/* TAB CONTENT: Multiple Warehouses */}
            {subTab === 'list' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="ss-table-controls">
                                <div className="ss-search-wrap">
                                    <Search size={16} />
                                    <input 
                                        type="text" 
                                        className="ss-search-input" 
                                        placeholder="Search Warehouses..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Depot ID</th>
                                            <th>Warehouse Name</th>
                                            <th>Street Location Address</th>
                                            <th>Space Capacity</th>
                                            <th>Total Stock Stored</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {warehouses.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td className="ss-item-name">{item.name}</td>
                                                <td>{item.location}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className={`badge py-1 px-2.5 rounded text-white ${
                                                            item.capacity.startsWith('7') ? 'bg-danger' : 
                                                            item.capacity.startsWith('3') ? 'bg-warning text-dark' : 'bg-success'
                                                        }`}>
                                                            {item.capacity}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="fw-semibold text-dark">{item.totalItems}</td>
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
                                <Box size={18} className="text-orange" color="#ff9b29" />
                                Add Warehouse Branch
                            </h4>
                            <form onSubmit={handleAddWarehouse}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Warehouse Name *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Cold Depot C" value={newWHName} onChange={(e) => setNewWHName(e.target.value)} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Street Location Address *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. MIDC Sector 15, Pune" value={newWHLocation} onChange={(e) => setNewWHLocation(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Assigned Storage Capacity</label>
                                    <select className="form-select form-select-sm p-2" value={newWHCapacity} onChange={(e) => setNewWHCapacity(e.target.value)}>
                                        <option value="10% Full">10% Capacity (Brand New)</option>
                                        <option value="50% Full">50% Capacity</option>
                                        <option value="80% Full">80% Capacity</option>
                                    </select>
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Save Warehouse
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Inter-Warehouse Transfers */}
            {subTab === 'transfer' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2"><ArrowRightLeft size={18} /> Transfer Dispatch Logs</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Transfer ID</th>
                                            <th>Item / Material</th>
                                            <th>Transfer Quantity</th>
                                            <th>Source Depot</th>
                                            <th>Destination Depot</th>
                                            <th>Dispatch Date</th>
                                            <th>Transit Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transfers.map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td className="ss-item-name">{item.item}</td>
                                                <td className="fw-bold text-dark">{item.qty}</td>
                                                <td className="small text-muted">{item.fromWH}</td>
                                                <td className="small text-muted">{item.toWH}</td>
                                                <td className="small">{item.date}</td>
                                                <td>
                                                    <span className={`badge py-1.5 px-3 rounded-pill text-white ${
                                                        item.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'
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
                                <ArrowRightLeft size={18} className="text-indigo" color="#6366f1" />
                                Initiate Stock Transfer
                            </h4>
                            <form onSubmit={handleAddTransfer}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Material / Finished Good *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Polypropylene Granules" value={newTrfItem} onChange={(e) => setNewTrfItem(e.target.value)} required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Transfer Quantity *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. 500 kg" value={newTrfQty} onChange={(e) => setNewTrfQty(e.target.value)} required />
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">From Depot *</label>
                                        <select className="form-select form-select-sm p-2" value={newTrfFrom} onChange={(e) => setNewTrfFrom(e.target.value)}>
                                            {warehouses.map(w => (
                                                <option key={w.id} value={w.name}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">To Depot *</label>
                                        <select className="form-select form-select-sm p-2" value={newTrfTo} onChange={(e) => setNewTrfTo(e.target.value)}>
                                            {warehouses.map(w => (
                                                <option key={w.id} value={w.name}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <ArrowRightLeft size={16} /> Dispatch Stock Cargo
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Rack & Shelf Map */}
            {subTab === 'racks' && (
                <div className="row g-3">
                    <div className="col-12 col-md-4 col-xl-3">
                        <div className="ss-main-panel shadow-sm p-3 bg-white rounded-3">
                            <h6 className="fw-bold text-dark mb-3">Select Warehouse Aisle</h6>
                            <div className="d-flex flex-column gap-2">
                                {initialAisles.map(a => (
                                    <button 
                                        key={a.aisle}
                                        onClick={() => setSelectedAisle(a.aisle)}
                                        className={`btn btn-sm text-start py-2.5 px-3 rounded-3 border-0 font-semibold ${
                                            selectedAisle === a.aisle ? 'bg-indigo-subtle text-indigo' : 'bg-light text-secondary'
                                        }`}
                                        style={selectedAisle === a.aisle ? {background: '#eff6ff', color: '#4f46e5'} : {}}
                                    >
                                        {a.aisle}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-8 col-xl-9">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Layers size={18} /> Interactive Rack Layout Grid: {selectedAisle}</h5>
                            
                            <div className="row g-3">
                                {initialAisles.find(a => a.aisle === selectedAisle)?.racks.map((rack, idx) => (
                                    <div className="col-12 col-md-6" key={idx}>
                                        <div className="p-3 border rounded-3 bg-light-subtle h-100" style={{ background: '#f8fafc' }}>
                                            <h6 className="fw-bold mb-3 text-indigo font-monospace" style={{color:'#4f46e5'}}>{rack.label}</h6>
                                            <div className="d-flex flex-column gap-2">
                                                {rack.shelves.map((shelf, sIdx) => {
                                                    const isEmpty = shelf.includes('Empty');
                                                    return (
                                                        <div 
                                                            key={sIdx} 
                                                            className={`p-3 rounded-2 border d-flex justify-content-between align-items-center ${
                                                                isEmpty ? 'bg-light text-muted' : 'bg-white text-dark shadow-sm'
                                                            }`}
                                                            style={{ borderLeft: isEmpty ? '3px solid #cbd5e1' : '3px solid #ff9b29' }}
                                                        >
                                                            <span className="small fw-semibold">{shelf}</span>
                                                            <span className={`badge small px-2 py-1 rounded ${
                                                                isEmpty ? 'bg-secondary-subtle text-secondary' : 'bg-warning-subtle text-warning'
                                                            }`}>
                                                                {isEmpty ? 'Available' : 'Occupied'}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
