import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Search, Settings } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import { useConfirm } from '../../../context/ConfirmContext';
import '../../inventory/Brands/Products.css';
import '../../inventory/Brands/inventory-pages-custom.css';

const API_BASE = `${ENV.API_BASE_URL}/menus`;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function Menus() {
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { confirm } = useConfirm();

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(API_BASE);
            if (res.data && Array.isArray(res.data)) {
                setMenus(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch menus:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    // Search filter
    const filtered = menus.filter(item => {
        if (!searchTerm) return true;
        return (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedIds(paginated.map(item => item.id));
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

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Menu',
            message: 'Are you sure you want to delete this menu?'
        });
        if (isConfirmed) {
            try {
                await apiClient.delete(`${API_BASE}/${id}`);
                fetchMenus();
            } catch (err) {
                console.error(err);
                alert('Failed to delete menu');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        const isConfirmed = await confirm({
            title: 'Delete Menus',
            message: `Are you sure you want to delete ${selectedIds.length} menus?`
        });
        if (isConfirmed) {
            try {
                await apiClient.post(`${API_BASE}/delete-bulk`, { ids: selectedIds });
                setSelectedIds([]);
                fetchMenus();
            } catch (err) {
                console.error('Failed to bulk delete menus:', err);
                alert('Failed to delete menus.');
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await apiClient.put(`${API_BASE}/${id}/default`);
            fetchMenus();
        } catch (err) {
            console.error('Failed to set default menu:', err);
            alert('Failed to set default menu.');
        }
    };

    return (
        <div className="product-page-container">
            {/* Header */}
            <div className="ss-header-row">
                <div className="ss-page-title-area">
                    <h2 className="ss-page-title">Web App Menus</h2>
                    <p className="ss-page-subtitle">Manage your navigation and menu structures</p>
                </div>
                <div className="ss-header-actions">
                    {selectedIds.length > 0 && (
                        <button className="ss-btn-red-outline" onClick={handleBulkDelete}>
                            <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <Link to="/dashboard/create-menu" className="ss-btn-orange" style={{ textDecoration: 'none' }}>
                        <PlusCircle size={18} /> Create Menu
                    </Link>
                </div>
            </div>

            {/* Table Card */}
            <div className="ss-main-panel">
                <div className="ss-table-controls">
                    <div className="ss-search-wrap">
                        <Search size={18} />
                        <input
                            type="text"
                            className="ss-search-input"
                            placeholder="Search menus..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                <div className="ss-table-wrapper">
                    <table className="ss-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input 
                                        type="checkbox" 
                                        className="ss-checkbox" 
                                        checked={paginated.length > 0 && selectedIds.length === paginated.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th>Menu Name</th>
                                <th style={{ textAlign: 'center' }}>Default</th>
                                <th>Total Items</th>
                                <th>Last Updated</th>
                                <th style={{ textAlign: 'center', width: '120px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length > 0 ? (
                                paginated.map((menu) => (
                                    <tr key={menu.id}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                className="ss-checkbox" 
                                                checked={selectedIds.includes(menu.id)}
                                                onChange={(e) => handleSelectItem(menu.id, e.target.checked)}
                                            />
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: '4px',
                                                    background: '#3b82f6', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', color: '#fff'
                                                }}>
                                                    <Settings size={14} />
                                                </div>
                                                <span className="ss-item-name">{menu.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input 
                                                type="radio" 
                                                name="defaultMenu"
                                                className="form-check-input"
                                                style={{ cursor: 'pointer' }}
                                                checked={menu.isDefault === true}
                                                onChange={() => handleSetDefault(menu.id)}
                                            />
                                        </td>
                                        <td>
                                            <span className="ss-status-badge ss-status-active">
                                                {menu.items ? menu.items.length : 0} ITEMS
                                            </span>
                                        </td>
                                        <td style={{ color: '#5b6670', fontSize: '13px' }}>
                                            {new Date(menu.updatedAt || menu.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="ss-actions-group" style={{ justifyContent: 'center' }}>
                                                <button className="ss-action-btn edit" title="Edit" onClick={() => navigate(`/dashboard/edit-menu/${menu.id}`)}>
                                                    <Edit size={15} />
                                                </button>
                                                <button className="ss-action-btn delete" title="Delete" onClick={() => handleDelete(menu.id)}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        No menus match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filtered.length > 0 && (
                    <div className="ss-pagination-row">
                        <div className="ss-page-size">
                            Row Per Page&nbsp;
                            <select
                                value={rowsPerPage}
                                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            &nbsp;| Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length}
                        </div>
                        <div className="ss-page-controls">
                            <button className="ss-page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .map((p) =>
                                    <button key={p} className={`ss-page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => goToPage(p)}>{p}</button>
                                )
                            }
                            <button className="ss-page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
