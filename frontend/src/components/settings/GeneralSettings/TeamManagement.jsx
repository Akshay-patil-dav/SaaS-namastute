import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '@/api/config';
import { 
    Users, 
    UserPlus, 
    Mail, 
    Plus, 
    Trash2, 
    Edit2, 
    Check, 
    X, 
    Search, 
    Shield, 
    Key, 
    Phone, 
    User, 
    Eye, 
    EyeOff, 
    Power, 
    CheckCircle, 
    Ban, 
    Sparkles, 
    ShoppingBag, 
    Boxes, 
    ShoppingCart, 
    Monitor, 
    BookOpen, 
    BarChart2, 
    Factory, 
    Settings, 
    Briefcase,
    RefreshCw,
    Copy
} from 'lucide-react';

const MODULES = [
    { id: 'pos', name: 'POS Terminal', icon: Monitor, desc: 'Make point of sale orders, process billing and print receipts' },
    { id: 'sales', name: 'Sales & Invoices', icon: ShoppingCart, desc: 'Manage POS orders, online orders, invoices and sales returns' },
    { id: 'products', name: 'Products Catalog', icon: ShoppingBag, desc: 'Products list, categories, brands, units, warranties and barcodes' },
    { id: 'inventory', name: 'Inventory & Stock', icon: Boxes, desc: 'Manage stock levels, adjustments, warehouse stock transfers' },
    { id: 'purchases', name: 'Purchases', icon: ShoppingBag, desc: 'Purchase orders, supplier bills and purchase returns' },
    { id: 'khata', name: 'Finance & Khata Book', icon: BookOpen, desc: 'Customer khata, supplier khata, daily cash ledger' },
    { id: 'reports', name: 'Financial Reports', icon: BarChart2, desc: 'Access revenue reports and business analytics', actions: ['VIEW'] },
    { id: 'crm', name: 'Customers & CRM', icon: Users, desc: 'Customer contacts, loyalty points, and purchase history' },
    { id: 'manufacturing', name: 'Manufacturing', icon: Factory, desc: 'Bill of materials (BOM), work orders and work centers' },
    { id: 'settings', name: 'Settings', icon: Settings, desc: 'Company details, bank accounts, tax rates and POS settings' }
];

const DEFAULT_ACTIONS = ['VIEW', 'CREATE', 'EDIT', 'DELETE'];

const ROLE_PRESETS = [
    {
        title: 'Cashier',
        badgeColor: '#f97316',
        desc: 'POS selling & customer billing',
        permissions: {
            pos: ['VIEW', 'CREATE', 'MANAGE'],
            sales: ['VIEW', 'CREATE'],
            products: ['VIEW'],
            crm: ['VIEW', 'CREATE']
        }
    },
    {
        title: 'Sales Executive',
        badgeColor: '#3b82f6',
        desc: 'Sales orders, invoices & customers',
        permissions: {
            pos: ['VIEW', 'CREATE'],
            sales: ['VIEW', 'CREATE', 'EDIT'],
            products: ['VIEW'],
            crm: ['VIEW', 'CREATE', 'EDIT'],
            khata: ['VIEW']
        }
    },
    {
        title: 'Inventory Manager',
        badgeColor: '#8b5cf6',
        desc: 'Manage products, stocks & suppliers',
        permissions: {
            products: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            inventory: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            purchases: ['VIEW', 'CREATE', 'EDIT']
        }
    },
    {
        title: 'Accountant',
        badgeColor: '#10b981',
        desc: 'Ledgers, sales, purchases & reports',
        permissions: {
            sales: ['VIEW'],
            purchases: ['VIEW'],
            khata: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            reports: ['VIEW'],
            settings: ['VIEW']
        }
    },
    {
        title: 'Store Manager',
        badgeColor: '#6366f1',
        desc: 'Full operational access',
        permissions: {
            pos: ['VIEW', 'CREATE', 'MANAGE'],
            sales: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            products: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            inventory: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            purchases: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            khata: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            reports: ['VIEW'],
            crm: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            manufacturing: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            settings: ['VIEW', 'EDIT']
        }
    }
];

export default function TeamManagement() {
    const [members, setMembers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    // Create Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        roleTitle: 'Cashier',
        permissions: ROLE_PRESETS[0].permissions
    });
    const [showCreatePassword, setShowCreatePassword] = useState(false);

    // Edit Modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [editForm, setEditForm] = useState({
        fullName: '',
        phoneNumber: '',
        roleTitle: '',
        status: 'ACTIVE',
        password: '',
        permissions: {}
    });
    const [showEditPassword, setShowEditPassword] = useState(false);

    // Invite Modal state
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [invitePermissions, setInvitePermissions] = useState(ROLE_PRESETS[0].permissions);

    // Feedback
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const showToast = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [membersRes, invitesRes] = await Promise.all([
                apiClient.get('/project/members'),
                apiClient.get('/project/invitations')
            ]);
            setMembers(membersRes.data || []);
            setInvitations(invitesRes.data || []);
        } catch (error) {
            console.error("Failed to fetch team data", error);
            showToast('error', 'Failed to load team data');
        } finally {
            setLoading(false);
        }
    };

    // Permission helpers
    const togglePermission = (formState, setFormState, modId, action) => {
        setFormState(prev => {
            const currentPerms = prev.permissions || {};
            const modPerms = currentPerms[modId] || [];
            const updatedModPerms = modPerms.includes(action)
                ? modPerms.filter(a => a !== action)
                : [...modPerms, action];

            return {
                ...prev,
                permissions: {
                    ...currentPerms,
                    [modId]: updatedModPerms
                }
            };
        });
    };

    const toggleAllForModule = (formState, setFormState, modId, actions) => {
        setFormState(prev => {
            const currentPerms = prev.permissions || {};
            const modPerms = currentPerms[modId] || [];
            const allSelected = actions.every(a => modPerms.includes(a));
            return {
                ...prev,
                permissions: {
                    ...currentPerms,
                    [modId]: allSelected ? [] : [...actions]
                }
            };
        });
    };

    const applyPreset = (setFormState, preset) => {
        setFormState(prev => ({
            ...prev,
            roleTitle: preset.title,
            permissions: { ...preset.permissions }
        }));
    };

    const selectAllModules = (setFormState) => {
        const all = {};
        MODULES.forEach(m => {
            all[m.id] = m.actions || DEFAULT_ACTIONS;
        });
        setFormState(prev => ({ ...prev, permissions: all }));
    };

    const clearAllModules = (setFormState) => {
        setFormState(prev => ({ ...prev, permissions: {} }));
    };

    // ── CREATE STAFF ──
    const handleCreateStaff = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiClient.post('/project/staff', {
                fullName: createForm.fullName,
                email: createForm.email,
                password: createForm.password,
                phoneNumber: createForm.phoneNumber,
                roleTitle: createForm.roleTitle,
                permissions: JSON.stringify(createForm.permissions)
            });
            showToast('success', `Staff user "${createForm.fullName || createForm.email}" created successfully! They can log in immediately.`);
            setShowCreateModal(false);
            setCreateForm({
                fullName: '',
                email: '',
                password: '',
                phoneNumber: '',
                roleTitle: 'Cashier',
                permissions: ROLE_PRESETS[0].permissions
            });
            fetchData();
        } catch (error) {
            showToast('error', error.response?.data?.error || "Failed to create staff user");
        } finally {
            setSubmitting(false);
        }
    };

    // ── EDIT STAFF ──
    const openEditModal = (member) => {
        let parsed = {};
        try {
            if (member.permissions) {
                parsed = typeof member.permissions === 'string' ? JSON.parse(member.permissions) : member.permissions;
            }
        } catch (e) {
            parsed = {};
        }

        setEditingMember(member);
        setEditForm({
            fullName: member.memberName || '',
            phoneNumber: member.phoneNumber || '',
            roleTitle: member.roleTitle || 'Staff',
            status: member.status || 'ACTIVE',
            password: '',
            permissions: parsed || {}
        });
        setShowEditModal(true);
    };

    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        if (!editingMember) return;
        setSubmitting(true);
        try {
            await apiClient.put(`/project/members/${editingMember.id}`, {
                fullName: editForm.fullName,
                phoneNumber: editForm.phoneNumber,
                roleTitle: editForm.roleTitle,
                status: editForm.status,
                password: editForm.password ? editForm.password : undefined,
                permissions: JSON.stringify(editForm.permissions)
            });
            showToast('success', `Staff member updated successfully!`);
            setShowEditModal(false);
            setEditingMember(null);
            fetchData();
        } catch (error) {
            showToast('error', error.response?.data?.error || "Failed to update staff member");
        } finally {
            setSubmitting(false);
        }
    };

    // ── TOGGLE STATUS ──
    const handleToggleStatus = async (id) => {
        try {
            const res = await apiClient.patch(`/project/members/${id}/status`);
            const newStatus = res.data?.status || 'ACTIVE';
            setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
            showToast('success', `Member status changed to ${newStatus}`);
        } catch (error) {
            showToast('error', error.response?.data?.error || "Failed to update member status");
        }
    };

    // ── DELETE MEMBER ──
    const handleRemoveMember = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove "${name || 'this member'}" from your team? They will no longer have access to this workspace.`)) return;
        try {
            await apiClient.delete(`/project/members/${id}`);
            showToast('success', 'Member removed successfully');
            fetchData();
        } catch (error) {
            showToast('error', error.response?.data?.error || "Failed to remove member");
        }
    };

    // ── INVITE MEMBER ──
    const copyInviteLink = (token) => {
        const url = `${window.location.origin}/invite/accept/${token}`;
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(url);
            showToast('success', 'Invitation link copied to clipboard!');
        } else {
            prompt('Copy this invitation link:', url);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await apiClient.post('/project/invite', {
                email: inviteEmail,
                permissions: JSON.stringify(invitePermissions)
            });
            const token = res.data?.token;
            if (token && navigator.clipboard?.writeText) {
                const url = `${window.location.origin}/invite/accept/${token}`;
                navigator.clipboard.writeText(url);
                showToast('success', `Invitation created! Link copied to clipboard for ${inviteEmail}`);
            } else {
                showToast('success', `Invitation sent to ${inviteEmail}`);
            }
            setShowInviteModal(false);
            setInviteEmail('');
            setInvitePermissions(ROLE_PRESETS[0].permissions);
            fetchData();
        } catch (error) {
            showToast('error', error.response?.data?.error || "Failed to send invitation");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelInvitation = async (id) => {
        try {
            await apiClient.delete(`/project/invitations/${id}`);
            showToast('success', 'Invitation cancelled');
            fetchData();
        } catch (error) {
            showToast('error', error.response?.data?.error || "Failed to cancel invitation");
        }
    };

    // Filter members
    const filteredMembers = useMemo(() => {
        return members.filter(m => {
            const matchesSearch = 
                (m.memberName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (m.memberEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (m.phoneNumber || '').includes(searchTerm) ||
                (m.roleTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesRole = filterRole === 'ALL' || (m.roleTitle || '').toLowerCase() === filterRole.toLowerCase();
            return matchesSearch && matchesRole;
        });
    }, [members, searchTerm, filterRole]);

    // Role options present in members
    const availableRoles = useMemo(() => {
        const roles = new Set(members.map(m => m.roleTitle || 'Staff'));
        return Array.from(roles);
    }, [members]);

    return (
        <div className="team-management-wrapper" style={{ padding: '0 4px' }}>
            {/* Notification alert */}
            {feedback.message && (
                <div 
                    className={`alert alert-${feedback.type === 'error' ? 'danger' : 'success'} d-flex align-items-center justify-content-between mb-4 shadow-sm`}
                    style={{ borderRadius: '10px' }}
                >
                    <div className="d-flex align-items-center gap-2">
                        {feedback.type === 'error' ? <Ban size={18} /> : <CheckCircle size={18} />}
                        <span>{feedback.message}</span>
                    </div>
                    <button type="button" className="btn-close" onClick={() => setFeedback({ type: '', message: '' })}></button>
                </div>
            )}

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div>
                    <h3 className="fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Users &amp; Staff Management
                    </h3>
                    <p className="text-secondary mb-0" style={{ fontSize: '0.875rem' }}>
                        Create staff accounts, assign granular feature permissions, and manage your store team.
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button 
                        className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2"
                        style={{ borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
                        onClick={() => setShowInviteModal(true)}
                    >
                        <Mail size={16} /> Invite via Link
                    </button>
                    <button 
                        className="btn d-flex align-items-center gap-2 px-3 py-2 text-white shadow-sm"
                        style={{ 
                            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            fontWeight: 600 
                        }}
                        onClick={() => setShowCreateModal(true)}
                    >
                        <UserPlus size={16} /> Create Staff User
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="p-3 bg-white border rounded-3 shadow-xs d-flex align-items-center gap-3">
                        <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                            <Users size={20} />
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>Total Staff</div>
                            <div className="fw-bold fs-5 text-dark">{members.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="p-3 bg-white border rounded-3 shadow-xs d-flex align-items-center gap-3">
                        <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>Active Users</div>
                            <div className="fw-bold fs-5 text-dark">{members.filter(m => m.status !== 'INACTIVE').length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="p-3 bg-white border rounded-3 shadow-xs d-flex align-items-center gap-3">
                        <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                            <Ban size={20} />
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>Suspended</div>
                            <div className="fw-bold fs-5 text-dark">{members.filter(m => m.status === 'INACTIVE').length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="p-3 bg-white border rounded-3 shadow-xs d-flex align-items-center gap-3">
                        <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                            <Mail size={20} />
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>Pending Invites</div>
                            <div className="fw-bold fs-5 text-dark">{invitations.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '400px' }}>
                    <div className="position-relative w-100">
                        <Search size={16} className="text-muted position-absolute" style={{ top: '10px', left: '12px' }} />
                        <input 
                            type="text" 
                            className="form-control ps-5" 
                            placeholder="Search staff by name, email, role or phone..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ fontSize: '13px', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <select 
                        className="form-select form-select-sm" 
                        value={filterRole} 
                        onChange={e => setFilterRole(e.target.value)}
                        style={{ fontSize: '13px', borderRadius: '8px', minWidth: '150px' }}
                    >
                        <option value="ALL">All Roles</option>
                        {availableRoles.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>

                    <button 
                        className="btn btn-sm btn-light border" 
                        onClick={fetchData} 
                        title="Refresh"
                        style={{ borderRadius: '8px' }}
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Active Members Table */}
            <div className="table-responsive border rounded-3 overflow-hidden bg-white mb-5 shadow-xs">
                <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '12px 16px' }}>Staff Member</th>
                            <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '12px 16px' }}>Designation / Role</th>
                            <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '12px 16px' }}>Phone</th>
                            <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '12px 16px' }}>Status</th>
                            <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '12px 16px' }}>Assigned Features</th>
                            <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && members.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">
                                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                    Loading team members...
                                </td>
                            </tr>
                        ) : filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">
                                    <Users size={36} className="d-block mx-auto mb-2 opacity-25" />
                                    No staff members found. Click <strong>"Create Staff User"</strong> to add your first employee.
                                </td>
                            </tr>
                        ) : filteredMembers.map(m => {
                            let parsedPerms = {};
                            try {
                                if (m.permissions) {
                                    parsedPerms = typeof m.permissions === 'string' ? JSON.parse(m.permissions) : m.permissions;
                                }
                            } catch(e) {}

                            const isActive = m.status !== 'INACTIVE';
                            const initials = (m.memberName || m.memberEmail || 'U').slice(0, 2).toUpperCase();

                            return (
                                <tr key={m.id} style={{ opacity: isActive ? 1 : 0.65 }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div 
                                                style={{ 
                                                    width: 38, 
                                                    height: 38, 
                                                    borderRadius: '50%', 
                                                    background: isActive ? 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)' : '#e2e8f0', 
                                                    color: isActive ? '#9a3412' : '#64748b',
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    fontWeight: 700, 
                                                    fontSize: '13px' 
                                                }}
                                            >
                                                {initials}
                                            </div>
                                            <div>
                                                <div className="fw-semibold text-dark" style={{ fontSize: '13.5px' }}>
                                                    {m.memberName || 'Unnamed Staff'}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>
                                                    {m.memberEmail}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span 
                                            className="badge text-dark border"
                                            style={{ 
                                                background: '#f1f5f9', 
                                                fontSize: '12px', 
                                                fontWeight: 600,
                                                padding: '4px 10px',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {m.roleTitle || 'Staff'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                        {m.phoneNumber || '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span 
                                            className={`badge ${isActive ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border'}`}
                                            style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', cursor: 'pointer' }}
                                            onClick={() => handleToggleStatus(m.id)}
                                            title="Click to toggle status"
                                        >
                                            ● {isActive ? 'Active' : 'Deactivated'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '340px' }}>
                                            {Object.keys(parsedPerms).length === 0 ? (
                                                <span className="text-muted" style={{ fontSize: '11px' }}>No modules assigned</span>
                                            ) : (
                                                Object.keys(parsedPerms).map(mod => {
                                                    const count = (parsedPerms[mod] || []).length;
                                                    if (count === 0) return null;
                                                    return (
                                                        <span 
                                                            key={mod} 
                                                            className="badge bg-light text-secondary border" 
                                                            style={{ fontSize: '11px', fontWeight: 500, padding: '3px 7px' }}
                                                        >
                                                            {mod}: {count}
                                                        </span>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <div className="d-inline-flex align-items-center gap-1">
                                            <button 
                                                className="btn btn-sm btn-light border text-primary" 
                                                onClick={() => openEditModal(m)}
                                                title="Edit Permissions & Details"
                                                style={{ borderRadius: '6px', padding: '5px 8px' }}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                className={`btn btn-sm border ${isActive ? 'btn-light text-warning' : 'btn-light text-success'}`}
                                                onClick={() => handleToggleStatus(m.id)}
                                                title={isActive ? 'Deactivate Account' : 'Activate Account'}
                                                style={{ borderRadius: '6px', padding: '5px 8px' }}
                                            >
                                                <Power size={14} />
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-light border text-danger" 
                                                onClick={() => handleRemoveMember(m.id, m.memberName)}
                                                title="Remove Staff"
                                                style={{ borderRadius: '6px', padding: '5px 8px' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pending Invitations Section */}
            {invitations.length > 0 && (
                <div className="mb-5">
                    <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}>
                        <Mail size={18} className="text-secondary" /> Pending Invitations ({invitations.length})
                    </h5>
                    <div className="table-responsive border rounded-3 overflow-hidden bg-white shadow-xs">
                        <table className="table table-hover align-middle mb-0">
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '10px 16px' }}>Invited Email</th>
                                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '10px 16px' }}>Status</th>
                                    <th style={{ fontSize: '12px', fontWeight: 600, color: '#475569', padding: '10px 16px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.map(inv => (
                                    <tr key={inv.id}>
                                        <td style={{ padding: '10px 16px', fontSize: '13px' }} className="fw-medium text-dark">{inv.inviteeEmail}</td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <span className="badge bg-warning-subtle text-warning border border-warning-subtle" style={{ fontSize: '11px', borderRadius: '10px' }}>
                                                Pending Acceptance
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                                            <button 
                                                className="btn btn-sm btn-light border text-primary me-2" 
                                                onClick={() => copyInviteLink(inv.token)}
                                                style={{ fontSize: '12px', borderRadius: '6px' }}
                                                title="Copy invite URL to clipboard"
                                            >
                                                <Copy size={13} className="me-1" /> Copy Link
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-light text-danger border" 
                                                onClick={() => handleCancelInvitation(inv.id)}
                                                style={{ fontSize: '12px', borderRadius: '6px' }}
                                            >
                                                Revoke
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════════
                CREATE STAFF MODAL
                ════════════════════════════════════════════════════════════════════ */}
            {showCreateModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div className="bg-white rounded-3 shadow-lg border" style={{ width: '100%', maxWidth: '780px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Modal Header */}
                        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{ background: '#f8fafc' }}>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserPlus size={18} />
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>Create New Staff / User</h5>
                                    <small className="text-muted">Directly create account with credentials and assign allowed features.</small>
                                </div>
                            </div>
                            <button className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCreateStaff} style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
                            {/* Staff Identity Details */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Full Name *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><User size={15} /></span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            required 
                                            placeholder="e.g. Ramesh Patil"
                                            value={createForm.fullName}
                                            onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })}
                                            style={{ fontSize: '13px' }}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Email Address (Login ID) *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><Mail size={15} /></span>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            required 
                                            placeholder="staff@yourstore.com"
                                            value={createForm.email}
                                            onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                                            style={{ fontSize: '13px' }}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Login Password *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><Key size={15} /></span>
                                        <input 
                                            type={showCreatePassword ? 'text' : 'password'} 
                                            className="form-control" 
                                            required 
                                            minLength={6}
                                            placeholder="Min. 6 characters"
                                            value={createForm.password}
                                            onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                                            style={{ fontSize: '13px' }}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowCreatePassword(!showCreatePassword)}
                                        >
                                            {showCreatePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Phone Number (Optional)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><Phone size={15} /></span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="+91 9876543210"
                                            value={createForm.phoneNumber}
                                            onChange={e => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                                            style={{ fontSize: '13px' }}
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Designation / Job Title *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><Briefcase size={15} /></span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="e.g. Cashier, Sales Manager, Accountant"
                                            value={createForm.roleTitle}
                                            onChange={e => setCreateForm({ ...createForm, roleTitle: e.target.value })}
                                            style={{ fontSize: '13px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Role Quick Presets */}
                            <div className="mb-4 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-semibold text-dark d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                                        <Sparkles size={14} className="text-warning" /> 1-Click Feature Presets
                                    </span>
                                    <div className="d-flex gap-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-xs btn-link text-decoration-none p-0" 
                                            style={{ fontSize: '12px' }}
                                            onClick={() => selectAllModules(setCreateForm)}
                                        >
                                            Select All
                                        </button>
                                        <span className="text-muted">|</span>
                                        <button 
                                            type="button" 
                                            className="btn btn-xs btn-link text-decoration-none p-0 text-secondary" 
                                            style={{ fontSize: '12px' }}
                                            onClick={() => clearAllModules(setCreateForm)}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {ROLE_PRESETS.map(preset => (
                                        <button 
                                            key={preset.title}
                                            type="button" 
                                            className="btn btn-sm btn-white border shadow-xs d-flex align-items-center gap-1.5"
                                            style={{ 
                                                fontSize: '12px', 
                                                borderRadius: '6px',
                                                borderColor: createForm.roleTitle === preset.title ? '#ea580c' : '#cbd5e1',
                                                background: createForm.roleTitle === preset.title ? '#fff7ed' : '#ffffff'
                                            }}
                                            onClick={() => applyPreset(setCreateForm, preset)}
                                        >
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: preset.badgeColor }}></span>
                                            <span className="fw-medium">{preset.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Permissions Matrix */}
                            <div className="mb-3">
                                <label className="form-label fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0f172a', fontSize: '14px' }}>
                                    <Shield size={16} className="text-primary" /> Feature &amp; Module Permissions
                                </label>

                                <div className="border rounded-3 overflow-hidden">
                                    {MODULES.map((mod, idx) => {
                                        const actions = mod.actions || DEFAULT_ACTIONS;
                                        const activeModPerms = createForm.permissions[mod.id] || [];
                                        const allSelected = actions.every(a => activeModPerms.includes(a));
                                        const ModIcon = mod.icon;

                                        return (
                                            <div 
                                                key={mod.id} 
                                                className={`p-3 ${idx < MODULES.length - 1 ? 'border-bottom' : ''}`}
                                                style={{ background: activeModPerms.length > 0 ? '#fafafa' : '#ffffff' }}
                                            >
                                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div style={{ width: 28, height: 28, borderRadius: '6px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                                                            <ModIcon size={15} />
                                                        </div>
                                                        <div>
                                                            <span className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{mod.name}</span>
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>{mod.desc}</div>
                                                        </div>
                                                    </div>

                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-link text-decoration-none p-0"
                                                        style={{ fontSize: '11px', color: allSelected ? '#ea580c' : '#64748b' }}
                                                        onClick={() => toggleAllForModule(createForm, setCreateForm, mod.id, actions)}
                                                    >
                                                        {allSelected ? 'Deselect Module' : 'Select Module'}
                                                    </button>
                                                </div>

                                                <div className="d-flex flex-wrap gap-2 pt-1 ps-4">
                                                    {actions.map(action => {
                                                        const isChecked = activeModPerms.includes(action);
                                                        return (
                                                            <label 
                                                                key={action} 
                                                                className={`btn btn-sm border d-flex align-items-center gap-1.5`}
                                                                style={{ 
                                                                    fontSize: '11.5px', 
                                                                    padding: '3px 10px', 
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    background: isChecked ? '#ea580c' : '#f8fafc',
                                                                    borderColor: isChecked ? '#ea580c' : '#e2e8f0',
                                                                    color: isChecked ? '#ffffff' : '#475569'
                                                                }}
                                                            >
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="d-none"
                                                                    checked={isChecked}
                                                                    onChange={() => togglePermission(createForm, setCreateForm, mod.id, action)}
                                                                />
                                                                {isChecked && <Check size={12} />}
                                                                <span>{action}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                <button 
                                    type="button" 
                                    className="btn btn-light border px-4" 
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn text-white px-4 shadow-sm" 
                                    style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', border: 'none', fontWeight: 600 }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Creating User...' : 'Create Staff User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════════
                EDIT STAFF MODAL
                ════════════════════════════════════════════════════════════════════ */}
            {showEditModal && editingMember && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div className="bg-white rounded-3 shadow-lg border" style={{ width: '100%', maxWidth: '780px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Modal Header */}
                        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{ background: '#f8fafc' }}>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Edit2 size={18} />
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>Edit Staff: {editingMember.memberName || editingMember.memberEmail}</h5>
                                    <small className="text-muted">Modify role, reset password, update feature access or deactivate user.</small>
                                </div>
                            </div>
                            <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdateStaff} style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editForm.fullName}
                                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                        style={{ fontSize: '13px' }}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Designation / Role Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editForm.roleTitle}
                                        onChange={e => setEditForm({ ...editForm, roleTitle: e.target.value })}
                                        style={{ fontSize: '13px' }}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editForm.phoneNumber}
                                        onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                        style={{ fontSize: '13px' }}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Account Status</label>
                                    <select 
                                        className="form-select" 
                                        value={editForm.status}
                                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                        style={{ fontSize: '13px' }}
                                    >
                                        <option value="ACTIVE">ACTIVE (Access Allowed)</option>
                                        <option value="INACTIVE">INACTIVE (Access Suspended)</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                                        Reset Login Password <span className="text-muted fw-normal">(Leave blank to keep current)</span>
                                    </label>
                                    <div className="input-group">
                                        <input 
                                            type={showEditPassword ? 'text' : 'password'} 
                                            className="form-control" 
                                            placeholder="Enter new password to reset"
                                            value={editForm.password}
                                            onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                            style={{ fontSize: '13px' }}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowEditPassword(!showEditPassword)}
                                        >
                                            {showEditPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Presets */}
                            <div className="mb-4 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-semibold text-dark d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                                        <Sparkles size={14} className="text-warning" /> Quick Presets
                                    </span>
                                    <div className="d-flex gap-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-xs btn-link text-decoration-none p-0" 
                                            style={{ fontSize: '12px' }}
                                            onClick={() => selectAllModules(setEditForm)}
                                        >
                                            Select All
                                        </button>
                                        <span className="text-muted">|</span>
                                        <button 
                                            type="button" 
                                            className="btn btn-xs btn-link text-decoration-none p-0 text-secondary" 
                                            style={{ fontSize: '12px' }}
                                            onClick={() => clearAllModules(setEditForm)}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {ROLE_PRESETS.map(preset => (
                                        <button 
                                            key={preset.title}
                                            type="button" 
                                            className="btn btn-sm btn-white border shadow-xs d-flex align-items-center gap-1.5"
                                            style={{ 
                                                fontSize: '12px', 
                                                borderRadius: '6px',
                                                borderColor: editForm.roleTitle === preset.title ? '#6366f1' : '#cbd5e1',
                                                background: editForm.roleTitle === preset.title ? '#eef2ff' : '#ffffff'
                                            }}
                                            onClick={() => applyPreset(setEditForm, preset)}
                                        >
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: preset.badgeColor }}></span>
                                            <span className="fw-medium">{preset.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Permissions Matrix */}
                            <div className="mb-3">
                                <label className="form-label fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0f172a', fontSize: '14px' }}>
                                    <Shield size={16} className="text-primary" /> Feature &amp; Module Permissions
                                </label>

                                <div className="border rounded-3 overflow-hidden">
                                    {MODULES.map((mod, idx) => {
                                        const actions = mod.actions || DEFAULT_ACTIONS;
                                        const activeModPerms = editForm.permissions[mod.id] || [];
                                        const allSelected = actions.every(a => activeModPerms.includes(a));
                                        const ModIcon = mod.icon;

                                        return (
                                            <div 
                                                key={mod.id} 
                                                className={`p-3 ${idx < MODULES.length - 1 ? 'border-bottom' : ''}`}
                                                style={{ background: activeModPerms.length > 0 ? '#fafafa' : '#ffffff' }}
                                            >
                                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div style={{ width: 28, height: 28, borderRadius: '6px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                                                            <ModIcon size={15} />
                                                        </div>
                                                        <div>
                                                            <span className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{mod.name}</span>
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>{mod.desc}</div>
                                                        </div>
                                                    </div>

                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-link text-decoration-none p-0"
                                                        style={{ fontSize: '11px', color: allSelected ? '#6366f1' : '#64748b' }}
                                                        onClick={() => toggleAllForModule(editForm, setEditForm, mod.id, actions)}
                                                    >
                                                        {allSelected ? 'Deselect Module' : 'Select Module'}
                                                    </button>
                                                </div>

                                                <div className="d-flex flex-wrap gap-2 pt-1 ps-4">
                                                    {actions.map(action => {
                                                        const isChecked = activeModPerms.includes(action);
                                                        return (
                                                            <label 
                                                                key={action} 
                                                                className={`btn btn-sm border d-flex align-items-center gap-1.5`}
                                                                style={{ 
                                                                    fontSize: '11.5px', 
                                                                    padding: '3px 10px', 
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    background: isChecked ? '#6366f1' : '#f8fafc',
                                                                    borderColor: isChecked ? '#6366f1' : '#e2e8f0',
                                                                    color: isChecked ? '#ffffff' : '#475569'
                                                                }}
                                                            >
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="d-none"
                                                                    checked={isChecked}
                                                                    onChange={() => togglePermission(editForm, setEditForm, mod.id, action)}
                                                                />
                                                                {isChecked && <Check size={12} />}
                                                                <span>{action}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                <button 
                                    type="button" 
                                    className="btn btn-light border px-4" 
                                    onClick={() => setShowEditModal(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary px-4 shadow-sm" 
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════════
                INVITE VIA LINK MODAL
                ════════════════════════════════════════════════════════════════════ */}
            {showInviteModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div className="bg-white rounded-3 shadow-lg border" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{ background: '#f8fafc' }}>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold">Invite Existing User</h5>
                                    <small className="text-muted">Send invitation link to an email to join your workspace.</small>
                                </div>
                            </div>
                            <button className="btn-close" onClick={() => setShowInviteModal(false)}></button>
                        </div>

                        <form onSubmit={handleInvite} style={{ padding: '24px' }}>
                            <div className="mb-4">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>User Email Address *</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    required 
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    style={{ fontSize: '13px' }}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold mb-2" style={{ fontSize: '13px' }}>Select Permissions</label>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {ROLE_PRESETS.map(preset => (
                                        <button 
                                            key={preset.title}
                                            type="button" 
                                            className="btn btn-sm btn-light border"
                                            style={{ fontSize: '11px', borderRadius: '6px' }}
                                            onClick={() => setInvitePermissions(preset.permissions)}
                                        >
                                            {preset.title}
                                        </button>
                                    ))}
                                </div>

                                <div className="border rounded-2 p-2 bg-light" style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '12px' }}>
                                    {MODULES.map(m => {
                                        const count = (invitePermissions[m.id] || []).length;
                                        return (
                                            <div key={m.id} className="d-flex justify-content-between py-1 border-bottom">
                                                <span>{m.name}</span>
                                                <span className="badge bg-secondary-subtle text-dark">{count} actions</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                                <button type="button" className="btn btn-light border" onClick={() => setShowInviteModal(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Sending...' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
