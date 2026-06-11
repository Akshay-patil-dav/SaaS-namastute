import React, { useState, useEffect, useRef } from 'react';
import AddCategoryModal from '../../../components/modals/inventory/AddCategoryModal/AddCategoryModal';
import './CreateProduct.css';
import { Link, useNavigate } from 'react-router-dom';
import apiClient, { API, ENV } from '@/api/config';
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
    Wand2,
    Layers,
    Trash2,
    Upload
} from 'lucide-react';

const API_BASE = `${ENV.API_BASE_URL}/products`;

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
    purchasePrice: '',
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

const CreateProduct = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [images, setImages] = useState([]);           // { url: string, name: string }[]
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
    const [generatingSku, setGeneratingSku] = useState(false);
    const [generatingBarcode, setGeneratingBarcode] = useState(false);

    // ── Variant Types state ────────────────────────────────────────────────────
    // variantTypes: [{ typeName: '', values: [{ value:'', price:'', sku:'', barcode:'', image:null }] }]
    const [variantTypes, setVariantTypes] = useState([]);
    const [vtUploading, setVtUploading] = useState({}); // key: `${typeIdx}-${valIdx}`
    const vtFileRefs = useRef({});
    // default variant: `typeIdx-valIdx` string, e.g. '0-1'
    const [defaultVariant, setDefaultVariant] = useState('0-0');
    
    // Dynamic categories
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [units, setUnits] = useState([]);
    const [warranties, setWarranties] = useState([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Fetch categories, sub-categories, brands and units on mount
    const fetchInitialData = async () => {
        try {
            const results = await Promise.allSettled([
                apiClient.get(`${ENV.API_BASE_URL}/categories`),
                apiClient.get(`${ENV.API_BASE_URL}/subcategories`),
                apiClient.get(`${ENV.API_BASE_URL}/brands`),
                apiClient.get(`${ENV.API_BASE_URL}/units`),
                apiClient.get(`${ENV.API_BASE_URL}/warranties`)
            ]);
            
            setCategories(results[0].status === 'fulfilled' ? (results[0].value.data || []) : []);
            setSubCategories(results[1].status === 'fulfilled' ? (results[1].value.data || []) : []);
            setBrands(results[2].status === 'fulfilled' ? (results[2].value.data || []) : []);
            setUnits(results[3].status === 'fulfilled' ? (results[3].value.data || []) : []);
            setWarranties(results[4].status === 'fulfilled' ? (results[4].value.data || []) : []);
        } catch (err) {
            console.error('Failed to fetch initial data', err);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setForm(prev => {
            const newState = { ...prev, [name]: type === 'checkbox' ? checked : value };
            
            // If Category changes, reset Sub Category to avoid invalid combos
            if (name === 'category') {
                newState.subCategory = '';
            }
            
            return newState;
        });

        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setForm(prev => ({ ...prev, name: value, slug }));
        }
    };

    // ── Generate SKU from backend ─────────────────────────────────────────────
    const handleGenerateSku = async () => {
        setGeneratingSku(true);
        try {
            const res = await apiClient.get(`${API_BASE}/generate-sku`);
            setForm(prev => ({ ...prev, sku: res.data.sku }));
        } catch {
            // fallback local
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
            const res = await apiClient.get(`${API_BASE}/generate-barcode`);
            setForm(prev => ({ ...prev, itemBarcode: res.data.barcode }));
        } catch {
            const local = String(Math.floor(Math.random() * 9e12) + 1e12);
            setForm(prev => ({ ...prev, itemBarcode: local }));
        } finally {
            setGeneratingBarcode(false);
        }
    };

    // ── Image upload — POST to /api/upload and store server file path ────────
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingImages(true);
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await apiClient.post(
                    `${ENV.API_BASE_URL}/upload`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                // Backend returns { url: '/uploads/uuid.ext' }
                return {
                    url: `${ENV.API_BASE_URL.replace('/api', '')}${res.data.url}`,
                    name: file.name,
                };
            });
            const uploaded = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...uploaded]);
        } catch (err) {
            showToast('error', 'Image upload failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setUploadingImages(false);
            // Reset input so same file can be re-selected if needed
            e.target.value = '';
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // ── Variant Type helpers ────────────────────────────────────────────────────
    const addVariantType = () => {
        setVariantTypes(prev => [
            ...prev,
            { typeName: '', values: [{ value: '', purchasePrice: '', price: '', sku: '', barcode: '', image: null, quantity: '' }] }
        ]);
    };

    const removeVariantType = (tIdx) => {
        setVariantTypes(prev => prev.filter((_, i) => i !== tIdx));
    };

    const updateVariantTypeName = (tIdx, name) => {
        setVariantTypes(prev => prev.map((t, i) => i === tIdx ? { ...t, typeName: name } : t));
    };

    const addVariantValue = (tIdx) => {
        setVariantTypes(prev => prev.map((t, i) => i === tIdx
            ? { ...t, values: [...t.values, { value: '', purchasePrice: '', price: '', sku: '', barcode: '', image: null, quantity: '' }] }
            : t
        ));
    };

    const removeVariantValue = (tIdx, vIdx) => {
        setVariantTypes(prev => prev.map((t, i) => i === tIdx
            ? { ...t, values: t.values.filter((_, vi) => vi !== vIdx) }
            : t
        ));
    };

    const updateVariantValue = (tIdx, vIdx, field, val) => {
        setVariantTypes(prev => prev.map((t, i) => i === tIdx
            ? { ...t, values: t.values.map((v, vi) => vi === vIdx ? { ...v, [field]: val } : v) }
            : t
        ));
    };

    const handleVtImageUpload = async (tIdx, vIdx, file) => {
        if (!file) return;
        const key = `${tIdx}-${vIdx}`;
        setVtUploading(prev => ({ ...prev, [key]: true }));
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await apiClient.post(
                `${ENV.API_BASE_URL}/upload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            const url = `${ENV.API_BASE_URL.replace('/api', '')}${res.data.url}`;
            updateVariantValue(tIdx, vIdx, 'image', url);
        } catch (err) {
            showToast('error', 'Image upload failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setVtUploading(prev => ({ ...prev, [key]: false }));
            const ref = vtFileRefs.current[`${tIdx}-${vIdx}`];
            if (ref) ref.value = '';
        }
    };

    const generateVtSku = async (tIdx, vIdx) => {
        try {
            const res = await apiClient.get(`${API_BASE}/generate-sku`);
            updateVariantValue(tIdx, vIdx, 'sku', res.data.sku);
        } catch {
            updateVariantValue(tIdx, vIdx, 'sku', 'SKU-' + Math.random().toString(36).substring(2, 10).toUpperCase());
        }
    };

    const generateVtBarcode = async (tIdx, vIdx) => {
        try {
            const res = await apiClient.get(`${API_BASE}/generate-barcode`);
            updateVariantValue(tIdx, vIdx, 'barcode', res.data.barcode);
        } catch {
            updateVariantValue(tIdx, vIdx, 'barcode', String(Math.floor(Math.random() * 9e12) + 1e12));
        }
    };

    // ── Reset ─────────────────────────────────────────────────────────────────
    const handleReset = () => {
        setForm(initialForm);
        setImages([]);
        setVariantTypes([]);
        setDefaultVariant('0-0');
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            showToast('error', 'Product name is required.');
            return;
        }
        if (form.productType !== 'Variable Product' && !form.price) {
            showToast('error', 'Price is required.');
            return;
        }

        if (uploadingImages) {
            showToast('error', 'Please wait for images to finish uploading.');
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
                quantity:         form.productType === 'Variable Product'
                                    ? variantTypes.reduce((sum, t) => sum + t.values.reduce((vSum, v) => vSum + (parseInt(v.quantity) || 0), 0), 0)
                                    : (parseInt(form.quantity) || 0),
                purchasePrice:    parseFloat(form.purchasePrice) || 0,
                price:            form.productType === 'Variable Product' 
                                    ? variantTypes.reduce((acc, t, tIdx) => {
                                        t.values.forEach((v, vIdx) => {
                                            if (defaultVariant === `${tIdx}-${vIdx}`) acc = parseFloat(v.price) || 0;
                                        });
                                        return acc;
                                      }, 0)
                                    : (parseFloat(form.price) || 0),
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
                variants:         variantTypes.map((t, tIdx) => ({
                    typeName: t.typeName,
                    values: t.values.map((v, vIdx) => ({
                        value:   v.value,
                        purchasePrice: parseFloat(v.purchasePrice) || 0,
                        price:   parseFloat(v.price) || 0,
                        sku:     v.sku,
                        barcode: v.barcode,
                        image:   v.image || '',
                        quantity: parseInt(v.quantity) || 0,
                        isDefault: defaultVariant === `${tIdx}-${vIdx}`,
                    }))
                })),
            };

            await apiClient.post(API_BASE, payload);
            showToast('success', `✓ Product "${form.name}" saved to database!`);
            setTimeout(() => navigate('/products'), 1800);
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Failed to save product.';
            showToast('error', msg);
        } finally {
            setSubmitting(false);
        }
    };

    const totalVariantQuantity = variantTypes.reduce((sum, t) => sum + t.values.reduce((vSum, v) => vSum + (parseInt(v.quantity) || 0), 0), 0);

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
                    <h4>Create Product</h4>
                    <p>Fill in product details and save to the database</p>
                </div>
                <div className="cp-actions">
                    <button className="btn-icon-action" title="Reset form" onClick={handleReset}>
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
                            {form.productType !== 'Variable Product' && (
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
                            )}
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
                                    <div className="add-new" onClick={() => setIsCategoryModalOpen(true)} style={{cursor: 'pointer'}}>
                                        <PlusCircle size={14} /> Add New
                                    </div>
                                </label>
                                <select name="category" className="cp-input text-muted" value={form.category} onChange={handleChange}>
                                    <option value="">Select</option>
                                    {categories.filter(c => c.status).map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Sub Category</label>
                                <select 
                                    name="subCategory" 
                                    className="cp-input text-muted" 
                                    value={form.subCategory} 
                                    onChange={handleChange}
                                    disabled={!form.category}
                                >
                                    <option value="">{form.category ? "Select Sub Category" : "Select Category First"}</option>
                                    {subCategories
                                        .filter(sub => sub.status && sub.category?.name === form.category)
                                        .map(sub => (
                                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Brand</label>
                                <select name="brand" className="cp-input text-muted" value={form.brand} onChange={handleChange}>
                                    <option value="">Select</option>
                                    {brands.filter(b => b.status !== false).map(b => (
                                        <option key={b.id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Unit</label>
                                <select name="unit" className="cp-input text-muted" value={form.unit} onChange={handleChange}>
                                    <option value="">Select</option>
                                    {units.filter(u => u.status !== false).map(u => (
                                        <option key={u.id} value={u.name}>{u.name}</option>
                                    ))}
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
                            {form.productType !== 'Variable Product' && (
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
                            )}
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

                            {form.productType !== 'Variable Product' && (
                            <>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Purchase Price</label>
                                <input
                                    type="number"
                                    name="purchasePrice"
                                    className="cp-input"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    value={form.purchasePrice}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Selling Price <span className="required">*</span></label>
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
                            </>
                            )}
                            <div className="col-md-4 cp-form-group mb-1">
                                <label className="cp-label">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    className={`cp-input ${form.productType === 'Variable Product' ? 'bg-light' : ''}`}
                                    placeholder="0"
                                    min="0"
                                    value={form.productType === 'Variable Product' ? totalVariantQuantity : form.quantity}
                                    onChange={handleChange}
                                    readOnly={form.productType === 'Variable Product'}
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
                            {form.productType === 'Variable Product' && (
                                <div className="col-12">
                                    <div className="vp-info-note">
                                        <span className="vp-info-icon">ℹ</span>
                                        Price, Tax, Discount &amp; SKU/Barcode are set individually per variant below.
                                    </div>
                                </div>
                            )}
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
                            <label className="add-image-box" style={{ cursor: uploadingImages ? 'not-allowed' : 'pointer', opacity: uploadingImages ? 0.6 : 1 }}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                    disabled={uploadingImages}
                                />
                                {uploadingImages
                                    ? <><Loader size={20} className="spin text-muted" /><span>Uploading...</span></>
                                    : <><Plus size={20} className="text-muted" /><span>Add Images</span></>
                                }
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

                {/* Variants Card — only for Variable Product */}
                {form.productType === 'Variable Product' && (
                    <div className="cp-card">
                        <div className="cp-card-header">
                            <div className="cp-card-title"><Layers size={18} /> Variant Types</div>
                            <button type="button" className="btn-add-variant" onClick={addVariantType}>
                                <Plus size={14} /> Add Variant Type
                            </button>
                        </div>
                        <div className="cp-card-body">
                            {variantTypes.length === 0 ? (
                                <div className="variants-empty">
                                    <Layers size={40} className="variants-empty-icon" />
                                    <p>No variant types added yet.</p>
                                    <span>e.g. Add "Color" then add Red, Blue, Green as values — each with its own price, image &amp; SKU.</span>
                                </div>
                            ) : (// variant list
                                <div className="vt-list">
                                    {variantTypes.map((vt, tIdx) => (
                                        <div className="vt-block" key={tIdx}>
                                            {/* Type header */}
                                            <div className="vt-block-header">
                                                <div className="vt-type-label-wrap">
                                                    <span className="vt-type-index">{tIdx + 1}</span>
                                                    <input
                                                        type="text"
                                                        className="cp-input vt-type-input"
                                                        placeholder="Variant type name — e.g. Color, Size, Storage"
                                                        value={vt.typeName}
                                                        onChange={e => updateVariantTypeName(tIdx, e.target.value)}
                                                    />
                                                </div>
                                                <div className="vt-block-actions">
                                                    <button
                                                        type="button"
                                                        className="btn-add-vt-value"
                                                        onClick={() => addVariantValue(tIdx)}
                                                    >
                                                        <Plus size={13} /> Add Value
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="variant-remove-btn"
                                                        onClick={() => removeVariantType(tIdx)}
                                                        title="Remove type"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Values table header */}
                                            {vt.values.length > 0 && (
                                                <div className="vt-values-wrap">
                                                    <div className="vt-values-header">
                                                        <span style={{width:36}} title="Set as default variant">Default</span>
                                                        <span style={{width:72}}>Image</span>
                                                        <span style={{flex:2}}>Value <span className="required">*</span></span>
                                                        <span style={{flex:1.5}}>Purchase Price</span>
                                                        <span style={{flex:1.5}}>Selling Price</span>
                                                        <span style={{width:70}}>Qty</span>
                                                        <span style={{flex:2}}>SKU</span>
                                                        <span style={{flex:2}}>Barcode</span>
                                                        <span style={{width:32}}></span>
                                                    </div>

                                                    {vt.values.map((val, vIdx) => {
                                                        const uploadKey = `${tIdx}-${vIdx}`;
                                                        return (
                                                            <div className={`vt-value-row ${defaultVariant === `${tIdx}-${vIdx}` ? 'vt-value-row--default' : ''}`} key={vIdx}>
                                                                {/* Default variant radio */}
                                                                <div className="vt-cell vt-default-cell" style={{width:36, flexShrink:0}} title="Set as default variant to display first">
                                                                    <label className="vt-default-radio">
                                                                        <input
                                                                            type="radio"
                                                                            name="defaultVariant"
                                                                            checked={defaultVariant === `${tIdx}-${vIdx}`}
                                                                            onChange={() => setDefaultVariant(`${tIdx}-${vIdx}`)}
                                                                        />
                                                                    </label>
                                                                </div>
                                                                {/* Image upload */}
                                                                <div className="vt-img-cell">
                                                                    <div
                                                                        className="vt-img-box"
                                                                        onClick={() => vtFileRefs.current[uploadKey]?.click()}
                                                                        title="Click to upload image"
                                                                    >
                                                                        {vtUploading[uploadKey] ? (
                                                                            <Loader size={18} className="spin text-muted" />
                                                                        ) : val.image ? (
                                                                            <>
                                                                                <img src={val.image} alt={val.value} />
                                                                                <button
                                                                                    type="button"
                                                                                    className="vt-img-remove"
                                                                                    onClick={e => { e.stopPropagation(); updateVariantValue(tIdx, vIdx, 'image', null); }}
                                                                                >
                                                                                    <X size={10} />
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Upload size={14} />
                                                                                <span>Photo</span>
                                                                            </>
                                                                        )}
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            style={{ display: 'none' }}
                                                                            ref={el => vtFileRefs.current[uploadKey] = el}
                                                                            onChange={e => handleVtImageUpload(tIdx, vIdx, e.target.files[0])}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Value name */}
                                                                <div className="vt-cell" style={{flex:2}}>
                                                                    <input
                                                                        type="text"
                                                                        className="cp-input"
                                                                        placeholder={`e.g. ${tIdx === 0 ? 'Red' : tIdx === 1 ? 'XL' : 'Option'}`}
                                                                        value={val.value}
                                                                        onChange={e => updateVariantValue(tIdx, vIdx, 'value', e.target.value)}
                                                                    />
                                                                </div>

                                                                {/* Purchase Price */}
                                                                <div className="vt-cell" style={{flex:1.5}}>
                                                                    <input
                                                                        type="number"
                                                                        className="cp-input"
                                                                        placeholder="0.00"
                                                                        min="0" step="0.01"
                                                                        value={val.purchasePrice}
                                                                        onChange={e => updateVariantValue(tIdx, vIdx, 'purchasePrice', e.target.value)}
                                                                        title="Purchase Price"
                                                                    />
                                                                </div>

                                                                {/* Selling Price */}
                                                                <div className="vt-cell" style={{flex:1.5}}>
                                                                    <input
                                                                        type="number"
                                                                        className="cp-input"
                                                                        placeholder="0.00"
                                                                        min="0" step="0.01"
                                                                        value={val.price}
                                                                        onChange={e => updateVariantValue(tIdx, vIdx, 'price', e.target.value)}
                                                                        title="Selling Price"
                                                                    />
                                                                </div>

                                                                {/* Quantity */}
                                                                <div className="vt-cell" style={{width:70}}>
                                                                    <input
                                                                        type="number"
                                                                        className="cp-input"
                                                                        placeholder="0"
                                                                        min="0"
                                                                        value={val.quantity}
                                                                        onChange={e => updateVariantValue(tIdx, vIdx, 'quantity', e.target.value)}
                                                                        style={{paddingLeft: '8px', paddingRight: '8px'}}
                                                                    />
                                                                </div>

                                                                {/* SKU */}
                                                                <div className="vt-cell" style={{flex:2}}>
                                                                    <div className="cp-input-group">
                                                                        <input
                                                                            type="text"
                                                                            className="cp-input"
                                                                            placeholder="SKU-XXXX"
                                                                            value={val.sku}
                                                                            onChange={e => updateVariantValue(tIdx, vIdx, 'sku', e.target.value)}
                                                                        />
                                                                        <button type="button" className="btn-generate" onClick={() => generateVtSku(tIdx, vIdx)} title="Generate">
                                                                            <Wand2 size={11} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Barcode */}
                                                                <div className="vt-cell" style={{flex:2}}>
                                                                    <div className="cp-input-group">
                                                                        <input
                                                                            type="text"
                                                                            className="cp-input"
                                                                            placeholder="1234567890"
                                                                            value={val.barcode}
                                                                            onChange={e => updateVariantValue(tIdx, vIdx, 'barcode', e.target.value)}
                                                                        />
                                                                        <button type="button" className="btn-generate" onClick={() => generateVtBarcode(tIdx, vIdx)} title="Generate">
                                                                            <Wand2 size={11} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Remove value */}
                                                                <div className="vt-cell" style={{width:32, flexShrink:0}}>
                                                                    <button
                                                                        type="button"
                                                                        className="vt-remove-val-btn"
                                                                        onClick={() => removeVariantValue(tIdx, vIdx)}
                                                                        title="Remove value"
                                                                        disabled={vt.values.length === 1}
                                                                    >
                                                                        <X size={13} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
                                        <option value="">Select Warranty</option>
                                        <option value="No Warranty">No Warranty</option>
                                        {warranties.filter(w => w.status).map(w => (
                                            <option key={w.id} value={w.name}>{w.name} ({w.duration})</option>
                                        ))}
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
                                <Loader size={16} className="spin" /> Saving...
                            </span>
                        ) : 'Add Product'}
                    </button>
                </div>

            </form>
            
            <AddCategoryModal 
                isOpen={isCategoryModalOpen} 
                onClose={() => setIsCategoryModalOpen(false)} 
                onCategoryAdded={() => {
                    fetchInitialData();
                }}
            />
        </div>
    );
};

export default CreateProduct;
