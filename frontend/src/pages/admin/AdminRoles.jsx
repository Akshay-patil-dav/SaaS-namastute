import React, { useState } from 'react';
import {
    Shield,
    Plus,
    Search,
    Edit3,
    Trash2,
    Users,
    Check,
    X,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';

const roles = [
    {
        id: 1,
        name: 'Super Admin',
        description: 'Full access to all features and settings',
        users: 2,
        color: 'danger',
        permissions: ['all']
    },
    {
        id: 2,
        name: 'Admin',
        description: 'Manage users and content, limited settings access',
        users: 8,
        color: 'primary',
        permissions: ['users.read', 'users.write', 'content.read', 'content.write', 'analytics.read']
    },
    {
        id: 3,
        name: 'Editor',
        description: 'Create and edit content, view analytics',
        users: 24,
        color: 'info',
        permissions: ['content.read', 'content.write', 'analytics.read']
    },
    {
        id: 4,
        name: 'User',
        description: 'Standard user with limited access',
        users: 1200,
        color: 'secondary',
        permissions: ['content.read']
    },
];

const permissionsList = [
    { id: 'users.read', label: 'View Users', category: 'Users' },
    { id: 'users.write', label: 'Manage Users', category: 'Users' },
    { id: 'users.delete', label: 'Delete Users', category: 'Users' },
    { id: 'content.read', label: 'View Content', category: 'Content' },
    { id: 'content.write', label: 'Manage Content', category: 'Content' },
    { id: 'content.delete', label: 'Delete Content', category: 'Content' },
    { id: 'analytics.read', label: 'View Analytics', category: 'Analytics' },
    { id: 'settings.read', label: 'View Settings', category: 'Settings' },
    { id: 'settings.write', label: 'Manage Settings', category: 'Settings' },
    { id: 'roles.read', label: 'View Roles', category: 'Roles' },
    { id: 'roles.write', label: 'Manage Roles', category: 'Roles' },
];

export default function AdminRoles() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Roles & Permissions</h1>
                    <p className="text-muted mb-0">Manage user roles and access control</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-primary d-flex align-items-center gap-2">
                    <Plus size={18} />
                    Create Role
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                {[
                    { label: 'Total Roles', value: roles.length, icon: Shield, color: 'primary' },
                    { label: 'Total Users', value: '1,234', icon: Users, color: 'success' },
                    { label: 'Active Admins', value: '10', icon: ShieldCheck, color: 'warning' },
                    { label: 'Permissions', value: permissionsList.length, icon: Check, color: 'info' },
                ].map((stat) => (
                    <div key={stat.label} className="col-6 col-xl-3">
                        <div className="stat-card">
                            <div className="d-flex align-items-center gap-3">
                                <div className={`stat-card-icon ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="stat-card-value mb-0">{stat.value}</p>
                                    <p className="stat-card-label mb-0">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Roles List */}
                <div className="col-12 col-lg-4">
                    <div className="content-card">
                        <div className="p-3 border-bottom">
                            <div className="search-box">
                                <Search className="search-box-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search roles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-control form-control-custom ps-5"
                                />
                            </div>
                        </div>

                        <div className="list-group list-group-flush">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role)}
                                    className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 ${
                                        selectedRole?.id === role.id ? 'active' : ''
                                    }`}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`badge bg-${role.color} bg-opacity-10 text-${role.color}`}>
                                            {role.name}
                                        </div>
                                        <span className="text-muted small">{role.users} users</span>
                                    </div>
                                    <ChevronRight size={16} className="text-muted" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Role Details */}
                <div className="col-12 col-lg-8">
                    {selectedRole ? (
                        <div className="content-card">
                            <div className="content-card-header">
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <h4 className="fw-bold mb-0">{selectedRole.name}</h4>
                                        <span className={`badge bg-${selectedRole.color}`}>
                                            {selectedRole.users} users
                                        </span>
                                    </div>
                                    <p className="text-muted mb-0">{selectedRole.description}</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-light p-2">
                                        <Edit3 size={18} className="text-secondary" />
                                    </button>
                                    {selectedRole.name !== 'Super Admin' && (
                                        <button className="btn btn-light p-2">
                                            <Trash2 size={18} className="text-danger" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="content-card-body">
                                <h6 className="fw-bold text-uppercase small text-muted mb-3">Permissions</h6>

                                {selectedRole.permissions.includes('all') ? (
                                    <div className="alert alert-success d-flex align-items-center gap-2">
                                        <ShieldCheck size={20} />
                                        <div>
                                            <p className="fw-bold mb-0">Full Access</p>
                                            <p className="small mb-0">This role has unrestricted access to all features</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="vstack gap-4">
                                        {['Users', 'Content', 'Analytics', 'Settings', 'Roles'].map((category) => {
                                            const categoryPerms = permissionsList.filter(p => p.category === category);
                                            return (
                                                <div key={category}>
                                                    <h6 className="fw-semibold mb-2">{category}</h6>
                                                    <div className="row g-2">
                                                        {categoryPerms.map((perm) => (
                                                            <div key={perm.id} className="col-12 col-md-6">
                                                                <label className={`d-flex align-items-center gap-2 p-2 rounded border ${
                                                                    selectedRole.permissions.includes(perm.id)
                                                                        ? 'bg-primary bg-opacity-10 border-primary'
                                                                        : 'bg-light'
                                                                }`}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedRole.permissions.includes(perm.id)}
                                                                        className="form-check-input"
                                                                        readOnly
                                                                    />
                                                                    <span className="small">{perm.label}</span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="content-card h-100 d-flex flex-column align-items-center justify-content-center p-5 text-center">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                <Shield size={32} className="text-secondary" />
                            </div>
                            <h5 className="fw-semibold">Select a Role</h5>
                            <p className="text-muted">Choose a role from the list to view and manage its permissions</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Role Modal */}
            {showCreateModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Create New Role</h5>
                                <button onClick={() => setShowCreateModal(false)} className="btn-close" />
                            </div>
                            <div className="modal-body">
                                <div className="vstack gap-3">
                                    <div>
                                        <label className="form-label fw-semibold">Role Name</label>
                                        <input type="text" placeholder="e.g., Content Manager" className="form-control" />
                                    </div>
                                    <div>
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea rows="3" placeholder="Describe the role's responsibilities..." className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button onClick={() => setShowCreateModal(false)} className="btn btn-light">Cancel</button>
                                <button onClick={() => setShowCreateModal(false)} className="btn btn-primary">Create Role</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
