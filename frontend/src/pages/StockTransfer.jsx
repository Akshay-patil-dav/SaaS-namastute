import React, { useState, useEffect, useMemo } from 'react';
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
    Eye
} from 'lucide-react';
import axios from 'axios';
import './stock-transfer.css';
import './inventory-pages-custom.css';
import AddTransferModal from '../components/AddTransferModal';
import ImportTransferModal from '../components/ImportTransferModal';
import EditTransferModal from '../components/EditTransferModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function StockTransfer() {
    const [transfers, setTransfers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');
    const [sortDays, setSortDays] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const fetchTransfers = async () => {
        setIsRefreshing(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/transfers`);
            setTransfers(response.data);
        } catch (error) {
            console.error('Error fetching transfers:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTransfers();
    }, []);

    // Reset page when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterFrom, filterTo, sortDays, rowsPerPage]);

    const openDeleteModal = (id) => {
        setTransferToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!transferToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/transfers/${transferToDelete}`);
            fetchTransfers();
            setIsDeleteModalOpen(false);
            setTransferToDelete(null);
        } catch (error) {
            console.error('Error deleting transfer:', error);
            alert('Failed to delete transfer. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (transfer, viewMode = false) => {
        setEditModalData(transfer);
        setIsViewMode(viewMode);
        setIsEditModalOpen(true);
    };

    const toggleRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    // Derive unique warehouse names for filter dropdowns
    const uniqueFromWarehouses = useMemo(() => {
        const names = transfers.map(t => t.fromWarehouse).filter(Boolean);
        return [...new Set(names)].sort();
    }, [transfers]);

    const uniqueToWarehouses = useMemo(() => {
        const names = transfers.map(t => t.toWarehouse).filter(Boolean);
        return [...new Set(names)].sort();
    }, [transfers]);

    // Filter + search + sort
    const filteredData = useMemo(() => {
        let data = [...transfers];

        // Search
        const st = searchTerm.toLowerCase();
        if (st) {
            data = data.filter(item => {
                return (
                    (item.fromWarehouse || '').toLowerCase().includes(st) ||
                    (item.toWarehouse || '').toLowerCase().includes(st) ||
                    (item.referenceNo || '').toLowerCase().includes(st) ||
                    (item.notes || '').toLowerCase().includes(st)
                );
            });
        }

        // From warehouse filter
        if (filterFrom) {
            data = data.filter(item => item.fromWarehouse === filterFrom);
        }

        // To warehouse filter
        if (filterTo) {
            data = data.filter(item => item.toWarehouse === filterTo);
        }

        // Sort by date
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

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const pagedData = filteredData.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

    const toggleAll = () => {
        const pageIds = pagedData.map(d => d.id);
        const allSelected = pageIds.every(id => selectedRows.includes(id));
        if (allSelected) {
            setSelectedRows(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedRows(prev => [...new Set([...prev, ...pageIds])]);
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
            case 'completed': return 'ss-status-badge ss-status-completed';
            case 'pending': return 'ss-status-badge ss-status-pending';
            case 'cancelled': return 'ss-status-badge ss-status-cancelled';
            default: return 'ss-status-badge ss-status-pending';
        }
    };

    return (
        <div className="stock-transfer-container">
            {/* Page Header */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Stock Transfer</h2>
                    <p className="ss-page-subtitle">Manage your stock transfers</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-icon-square" style={{ color: '#ea5455', borderColor: '#fbdada', background: '#fff1f1' }} title="Export PDF" onClick={() => window.print()}>
                        <FileText size={16} />
                    </button>
                    <button className="ss-btn-icon-square" style={{ color: '#28c76f', borderColor: '#d4f4e2', background: '#e9f9ef' }} title="Export CSV" onClick={exportCSV}>
                        <Download size={16} />
                    </button>
                    <button
                        className={`ss-btn-icon-square${isRefreshing ? ' spin' : ''}`}
                        title="Refresh"
                        onClick={fetchTransfers}
                        disabled={isRefreshing}
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button className="ss-btn-orange" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} />
                        Add New
                    </button>
                    <button className="ss-btn-orange" style={{ background: '#1b2850', boxShadow: 'none' }} onClick={() => setIsImportModalOpen(true)}>
                        <Upload size={16} />
                        Import Transfer
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            {!isCollapsed && (
                <div className="ss-main-panel">
                    {/* Filters */}
                    <div className="ss-table-controls">
                        <div className="ss-search-wrap">
                            <Search size={16} />
                            <input 
                                type="text" 
                                className="ss-search-input" 
                                placeholder="Search by warehouse, ref no…" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="ss-filters-wrap">
                            <select
                                className="ss-filter-select"
                                value={filterFrom}
                                onChange={(e) => setFilterFrom(e.target.value)}
                            >
                                <option value="">From Warehouse</option>
                                {uniqueFromWarehouses.map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                            </select>
                            <select
                                className="ss-filter-select"
                                value={filterTo}
                                onChange={(e) => setFilterTo(e.target.value)}
                            >
                                <option value="">To Warehouse</option>
                                {uniqueToWarehouses.map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                            </select>
                            <select
                                className="ss-filter-select"
                                value={sortDays}
                                onChange={(e) => setSortDays(e.target.value)}
                            >
                                <option value="">All Time</option>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
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
                                            checked={allPageSelected}
                                            onChange={toggleAll}
                                        />
                                    </th>
                                    <th>From Warehouse</th>
                                    <th>To Warehouse</th>
                                    <th>No of Products</th>
                                    <th>Qty Transferred</th>
                                    <th>Ref Number</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedData.length > 0 ? (
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
                                                    <button
                                                        className="ss-action-btn view"
                                                        title="View"
                                                        onClick={() => handleEdit(item, true)}
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        className="ss-action-btn edit"
                                                        title="Edit"
                                                        onClick={() => handleEdit(item, false)}
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        className="ss-action-btn delete"
                                                        title="Delete"
                                                        onClick={() => openDeleteModal(item.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: 'center', padding: '40px 20px', color: '#5b6670' }}>
                                            {isRefreshing ? 'Loading…' : 'No matching records found.'}
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
                            <select
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            >
                                {ROWS_PER_PAGE_OPTIONS.map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            <span>
                                Entries
                            </span>
                        </div>
                        <div className="ss-page-controls">
                            <button
                                className="ss-page-btn"
                                disabled={safePage <= 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) {
                                        acc.push('...');
                                    }
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, idx) =>
                                    p === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="ss-page-btn" style={{ border: 'none', cursor: 'default' }}>…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            className={`ss-page-btn${safePage === p ? ' active' : ''}`}
                                            onClick={() => setCurrentPage(p)}
                                        >
                                            {p}
                                        </button>
                                    )
                                )
                            }
                            <button
                                className="ss-page-btn"
                                disabled={safePage >= totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="manage-stock-footer">
                <div className="footer-copyright">
                    2014 - 2026 © DreamsPOS. All Right Reserved
                </div>
                <div className="footer-designer">
                    Designed &amp; Developed by <span>Dreams</span>
                </div>
            </footer>

            <AddTransferModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={fetchTransfers}
            />
            <ImportTransferModal 
                isOpen={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)} 
                onSuccess={fetchTransfers}
            />
            <EditTransferModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchTransfers}
                initialData={editModalData}
                isView={isViewMode}
            />
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setTransferToDelete(null); }}
                onConfirm={confirmDelete}
                title="Delete Transfer"
                message="Are you sure you want to delete this transfer? This action cannot be undone."
                isDeleting={isDeleting}
            />
        </div>
    );
}
