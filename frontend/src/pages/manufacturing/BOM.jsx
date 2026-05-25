import React, { useState } from 'react';
import { Plus, Trash2, Scale, Calculator, CheckCircle2, RotateCcw, Box, ArrowRight } from 'lucide-react';
import '../inventory-pages-custom.css';

// Pre-defined Materials base database
const rawMaterialsDB = [
    { id: 'RM001', name: 'Polypropylene Granules', cost: 120, unit: 'kg' },
    { id: 'RM002', name: 'Titanium Dioxide', cost: 350, unit: 'kg' },
    { id: 'RM003', name: 'Red Dye Liquid Base', cost: 450, unit: 'Litre' },
    { id: 'RM004', name: 'Aluminium Extrusion', cost: 180, unit: 'm' },
    { id: 'RM005', name: 'Corrugated Packaging Boxes', cost: 15, unit: 'Unit' },
];

export default function BOM() {
    const [selectedProduct, setSelectedProduct] = useState('Plastic Chair');
    const [autoDeduct, setAutoDeduct] = useState(true);
    
    // Formula list state
    const [formulaItems, setFormulaItems] = useState([
        { materialId: 'RM001', qty: 2.0 },  // 2kg Polypropylene
        { materialId: 'RM003', qty: 0.1 },  // 100g dye
        { materialId: 'RM005', qty: 1 },    // 1 box
    ]);

    const [toastMsg, setToastMsg] = useState('');
    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    // Calculate BOM item cost
    const getItemCost = (item) => {
        const mat = rawMaterialsDB.find(m => m.id === item.materialId);
        return mat ? mat.cost * item.qty : 0;
    };

    // Calculate BOM Total Cost
    const totalBOMCost = formulaItems.reduce((acc, item) => acc + getItemCost(item), 0);
    // Overhead cost estimate (15%)
    const overheadCost = totalBOMCost * 0.15;
    const finalManufacturingCost = totalBOMCost + overheadCost;

    const handleAddRow = () => {
        setFormulaItems([...formulaItems, { materialId: 'RM001', qty: 1.0 }]);
    };

    const handleRemoveRow = (idx) => {
        setFormulaItems(formulaItems.filter((_, i) => i !== idx));
    };

    const handleMaterialChange = (idx, value) => {
        const updated = [...formulaItems];
        updated[idx].materialId = value;
        setFormulaItems(updated);
    };

    const handleQtyChange = (idx, value) => {
        const updated = [...formulaItems];
        updated[idx].qty = parseFloat(value) || 0;
        setFormulaItems(updated);
    };

    const handleSaveBOM = () => {
        showToast(`BOM Formula for ${selectedProduct} saved successfully! OEE optimized.`);
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

            {/* Header Area */}
            <div className="ss-header-row mb-4">
                <div>
                    <h2 className="ss-page-title">Bill of Materials (BOM)</h2>
                    <p className="ss-page-subtitle">Configure manufacturing formulas, material lists, and automatic stock deduction rules</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-orange" onClick={handleSaveBOM}>
                        <CheckCircle2 size={16} />
                        Save Formula
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Form & Rows */}
                <div className="col-12 col-xl-8">
                    <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                        <div className="row g-3 mb-4 align-items-center">
                            <div className="col-12 col-md-6">
                                <label className="form-label small fw-bold text-secondary">Target Manufactured Product *</label>
                                <select className="form-select border p-2 fw-semibold" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                                    <option value="Plastic Chair">Classic Plastic Chair (Red)</option>
                                    <option value="Office Chair">Premium Office Ergonomic Chair</option>
                                    <option value="Dining Table">Plastic Dining Table (Oval)</option>
                                    <option value="Steel Bench">Steel Frame Folding Bench</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6 d-flex align-items-center mt-md-4 pt-md-2">
                                <div className="form-check form-switch d-flex align-items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input ss-checkbox" 
                                        role="switch" 
                                        id="autoDeductSwitch" 
                                        checked={autoDeduct}
                                        onChange={() => setAutoDeduct(!autoDeduct)} 
                                        style={{ width: '45px', height: '22px', accentColor: '#ff9b29' }}
                                    />
                                    <label className="form-check-label small fw-semibold text-secondary" htmlFor="autoDeductSwitch">
                                        Auto deduct raw stock on production run completion
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* BOM Table */}
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2">
                            <Scale size={18} className="text-orange" color="#ff9b29" />
                            Required Ingredients & Materials
                        </h5>
                        
                        <div className="table-responsive mb-3">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th className="small fw-bold text-muted" style={{ width: '45%' }}>Material / Item Name</th>
                                        <th className="small fw-bold text-muted text-center" style={{ width: '20%' }}>Quantity Required</th>
                                        <th className="small fw-bold text-muted text-end" style={{ width: '15%' }}>Unit Price</th>
                                        <th className="small fw-bold text-muted text-end" style={{ width: '15%' }}>Computed Cost</th>
                                        <th className="small fw-bold text-muted text-center" style={{ width: '5%' }}>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formulaItems.map((item, idx) => {
                                        const matObj = rawMaterialsDB.find(m => m.id === item.materialId);
                                        return (
                                            <tr key={idx}>
                                                <td>
                                                    <select 
                                                        className="form-select form-select-sm p-1.5 border" 
                                                        value={item.materialId}
                                                        onChange={(e) => handleMaterialChange(idx, e.target.value)}
                                                    >
                                                        {rawMaterialsDB.map(m => (
                                                            <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <div className="input-group input-group-sm">
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            className="form-control form-control-sm text-center border p-1" 
                                                            value={item.qty} 
                                                            onChange={(e) => handleQtyChange(idx, e.target.value)}
                                                        />
                                                        <span className="input-group-text bg-light">{matObj?.unit || ''}</span>
                                                    </div>
                                                </td>
                                                <td className="text-end small fw-semibold text-secondary">
                                                    ₹{matObj?.cost.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="text-end fw-bold text-dark">
                                                    ₹{getItemCost(item).toFixed(2)}
                                                </td>
                                                <td className="text-center">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-danger border-0 rounded"
                                                        onClick={() => handleRemoveRow(idx)}
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <button type="button" className="btn btn-sm btn-outline-indigo d-flex align-items-center gap-1" style={{ borderColor: '#6366f1', color: '#4f46e5' }} onClick={handleAddRow}>
                            <Plus size={15} /> Add Ingredient
                        </button>
                    </div>
                </div>

                {/* Costing Summary panel */}
                <div className="col-12 col-xl-4">
                    <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100">
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark pb-2 border-bottom">
                            <Calculator size={18} className="text-indigo" color="#6366f1" />
                            Production Formula Costs
                        </h4>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-secondary small fw-medium">Direct Materials Subtotal:</span>
                            <span className="fw-bold text-dark fs-6">₹{totalBOMCost.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-secondary small fw-medium">Factory Overhead / Labor (15%):</span>
                            <span className="fw-bold text-warning fs-6">₹{overheadCost.toFixed(2)}</span>
                        </div>
                        
                        <div className="p-3 bg-light rounded-3 mb-4 mt-4 d-flex justify-content-between align-items-center" style={{ borderLeft: '4px solid #6366f1' }}>
                            <div>
                                <h6 className="mb-0 fw-bold text-dark">Estimated Finished Cost:</h6>
                                <span className="small text-muted">Per Manufactured Unit</span>
                            </div>
                            <span className="fw-bold text-indigo fs-5 text-end">₹{finalManufacturingCost.toFixed(2)}</span>
                        </div>

                        {/* Interactive Example Demo */}
                        <div className="p-3 bg-warning-subtle text-amber-950 rounded-3 mb-3" style={{ background: '#fef3c7', border: '1px dashed #fcd34d', color: '#78350f' }}>
                            <h6 className="fw-bold mb-1 d-flex align-items-center gap-1 small"><Box size={14} /> Example Scenario:</h6>
                            <p className="small mb-0" style={{ fontSize: '12px' }}>
                                To manufacture **100 Plastic Chairs**, the ERP system automatically schedules deduction of:
                                <br />• **200 kg** of Polypropylene Resin
                                <br />• **10 Litres** of Red Pigment Dye
                                <br />• **100 Units** of Cardboard Packaging Box
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
