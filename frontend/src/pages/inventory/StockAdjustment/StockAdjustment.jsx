import React, { useState } from 'react';
import { useConfirm } from '../../../context/ConfirmContext';
import { 
    Search, 
    FileText, 
    Download, 
    RotateCcw, 
    ChevronUp, 
    Plus, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    FileSearch
} from 'lucide-react';
import './stock-adjustment.css';
import '../Brands/inventory-pages-custom.css';

const _initialAdjustmentData = [
    { id: 1, warehouse: 'Lavish Warehouse', store: 'Electro Mart', product: 'Lenovo IdeaPad 3', date: '24 Dec 2024', person: 'James Kirwin', qty: 100, productImg: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    { id: 2, warehouse: 'Quaint Warehouse', store: 'Quantum Gadgets', product: 'Beats Pro', date: '10 Dec 2024', person: 'Francis Chang', qty: 140, productImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Francis' },
    { id: 3, warehouse: 'Overflow Warehouse', store: 'Prime Bazaar', product: 'Nike Jordan', date: '25 Jul 2023', person: 'Antonio Engle', qty: 120, productImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Antonio' },
    { id: 4, warehouse: 'Quaint Warehouse', store: 'Gadget World', product: 'Apple Series 5 Watch', date: '28 Jul 2023', person: 'Leo Kelly', qty: 130, productImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' },
    { id: 5, warehouse: 'Traditional Warehouse', store: 'Volt Vault', product: 'Amazon Echo Dot', date: '24 Jul 2023', person: 'Annette Walker', qty: 140, productImg: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annette' },
    { id: 6, warehouse: 'Cool Warehouse', store: 'Elite Retail', product: 'Lobar Handy', date: '15 Jul 2023', person: 'John Weaver', qty: 150, productImg: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 7, warehouse: 'Retail Supply Hub', store: 'Prime Mart', product: 'Red Premium Satchel', date: '14 Oct 2024', person: 'Gary Hennessy', qty: 700, productImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gary' },
    { id: 8, warehouse: 'EdgeWare Solutions', store: 'NeoTech Store', product: 'Iphone 14 Pro', date: '03 Oct 2024', person: 'Eleanor Panek', qty: 630, productImg: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor' },
    { id: 9, warehouse: 'North Zone Warehouse', store: 'Urban Mart', product: 'Gaming Chair', date: '20 Sep 2024', person: 'William Levy', qty: 410, productImg: 'https://images.unsplash.com/photo-1598550874175-4d0fe4a2c906?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William' },
    { id: 10, warehouse: 'Fulfillment Hub', store: 'Travel Mart', product: 'Borealis Backpack', date: '10 Sep 2024', person: 'Charlotte Klotz', qty: 550, productImg: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop', personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte' },
];

import apiClient, { ENV } from '@/api/config';
import AddAdjustmentModal from '../../../components/modals/inventory/AddAdjustmentModal/AddAdjustmentModal';
import ViewAdjustmentModal from '../../../components/modals/inventory/ViewAdjustmentModal/ViewAdjustmentModal';
import DeleteConfirmModal from '../../../components/modals/common/DeleteConfirmModal/DeleteConfirmModal';

export default function StockAdjustment() {
    const { confirm } = useConfirm();
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAdjustment, setSelectedAdjustment] = useState(null);

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${ENV.API_BASE_URL}/stocks`);
            setData(response.data.map(item => ({
                id: item.id,
                warehouse: item.warehouse || '',
                store: item.store || '',
                product: item.productName || 'Unknown',
                date: item.date || item.createdAt?.substring(0, 10) || '',
                person: item.responsiblePerson || '',
                qty: item.quantity || 0,
                productImg: item.productImg || 'https://via.placeholder.com/40',
                personImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + item.responsiblePerson,
                // store original object to use mapped standard names for View
                original: item
            })));
        } catch (error) {
            console.error('Error fetching stocks:', error);
            alert('Failed to load adjustments.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchStocks();
    }, []);

    const toggleRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedRows(prev => 
            prev.length === data.length ? [] : data.map(d => d.id)
        );
    };

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Adjustments',
            message: `Are you sure you want to delete ${selectedRows.length} stock adjustment entries? This will revert their quantities.`
        });
        if (!isConfirmed) return;
        
        try {
            await apiClient.post(`${ENV.API_BASE_URL}/stocks/delete-bulk`, { ids: selectedRows });
            setSelectedRows([]);
            fetchStocks();
        } catch (err) {
            console.error('Failed to delete adjustments:', err);
            alert('Failed to delete adjustments.');
        }
    };

    const filteredData = data.filter(item => 
        item.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.person.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenAddModal = () => {
        setSelectedAdjustment(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setSelectedAdjustment(item);
        setIsModalOpen(true);
    };

    const handleOpenViewModal = (item) => {
        setSelectedAdjustment(item);
        setIsViewModalOpen(true);
    };

    const handleModalSuccess = async (saveData) => {
        try {
            if (selectedAdjustment) {
                // Edit existing
                const product = saveData.products[0];
                const payload = {
                    warehouse: saveData.warehouse,
                    store: saveData.store,
                    responsiblePerson: saveData.person,
                    quantity: saveData.products.reduce((acc, p) => acc + (p.quantity || 0), 0),
                    productId: product?.productId,
                    productName: product?.name,
                    productSku: product?.sku,
                    productCategory: product?.category,
                    productImg: product?.img
                };
                await apiClient.put(`${ENV.API_BASE_URL}/stocks/${selectedAdjustment.id}`, payload);
            } else {
                // Add new
                const payload = {
                    warehouse: saveData.warehouse,
                    store: saveData.store,
                    responsiblePerson: saveData.person,
                    products: saveData.products.map(p => ({
                        productId: p.productId,
                        quantity: p.quantity,
                        productName: p.name,
                        productImg: p.img
                    }))
                };
                await apiClient.post(`${ENV.API_BASE_URL}/stocks`, payload);
            }
            fetchStocks();
        } catch (error) {
            console.error('Error saving stock adjustment:', error);
            alert('Failed to save adjustment.');
        }
    };

    const handleDeleteClick = (item) => {
        setSelectedAdjustment(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedAdjustment) return;
        try {
            await apiClient.delete(`${ENV.API_BASE_URL}/stocks/${selectedAdjustment.id}`);
            fetchStocks();
            setIsDeleteModalOpen(false);
            setSelectedAdjustment(null);
        } catch (error) {
            console.error('Error deleting stock:', error);
            alert('Failed to delete adjustment.');
        }
    };

    return (
        <div className="stock-adjustment-container">
            {/* Page Header */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Stock Adjustment</h2>
                    <p className="ss-page-subtitle">Manage your stock adjustment</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="Export PDF"><FileText size={16} /></button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Export Excel"><Download size={16} /></button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchStocks}><RotateCcw size={16} /></button>
                    {selectedRows.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedRows.length})
                        </button>
                    )}
                    <button className="ss-btn-orange" onClick={handleOpenAddModal}>
                        <Plus size={16} />
                        Add Adjustment
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="ss-main-panel">
                {/* Filters */}
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={16} />
                        <input 
                            type="text" 
                            className="ss-search-input" 
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="ss-filters-wrap">
                        <select className="ss-filter-select">
                            <option>Warehouse</option>
                            <option>Lavish Warehouse</option>
                            <option>Quaint Warehouse</option>
                        </select>
                        <select className="ss-filter-select">
                            <option>Sort By : Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Month</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="ss-table-wrapper">
                    <table className="ss-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col" style={{ width: '40px' }}>
                                    <input 
                                        type="checkbox" 
                                        className="ss-checkbox"
                                        checked={selectedRows.length === data.length && data.length > 0}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>Warehouse</th>
                                <th>Store</th>
                                <th>Product</th>
                                <th>Date</th>
                                <th>Person</th>
                                <th>Qty</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#5b6670' }}>
                                        Loading Data...
                                    </td>
                                </tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className={selectedRows.includes(item.id) ? 'row-selected' : ''}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                className="ss-checkbox"
                                                checked={selectedRows.includes(item.id)}
                                                onChange={() => toggleRow(item.id)}
                                            />
                                        </td>
                                        <td className="ss-item-name">{item.warehouse}</td>
                                        <td>{item.store}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="ss-table-img-wrapper">
                                                    <img src={item.productImg} alt={item.product} className="ss-table-img" />
                                                </div>
                                                <span className="ss-item-name">{item.product}</span>
                                            </div>
                                        </td>
                                        <td>{item.date}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <img src={item.personImg} alt={item.person} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                                                <span>{item.person}</span>
                                            </div>
                                        </td>
                                        <td>{item.qty}</td>
                                        <td>
                                            <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                <button className="ss-action-btn view" onClick={() => handleOpenViewModal(item)}><FileSearch size={14} /></button>
                                                <button className="ss-action-btn edit" onClick={() => handleOpenEditModal(item)}><Edit size={14} /></button>
                                                <button className="ss-action-btn delete" onClick={() => handleDeleteClick(item)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#5b6670' }}>
                                        No matching records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="ss-pagination-row">
                    <div className="ss-page-size">
                        <span>Row Per Page</span>
                        <select>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span>Entries</span>
                    </div>
                    <div className="ss-page-controls">
                        <button className="ss-page-btn" disabled><ChevronLeft size={16} /></button>
                        <button className="ss-page-btn active">1</button>
                        <button className="ss-page-btn" disabled><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="manage-stock-footer">
                <div className="footer-copyright">
                    2014 - 2026 © DreamsPOS. All Right Reserved
                </div>
                <div className="footer-designer">
                    Designed & Developed by <span>Dreams</span>
                </div>
            </footer>
            <AddAdjustmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                initialData={selectedAdjustment}
            />
            <ViewAdjustmentModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                adjustment={selectedAdjustment}
            />
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Adjustment"
                message="Are you sure you want to delete this adjustment entry? This action implies reverting the related quantities."
            />
        </div>
    );
}
