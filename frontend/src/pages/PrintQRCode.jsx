import React from 'react';
import './Products.css';
import { 
    RefreshCw, 
    ChevronUp,
    Trash2,
    Eye,
    Power,
    Printer,
    Minus,
    Plus,
    Search
} from 'lucide-react';

const PrintQRCode = () => {
    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Print QR Code</h4>
                    <p>Manage your QR code</p>
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
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '500'}}>Warehouse <span className="text-danger">*</span></label>
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
                        <div className="form-group mb-0">
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '500'}}>Product <span className="text-danger">*</span></label>
                            <div className="search-box w-100 m-0" style={{ maxWidth: 'none', background: '#fff', border: '1px solid #e2e8f0' }}>
                                <Search size={18} color="#9ca3af" />
                                <input 
                                    type="text" 
                                    className="border-0 bg-transparent"
                                    placeholder="Search Product by Code" 
                                    style={{flex: 1, outline: 'none', paddingLeft: '10px'}}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Options Table */}
                <div className="table-responsive mb-5 border rounded bg-white">
                    <table className="table mb-0" style={{ minWidth: '800px' }}>
                        <thead style={{ backgroundColor: '#e9ecef' }}>
                            <tr>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Product</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>SKU</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Code</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Reference Number</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Qty</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', padding: '12px 16px', width: '60px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <img src="https://placehold.co/32x32/fee2e2/dc2626?text=NJ" alt="Nike" style={{width: '32px', height: '32px', borderRadius: '4px'}} />
                                        <span>Nike Jordan</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>PT002</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>HG3FK</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>32RRR554</td>
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
                <div className="row align-items-center flex-wrap mb-5">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '500'}}>Paper Size <span className="text-danger">*</span></label>
                            <select className="form-select custom-input">
                                <option value="">Select</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-md-end align-items-center pt-md-4">
                        <div className="d-flex flex-column align-items-center">
                            <span className="mb-2" style={{fontSize: '13px', fontWeight: '600', color: '#4b5563'}}>Reference Number</span>
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
                        <Eye size={16} /> Generate QR Code
                    </button>
                    <button className="btn d-flex align-items-center justify-content-center gap-2" style={{ height: '40px', padding: '0 20px', borderRadius: '4px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontWeight: '500', fontSize: '14px' }}>
                        <Power size={16} /> Reset
                    </button>
                    <button className="btn btn-danger text-white d-flex align-items-center justify-content-center gap-2" style={{ height: '40px', padding: '0 20px', borderRadius: '4px', border: 'none', fontWeight: '500', fontSize: '14px' }}>
                        <Printer size={16} /> Print QRcode
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PrintQRCode;
