import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft, CornerDownRight, Info, ChevronDown, List } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import '../../inventory/CreateProduct/CreateProduct.css';

const API_BASE = `${ENV.API_BASE_URL}/menus`;

export default function CreateMenu() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [menuName, setMenuName] = useState('');
    const [items, setItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (isEditMode) {
            fetchMenuDetails();
        } else {
            // Default 1 empty item
            setItems([{ id: Date.now().toString(), name: '', url: '', submenus: [] }]);
        }
    }, [id]);

    const fetchMenuDetails = async () => {
        try {
            const res = await apiClient.get(`${API_BASE}/${id}`);
            if (res.data) {
                setMenuName(res.data.name);
                if (res.data.items && Array.isArray(res.data.items)) {
                    setItems(res.data.items);
                } else {
                    setItems([]);
                }
            }
        } catch (err) {
            console.error('Failed to fetch menu:', err);
            showToast('error', 'Failed to load menu data.');
        }
    };

    const handleAddItem = () => {
        setItems([
            ...items, 
            { id: Date.now().toString(), name: '', url: '', submenus: [] }
        ]);
    };

    const handleRemoveItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const handleItemChange = (itemId, field, value) => {
        setItems(items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
        ));
    };

    const handleAddSubmenu = (itemId) => {
        setItems(items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    submenus: [
                        ...(item.submenus || []),
                        { id: Date.now().toString() + Math.random(), name: '', url: '' }
                    ]
                };
            }
            return item;
        }));
    };

    const handleRemoveSubmenu = (itemId, submenuId) => {
        setItems(items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    submenus: item.submenus.filter(sub => sub.id !== submenuId)
                };
            }
            return item;
        }));
    };

    const handleSubmenuChange = (itemId, submenuId, field, value) => {
        setItems(items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    submenus: item.submenus.map(sub => 
                        sub.id === submenuId ? { ...sub, [field]: value } : sub
                    )
                };
            }
            return item;
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!menuName.trim()) {
            showToast('error', 'Please enter a Menu Name');
            return;
        }

        const payload = {
            name: menuName,
            itemsJson: JSON.stringify(items)
        };

        try {
            setSubmitting(true);
            if (isEditMode) {
                await apiClient.put(`${API_BASE}/${id}`, payload);
                showToast('success', 'Menu updated successfully!');
            } else {
                await apiClient.post(API_BASE, payload);
                showToast('success', 'Menu created successfully!');
            }
            setTimeout(() => navigate('/dashboard/menus'), 1500);
        } catch (err) {
            console.error('Failed to save menu:', err);
            showToast('error', 'Failed to save menu. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cp-container container-fluid px-0">
            <div className="cp-header">
                <div className="cp-title">
                    <h4>{isEditMode ? 'Edit Menu' : 'Create Menu'}</h4>
                    <p>Build your navigation structure</p>
                </div>
                <div className="cp-actions">
                    <Link to="/dashboard/menus" className="btn-dark-blue text-decoration-none">
                        <ArrowLeft size={18} /> Back to Menus
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSave} noValidate>
                <div className="cp-card">
                    <div className="cp-card-header">
                        <div className="cp-card-title"><Info size={18} /> Menu Information</div>
                        <ChevronDown size={18} className="text-muted" />
                    </div>
                    <div className="cp-card-body">
                        <div className="row">
                            <div className="col-md-6 cp-form-group">
                                <label className="cp-label">Menu Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    className="cp-input" 
                                    placeholder="e.g. Main Header Navigation" 
                                    value={menuName}
                                    onChange={(e) => setMenuName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cp-card">
                    <div className="cp-card-header">
                        <div className="cp-card-title"><List size={18} /> Menu Items</div>
                        <button type="button" className="btn-add-variant" onClick={handleAddItem}>
                            <Plus size={14} /> Add Item
                        </button>
                    </div>
                    <div className="cp-card-body">
                        {items.length === 0 ? (
                            <div className="variants-empty">
                                <List size={40} className="variants-empty-icon" />
                                <p>No items added yet.</p>
                                <span>Click "Add Item" to start building your menu.</span>
                            </div>
                        ) : (
                            <div className="vt-list">
                                {items.map((item, index) => (
                                    <div className="vt-block" key={item.id}>
                                        <div className="vt-block-header">
                                            <div className="vt-type-label-wrap">
                                                <span className="vt-type-index">{index + 1}</span>
                                                <input 
                                                    type="text" 
                                                    className="cp-input vt-type-input" 
                                                    placeholder="Item Name (e.g. Home)"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                                    style={{ minWidth: '200px' }}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="cp-input vt-type-input" 
                                                    placeholder="Item URL (e.g. /home)"
                                                    value={item.url}
                                                    onChange={(e) => handleItemChange(item.id, 'url', e.target.value)}
                                                    style={{ minWidth: '200px', marginLeft: '10px' }}
                                                />
                                            </div>
                                            <div className="vt-block-actions">
                                                <button type="button" className="btn-add-vt-value" onClick={() => handleAddSubmenu(item.id)}>
                                                    <Plus size={13} /> Add Submenu
                                                </button>
                                                <button type="button" className="variant-remove-btn" title="Remove Item" onClick={() => handleRemoveItem(item.id)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {item.submenus.length > 0 && (
                                            <div className="vt-values-wrap">
                                                <div className="vt-values-header">
                                                    <span style={{flex: 1}}>Submenu Name <span className="required">*</span></span>
                                                    <span style={{flex: 1}}>URL / Path <span className="required">*</span></span>
                                                    <span style={{width: 32}}></span>
                                                </div>

                                                {item.submenus.map((sub) => (
                                                    <div className="vt-value-row" key={sub.id}>
                                                        <div className="vt-cell" style={{flex: 1}}>
                                                            <input 
                                                                type="text" 
                                                                className="cp-input" 
                                                                placeholder="Submenu Name"
                                                                value={sub.name}
                                                                onChange={(e) => handleSubmenuChange(item.id, sub.id, 'name', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="vt-cell" style={{flex: 1}}>
                                                            <input 
                                                                type="text" 
                                                                className="cp-input" 
                                                                placeholder="Submenu URL"
                                                                value={sub.url}
                                                                onChange={(e) => handleSubmenuChange(item.id, sub.id, 'url', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="vt-cell vt-actions-cell" style={{width: 32}}>
                                                            <button type="button" className="vt-val-remove-btn" title="Remove Submenu" onClick={() => handleRemoveSubmenu(item.id, sub.id)}>
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="cp-form-footer">
                    <button 
                        type="button" 
                        className="btn-light-secondary px-4" 
                        onClick={() => navigate('/dashboard/menus')}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn-orange px-4"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : 'Save Menu'}
                    </button>
                </div>
            </form>

            {/* Toast notification */}
            {toast && (
                <div className={`cp-toast cp-toast-${toast.type}`}>
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}
