import React, { useState } from 'react';
import { 
    ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Search,
    Plus, Trash2, FileText, ClipboardList
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import '../inventory-pages-custom.css';

// Initial Mock Datasets
const initialInspections = [
    { id: 'QC-8891', product: 'Classic Plastic Chair (Red)', batch: 'BCH-2026-05A', qtyTested: 100, passed: 98, failed: 2, inspector: 'Rahul Mehta', date: '2026-05-24' },
    { id: 'QC-8892', product: 'Premium Office Ergonomic Chair', batch: 'BCH-2026-05B', qtyTested: 50, passed: 48, failed: 2, inspector: 'Sita Sharma', date: '2026-05-23' },
    { id: 'QC-8893', product: 'Plastic Dining Table (Oval)', batch: 'BCH-2026-05B', qtyTested: 20, passed: 20, failed: 0, inspector: 'Rahul Mehta', date: '2026-05-21' },
    { id: 'QC-8894', product: 'Steel Frame Folding Bench', batch: 'BCH-2026-05C', qtyTested: 10, passed: 9, failed: 1, inspector: 'Sita Sharma', date: '2026-05-18' },
];

const initialRejections = [
    { id: 'REJ-102', product: 'Classic Plastic Chair (Red)', batch: 'BCH-2026-05A', qty: 2, reason: 'Molding sink marks / bubbles', disposal: 'Granulate & Re-blend' },
    { id: 'REJ-103', product: 'Premium Office Ergonomic Chair', batch: 'BCH-2026-05B', qty: 2, reason: 'Fabric tear / cylinder drift', disposal: 'Rework Required' },
    { id: 'REJ-104', product: 'Steel Frame Folding Bench', batch: 'BCH-2026-05C', qty: 1, reason: 'Joint welding fracture cracks', disposal: 'Scrapped' },
];

export default function QualityControl() {
    const [inspections, setInspections] = useState(initialInspections);
    const [rejections, setRejections] = useState(initialRejections);
    const [searchTerm, setSearchTerm] = useState('');

    // Form inputs
    const [newProduct, setNewProduct] = useState('Classic Plastic Chair (Red)');
    const [newBatch, setNewBatch] = useState('BCH-2026-05A');
    const [newQtyTested, setNewQtyTested] = useState('');
    const [newPassed, setNewPassed] = useState('');
    const [newFailed, setNewFailed] = useState('');
    const [newInspector, setNewInspector] = useState('');
    const [newFailReason, setNewFailReason] = useState('');

    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Calculate metrics
    const totalTested = inspections.reduce((acc, curr) => acc + curr.qtyTested, 0);
    const totalPassed = inspections.reduce((acc, curr) => acc + curr.passed, 0);
    const totalFailed = inspections.reduce((acc, curr) => acc + curr.failed, 0);
    const passRate = totalTested > 0 ? ((totalPassed / totalTested) * 100).toFixed(1) : 100;

    const qcDistributionData = [
        { name: 'Passed Products', value: totalPassed, color: '#10b981' },
        { name: 'Failed Products', value: totalFailed, color: '#ef4444' }
    ];

    // Add Inspection Handler
    const handleAddInspection = (e) => {
        e.preventDefault();
        const tested = parseInt(newQtyTested) || 0;
        const pass = parseInt(newPassed) || 0;
        const fail = parseInt(newFailed) || 0;

        if (tested === 0) {
            showToast('Inspection volume cannot be zero!', 'error');
            return;
        }

        if (pass + fail !== tested) {
            showToast('Math error: Passed + Failed must equal Total Inspected quantity!', 'error');
            return;
        }

        const newInspection = {
            id: `QC-88${inspections.length + 95}`,
            product: newProduct,
            batch: newBatch,
            qtyTested: tested,
            passed: pass,
            failed: fail,
            inspector: newInspector || 'General QA Inspector',
            date: new Date().toISOString().split('T')[0]
        };

        setInspections([newInspection, ...inspections]);

        // If failures exist, automatically log into rejections!
        if (fail > 0) {
            const newRej = {
                id: `REJ-${rejections.length + 105}`,
                product: newProduct,
                batch: newBatch,
                qty: fail,
                reason: newFailReason || 'General QA Tolerance Defect',
                disposal: 'Awaiting Engineering Review'
            };
            setRejections([newRej, ...rejections]);
        }

        setNewQtyTested('');
        setNewPassed('');
        setNewFailed('');
        setNewInspector('');
        setNewFailReason('');
        showToast('QC Inspection sheet recorded successfully!');
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
                    <h2 className="ss-page-title">Quality Control (QC)</h2>
                    <p className="ss-page-subtitle">File quality audit logs, track rejection reasons, and monitor plant pass rates</p>
                </div>
            </div>

            {/* Top Cards Row */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 shadow-sm bg-white border d-flex justify-content-between align-items-center">
                        <div>
                            <span className="small text-muted d-block fw-semibold mb-1">Inspected Items (Monthly)</span>
                            <h3 className="fw-bold mb-0 text-indigo" style={{color: '#4f46e5'}}>{totalTested} Units</h3>
                        </div>
                        <div className="p-2.5 rounded bg-indigo-subtle text-indigo" style={{background: '#eff6ff', color: '#4f46e5'}}>
                            <ClipboardList size={24} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 shadow-sm bg-white border d-flex justify-content-between align-items-center">
                        <div>
                            <span className="small text-muted d-block fw-semibold mb-1">Average Plant Pass Rate</span>
                            <h3 className="fw-bold mb-0 text-success">{passRate}% Pass</h3>
                        </div>
                        <div className="p-2.5 rounded bg-success-subtle text-success" style={{background: '#eff6ff', color: '#16a34a'}}>
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 shadow-sm bg-white border d-flex justify-content-between align-items-center">
                        <div>
                            <span className="small text-muted d-block fw-semibold mb-1">Total Failures & Rejections</span>
                            <h3 className="fw-bold mb-0 text-danger">{totalFailed} Defected</h3>
                        </div>
                        <div className="p-2.5 rounded bg-danger-subtle text-danger" style={{background: '#eff6ff', color: '#ef4444'}}>
                            <XCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Area: Audit & Configuration Form */}
            <div className="row g-4 mb-4">
                {/* Form Sheet */}
                <div className="col-12 col-xl-4">
                    <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100">
                        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2" style={{ fontSize: '18px' }}>
                            <ShieldCheck size={18} className="text-indigo" color="#6366f1" />
                            File Quality Audit Sheet
                        </h4>
                        <form onSubmit={handleAddInspection}>
                            <div className="mb-2">
                                <label className="form-label small fw-bold text-secondary">Target Finished Good *</label>
                                <select className="form-select form-select-sm p-2" value={newProduct} onChange={(e) => setNewProduct(e.target.value)}>
                                    <option value="Classic Plastic Chair (Red)">Classic Plastic Chair (Red)</option>
                                    <option value="Premium Office Ergonomic Chair">Premium Office Ergonomic Chair</option>
                                    <option value="Plastic Dining Table (Oval)">Plastic Dining Table (Oval)</option>
                                    <option value="Steel Frame Folding Bench">Steel Frame Folding Bench</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-bold text-secondary">Lot Production Batch Code *</label>
                                <select className="form-select form-select-sm p-2" value={newBatch} onChange={(e) => setNewBatch(e.target.value)}>
                                    <option value="BCH-2026-05A">BCH-2026-05A (Plastic)</option>
                                    <option value="BCH-2026-05B">BCH-2026-05B (Resin/Dye)</option>
                                    <option value="BCH-2026-05C">BCH-2026-05C (Metal Framing)</option>
                                </select>
                            </div>
                            <div className="row g-2 mb-2">
                                <div className="col-4">
                                    <label className="form-label small fw-bold text-secondary">Total Tested *</label>
                                    <input type="number" className="form-control form-control-sm p-2" placeholder="e.g. 100" value={newQtyTested} onChange={(e) => setNewQtyTested(e.target.value)} required />
                                </div>
                                <div className="col-4">
                                    <label className="form-label small fw-bold text-secondary">Passed Qty *</label>
                                    <input type="number" className="form-control form-control-sm p-2" placeholder="98" value={newPassed} onChange={(e) => setNewPassed(e.target.value)} required />
                                </div>
                                <div className="col-4">
                                    <label className="form-label small fw-bold text-secondary">Failed Qty *</label>
                                    <input type="number" className="form-control form-control-sm p-2" placeholder="2" value={newFailed} onChange={(e) => setNewFailed(e.target.value)} required />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-bold text-secondary">Defect / Failure Root Cause</label>
                                <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Surface bubble / cracks" value={newFailReason} onChange={(e) => setNewFailReason(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Auditing Inspector</label>
                                <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Rahul Mehta" value={newInspector} onChange={(e) => setNewInspector(e.target.value)} />
                            </div>
                            <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center align-items-center gap-1.5" style={{ background: '#ff9b29' }}>
                                <ShieldCheck size={16} /> Save Inspection Log
                            </button>
                        </form>
                    </div>
                </div>

                {/* Live History Logs */}
                <div className="col-12 col-xl-8">
                    <div className="ss-main-panel shadow-sm bg-white h-100">
                        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2"><ClipboardList size={18} /> Finished Goods Inspection logs</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="ss-table align-middle">
                                <thead>
                                    <tr>
                                        <th>QC Sheet ID</th>
                                        <th>Target Product</th>
                                        <th>Production Batch</th>
                                        <th>Inspected Vol</th>
                                        <th>Passed / Failed</th>
                                        <th>Quality Officer</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inspections.map((item) => (
                                        <tr key={item.id}>
                                            <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                            <td className="ss-item-name">{item.product}</td>
                                            <td><span className="ss-code-badge bg-warning-subtle font-monospace">{item.batch}</span></td>
                                            <td className="fw-bold text-dark text-center">{item.qtyTested} Units</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2.5">
                                                    <span className="text-success small fw-semibold">✔ {item.passed} Pass</span>
                                                    {item.failed > 0 && <span className="text-danger small fw-semibold">✘ {item.failed} Fail</span>}
                                                </div>
                                            </td>
                                            <td className="small text-muted">{item.inspector}</td>
                                            <td className="small text-nowrap">{item.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 4: Rejections & Pass/Fail Chart */}
            <div className="row g-4">
                {/* Rejected Products List */}
                <div className="col-12 col-xl-8">
                    <div className="ss-main-panel shadow-sm bg-white">
                        <div className="p-3 border-bottom bg-light">
                            <h5 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2"><AlertTriangle size={18} /> Rejected Products & Disposal Log</h5>
                        </div>
                        <div className="ss-table-wrapper">
                            <table className="ss-table align-middle">
                                <thead>
                                    <tr>
                                        <th>Rejection ID</th>
                                        <th>Product / Batch</th>
                                        <th>Rejected Qty</th>
                                        <th>Tolerance Defect Reason</th>
                                        <th>Disposal Corrective Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rejections.map((item) => (
                                        <tr key={item.id}>
                                            <td><span className="ss-code-badge bg-danger-subtle text-danger font-monospace">{item.id}</span></td>
                                            <td>
                                                <h6 className="fw-bold mb-0 small text-dark">{item.product}</h6>
                                                <span className="text-secondary small font-monospace" style={{ fontSize: '10px' }}>{item.batch}</span>
                                            </td>
                                            <td className="text-danger fw-bold">{item.qty} Units</td>
                                            <td className="small text-muted">{item.reason}</td>
                                            <td>
                                                <span className="badge bg-warning text-dark py-1 px-3.5 rounded">{item.disposal}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pie Chart Widget */}
                <div className="col-12 col-xl-4">
                    <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 text-center">
                        <h5 className="fw-bold text-dark text-start mb-3"><ClipboardList size={18} className="text-indigo" color="#6366f1" /> Pass vs Fail Analysis</h5>
                        <div className="d-flex align-items-center justify-content-center my-3 mx-auto" style={{ width: 150, height: 150 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={qcDistributionData} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                                        {qcDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="d-flex justify-content-center gap-3.5 mt-3">
                            <span className="small text-muted"><span style={{color: '#10b981'}}>●</span> Passed ({totalPassed} units)</span>
                            <span className="small text-muted"><span style={{color: '#ef4444'}}>●</span> Rejected ({totalFailed} units)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
