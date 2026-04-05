import React from 'react';
import './CreateProduct.css';
import { Link } from 'react-router-dom';
import { 
    RefreshCw, 
    ChevronUp, 
    ArrowLeft,
    Info,
    ChevronDown,
    PlusCircle,
    Copy,
    Bold, Italic, Underline, Link as LinkIcon, AlignLeft, List, Target,
    DollarSign,
    Image as ImageIcon,
    Plus,
    X,
    ListChecks,
    Calendar
} from 'lucide-react';

const CreateProduct = () => {

    return (
        <div className="cp-container container-fluid px-0">
            {/* Header */}
            <div className="cp-header">
                <div className="cp-title">
                    <h4>Create Product</h4>
                    <p>Create new product</p>
                </div>
                <div className="cp-actions">
                    <button className="btn-icon-action" title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    <button className="btn-icon-action" title="Collapse">
                        <ChevronUp size={18} />
                    </button>
                    <Link to="/products" className="btn-dark-blue text-decoration-none">
                        <ArrowLeft size={18} /> Back to Product
                    </Link>
                </div>
            </div>

            {/* Product Information Card */}
            <div className="cp-card">
                <div className="cp-card-header">
                    <div className="cp-card-title"><Info size={18} /> Product Information</div>
                    <ChevronDown size={18} className="text-muted" />
                </div>
                <div className="cp-card-body">
                    <div className="row">
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Store <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Warehouse <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Product Name <span className="required">*</span></label>
                            <input type="text" className="cp-input" />
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Slug <span className="required">*</span></label>
                            <input type="text" className="cp-input" />
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">SKU <span className="required">*</span></label>
                            <div className="cp-input-group">
                                <input type="text" className="cp-input text-muted" />
                                <button className="btn-generate">Generate</button>
                            </div>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Selling Type <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">
                                <span>Category <span className="required">*</span></span>
                                <div className="add-new"><PlusCircle size={14}/> Add New</div>
                            </label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Sub Category <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Brand <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Unit <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Barcode Symbology <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Item Barcode <span className="required">*</span></label>
                            <div className="cp-input-group">
                                <input type="text" className="cp-input text-muted" />
                                <button className="btn-generate">Generate</button>
                            </div>
                        </div>
                        <div className="col-12 cp-form-group mb-1">
                            <label className="cp-label">Description</label>
                            <div className="rt-editor">
                                <div className="rt-toolbar">
                                    <div><span>Normal</span></div>
                                    <div><ChevronDown size={14}/></div>
                                    <div><Bold size={14} className="text-dark"/></div>
                                    <div><Italic size={14} className="text-dark"/></div>
                                    <div><Underline size={14} className="text-dark"/></div>
                                    <div><LinkIcon size={14} className="text-dark"/></div>
                                    <div><AlignLeft size={14}/></div>
                                    <div><List size={14}/></div>
                                    <div><Target size={14}/></div>
                                </div>
                                <textarea className="rt-textarea"></textarea>
                            </div>
                            <div className="desc-hint">Maximum 50 Words</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing & Stocks Card */}
            <div className="cp-card">
                <div className="cp-card-header">
                    <div className="cp-card-title"><DollarSign size={18} /> Pricing & Stocks</div>
                    <ChevronDown size={18} className="text-muted" />
                </div>
                <div className="cp-card-body">
                    <div className="row">
                        <div className="col-12 cp-form-group">
                            <label className="cp-label">Product Type <span className="required">*</span></label>
                            <div className="cp-radio-group">
                                <label className="cp-radio">
                                    <input type="radio" name="productType" defaultChecked />
                                    Single Product
                                </label>
                                <label className="cp-radio">
                                    <input type="radio" name="productType" />
                                    Variable Product
                                </label>
                            </div>
                        </div>
                        <div className="col-md-4 cp-form-group">
                            <label className="cp-label">Quantity <span className="required">*</span></label>
                            <input type="number" className="cp-input" />
                        </div>
                        <div className="col-md-4 cp-form-group">
                            <label className="cp-label">Price <span className="required">*</span></label>
                            <input type="text" className="cp-input" />
                        </div>
                        <div className="col-md-4 cp-form-group">
                            <label className="cp-label">Tax Type <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-4 cp-form-group">
                            <label className="cp-label">Tax <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-4 cp-form-group">
                            <label className="cp-label">Discount Type <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-4 cp-form-group">
                            <label className="cp-label">Discount Value <span className="required">*</span></label>
                            <input type="text" className="cp-input" />
                        </div>
                        <div className="col-md-4 cp-form-group mb-1">
                            <label className="cp-label">Quantity Alert <span className="required">*</span></label>
                            <input type="number" className="cp-input" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Images Card */}
            <div className="cp-card">
                <div className="cp-card-header">
                    <div className="cp-card-title"><ImageIcon size={18} /> Images</div>
                    <ChevronDown size={18} className="text-muted" />
                </div>
                <div className="cp-card-body">
                    <div className="images-container">
                        <div className="add-image-box">
                            <Plus size={20} className="text-muted" />
                            <span>Add Images</span>
                        </div>
                        <div className="preview-image-box">
                            <img src="https://placehold.co/100x100/e2e8f0/ef4444?text=Phone+Red+1" alt="Preview 1" />
                            <button className="remove-image-btn"><X size={12} /></button>
                        </div>
                        <div className="preview-image-box">
                            <img src="https://placehold.co/100x100/e2e8f0/ef4444?text=Phone+Red+2" alt="Preview 2" />
                            <button className="remove-image-btn"><X size={12} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Fields Card */}
            <div className="cp-card">
                <div className="cp-card-header">
                    <div className="cp-card-title"><ListChecks size={18} /> Custom Fields</div>
                    <ChevronDown size={18} className="text-muted" />
                </div>
                <div className="cp-card-body">
                    <div className="custom-fields-row">
                        <label className="cp-checkbox">
                            <input type="checkbox" /> Warranties
                        </label>
                        <label className="cp-checkbox">
                            <input type="checkbox" /> Manufacturer
                        </label>
                        <label className="cp-checkbox">
                            <input type="checkbox" /> Expiry
                        </label>
                    </div>

                    <div className="row">
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Warranty <span className="required">*</span></label>
                            <select className="cp-input text-muted">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="col-md-6 cp-form-group">
                            <label className="cp-label">Manufacturer <span className="required">*</span></label>
                            <input type="text" className="cp-input" />
                        </div>
                        <div className="col-md-6 cp-form-group mb-1">
                            <label className="cp-label">Manufactured Date <span className="required">*</span></label>
                            <div className="cp-input-group">
                                <input type="text" className="cp-input text-muted" placeholder="dd/mm/yyyy" />
                                <Calendar size={16} className="calendar-icon" />
                            </div>
                        </div>
                        <div className="col-md-6 cp-form-group mb-1">
                            <label className="cp-label">Expiry On <span className="required">*</span></label>
                            <div className="cp-input-group">
                                <input type="text" className="cp-input text-muted" placeholder="dd/mm/yyyy" />
                                <Calendar size={16} className="calendar-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Form Actions */}
            <div className="cp-footer">
                <button className="btn-dark-blue px-4">Cancel</button>
                <button className="btn-orange px-4">Add Product</button>
            </div>

        </div>
    );
};

export default CreateProduct;
