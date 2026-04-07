import React, { useState, useEffect } from 'react';
import './EditProduct.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    RefreshCw,
    ChevronUp,
    ArrowLeft,
    Info,
    ChevronDown,
    PlusCircle,
    Bold, Italic, Underline, Link as LinkIcon, AlignLeft, List, Target,
    DollarSign,
    Image as ImageIcon,
    Plus,
    X,
    ListChecks,
    Calendar,
    CheckCircle,
    AlertCircle,
    Loader,
    Wand2
} from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/products`;

// ── Initial form state ──────────────────────────────────────────────────────
const initialForm = {
    store: '',
    warehouse: '',
    name: '',
    slug: '',
    sku: '',
    sellingType: '',
    category: '',
    subCategory: '',
    brand: '',
    unit: '',
    barcodeSymbology: '',
    itemBarcode: '',
    description: '',
    productType: 'Single Product',
    quantity: '',
    price: '',
    taxType: '',
    tax: '',
    discountType: '',
    discountValue: '',
    quantityAlert: '',
    showWarranties: false,
    showManufacturer: false,
    showExpiry: false,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
};

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
    const [generatingSku, setGeneratingSku] = useState(false);
    const [generatingBarcode, setGeneratingBarcode] = useState(false);

    // ── Fetch product data ────────────────────────────────────────────────────
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_BASE}/${id}`);
                const p = res.data;
                
                setForm({
                    store: p.store || '',
                    warehouse: p.warehouse || '',
                    name: p.name || '',
                    slug: p.slug || '',
                    sku: p.sku || '',
                    sellingType: p.sellingType || '',
                    category: p.category || '',
                    subCategory: p.subCategory || '',
                    brand: p.brand || '',
                    unit: p.unit || '',
                    barcodeSymbology: p.barcodeSymbology || '',
                    itemBarcode: p.itemBarcode || '',
                    description: p.description || '',
                    productType: p.productType || 'Single Product',
                    quantity: p.quantity != null ? String(p.quantity) : '',
                    price: p.price != null ? String(p.price) : '',
                    taxType: p.taxType || '',
                    tax: p.tax || '',
                    discountType: p.discountType || '',
                    discountValue: p.discountValue != null ? String(p.discountValue) : '',
                    quantityAlert: p.quantityAlert != null ? String(p.quantityAlert) : '',
                    showWarranties: !!p.warranty,
                    showManufacturer: !!p.manufacturer,
                    showExpiry: !!p.expiryDate,
                    warranty: p.warranty || '',
                    manufacturer: p.manufacturer || '',
                    manufacturedDate: p.manufacturedDate ? p.manufacturedDate.split('T')[0] : '',
                    expiryDate: p.expiryDate ? p.expiryDate.split('T')[0] : '',
                });

                if (p.images) {
                    const imgList = p.images.split(',').filter(url => url.trim()).map(url => ({
                        url: url.trim(),
                        name: 'product-image'
                    }));
                    setImages(imgList);
                }
                setLoading(false);
            } catch (err) {
                showToast('error', 'Failed to load product data.');
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

        // Auto-generate slug from name (only if not manually edited or if desired, but for edit we might want to keep it)
        if (name === 'name') {
            const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setForm(prev => ({ ...prev, name: value, slug }));
        }
    };

    // ── Generate SKU from backend ─────────────────────────────────────────────
    const handleGenerateSku = async () => {
        setGeneratingSku(true);
        try {
            const res = await axios.get(`${API_BASE}/generate-sku`);
            setForm(prev => ({ ...prev, sku: res.data.sku }));
        } catch {
            const local = 'SKU-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            setForm(prev => ({ ...prev, sku: local }));
        } finally {
            setGeneratingSku(false);
        }
    };

    // ── Generate Barcode from backend ─────────────────────────────────────────
    const handleGenerateBarcode = async () => {
        setGeneratingBarcode(true);
        try {
            const res = await axios.get(`${API_BASE}/generate-barcode`);
            setForm(prev => ({ ...prev, itemBarcode: res.data.barcode }));
        } catch {
            const local = String(Math.floor(Math.random() * 9e12) + 1e12);
            setForm(prev => ({ ...prev, itemBarcode: local }));
        } finally {
            setGeneratingBarcode(false);
        }
    };

    // ── Image upload ──────────────────────────────────────────────────────────
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImages(prev => [...prev, { url: ev.target.result, name: file.name }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // ── Reset ─────────────────────────────────────────────────────────────────
    const handleReset = () => {
        // Reset to initial fetch data would be better, but for now we can just re-fetch or clear
        window.location.reload();
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            showToast('error', 'Product name is required.');
            return;
        }
        if (!form.price) {
            showToast('error', 'Price is required.');
            return;
        }
        if (!form.quantity) {
            showToast('error', 'Quantity is required.');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                name:             form.name,
                slug:             form.slug,
                sku:              form.sku,
                description:      form.description,
                store:            form.store,
                warehouse:        form.warehouse,
                sellingType:      form.sellingType,
                category:         form.category,
                subCategory:      form.subCategory,
                brand:            form.brand,
                unit:             form.unit,
                barcodeSymbology: form.barcodeSymbology,
                itemBarcode:      form.itemBarcode,
                quantity:         parseInt(form.quantity) || 0,
                price:            parseFloat(form.price) || 0,
                productType:      form.productType,
                taxType:          form.taxType,
                tax:              form.tax,
                discountType:     form.discountType,
                discountValue:    form.discountValue ? parseFloat(form.discountValue) : null,
                quantityAlert:    form.quantityAlert ? parseInt(form.quantityAlert) : null,
                warranty:         form.showWarranties ? form.warranty : null,
                manufacturer:     form.showManufacturer ? form.manufacturer : null,
                manufacturedDate: form.showManufacturer && form.manufacturedDate ? form.manufacturedDate : null,
                expiryDate:       form.showExpiry && form.expiryDate ? form.expiryDate : null,
                images:           images.map(img => img.url).join(','),
            };

            await axios.put(`${API_BASE}/${id}`, payload);
            showToast('success', `✓ Product "${form.name}" updated successfully!`);
            setTimeout(() => navigate('/products'), 1800);
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Failed to update product.';
            showToast('error', msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="cp-container container-fluid px-0 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <Loader size={48} className="spin text-orange mb-3" />
                    <p className="text-muted">Loading product details...</p>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="cp-container container-fluid px-0">
            {/* Toast notification */}
            {toast && (
                <div className={`cp-toast cp-toast-${toast.type}`}>
                    {toast.type === 'success'
                        ? <CheckCircle size={18} />
                        : <AlertCircle size={18} />
                    }
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="cp-header">
                <div className="cp-title">
                    <h4>Edit Product</h4>
                    <p>Modify product details and update the database</p>
                </div>
                <div className="cp-actions">
                    <button className="btn-icon-action" title="Reload product" onClick={handleReset}>
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

            <form onSubmit={handleSubmit} noValidate>

                {/* Product Information Card */}
                <div className="cp-card">
                    <div className="cp-card-header">
                        <div className="cp-card-title"><Info size={18} /> Product Information</div>
                        <ChevronDown size={18} className="text-muted" />
                    </div>
                    <div className="cp-card-body">
                        <div className="row">
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Store</label>
                                <select name="store" className="cp-input text-muted" value={form.store} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Freshmart</option>
                                    <option>Main Store</option>
                                    <option>Warehouse A</option>
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Warehouse</label>
                                <select name="warehouse" className="cp-input text-muted" value={form.warehouse} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Warehouse A</option>
                                    <option>Warehouse B</option>
                                    <option>Cold Storage</option>
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Product Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className="cp-input"
                                    placeholder="e.g. iPhone 15 Pro"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Slug <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="slug"
                                    className="cp-input"
                                    placeholder="auto-generated from name"
                                    value={form.slug}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">SKU <span className="required">*</span></label>
                                <div className="cp-input-group">
                                    <input
                                        type="text"
                                        name="sku"
                                        className="cp-input"
                                        placeholder="SKU-XXXXXXXX"
                                        value={form.sku}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="btn-generate"
                                        onClick={handleGenerateSku}
                                        disabled={generatingSku}
                                    >
                                        {generatingSku ? <Loader size={14} className="spin" /> : <><Wand2 size={12} /> Generate</>}
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Selling Type <span className="required">*</span></label>
                                <select name="sellingType" className="cp-input text-muted" value={form.sellingType} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Retail</option>
                                    <option>Wholesale</option>
                                    <option>Both</option>
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">
                                    <span>Category <span className="required">*</span></span>
                                    <div className="add-new"><PlusCircle size={14} /> Add New</div>
                                </label>
                                <select name="category" className="cp-input text-muted" value={form.category} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Electronics</option>
                                    <option>Clothing</option>
                                    <option>Food & Beverages</option>
                                    <option>Health & Beauty</option>
                                    <option>Sports</option>
                                    <option>Home & Garden</option>
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Sub Category</label>
                                <select name="subCategory" className="cp-input text-muted" value={form.subCategory} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Smartphones</option>
                                    <option>Laptops</option>
                                    <option>Tablets</option>
                                    <option>Accessories</option>
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Brand</label>
                                <select name="brand" className="cp-input text-muted" value={form.brand} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Apple</option>
                                    <option>Samsung</option>
                                    <option>Nike</option>
                                    <option>Adidas</option>
                                    <option>Generic</option>
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Unit</label>
                                <select name="unit" className="cp-input text-muted" value={form.unit} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Piece</option>
                                    <option>Kg</option>
                                    <option>Litre</option>
                                    <option>Box</option>
                                    <option>Pack</option>
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Barcode Symbology</label>
                                <select name="barcodeSymbology" className="cp-input text-muted" value={form.barcodeSymbology} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>EAN-13</option>
                                    <option>UPC-A</option>
                                    <option>QR Code</option>
                                    <option>Code 128</option>
                                    <option>Code 39</option>
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Item Barcode</label>
                                <div className="cp-input-group">
                                    <input
                                        type="text"
                                        name="itemBarcode"
                                        className="cp-input"
                                        placeholder="e.g. 1234567890123"
                                        value={form.itemBarcode}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="btn-generate"
                                        onClick={handleGenerateBarcode}
                                        disabled={generatingBarcode}
                                    >
                                        {generatingBarcode ? <Loader size={14} className="spin" /> : <><Wand2 size={12} /> Generate</>}
                                    </button>
                                </div>
                            </div>
                            <div className="col-12 cp-form-group mb-1">
                                <label className="cp-label">Description</label>
                                <div className="rt-editor">
                                    <div className="rt-toolbar">
                                        <div><span>Normal</span></div>
                                        <div><ChevronDown size={14} /></div>
                                        <div><Bold size={14} className="text-dark" /></div>
                                        <div><Italic size={14} className="text-dark" /></div>
                                        <div><Underline size={14} className="text-dark" /></div>
                                        <div><LinkIcon size={14} className="text-dark" /></div>
                                        <div><AlignLeft size={14} /></div>
                                        <div><List size={14} /></div>
                                        <div><Target size={14} /></div>
                                    </div>
                                    <textarea
                                        name="description"
                                        className="rt-textarea"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Enter product description..."
                                    />
                                </div>
                                <div className="desc-hint">Maximum 50 Words</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing & Stocks Card */}
                <div className="cp-card">
                    <div className="cp-card-header">
                        <div className="cp-card-title"><DollarSign size={18} /> Pricing &amp; Stocks</div>
                        <ChevronDown size={18} className="text-muted" />
                    </div>
                    <div className="cp-card-body">
                        <div className="row">
                            <div className="col-12 cp-form-group">
                                <label className="cp-label">Product Type <span className="required">*</span></label>
                                <div className="cp-radio-group">
                                    <label className="cp-radio">
                                        <input
                                            type="radio"
                                            name="productType"
                                            value="Single Product"
                                            checked={form.productType === 'Single Product'}
                                            onChange={handleChange}
                                        />
                                        Single Product
                                    </label>
                                    <label className="cp-radio">
                                        <input
                                            type="radio"
                                            name="productType"
                                            value="Variable Product"
                                            checked={form.productType === 'Variable Product'}
                                            onChange={handleChange}
                                        />
                                        Variable Product
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Quantity <span className="required">*</span></label>
                                <input
                                    type="number"
                                    name="quantity"
                                    className="cp-input"
                                    placeholder="0"
                                    min="0"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Price <span className="required">*</span></label>
                                <input
                                    type="number"
                                    name="price"
                                    className="cp-input"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Tax Type</label>
                                <select name="taxType" className="cp-input text-muted" value={form.taxType} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Exclusive</option>
                                    <option>Inclusive</option>
                                </select>
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Tax</label>
                                <select name="tax" className="cp-input text-muted" value={form.tax} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>5%</option>
                                    <option>12%</option>
                                    <option>18%</option>
                                    <option>28%</option>
                                </select>
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Discount Type</label>
                                <select name="discountType" className="cp-input text-muted" value={form.discountType} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Percentage</option>
                                    <option>Fixed Amount</option>
                                </select>
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Discount Value</label>
                                <input
                                    type="number"
                                    name="discountValue"
                                    className="cp-input"
                                    placeholder="0"
                                    min="0"
                                    value={form.discountValue}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4 cp-form-group mb-1">
                                <label className="cp-label">Quantity Alert</label>
                                <input
                                    type="number"
                                    name="quantityAlert"
                                    className="cp-input"
                                    placeholder="Alert when stock falls below"
                                    min="0"
                                    value={form.quantityAlert}
                                    onChange={handleChange}
                                />
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
                            <label className="add-image-box" style={{ cursor: 'pointer' }}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                                <Plus size={20} className="text-muted" />
                                <span>Add Images</span>
                            </label>
                            {images.map((img, idx) => (
                                <div className="preview-image-box" key={idx}>
                                    <img src={img.url} alt={img.name} />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => removeImage(idx)}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
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
                                <input
                                    type="checkbox"
                                    name="showWarranties"
                                    checked={form.showWarranties}
                                    onChange={handleChange}
                                /> Warranties
                            </label>
                            <label className="cp-checkbox">
                                <input
                                    type="checkbox"
                                    name="showManufacturer"
                                    checked={form.showManufacturer}
                                    onChange={handleChange}
                                /> Manufacturer
                            </label>
                            <label className="cp-checkbox">
                                <input
                                    type="checkbox"
                                    name="showExpiry"
                                    checked={form.showExpiry}
                                    onChange={handleChange}
                                /> Expiry
                            </label>
                        </div>

                        <div className="row">
                            {form.showWarranties && (
                                <div className="col-md-6 cp-form-group">
                                    <label className="cp-label">Warranty</label>
                                    <select name="warranty" className="cp-input text-muted" value={form.warranty} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option>No Warranty</option>
                                        <option>3 Months</option>
                                        <option>6 Months</option>
                                        <option>1 Year</option>
                                        <option>2 Years</option>
                                    </select>
                                </div>
                            )}
                            {form.showManufacturer && (
                                <>
                                    <div className="col-md-6 cp-form-group">
                                        <label className="cp-label">Manufacturer</label>
                                        <input
                                            type="text"
                                            name="manufacturer"
                                            className="cp-input"
                                            placeholder="Manufacturer name"
                                            value={form.manufacturer}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 cp-form-group mb-1">
                                        <label className="cp-label">Manufactured Date</label>
                                        <input
                                            type="date"
                                            name="manufacturedDate"
                                            className="cp-input"
                                            value={form.manufacturedDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}
                            {form.showExpiry && (
                                <div className="col-md-6 cp-form-group mb-1">
                                    <label className="cp-label">Expiry On</label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        className="cp-input"
                                        value={form.expiryDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="cp-footer">
                    <button
                        type="button"
                        className="btn-dark-blue px-4"
                        onClick={() => navigate('/products')}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-orange px-4"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Loader size={16} className="spin" /> Updating...
                            </span>
                        ) : 'Update Product'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditProduct;
