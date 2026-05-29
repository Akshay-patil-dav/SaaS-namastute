import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useConfirm } from '../../context/ConfirmContext';
import { 
    Search, 
    FileText, 
    Download, 
    RotateCcw, 
    ChevronUp, 
    ChevronDown,
    Plus, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Upload,
    Eye,
    Package,
    AlertCircle
} from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import './stock-transfer.css';
import './inventory-pages-custom.css';
import AddTransferModal from '../../components/modals/inventory/AddTransferModal';
import ImportTransferModal from '../../components/modals/inventory/ImportTransferModal';
import EditTransferModal from '../../components/modals/inventory/EditTransferModal';
import DeleteConfirmModal from '../../components/modals/common/DeleteConfirmModal';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const StockTransfer = () => {
    const { confirm } = useConfirm();
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');
    const [sortDays, setSortDays] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [transferToDelete, setTransferToDelete] = useState(null);
    
    // Edit/View state
    const [editModalData, setEditModalData] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const API_BASE = `${ENV.API_BASE_URL}/transfers`;

    const fetchTransfers = useCallback(async () => {
        setIsRefreshing(true);
        if (loading) setLoading(true);
        try {
            const response = await apiClient.get(API_BASE);
            setTransfers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching transfers:', error);
        } finally {
            setIsRefreshing(false);
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        fetchTransfers();
    }, [fetchTransfers]);

    // Derive unique warehouse names for filter dropdowns
    const uniqueFromWarehouses = useMemo(() => {
        const names = transfers.map(t => t.fromWarehouse).filter(Boolean);
        return [...new Set(names)].sort();
    }, [transfers]);

    const uniqueToWarehouses = useMemo(() => {
        const names = transfers.map(t => t.toWarehouse).filter(Boolean);
        return [...new Set(names)].sort();
    }, [transfers]);

    // Filtering & Pagination
    const filteredData = useMemo(() => {
        let data = [...transfers];

        if (searchTerm) {
            const st = searchTerm.toLowerCase();
            data = data.filter(item => 
                (item.fromWarehouse || '').toLowerCase().includes(st) ||
                (item.toWarehouse || '').toLowerCase().includes(st) ||
                (item.referenceNo || '').toLowerCase().includes(st) ||
                (item.notes || '').toLowerCase().includes(st)
            );
        }

        if (filterFrom) data = data.filter(item => item.fromWarehouse === filterFrom);
        if (filterTo)   data = data.filter(item => item.toWarehouse === filterTo);

        if (sortDays) {
            const days = parseInt(sortDays, 10);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            data = data.filter(item => {
                const d = item.date ? new Date(item.date) : null;
                return d && d >= cutoff;
            });
        }
        return data;
    }, [transfers, searchTerm, filterFrom, filterTo, sortDays]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const pagedData = filteredData.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterFrom, filterTo, sortDays, rowsPerPage]);

    // Handlers
    const handleEdit = (transfer, viewMode = false) => {
        setEditModalData(transfer);
        setIsViewMode(viewMode);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (id) => {
        setTransferToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!transferToDelete) return;
        setIsDeleting(true);
        try {
            await apiClient.delete(`${API_BASE}/${transferToDelete}`);
            fetchTransfers();
            setIsDeleteModalOpen(false);
            setTransferToDelete(null);
        } catch (error) {
            console.error('Error deleting transfer:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        const pageIds = pagedData.map(d => d.id);
        const allSelected = pageIds.every(id => selectedRows.includes(id));
        if (allSelected) {
            setSelectedRows(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedRows(prev => [...new Set([...prev, ...pageIds])]);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Transfers',
            message: `Are you sure you want to delete ${selectedRows.length} stock transfer records?`
        });
        if (!isConfirmed) return;
        
        try {
            await apiClient.post(`${ENV.API_BASE_URL}/transfers/delete-bulk`, { ids: selectedRows });
            setSelectedRows([]);
            fetchTransfers();
        } catch (err) {
            console.error('Failed to delete transfers:', err);
            alert('Failed to delete transfers.');
        }
    };

    const allPageSelected = pagedData.length > 0 && pagedData.every(d => selectedRows.includes(d.id));

    const exportCSV = () => {
        const headers = ['From Warehouse', 'To Warehouse', 'No of Products', 'Qty Transferred', 'Ref Number', 'Date', 'Status'];
        const rows = filteredData.map(item => [
            item.fromWarehouse || '',
            item.toWarehouse || '',
            item.noOfProducts ?? 0,
            item.quantityTransferred ?? 0,
            item.referenceNo || '',
            item.formattedDate || item.date || '',
            item.status || ''
        ]);
        const csvContent = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stock_transfers.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusClass = (status) => {
        if (!status) return 'ss-status-badge ss-status-pending';
        switch (status.toLowerCase()) {
            case 'completed': return 'ss-status-badge ss-status-active'; // Updated for ss- design system
            case 'pending': return 'ss-status-badge ss-status-pending';
            case 'cancelled': return 'ss-status-badge ss-status-inactive'; // Updated for ss- design system
            default: return 'ss-status-badge ss-status-pending';
        }
    };

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Stock Transfer</h2>
                    <p className="ss-page-subtitle">Manage your warehouse stock transfers</p>
                </div>
                
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="PDF" onClick={() => window.print()}>
                        <FileText size={16} />
                    </button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Excel" onClick={exportCSV}>
                        <Download size={16} />
                    </button>
                    <button className="ss-btn-icon-square" title="Refresh" onClick={fetchTransfers}>
                        <RotateCcw size={16} className={isRefreshing ? 'spin' : ''} />
                    </button>
                    {selectedRows.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedRows.length})
                        </button>
                    )}
                    <button className="ss-btn-icon-square" title={isCollapsed ? "Expand" : "Collapse"} onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                    <button className="ss-btn-orange" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} /> Add New
                    </button>
                    <button className="ss-btn-orange" style={{ background: '#1b2850', borderColor: '#1b2850' }} onClick={() => setIsImportModalOpen(true)}>
                        <Upload size={16} /> Import
                    </button>
                </div>
            </div>

            {/* Main Panel */}
            <div className={`ss-main-panel ${isCollapsed ? 'ss-collapsed' : ''}`}>
                {!isCollapsed && (
                    <>
                        {/* Table Controls */}
                        <div className="ss-table-controls">
                            <div className="ss-search-wrap">
                                <Search size={18} />
                                <input 
                                    type="text" 
                                    className="ss-search-input"
                                    placeholder="Search warehouse, ref no…" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="ss-filters-wrap">
                                <select className="ss-filter-select" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)}>
                                    <option value="">From Warehouse</option>
                                    {uniqueFromWarehouses.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                                <select className="ss-filter-select" value={filterTo} onChange={(e) => setFilterTo(e.target.value)}>
                                    <option value="">To Warehouse</option>
                                    {uniqueToWarehouses.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                                <select className="ss-filter-select" value={sortDays} onChange={(e) => setSortDays(e.target.value)}>
                                    <option value="">All Time</option>
                                    <option value="7">Last 7 Days</option>
                                    <option value="30">Last 30 Days</option>
                                    <option value="90">Last 90 Days</option>
                                </select>
                            </div>
                        </div>

                        {/* Table Area */}
                        <div className="ss-table-wrapper">
                            <table className="ss-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>
                                            <input 
                                                type="checkbox" 
                                                className="ss-checkbox" 
                                                checked={allPageSelected}
                                                onChange={toggleAll}
                                            />
                                        </th>
                                        <th>From Warehouse</th>
                                        <th>To Warehouse</th>
                                        <th>Products</th>
                                        <th>Qty</th>
                                        <th>Ref Number</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th style={{ textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={`skel-${i}`} className="skeleton-row">
                                                <td colSpan="9"><div className="skel skel-lg" /></td>
                                            </tr>
                                        ))
                                    ) : pagedData.length > 0 ? (
                                        pagedData.map((item) => (
                                            <tr key={item.id} className={selectedRows.includes(item.id) ? 'row-selected' : ''}>
                                                <td>
                                                    <input 
                                                        type="checkbox" 
                                                        className="ss-checkbox" 
                                                        checked={selectedRows.includes(item.id)}
                                                        onChange={() => toggleRow(item.id)}
                                                    />
                                                </td>
                                                <td className="ss-item-name">{item.fromWarehouse || '—'}</td>
                                                <td>{item.toWarehouse || '—'}</td>
                                                <td>{item.noOfProducts ?? 0}</td>
                                                <td>{item.quantityTransferred ?? 0}</td>
                                                <td><span className="ss-code-badge">{item.referenceNo || '—'}</span></td>
                                                <td>
                                                    <span className={getStatusClass(item.status)}>
                                                        {item.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td>{item.formattedDate || item.date || '—'}</td>
                                                <td>
                                                    <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                        <button className="ss-action-btn view" title="View" onClick={() => handleEdit(item, true)}>
                                                            <Eye size={15} />
                                                        </button>
                                                        <button className="ss-action-btn edit" title="Edit" onClick={() => handleEdit(item, false)}>
                                                            <Edit size={15} />
                                                        </button>
                                                        <button className="ss-action-btn delete" title="Delete" onClick={() => openDeleteModal(item.id)}>
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                                <div className="empty-state">
                                                    <Package size={48} strokeWidth={1} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                                    <p style={{ color: '#94a3b8' }}>No stock transfers found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Row */}
                        <div className="ss-pagination-row">
                            <div className="ss-page-size">
                                Row Per Page&nbsp;
                                <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                    {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                                </select> 
                                &nbsp;| Showing {(safePage - 1) * rowsPerPage + 1}–{Math.min(safePage * rowsPerPage, filteredData.length)} of {filteredData.length}
                            </div>
                            <div className="ss-page-controls">
                                <button className="ss-page-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={safePage === 1}>
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                                    .reduce((acc, p, i, arr) => {
                                        if (i > 0 && p - arr[i-1] > 1) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) => (
                                        p === '...' 
                                        ? <span key={`ellipsis-${i}`} className="ss-page-btn" style={{ border: 'none', cursor: 'default' }}>…</span>
                                        : <button key={p} className={`ss-page-btn ${p === safePage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
                                    ))
                                }
                                <button className="ss-page-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={safePage === totalPages}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <footer className="manage-stock-footer">
                <div className="footer-copyright">2014 - 2026 © DreamsPOS. All Right Reserved</div>
                <div className="footer-designer">Designed & Developed by <span>Dreams</span></div>
            </footer>

            {/* Modals */}
            <AddTransferModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchTransfers} />
            <ImportTransferModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onSuccess={fetchTransfers} />
            <EditTransferModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchTransfers} initialData={editModalData} isView={isViewMode} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setTransferToDelete(null); }} onConfirm={confirmDelete} title="Delete Transfer" message="Are you sure you want to delete this transfer? This action cannot be undone." isDeleting={isDeleting} />
        </div>
    );
};

export default StockTransfer;
