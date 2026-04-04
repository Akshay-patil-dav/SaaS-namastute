import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    UserX,
    Mail,
    Shield,
    Edit3,
    Trash2
} from 'lucide-react';

const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastActive: '2 min ago', joined: 'Jan 15, 2024' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', lastActive: '15 min ago', joined: 'Jan 14, 2024' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'pending', lastActive: 'Never', joined: 'Jan 13, 2024' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'inactive', lastActive: '2 days ago', joined: 'Jan 10, 2024' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', status: 'active', lastActive: '5 hours ago', joined: 'Jan 8, 2024' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'User', status: 'active', lastActive: '1 day ago', joined: 'Jan 5, 2024' },
    { id: 7, name: 'Eve Adams', email: 'eve@example.com', role: 'User', status: 'suspended', lastActive: '1 week ago', joined: 'Dec 28, 2023' },
];

const statusFilters = ['All', 'Active', 'Pending', 'Inactive', 'Suspended'];
const roleFilters = ['All', 'Admin', 'Editor', 'User'];

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus.toLowerCase();
        const matchesRole = selectedRole === 'All' || user.role === selectedRole;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };

    const toggleSelectUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
        );
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">User Management</h1>
                    <p className="text-muted mb-0">Manage user accounts, roles, and permissions</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2">
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                {[
                    { label: 'Total Users', value: '1,234', icon: UserCheck, color: 'primary' },
                    { label: 'Active Users', value: '1,089', icon: UserCheck, color: 'success' },
                    { label: 'Pending', value: '45', icon: Mail, color: 'warning' },
                    { label: 'Admins', value: '12', icon: Shield, color: 'danger' },
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

            {/* Filters */}
            <div className="content-card mb-4">
                <div className="content-card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="search-box">
                                <Search className="search-box-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-control form-control-custom ps-5"
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="d-flex gap-2">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="form-select"
                                >
                                    {statusFilters.map(status => (
                                        <option key={status} value={status}>Status: {status}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="form-select"
                                >
                                    {roleFilters.map(role => (
                                        <option key={role} value={role}>Role: {role}</option>
                                    ))}
                                </select>

                                <button className="btn btn-light border">
                                    <Filter size={18} className="text-secondary" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedUsers.length > 0 && (
                        <div className="d-flex align-items-center gap-3 pt-3 mt-3 border-top">
                            <span className="text-muted">{selectedUsers.length} selected</span>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-success">Activate</button>
                                <button className="btn btn-sm btn-warning">Deactivate</button>
                                <button className="btn btn-sm btn-danger">Delete</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="content-card">
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="form-check-input"
                                    />
                                </th>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th className="d-none d-md-table-cell">Last Active</th>
                                <th className="d-none d-lg-table-cell">Joined</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleSelectUser(user.id)}
                                            className="form-check-input"
                                        />
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                                alt={user.name}
                                                className="rounded-circle"
                                                width="40"
                                                height="40"
                                            />
                                            <div>
                                                <p className="fw-semibold mb-0">{user.name}</p>
                                                <p className="text-muted small mb-0">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge-custom ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge-custom ${user.status}`}>
                                            <span className="d-inline-block rounded-circle me-1" style={{width: '6px', height: '6px', background: user.status === 'active' ? '#10b981' : user.status === 'pending' ? '#f59e0b' : user.status === 'suspended' ? '#ef4444' : '#6b7280'}} ></span>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="d-none d-md-table-cell">
                                        <span className="text-muted">{user.lastActive}</span>
                                    </td>
                                    <td className="d-none d-lg-table-cell">
                                        <span className="text-muted">{user.joined}</span>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-1">
                                            <button className="btn btn-light btn-sm p-1" title="Edit">
                                                <Edit3 size={16} className="text-primary" />
                                            </button>
                                            <button className="btn btn-light btn-sm p-1" title="Suspend">
                                                <UserX size={16} className="text-warning" />
                                            </button>
                                            <button className="btn btn-light btn-sm p-1">
                                                <MoreHorizontal size={16} className="text-secondary" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <p className="text-muted mb-0 small">
                        Showing {filteredUsers.length} of {mockUsers.length} users
                    </p>
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="btn btn-light border btn-sm"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="d-flex align-items-center px-3 text-muted small">Page {currentPage} of 5</span>
                        <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="btn btn-light border btn-sm"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
