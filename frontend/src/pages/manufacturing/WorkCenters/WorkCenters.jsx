import React, { useState, useEffect, useMemo } from 'react';
import './WorkCenters.css';
import apiClient, { ENV } from '@/api/config';
import {
    Factory,
    PlusCircle,
    Search,
    Pencil,
    Trash2,
    CheckCircle,
    AlertCircle,
    X,
    Grid,
    List,
    DollarSign,
    Zap,
    Activity,
    Cpu,
    Clock,
    Filter,
    Layers,
    Gauge,
    Sparkles,
    ArrowUpDown,
    Wrench
} from 'lucide-react';
import { useConfirm } from '../../../context/ConfirmContext';
import { useCurrency } from '../../../hooks/useCurrency';

const WorkCenters = () => {
    const confirm = useConfirm();
    const { currencySymbol } = useCurrency();
    
    // Core data state
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtering & View state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

    // Form / Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCenter, setEditingCenter] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        costPerHour: 0.0,
        capacity: 100,
        description: ''
    });

    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(`${ENV.API_BASE_URL}/manufacturing/work-centers`);
            setCenters(res.data || []);
        } catch (err) {
            console.error('Failed to load work centers', err);
            showToast('Failed to load factory work centers', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingCenter(null);
        setFormData({
            name: '',
            code: '',
            costPerHour: 0.0,
            capacity: 100,
            description: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (wc) => {
        setEditingCenter(wc);
        setFormData({
            name: wc.name || '',
            code: wc.code || '',
            costPerHour: wc.costPerHour || 0.0,
            capacity: wc.capacity || 100,
            description: wc.description || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.code.trim()) {
            showToast('Please enter work center name and code', 'error');
            return;
        }

        try {
            if (editingCenter) {
                await apiClient.put(`${ENV.API_BASE_URL}/manufacturing/work-centers/${editingCenter.id}`, formData);
                showToast('Work Center updated successfully!');
            } else {
                await apiClient.post(`${ENV.API_BASE_URL}/manufacturing/work-centers`, formData);
                showToast('Work Center created successfully!');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            showToast(err.response?.data || 'Failed to save Work Center', 'error');
        }
    };

    const handleDelete = async (wc) => {
        const ok = await confirm({
            title: 'Delete Work Center',
            message: `Are you sure you want to delete "${wc.name}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });
        if (!ok) return;

        try {
            await apiClient.delete(`${ENV.API_BASE_URL}/manufacturing/work-centers/${wc.id}`);
            showToast('Work Center deleted successfully');
            fetchData();
        } catch (err) {
            showToast('Failed to delete work center', 'error');
        }
    };

    // Calculate Analytics
    const analytics = useMemo(() => {
        const totalCenters = centers.length;
        const totalCapacity = centers.reduce((acc, curr) => acc + (Number(curr.capacity) || 100), 0);
        const avgCost = totalCenters
            ? (centers.reduce((acc, curr) => acc + (Number(curr.costPerHour) || 0), 0) / totalCenters).toFixed(2)
            : '0.00';
        return { totalCenters, totalCapacity, avgCost };
    }, [centers]);

    // Process Filter & Sort
    const processedCenters = useMemo(() => {
        let result = centers.filter(c =>
            (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        result.sort((a, b) => {
            if (sortBy === 'code') return (a.code || '').localeCompare(b.code || '');
            if (sortBy === 'costAsc') return (Number(a.costPerHour) || 0) - (Number(b.costPerHour) || 0);
            if (sortBy === 'costDesc') return (Number(b.costPerHour) || 0) - (Number(a.costPerHour) || 0);
            if (sortBy === 'capacityDesc') return (Number(b.capacity) || 0) - (Number(a.capacity) || 0);
            return (a.name || '').localeCompare(b.name || '');
        });

        return result;
    }, [centers, searchTerm, sortBy]);

    return (
        <div className="work-centers-page container-fluid p-4">
            {/* Toast Notification */}
            {toast && (
                <div className={`wc-toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    <div className="mfg-header-badge">
                        <Factory size={26} />
                    </div>
                    <div>
                        <h4 className="mfg-page-title mb-1">Manufacturing Work Centers</h4>
                        <p className="mfg-page-subtitle mb-0">
                            Configure assembly lines, workstation capacities, machine throughput, and operational hourly rates.
                        </p>
                    </div>
                </div>
                <button className="btn-mfg-orange" onClick={openCreateModal}>
                    <PlusCircle size={18} />
                    <span>Add Work Center</span>
                </button>
            </div>

            {/* Stat Summary Cards Grid */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="mfg-stat-card orange">
                        <div className="mfg-stat-icon orange">
                            <Layers size={24} />
                        </div>
                        <div>
                            <div className="mfg-stat-label">Total Work Centers</div>
                            <div className="mfg-stat-value">{analytics.totalCenters}</div>
                            <div className="mfg-stat-subtext">Active Assembly Lines</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="mfg-stat-card emerald">
                        <div className="mfg-stat-icon emerald">
                            <Zap size={24} />
                        </div>
                        <div>
                            <div className="mfg-stat-label">Total Daily Output</div>
                            <div className="mfg-stat-value">{analytics.totalCapacity.toLocaleString()}</div>
                            <div className="mfg-stat-subtext">Units / Day Max Capacity</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="mfg-stat-card blue">
                        <div className="mfg-stat-icon blue">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="mfg-stat-label">Avg Operating Rate</div>
                            <div className="mfg-stat-value">{currencySymbol}{analytics.avgCost}</div>
                            <div className="mfg-stat-subtext">Cost Per Hour / Workstation</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="mfg-stat-card purple">
                        <div className="mfg-stat-icon purple">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="mfg-stat-label">Factory Health</div>
                            <div className="mfg-stat-value">100%</div>
                            <div className="mfg-stat-subtext">Operational Line Readiness</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Toolbar (Search, Sort, View Toggle) */}
            <div className="mfg-control-card mb-4">
                <div className="row g-3 align-items-center">
                    {/* Search Field */}
                    <div className="col-12 col-md-5">
                        <div className="mfg-search-input">
                            <Search size={18} className="mfg-search-icon" />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search workstations by name, code, or details..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <X size={16} className="mfg-clear-icon" onClick={() => setSearchTerm('')} />
                            )}
                        </div>
                    </div>

                    {/* Sorting Select */}
                    <div className="col-6 col-md-4 col-lg-3">
                        <div className="d-flex align-items-center gap-2">
                            <ArrowUpDown size={16} className="text-muted flex-shrink-0" />
                            <select
                                className="form-select mfg-filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Sort by Name (A-Z)</option>
                                <option value="code">Sort by Code</option>
                                <option value="costAsc">Cost: Low to High</option>
                                <option value="costDesc">Cost: High to Low</option>
                                <option value="capacityDesc">Capacity: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* View Switcher & Result Count */}
                    <div className="col-6 col-md-3 col-lg-4 d-flex align-items-center justify-content-end gap-3">
                        <span className="text-muted small fw-medium d-none d-sm-inline">
                            {processedCenters.length} {processedCenters.length === 1 ? 'Station' : 'Stations'}
                        </span>
                        <div className="d-flex align-items-center gap-1 bg-light p-1 rounded-3 border">
                            <button
                                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Grid View"
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                                onClick={() => setViewMode('table')}
                                title="Table View"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Grid or Table View */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                    <p className="text-muted fw-medium">Loading Work Centers...</p>
                </div>
            ) : processedCenters.length === 0 ? (
                <div className="mfg-empty-state">
                    <div className="mfg-empty-icon">
                        <Wrench size={32} />
                    </div>
                    <h5 className="fw-bold text-dark mb-2">No Work Centers Found</h5>
                    <p className="text-muted mb-4" style={{ maxWidth: '440px', margin: '0 auto' }}>
                        {searchTerm
                            ? `No workstations match "${searchTerm}". Try resetting your search filters.`
                            : 'No factory work centers have been configured yet. Click below to setup your first assembly line.'}
                    </p>
                    {searchTerm ? (
                        <button className="btn btn-outline-secondary rounded-3 px-4 fw-semibold" onClick={() => setSearchTerm('')}>
                            Clear Search
                        </button>
                    ) : (
                        <button className="btn-mfg-orange" onClick={openCreateModal}>
                            <PlusCircle size={18} />
                            <span>Create Work Center</span>
                        </button>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View Cards */
                <div className="wc-grid-container">
                    {processedCenters.map((wc) => {
                        const cost = Number(wc.costPerHour || 0).toFixed(2);
                        const capacity = wc.capacity || 100;
                        const capacityPercent = Math.min(100, Math.max(15, (capacity / 1000) * 100));

                        return (
                            <div className="wc-card" key={wc.id}>
                                <div>
                                    {/* Card Header Tag */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="wc-code-badge">{wc.code || 'WC-DEFAULT'}</span>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="wc-status-pill active">
                                                <span className="wc-status-dot"></span>
                                                Operational
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <h5 className="wc-title">{wc.name}</h5>
                                    <p className="wc-description">
                                        {wc.description || 'Primary workstation for assembly, quality testing, and machine processing operations.'}
                                    </p>

                                    {/* Key Metrics Box */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <div className="wc-metric-box">
                                                <div className="wc-metric-label mb-1 d-flex align-items-center gap-1">
                                                    <Clock size={12} className="text-warning" /> Operating Cost
                                                </div>
                                                <div className="wc-metric-val text-dark">
                                                    {currencySymbol}{cost} <span className="small text-muted font-normal">/ hr</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="wc-metric-box">
                                                <div className="wc-metric-label mb-1 d-flex align-items-center gap-1">
                                                    <Gauge size={12} className="text-success" /> Max Output
                                                </div>
                                                <div className="wc-metric-val text-dark">
                                                    {capacity} <span className="small text-muted font-normal">units/day</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Capacity Progress Bar */}
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="small text-muted fw-semibold" style={{ fontSize: '11px' }}>Capacity Meter</span>
                                            <span className="small fw-bold text-dark" style={{ fontSize: '11px' }}>{capacity} Daily Units</span>
                                        </div>
                                        <div className="wc-progress-bar-bg">
                                            <div
                                                className="wc-progress-bar-fill"
                                                style={{ width: `${capacityPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer Actions */}
                                <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
                                    <span className="small text-muted" style={{ fontSize: '11.5px' }}>
                                        Ready for production
                                    </span>
                                    <div className="d-flex align-items-center gap-2">
                                        <button
                                            className="btn-action-icon edit"
                                            onClick={() => openEditModal(wc)}
                                            title="Edit Work Center"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            className="btn-action-icon delete"
                                            onClick={() => handleDelete(wc)}
                                            title="Delete Work Center"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Table View */
                <div className="mfg-table-card">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Work Center Name</th>
                                    <th>Operating Cost / Hour</th>
                                    <th>Production Capacity</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedCenters.map((wc) => (
                                    <tr key={wc.id}>
                                        <td>
                                            <span className="wc-code-badge">{wc.code || 'WC-DEFAULT'}</span>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{wc.name}</div>
                                            {wc.description && (
                                                <div className="small text-muted text-truncate" style={{ maxWidth: '280px' }}>
                                                    {wc.description}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className="fw-bold text-dark">
                                                {currencySymbol}{Number(wc.costPerHour || 0).toFixed(2)}
                                            </span>
                                            <span className="small text-muted ms-1">/ hr</span>
                                        </td>
                                        <td>
                                            <div className="fw-semibold text-dark">
                                                {wc.capacity || 100} units/day
                                            </div>
                                        </td>
                                        <td>
                                            <span className="wc-status-pill active">
                                                <span className="wc-status-dot"></span>
                                                Operational
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-inline-flex gap-2">
                                                <button
                                                    className="btn-action-icon edit"
                                                    onClick={() => openEditModal(wc)}
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    className="btn-action-icon delete"
                                                    onClick={() => handleDelete(wc)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create / Edit Work Center Modal */}
            {isModalOpen && (
                <div className="modal-backdrop-custom">
                    <div className="modal-content-custom card border-0 p-4" style={{ maxWidth: '540px', width: '100%' }}>
                        {/* Modal Header */}
                        <div className="wc-modal-header d-flex justify-content-between align-items-center mb-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="modal-icon-badge">
                                    <Factory size={22} />
                                </div>
                                <div>
                                    <h5 className="fw-bold text-dark mb-0">
                                        {editingCenter ? 'Edit Work Center' : 'Add Work Center'}
                                    </h5>
                                    <span className="small text-muted">Configure factory line settings</span>
                                </div>
                            </div>
                            <button className="wc-modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3 mb-3">
                                {/* Code Field */}
                                <div className="col-12 col-md-5">
                                    <label className="form-label fw-semibold small text-dark mb-1">
                                        Work Center Code *
                                    </label>
                                    <div className="input-icon-group">
                                        <Cpu size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. WC-ASM-01"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div className="col-12 col-md-7">
                                    <label className="form-label fw-semibold small text-dark mb-1">
                                        Work Center Name *
                                    </label>
                                    <div className="input-icon-group">
                                        <Factory size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Assembly Line A"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                {/* Cost per Hour */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold small text-dark mb-1">
                                        Cost Per Hour ({currencySymbol}) *
                                    </label>
                                    <div className="input-icon-group">
                                        <Clock size={16} className="input-icon" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            placeholder="0.00"
                                            value={formData.costPerHour}
                                            onChange={(e) => setFormData({ ...formData, costPerHour: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Capacity */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold small text-dark mb-1">
                                        Daily Capacity (units/day) *
                                    </label>
                                    <div className="input-icon-group">
                                        <Gauge size={16} className="input-icon" />
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="100"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold small text-dark mb-1">
                                    Description & Equipment Notes
                                </label>
                                <div className="input-icon-group">
                                    <Wrench size={16} className="input-icon" />
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Optional workstation specifications, equipment models, or operator details..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Live Card Preview */}
                            <div className="wc-preview-box mb-4">
                                <div className="d-flex align-items-center gap-1 mb-2 text-warning font-semibold small">
                                    <Sparkles size={14} /> <span>Live Preview</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="wc-code-badge me-2">{formData.code || 'WC-CODE'}</span>
                                        <strong className="text-dark me-2">{formData.name || 'Work Center Name'}</strong>
                                    </div>
                                    <div className="small fw-bold text-dark">
                                        {currencySymbol}{Number(formData.costPerHour || 0).toFixed(2)}/hr | {formData.capacity || 0} units
                                    </div>
                                </div>
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                                <button
                                    type="button"
                                    className="btn btn-light rounded-3 px-4 fw-semibold"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-mfg-orange border-0 px-4">
                                    {editingCenter ? 'Update Work Center' : 'Save Work Center'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkCenters;
