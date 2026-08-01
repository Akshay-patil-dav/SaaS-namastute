import React, { useState, useEffect } from 'react';
import './WebAppCategories.css';
import { 
    PlusCircle, 
    Search, 
    Pencil, 
    Trash2, 
    LayoutGrid, 
    CheckCircle, 
    AlertCircle, 
    X,
    Package
} from 'lucide-react';
import { useConfirm } from '../../../context/ConfirmContext';
import apiClient, { API, ENV } from '@/api/config';

export default function WebAppCategories() {
    const [categories, setCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    
    // Form state for new category
    const [catName, setCatName] = useState('');
    const [catSlug, setCatSlug] = useState('');
    
    // State for managing products in a category
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    
    const { confirm } = useConfirm();
    const [toast, setToast] = useState(null);

    // Load categories from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('webapp_categories');
        if (stored) {
            try {
                setCategories(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing stored categories", e);
            }
        }
    }, []);

    // Save categories to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('webapp_categories', JSON.stringify(categories));
    }, [categories]);

    // Fetch all products when component mounts (or when product modal opens)
    useEffect(() => {
        const fetchProducts = async () => {
            setProductsLoading(true);
            try {
                const res = await apiClient.get(`${ENV.API_BASE_URL}/products`);
                if (res.data && Array.isArray(res.data)) {
                    setAllProducts(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setProductsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddCategory = () => {
        if (!catName.trim()) {
            showToast('error', 'Category name is required.');
            return;
        }
        
        const newCat = {
            id: Date.now().toString(),
            name: catName,
            slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            products: [],
            createdAt: new Date().toISOString()
        };
        
        setCategories([...categories, newCat]);
        setCatName('');
        setCatSlug('');
        setIsAddModalOpen(false);
        showToast('success', 'Category added successfully!');
    };

    const handleDeleteCategory = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Category',
            message: 'Are you sure you want to delete this category? This will not delete the actual products, just the category mapping.'
        });
        
        if (isConfirmed) {
            setCategories(categories.filter(c => c.id !== id));
            showToast('success', 'Category deleted.');
        }
    };

    const openManageProducts = (cat) => {
        setSelectedCategory(cat);
        setIsProductModalOpen(true);
    };

    const toggleProductInCategory = (productId) => {
        if (!selectedCategory) return;
        
        const updatedCat = { ...selectedCategory };
        if (updatedCat.products.includes(productId)) {
            updatedCat.products = updatedCat.products.filter(id => id !== productId);
        } else {
            updatedCat.products.push(productId);
        }
        
        setSelectedCategory(updatedCat);
        setCategories(categories.map(c => c.id === updatedCat.id ? updatedCat : c));
    };

    // Filter products for the modal
    const filteredProducts = allProducts.filter(p => 
        (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) || 
        (p.sku || '').toLowerCase().includes(productSearch.toLowerCase())
    );

    return (
        <div className="wa-categories-page">
            {toast && (
                <div className={`prod-toast prod-toast-${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="toast-close"><X size={14} /></button>
                </div>
            )}

            <div className="wa-header-row">
                <div>
                    <h1 className="wa-page-title">Storefront Categories</h1>
                    <p className="wa-page-subtitle">Manage dynamic categories and their products for your web app menus</p>
                </div>
                
                <div className="wa-header-actions">
                    <button className="wa-btn-primary" onClick={() => setIsAddModalOpen(true)}>
                        <PlusCircle size={18} /> Add Category
                    </button>
                </div>
            </div>

            <div className="wa-categories-grid">
                {categories.length > 0 ? (
                    categories.map(cat => (
                        <div key={cat.id} className="wa-cat-card">
                            <div className="wa-cat-card-header">
                                <div className="wa-cat-title-wrap">
                                    <div className="wa-cat-icon"><LayoutGrid size={20} /></div>
                                    <div>
                                        <h3 className="wa-cat-title">{cat.name}</h3>
                                        <span className="wa-cat-slug">/{cat.slug}</span>
                                    </div>
                                </div>
                                <button className="wa-cat-delete-btn" onClick={() => handleDeleteCategory(cat.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="wa-cat-card-body">
                                <div className="wa-cat-stat">
                                    <Package size={16} />
                                    <span>{cat.products?.length || 0} Products Attached</span>
                                </div>
                            </div>
                            <div className="wa-cat-card-footer">
                                <button className="wa-btn-outline" onClick={() => openManageProducts(cat)}>
                                    Manage Products
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="wa-empty-state">
                        <LayoutGrid size={48} strokeWidth={1} style={{ opacity: 0.3, marginBottom: '16px' }} />
                        <h3>No Categories Found</h3>
                        <p>Create a category to group products for your storefront menus.</p>
                        <button className="wa-btn-primary" onClick={() => setIsAddModalOpen(true)}>
                            <PlusCircle size={18} /> Create First Category
                        </button>
                    </div>
                )}
            </div>

            {/* ADD CATEGORY MODAL */}
            {isAddModalOpen && (
                <div className="wa-modal-overlay">
                    <div className="wa-modal-content">
                        <div className="wa-modal-header">
                            <h2>Add New Category</h2>
                            <button className="wa-modal-close" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="wa-modal-body">
                            <div className="wa-form-group">
                                <label>Category Name</label>
                                <input 
                                    type="text" 
                                    className="wa-form-input" 
                                    placeholder="e.g. Featured Deals" 
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                />
                            </div>
                            <div className="wa-form-group">
                                <label>Category Slug (Optional)</label>
                                <input 
                                    type="text" 
                                    className="wa-form-input" 
                                    placeholder="e.g. featured-deals" 
                                    value={catSlug}
                                    onChange={(e) => setCatSlug(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="wa-modal-footer">
                            <button className="wa-btn-ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                            <button className="wa-btn-primary" onClick={handleAddCategory}>Save Category</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MANAGE PRODUCTS MODAL */}
            {isProductModalOpen && selectedCategory && (
                <div className="wa-modal-overlay wa-modal-large">
                    <div className="wa-modal-content">
                        <div className="wa-modal-header">
                            <h2>Manage Products: {selectedCategory.name}</h2>
                            <button className="wa-modal-close" onClick={() => setIsProductModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="wa-modal-body">
                            <div className="wa-search-bar">
                                <Search size={18} className="wa-search-icon" />
                                <input 
                                    type="text" 
                                    className="wa-form-input" 
                                    placeholder="Search products by name or SKU..." 
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                />
                            </div>
                            
                            <div className="wa-products-list">
                                {productsLoading ? (
                                    <div className="wa-loading-state">Loading products...</div>
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map(p => {
                                        const isSelected = selectedCategory.products.includes(p.id);
                                        return (
                                            <div key={p.id} className={`wa-product-item ${isSelected ? 'selected' : ''}`} onClick={() => toggleProductInCategory(p.id)}>
                                                <div className="wa-product-item-img">
                                                    {p.images && p.images.length > 0 ? (
                                                        <img src={p.images[0].url} alt={p.name} />
                                                    ) : (
                                                        <Package size={24} />
                                                    )}
                                                </div>
                                                <div className="wa-product-item-info">
                                                    <h4>{p.name}</h4>
                                                    <p>SKU: {p.sku || 'N/A'} | ₹{p.price}</p>
                                                </div>
                                                <div className="wa-product-item-action">
                                                    {isSelected ? (
                                                        <CheckCircle size={24} className="icon-green" />
                                                    ) : (
                                                        <div className="wa-circle-empty"></div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="wa-empty-state-small">
                                        No products found matching your search.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="wa-modal-footer">
                            <button className="wa-btn-primary" onClick={() => setIsProductModalOpen(false)}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
