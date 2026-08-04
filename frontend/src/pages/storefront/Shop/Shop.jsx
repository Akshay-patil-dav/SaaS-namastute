import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Filter, Loader } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import { useCartStore } from '../../../store/cartStore';
import './Shop.css';
import { useCurrency } from '../../../hooks/useCurrency';


const Shop = () => {
    const { currencySymbol } = useCurrency();

    const addToCart = useCartStore(state => state.addToCart);
    const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');
    const [sortBy, setSortBy] = useState('featured');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch real products
        const fetchProducts = async () => {
            try {
                const res = await apiClient.get(`${ENV.API_BASE_URL}/products`);
                if (res.data && Array.isArray(res.data)) {
                    setProducts(res.data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };

        // Load custom web app categories from localStorage
        const storedCats = localStorage.getItem('webapp_categories');
        let parsedCats = [];
        if (storedCats) {
            try {
                parsedCats = JSON.parse(storedCats);
            } catch (e) {
                console.error("Error parsing categories", e);
            }
        }
        setCategories(parsedCats);

        fetchProducts();
    }, []);

    // Filter and Sort logic
    // Show only "present products" (quantity > 0)
    let displayedProducts = products.filter(p => p.quantity > 0);
    
    // Filter by selected category
    if (selectedCategoryId !== 'ALL') {
        const cat = categories.find(c => c.id === selectedCategoryId);
        if (cat) {
            displayedProducts = displayedProducts.filter(p => cat.products?.includes(p.id));
        }
    }
    
    if (sortBy === 'price-low') {
        displayedProducts = [...displayedProducts].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        displayedProducts = [...displayedProducts].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
        displayedProducts = [...displayedProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    return (
        <div className="storefront-shop">
            <div className="shop-header">
                <div className="shop-header-content">
                    <h1>Shop Premium Tech</h1>
                    <p>Discover our full collection of high-end electronics and accessories.</p>
                </div>
                <div className="shop-header-glow"></div>
            </div>

            <div className="shop-container">
                {/* Sidebar Filters */}
                <aside className="shop-sidebar">
                    <div className="filter-group">
                        <h3><Filter size={18} /> Categories</h3>
                        <ul className="category-list">
                            <li>
                                <button 
                                    className={`category-btn ${selectedCategoryId === 'ALL' ? 'active' : ''}`}
                                    onClick={() => setSelectedCategoryId('ALL')}
                                >
                                    All Products
                                </button>
                            </li>
                            {categories.map(category => (
                                <li key={category.id}>
                                    <button 
                                        className={`category-btn ${selectedCategoryId === category.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCategoryId(category.id)}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Shop Content */}
                <div className="shop-main">
                    <div className="shop-toolbar">
                        <span className="results-count">
                            Showing {displayedProducts.length} results
                        </span>
                        <div className="sort-control">
                            <label htmlFor="sort">Sort by:</label>
                            <select 
                                id="sort" 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="shop-loading-state">
                            <Loader size={48} className="spin-icon" />
                            <p>Loading premium products...</p>
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <div className="no-products glass-panel">
                            <h2>No products found</h2>
                            <p>Try selecting a different category.</p>
                            <button onClick={() => setSelectedCategoryId('ALL')} className="btn-primary">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="shop-product-grid">
                            {displayedProducts.map((product) => {
                                // Some products use an images array/json string
                                let imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
                                if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                                    imageUrl = product.images[0].url;
                                } else if (typeof product.images === 'string') {
                                    imageUrl = product.images.split(',')[0];
                                }

                                const isLowStock = product.quantity > 0 && product.quantity <= 5;
                                return (
                                <Link to={`/shop/product/${product.id}`} className="shop-product-card" key={product.id}>
                                    <div className="shop-product-image-container">
                                        <img src={imageUrl} alt={product.name} className="shop-product-image" />
                                        <div className="product-overlay-gradient"></div>
                                        <div className="product-status-badges">
                                            {isLowStock ? (
                                                <span className="status-badge low-stock">Only {product.quantity} left</span>
                                            ) : (
                                                <span className="status-badge in-stock">In Stock</span>
                                            )}
                                        </div>
                                        <button 
                                            className="shop-add-to-cart"
                                            onClick={(e) => handleAddToCart(e, product)}
                                            aria-label="Add to cart"
                                        >
                                            <ShoppingBag size={20} />
                                        </button>
                                    </div>
                                    <div className="shop-product-info">
                                        <span className="shop-product-category">{product.category || 'General'}</span>
                                        <h3 className="shop-product-name">{product.name}</h3>
                                        <div className="shop-product-meta">
                                            <div className="shop-product-rating">
                                                <Star size={14} className="star-icon filled" />
                                                <span>{product.rating || 5.0}</span>
                                                <span className="review-count">({product.reviews || 0})</span>
                                            </div>
                                            <span className="shop-product-price">{currencySymbol}{(product.price || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
