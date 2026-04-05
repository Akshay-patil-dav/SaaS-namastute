import React from 'react';
import './Products.css';
import { 
    RefreshCw, 
    ChevronUp,
    Trash2,
    Eye,
    Power,
    Printer,
    MinusSquare,
    PlusSquare,
    Minus,
    Plus
} from 'lucide-react';

const PrintBarcode = () => {
    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Print Barcode</h4>
                    <p>Print product barcodes</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    <button className="btn-icon-action" title="Collapse">
                        <ChevronUp size={18} />
                    </button>
                </div>
            </div>

            {/* Main Form Area */}
            <div className="product-table-card form-layout-wrapper p-4">
                
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '500'}}>Warehouse</label>
                            <select className="form-select custom-input">
                                <option>Select</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '500'}}>Store <span className="text-danger">*</span></label>
                            <select className="form-select custom-input">
                                <option>Select</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12">
                        <input type="text" className="form-control custom-input" placeholder="Search Product by Code" />
                    </div>
                </div>

                {/* Print Options Table */}
                <div className="table-responsive mb-5 border rounded">
                    <table className="table mb-0" style={{ minWidth: '700px' }}>
                        <thead style={{ backgroundColor: '#e9ecef' }}>
                            <tr>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Product</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>SKU</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Code</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Qty</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', padding: '12px 16px', width: '60px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>Nike Air Jordan</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>PT002</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>HG3FK</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                                    <div className="d-inline-flex border rounded align-items-center" style={{ width: '100px', height: '36px', justifyContent: 'space-between' }}>
                                        <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center text-secondary" style={{height: '100%', width: '30px'}}><Minus size={14}/></button>
                                        <span style={{fontSize: '14px', fontWeight: '500'}}>4</span>
                                        <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center text-secondary" style={{height: '100%', width: '30px'}}><Plus size={14}/></button>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', textAlign: 'center' }}>
                                    <button className="btn btn-sm btn-outline-light border text-danger d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>Apple Series 5 Watch</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>PT003</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>TEUIU7</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                                    <div className="d-inline-flex border rounded align-items-center" style={{ width: '100px', height: '36px', justifyContent: 'space-between' }}>
                                        <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center text-secondary" style={{height: '100%', width: '30px'}}><Minus size={14}/></button>
                                        <span style={{fontSize: '14px', fontWeight: '500'}}>4</span>
                                        <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center text-secondary" style={{height: '100%', width: '30px'}}><Plus size={14}/></button>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', textAlign: 'center' }}>
                                    <button className="btn btn-sm btn-outline-light border text-danger d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Configuration Options */}
                <div className="row align-items-center mb-5">
                    <div className="col-md-5">
                        <select className="form-select custom-input" defaultValue="36mm (1.4 inch)">
                            <option value="36mm (1.4 inch)">36mm (1.4 inch)</option>
                            <option value="12mm (0.47 inch)">12mm (0.47 inch)</option>
                        </select>
                    </div>
                    <div className="col-md-7 d-flex justify-content-end align-items-center gap-5">
                        <div className="d-flex flex-column align-items-center">
                            <span className="mb-2" style={{fontSize: '13px', fontWeight: '600', color: '#4b5563'}}>Show Store Name</span>
                            <label className="switch mb-0">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <span className="mb-2" style={{fontSize: '13px', fontWeight: '600', color: '#4b5563'}}>Show Product Name</span>
                            <label className="switch mb-0">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <span className="mb-2" style={{fontSize: '13px', fontWeight: '600', color: '#4b5563'}}>Show Price</span>
                            <label className="switch mb-0">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-3 pt-4" style={{borderTop: '1px solid #e2e8f0'}}>
                    <button className="btn-orange text-white d-flex align-items-center justify-content-center gap-2" style={{ height: '40px', padding: '0 20px', borderRadius: '4px', border: 'none', fontWeight: '500', fontSize: '14px' }}>
                        <Eye size={16} /> Generate Barcode
                    </button>
                    <button className="btn d-flex align-items-center justify-content-center gap-2" style={{ height: '40px', padding: '0 20px', borderRadius: '4px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontWeight: '500', fontSize: '14px' }}>
                        <Power size={16} /> Reset Barcode
                    </button>
                    <button className="btn d-flex align-items-center justify-content-center gap-2" style={{ height: '40px', padding: '0 20px', borderRadius: '4px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: '500', fontSize: '14px' }}>
                        <Printer size={16} /> Print Barcode
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PrintBarcode;
