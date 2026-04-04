import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    TrendingUp,
    Activity,
    DollarSign,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Calendar,
    Download,
    RefreshCw,
    FileText,
    Mail,
    CheckCircle
} from 'lucide-react';

// Mock data for the admin dashboard
const statsData = [
    { id: 1, label: 'Total Users', value: '12,345', change: '+12%', trend: 'up', icon: Users, color: 'primary' },
    { id: 2, label: 'Active Sessions', value: '1,234', change: '+5%', trend: 'up', icon: Activity, color: 'success' },
    { id: 3, label: 'Revenue', value: '$45,678', change: '-3%', trend: 'down', icon: DollarSign, color: 'warning' },
    { id: 4, label: 'Growth Rate', value: '23.5%', change: '+8%', trend: 'up', icon: TrendingUp, color: 'danger' },
];

const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joined: '2 min ago', avatar: 'john' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joined: '15 min ago', avatar: 'jane' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'pending', joined: '1 hour ago', avatar: 'bob' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'inactive', joined: '3 hours ago', avatar: 'alice' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', status: 'active', joined: '5 hours ago', avatar: 'charlie' },
];

const recentActivity = [
    { id: 1, action: 'New user registration', user: 'john@example.com', time: '2 min ago', type: 'user', icon: Users },
    { id: 2, action: 'Settings updated', user: 'admin@example.com', time: '15 min ago', type: 'settings', icon: CheckCircle },
    { id: 3, action: 'Payment received', user: 'jane@example.com', time: '1 hour ago', type: 'payment', icon: DollarSign },
    { id: 4, action: 'Role changed', user: 'bob@example.com', time: '2 hours ago', type: 'role', icon: Users },
    { id: 5, action: 'Content published', user: 'alice@example.com', time: '3 hours ago', type: 'content', icon: FileText },
];

export default function AdminDashboard() {
    const { user } = useAuth();
    const [timeRange, setTimeRange] = useState('7d');

    const name = user?.identifier?.split('@')[0] || 'Admin';

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Dashboard Overview</h1>
                    <p className="text-muted mb-0">
                        Welcome back, {name}. Here's what's happening today.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }}
                    >
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                    <button className="btn btn-light d-flex align-items-center gap-2 border">
                        <Download size={16} />
                        <span className="d-none d-sm-inline">Export</span>
                    </button>
                    <button className="btn btn-light border p-2">
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-4 mb-4">
                {statsData.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.id} className="col-12 col-sm-6 col-xl-3">
                            <div className="stat-card">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className={`stat-card-icon ${stat.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className={`stat-card-change ${stat.trend === 'up' ? 'positive' : 'negative'}`}>
                                        {stat.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="stat-card-value">{stat.value}</p>
                                <p className="stat-card-label">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="row g-4 mb-4">
                {/* Chart Section */}
                <div className="col-12 col-lg-8">
                    <div className="content-card">
                        <div className="content-card-header">
                            <h5 className="content-card-title mb-0">Activity Overview</h5>
                            <button className="btn btn-link text-muted p-1">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                        <div className="content-card-body">
                            <div className="chart-container d-flex align-items-end justify-content-between gap-2">
                                {[65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95, 70].map((height, i) => (
                                    <div key={i} className="flex-fill d-flex flex-column align-items-center gap-2">
                                        <div
                                            className="chart-bar w-100"
                                            style={{ height: `${height}%`, minHeight: '20px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-between mt-3 text-muted small">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                                    <span key={month} className="flex-fill text-center">{month}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-12 col-lg-4">
                    <div className="content-card h-100">
                        <div className="content-card-header">
                            <h5 className="content-card-title mb-0">Recent Activity</h5>
                            <button className="btn btn-link text-decoration-none fw-semibold">View all</button>
                        </div>
                        <div className="content-card-body">
                            <div className="activity-list">
                                {recentActivity.map((activity) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={activity.id} className="activity-item">
                                            <div className={`activity-icon bg-${
                                                activity.type === 'user' ? 'primary' :
                                                activity.type === 'settings' ? 'secondary' :
                                                activity.type === 'payment' ? 'success' :
                                                activity.type === 'role' ? 'info' :
                                                'warning'
                                            } bg-opacity-10`}>
                                                <Icon size={18} className={`text-${
                                                    activity.type === 'user' ? 'primary' :
                                                    activity.type === 'settings' ? 'secondary' :
                                                    activity.type === 'payment' ? 'success' :
                                                    activity.type === 'role' ? 'info' :
                                                    'warning'
                                                }`} />
                                            </div>
                                            <div className="activity-content">
                                                <p className="activity-title mb-1">{activity.action}</p>
                                                <p className="activity-desc mb-1">{activity.user}</p>
                                                <span className="activity-time">{activity.time}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className="content-card">
                <div className="content-card-header">
                    <h5 className="content-card-title mb-0">Recent Users</h5>
                    <button className="btn btn-link text-decoration-none fw-semibold">View all</button>
                </div>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Status</th>
                                <th className="d-none d-md-table-cell">Joined</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
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
                                        <span className={`badge-custom ${user.status}`}>
                                            <span className={`d-inline-block rounded-circle me-1`} style={{width: '6px', height: '6px', background: user.status === 'active' ? '#10b981' : user.status === 'pending' ? '#f59e0b' : '#6b7280'}} ></span>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="d-none d-md-table-cell">
                                        <div className="d-flex align-items-center gap-1 text-muted">
                                            <Calendar size={14} />
                                            {user.joined}
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        <button className="btn btn-link text-muted p-1">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
