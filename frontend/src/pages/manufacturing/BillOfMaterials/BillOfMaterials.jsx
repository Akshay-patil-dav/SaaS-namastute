import React, { useState, useEffect } from 'react';
import './BillOfMaterials.css';
import apiClient, { ENV } from '@/api/config';
import {
    PlusCircle,
    Search,
    Pencil,
    Trash2,
    Layers,
    Package,
    CheckCircle,
    AlertCircle,
    X,
    Plus,
    MinusCircle
} from 'lucide-react';
import { useConfirm } from '../../../context/ConfirmContext';

const BillOfMaterials = () => {
    const confirm = useConfirm();
    const [boms, setBoms] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBom, setEditingBom] = useState(null);
    const [formData, setFormData] = useState({
        productId: '',
        name: '',
        items: [{ ingredientId: '', quantityRequired: 1 }]
    });

    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bomsRes, prodRes] = await Promise.all([
                apiClient.get(`${ENV.API_BASE_URL}/manufacturing/bom`),
                apiClient.get(`${ENV.API_BASE_URL}/products`)
            ]);
            setBoms(bomsRes.data || []);
            setProducts(prodRes.data || []);
        } catch (err) {
            console.error('Failed to load BOM data', err);
            showToast('Failed to load manufacturing data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingBom(null);
        setFormData({
            productId: '',
            name: '',
            items: [{ ingredientId: '', quantityRequired: 1 }]
        });
        setIsModalOpen(true);
    };

    const openEditModal = (bom) => {
        setEditingBom(bom);
        setFormData({
            productId: bom.product?.id || '',
            name: bom.name || '',
            items: (bom.items || []).map(item => ({
                ingredientId: item.ingredient?.id || '',
                quantityRequired: item.quantityRequired || 1
            }))
        });
        setIsModalOpen(true);
    };

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { ingredientId: '', quantityRequired: 1 }]
        }));
    };

    const handleRemoveItem = (index) => {
        if (formData.items.length === 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index, field, value) => {
        setFormData(prev => {
            const updated = [...prev.items];
            updated[index][field] = value;
            return { ...prev, items: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productId || !formData.name.trim()) {
            showToast('Please select a target product and provide a recipe name', 'error');
            return;
        }

        const validItems = formData.items.filter(i => i.ingredientId && i.quantityRequired > 0);
        if (validItems.length === 0) {
            showToast('Please add at least one valid raw material ingredient', 'error');
            return;
        }

        const payload = {
            productId: Number(formData.productId),
            name: formData.name.trim(),
            items: validItems.map(i => ({
                ingredientId: Number(i.ingredientId),
                quantityRequired: Number(i.quantityRequired)
            }))
        };

        try {
            if (editingBom) {
                await apiClient.put(`${ENV.API_BASE_URL}/manufacturing/bom/${editingBom.id}`, payload);
                showToast('Bill of Materials updated successfully!');
            } else {
                await apiClient.post(`${ENV.API_BASE_URL}/manufacturing/bom`, payload);
                showToast('Bill of Materials created successfully!');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            showToast(err.response?.data || 'Failed to save BOM recipe', 'error');
        }
    };

    const handleDelete = async (bom) => {
        const ok = await confirm({
            title: 'Delete BOM Recipe?',
            message: `Are you sure you want to delete "${bom.name}"? This action cannot be undone.`,
            confirmText: 'Delete Recipe',
            cancelText: 'Cancel'
        });
        if (!ok) return;

        try {
            await apiClient.delete(`${ENV.API_BASE_URL}/manufacturing/bom/${bom.id}`);
            showToast('BOM Recipe deleted successfully');
            fetchData();
        } catch (err) {
            showToast('Failed to delete BOM recipe', 'error');
        }
    };

    const filteredBoms = boms.filter(bom =>
        bom.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bom.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const rawMaterials = products.filter(p => p.itemType === 'RAW_MATERIAL' || !p.itemType || p.itemType === 'STANDARD_ITEM');

    return (
        <div className="bom-page container-fluid p-4">
            {toast && (
                <div className={`bom-toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h4 className="mfg-page-title d-flex align-items-center gap-2">
                        <Layers style={{ color: '#ff9b29' }} /> Bill of Materials (BOM Recipes)
                    </h4>
                    <p className="mfg-page-subtitle">Define raw material recipes and quantities required to manufacture finished goods.</p>
                </div>
                <button className="btn-mfg-orange" onClick={openCreateModal}>
                    <PlusCircle size={18} /> Create BOM Recipe
                </button>
            </div>

            {/* KPI Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="mfg-stat-card">
                        <div className="mfg-stat-icon orange">
                            <Layers size={24} />
                        </div>
                        <div>
                            <span className="text-muted small fw-medium">Total BOM Recipes</span>
                            <h3 className="mb-0 fw-bold text-dark">{boms.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="mfg-stat-card">
                        <div className="mfg-stat-icon green">
                            <Package size={24} />
                        </div>
                        <div>
                            <span className="text-muted small fw-medium">Products with Recipe</span>
                            <h3 className="mb-0 fw-bold text-dark">{new Set(boms.map(b => b.product?.id)).size}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="mfg-stat-card">
                        <div className="mfg-stat-icon blue">
                            <Search size={24} />
                        </div>
                        <div>
                            <span className="text-muted small fw-medium">Available Catalog Items</span>
                            <h3 className="mb-0 fw-bold text-dark">{products.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm p-3 mb-4 bg-white rounded-3">
                <div className="row g-2">
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                                <Search size={16} className="text-muted" />
                            </span>
                            <input
                                type="text"
                                className="form-control bg-light border-0"
                                placeholder="Search by recipe name or product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mfg-table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Recipe Name</th>
                                <th>Finished Product</th>
                                <th>Ingredients Required</th>
                                <th>Created Date</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        Loading BOM Recipes...
                                    </td>
                                </tr>
                            ) : filteredBoms.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No Bill of Materials recipes found. Click <strong>Create BOM Recipe</strong> to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredBoms.map(bom => (
                                    <tr key={bom.id}>
                                        <td className="fw-semibold text-dark">{bom.name}</td>
                                        <td>
                                            <span className="badge px-3 py-2 rounded-pill fs-7" style={{ backgroundColor: 'rgba(255, 155, 41, 0.12)', color: '#e68a22', fontWeight: '600' }}>
                                                {bom.product?.name || 'N/A'} (SKU: {bom.product?.sku || '---'})
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                {(bom.items || []).map((item, idx) => (
                                                    <span key={idx} className="badge bg-light text-dark border px-2 py-1">
                                                        {item.ingredient?.name}: <strong>{item.quantityRequired} {item.ingredient?.unit || 'units'}</strong>
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="small text-muted">
                                            {bom.createdAt ? new Date(bom.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-light me-2 text-dark" onClick={() => openEditModal(bom)} title="Edit Recipe">
                                                <Pencil size={15} />
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(bom)} title="Delete Recipe">
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="modal-backdrop-custom">
                    <div className="modal-content-custom card shadow-lg border-0 p-4" style={{ maxWidth: '650px', width: '100%' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0 text-dark">{editingBom ? 'Edit BOM Recipe' : 'Create New BOM Recipe'}</h5>
                            <button className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">BOM Recipe Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Standard Cabinet Recipe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold small">Finished Product to Manufacture</label>
                                <select
                                    className="form-select"
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Target Finished Good --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} ({p.sku || 'No SKU'}) {p.itemType ? `[${p.itemType}]` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
                                Raw Material Ingredients Required per Unit
                                <button type="button" className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 fw-semibold text-dark border-warning" onClick={handleAddItem}>
                                    <Plus size={14} /> Add Raw Material
                                </button>
                            </h6>

                            <div className="ingredients-list mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {formData.items.map((item, index) => (
                                    <div key={index} className="row g-2 align-items-center mb-2 bg-light p-2 rounded border">
                                        <div className="col-md-7">
                                            <select
                                                className="form-select form-select-sm"
                                                value={item.ingredientId}
                                                onChange={(e) => handleItemChange(index, 'ingredientId', e.target.value)}
                                                required
                                            >
                                                <option value="">-- Select Raw Material Ingredient --</option>
                                                {rawMaterials.map(rm => (
                                                    <option key={rm.id} value={rm.id}>
                                                        {rm.name} (In stock: {rm.quantity} {rm.unit || ''})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                className="form-control form-control-sm"
                                                placeholder="Qty Required"
                                                value={item.quantityRequired}
                                                onChange={(e) => handleItemChange(index, 'quantityRequired', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-1 text-end">
                                            <button
                                                type="button"
                                                className="btn btn-sm text-danger p-0 border-0"
                                                onClick={() => handleRemoveItem(index)}
                                                disabled={formData.items.length === 1}
                                            >
                                                <MinusCircle size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-light" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-mfg-orange border-0 px-4">
                                    {editingBom ? 'Update Recipe' : 'Save BOM Recipe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillOfMaterials;
