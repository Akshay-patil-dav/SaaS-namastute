import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../inventory/Brands/inventory-pages-custom.css';

import { 
    FileText, 
    FileSpreadsheet, 
    RefreshCw, 
    ChevronUp,
    Search,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Eye,
    Plus,
    Upload,
    MoreVertical
} from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import ViewPurchaseModal from '../../../components/modals/purchases/ViewPurchaseModal/ViewPurchaseModal';
import DeleteConfirmModal from '../../../components/modals/common/DeleteConfirmModal/DeleteConfirmModal';
import ImportPurchaseModal from '../../../components/modals/purchases/ImportPurchaseModal/ImportPurchaseModal';
import { useConfirm } from '../../../context/ConfirmContext';

const mockPurchasesData = [
    { id: 1, supplier: 'Electro Mart', reference: 'PT001', date: '24 Dec 2024', status: 'Received', total: 1000, paid: 1000, due: 0, paymentStatus: 'Paid' },
    { id: 2, supplier: 'Quantum Gadgets', reference: 'PT002', date: '10 Dec 2024', status: 'Pending', total: 1500, paid: 0, due: 1500, paymentStatus: 'Unpaid' },
    { id: 3, supplier: 'Prime Bazaar', reference: 'PT003', date: '27 Nov 2024', status: 'Received', total: 1500, paid: 1800, due: 0, paymentStatus: 'Paid' },
    { id: 4, supplier: 'Gadget World', reference: 'PT004', date: '18 Nov 2024', status: 'Ordered', total: 2000, paid: 1000, due: 1000, paymentStatus: 'Overdue' },
    { id: 5, supplier: 'Volt Vault', reference: 'PT005', date: '06 Nov 2024', status: 'Received', total: 800, paid: 800, due: 0, paymentStatus: 'Paid' },
    { id: 6, supplier: 'Elite Retail', reference: 'PT006', date: '25 Oct 2024', status: 'Pending', total: 750, paid: 0, due: 750, paymentStatus: 'Unpaid' },
    { id: 7, supplier: 'Prime Mart', reference: 'PT007', date: '14 Oct 2024', status: 'Received', total: 1300, paid: 1300, due: 0, paymentStatus: 'Paid' },
    { id: 8, supplier: 'NeoTech Store', reference: 'PT008', date: '03 Oct 2024', status: 'Received', total: 1100, paid: 1100, due: 0, paymentStatus: 'Paid' },
    { id: 9, supplier: 'Urban Mart', reference: 'PT009', date: '20 Sep 2024', status: 'Ordered', total: 2300, paid: 2300, due: 0, paymentStatus: 'Paid' },
    { id: 10, supplier: 'Travel Mart', reference: 'PT010', date: '10 Sep 2024', status: 'Pending', total: 1700, paid: 1700, due: 0, paymentStatus: 'Paid' },
];

const Purchases = () => {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const { confirm } = useConfirm();
    
    // Modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    
    // Delete state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Import state
    const [importModalOpen, setImportModalOpen] = useState(false);

    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(`${ENV.API_BASE_URL}/purchases`);
            // Format dates
            const formatted = res.data.map(p => ({
                ...p,
                date: p.formattedDate || new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            }));
            setPurchases(formatted);
        } catch (error) {
            console.error('Error fetching purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await apiClient.delete(`${ENV.API_BASE_URL}/purchases/${itemToDelete}`);
            setDeleteModalOpen(false);
            setItemToDelete(null);
            fetchPurchases();
        } catch (error) {
            console.error('Error deleting purchase:', error);
            // Optionally add a toast error here
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Purchases',
            message: `Are you sure you want to delete ${selectedIds.length} purchases?`
        });
        if (!isConfirmed) return;
        
        try {
            await apiClient.post(`${ENV.API_BASE_URL}/purchases/delete-bulk`, { ids: selectedIds });
            setSelectedIds([]);
            fetchPurchases();
        } catch (err) {
            console.error('Failed to delete purchases:', err);
            alert('Failed to delete purchases.');
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
    const [selectedIds, setSelectedIds] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Filtering logic
    const filteredData = purchases.filter(item => {
        if (item.status === 'Return' || item.status === 'Returned') return false;
        const matchesSearch = 
            item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.reference.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = paymentStatusFilter === 'All' || item.paymentStatus === paymentStatusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const pagedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedIds(pagedData.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id, isChecked) => {
        if (isChecked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Received': return 'badge-received';
            case 'Pending': return 'badge-pending';
            case 'Ordered': return 'badge-ordered';
            default: return 'ss-status-badge';
        }
    };

    const getPaymentBadgeClass = (status) => {
        switch (status) {
            case 'Paid': return 'badge-payment-paid';
            case 'Unpaid': return 'badge-payment-unpaid';
            case 'Overdue': return 'badge-payment-overdue';
            default: return 'ss-status-badge';
        }
    };

    const handleRefresh = () => {
        fetchPurchases();
    };

    return (
        <div className="product-page-container">
            <style>{`
                .badge-received { background: #28c76f; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
                .badge-pending { background: #00cfe8; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
                .badge-ordered { background: #ff9f43; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
                
                .badge-payment-paid { background: #28c76f15; color: #28c76f; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
                .badge-payment-unpaid { background: #ea545515; color: #ea5455; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
                .badge-payment-overdue { background: #ff9f4315; color: #ff9f43; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
                
                .dot { width: 4px; height: 4px; border-radius: 50%; display: inline-block; }
                .badge-payment-paid .dot { background: #28c76f; }
                .badge-payment-unpaid .dot { background: #ea5455; }
                .badge-payment-overdue .dot { background: #ff9f43; }
                
                .ss-action-btn { background: #f8f9fa; border: 1px solid #ebf1f5; color: #6e6e6e; }
                .ss-action-btn:hover { background: #fff; color: #1b2850; border-color: #1b2850; }
            `}</style>
            {/* Header Section */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Purchase</h2>
                    <p className="ss-page-subtitle">Manage your purchases</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="PDF">
                        <FileText size={16} />
                    </button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel">
                        <FileSpreadsheet size={16} />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={handleRefresh}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    </button>
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button className="ss-btn-icon-square" title="Collapse">
                        <ChevronUp size={16} />
                    </button>
                    <button className="ss-btn-orange" onClick={() => navigate('/add-purchase')}>
                        <Plus size={16} /> Add Purchase
                    </button>
                    <button className="ss-btn-orange" style={{ background: '#1b2850', borderColor: '#1b2850' }} onClick={() => setImportModalOpen(true)}>
                        <Upload size={16} /> Import Purchase
                    </button>
                </div>
            </div>

            {/* View Modal */}
            <ViewPurchaseModal 
                isOpen={viewModalOpen} 
                purchase={selectedPurchase} 
                onClose={() => setViewModalOpen(false)} 
            />

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => { setDeleteModalOpen(false); setItemToDelete(null); }}
                onConfirm={handleDeleteConfirm}
                title="Delete Purchase"
                message="Are you sure you want to delete this purchase? This action cannot be undone."
                isDeleting={isDeleting}
            />

            {/* Import Modal */}
            <ImportPurchaseModal 
                isOpen={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onSuccess={fetchPurchases}
            />

            {/* Main Panel */}
            <div className="ss-main-panel">
                {/* Controls */}
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={18} />
                        <input 
                            type="text" 
                            className="ss-search-input"
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="ss-filters-wrap">
                        <select 
                            className="ss-filter-select"
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        >
                            <option value="All">Payment Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="ss-table-wrapper">
                    <table className="ss-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input 
                                        type="checkbox" 
                                        className="ss-checkbox" 
                                        checked={pagedData.length > 0 && selectedIds.length === pagedData.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th>Supplier Name</th>
                                <th>Reference</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Due</th>
                                <th>Payment Status</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skel-${i}`} className="skeleton-row">
                                        <td colSpan="10"><div className="skel skel-lg" /></td>
                                    </tr>
                                ))
                            ) : pagedData.length > 0 ? (
                                pagedData.map((item) => (
                                    <tr key={item.id} className={selectedIds.includes(item.id) ? 'row-selected' : ''}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                className="ss-checkbox" 
                                                checked={selectedIds.includes(item.id)}
                                                onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                            />
                                        </td>
                                        <td className="ss-item-name">{item.supplier}</td>
                                        <td>{item.reference}</td>
                                        <td>{item.date}</td>
                                        <td>
                                            <span className={getStatusBadgeClass(item.status)}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: '600' }}>${item.total}</td>
                                        <td style={{ fontWeight: '600' }}>${item.paid}</td>
                                        <td style={{ fontWeight: '600' }}>${item.due}</td>
                                        <td>
                                            <span className={getPaymentBadgeClass(item.paymentStatus)}>
                                                <span className="dot"></span>
                                                {item.paymentStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                <button className="ss-action-btn view" title="View" onClick={() => { setSelectedPurchase(item); setViewModalOpen(true); }}>
                                                    <Eye size={15} />
                                                </button>
                                                <button className="ss-action-btn edit" title="Edit" onClick={() => navigate(`/edit-purchase/${item.id}`)}>
                                                    <Pencil size={15} />
                                                </button>
                                                <button className="ss-action-btn delete" title="Delete" onClick={() => { setItemToDelete(item.id); setDeleteModalOpen(true); }}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                                        <p style={{ color: '#94a3b8' }}>No purchase records found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="ss-pagination-row">
                    <div className="ss-page-size">
                        Row Per Page&nbsp;
                        <select 
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select> 
                        &nbsp;Entries
                    </div>
                    <div className="ss-page-controls">
                        <button className="ss-page-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button 
                                key={p} 
                                className={`ss-page-btn ${p === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(p)}
                            >
                                {p}
                            </button>
                        ))}
                        <button className="ss-page-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Purchases;
