import React from 'react';
import { X, Plus, Calendar, Search, Maximize, Minus } from 'lucide-react';
import './add-sales-modal.css';

const AddSalesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content add-sales-modal">
                {/* Header */}
                <div className="modal-header">
                    <h4>Add Sales</h4>
                    <button className="close-btn-red" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Top Stats Header */}
                    <div className="modal-table-header">
                        <div className="header-item">Product</div>
                        <div className="header-item">Qty</div>
                        <div className="header-item">Purchase Price($)</div>
                        <div className="header-item">Discount($)</div>
                        <div className="header-item">Tax(%)</div>
                        <div className="header-item">Tax Amount($)</div>
                        <div className="header-item">Unit Cost($)</div>
                        <div className="header-item">Total Cost(%)</div>
                    </div>

                    {/* Form Fields Row 1 */}
                    <div className="form-row-grid">
                        <div className="form-group">
                            <label>Customer Name <span className="required">*</span></label>
                            <div className="input-with-action">
                                <select className="form-select">
                                    <option>Select</option>
                                </select>
                                <button className="btn-plus-blue">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Date <span className="required">*</span></label>
                            <div className="input-icon-wrapper">
                                <input type="text" placeholder="Choose" className="form-input" />
                                <Calendar className="input-icon-right" size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Supplier <span className="required">*</span></label>
                            <select className="form-select">
                                <option>Select</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Search */}
                    <div className="form-group mt-3">
                        <label>Product <span className="required">*</span></label>
                        <div className="input-icon-wrapper">
                            <input type="text" placeholder="Please type product code and select" className="form-input" />
                            <Maximize className="input-icon-right gray-icon" size={16} />
                        </div>
                    </div>

                    {/* Middle Section: Summary Table */}
                    <div className="summary-section-flex">
                        <div className="left-spacer"></div>
                        <div className="summary-table-container">
                            <table className="summary-mini-table">
                                <tbody>
                                    <tr>
                                        <td>Order Tax</td>
                                        <td>$ 0.00</td>
                                    </tr>
                                    <tr>
                                        <td>Discount</td>
                                        <td>$ 0.00</td>
                                    </tr>
                                    <tr>
                                        <td>Shipping</td>
                                        <td>$ 0.00</td>
                                    </tr>
                                    <tr className="grand-total-row">
                                        <td>Grand Total</td>
                                        <td>$ 0.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Form Fields */}
                    <div className="form-row-grid four-cols">
                        <div className="form-group">
                            <label>Order Tax <span className="required">*</span></label>
                            <input type="number" defaultValue="0" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Discount <span className="required">*</span></label>
                            <input type="number" defaultValue="0" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Shipping <span className="required">*</span></label>
                            <input type="number" defaultValue="0" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Status <span className="required">*</span></label>
                            <select className="form-select">
                                <option>Select</option>
                                <option>Received</option>
                                <option>Pending</option>
                                <option>Ordered</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-submit">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default AddSalesModal;
