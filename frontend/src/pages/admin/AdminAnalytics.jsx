import React, { useState } from 'react';
import {
    TrendingUp,
    Users,
    Clock,
    MousePointer,
    Calendar,
    Download,
    ChevronDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

const timeRanges = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'This year'];

const analyticsCards = [
    { label: 'Total Page Views', value: '234.5K', change: '+12.5%', trend: 'up', icon: MousePointer, color: 'primary' },
    { label: 'Unique Visitors', value: '45.2K', change: '+8.2%', trend: 'up', icon: Users, color: 'success' },
    { label: 'Avg. Session', value: '4m 32s', change: '+5.1%', trend: 'up', icon: Clock, color: 'warning' },
    { label: 'Bounce Rate', value: '32.8%', change: '-2.3%', trend: 'down', icon: TrendingUp, color: 'danger' },
];

const topPages = [
    { path: '/dashboard', views: '45.2K', visitors: '12.3K', trend: '+12%' },
    { path: '/profile', views: '32.1K', visitors: '8.7K', trend: '+8%' },
    { path: '/settings', views: '28.4K', visitors: '7.2K', trend: '-3%' },
    { path: '/admin', views: '15.6K', visitors: '2.1K', trend: '+15%' },
    { path: '/help', views: '12.3K', visitors: '5.4K', trend: '+5%' },
];

const trafficSources = [
    { source: 'Direct', percentage: 45, color: 'bg-primary' },
    { source: 'Organic Search', percentage: 30, color: 'bg-success' },
    { source: 'Referral', percentage: 15, color: 'bg-warning' },
    { source: 'Social Media', percentage: 10, color: 'bg-danger' },
];

export default function AdminAnalytics() {
    const [timeRange, setTimeRange] = useState('Last 7 days');

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Analytics</h1>
                    <p className="text-muted mb-0">Track user engagement and platform performance</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="dropdown">
                        <button className="btn btn-light border dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                            {timeRange}
                            <ChevronDown size={16} />
                        </button>
                        <ul className="dropdown-menu">
                            {timeRanges.map(range => (
                                <li key={range}>
                                    <button className="dropdown-item" onClick={() => setTimeRange(range)}>{range}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="btn btn-primary d-flex align-items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-4 mb-4">
                {analyticsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="col-6 col-xl-3">
                            <div className="stat-card">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className={`stat-card-icon ${card.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className={`d-inline-flex align-items-center gap-1 small fw-semibold ${
                                        card.trend === 'up' ? 'text-success' : 'text-danger'
                                    }`}>
                                        {card.change}
                                    </span>
                                </div>
                                <p className="stat-card-value mb-1">{card.value}</p>
                                <p className="stat-card-label mb-0">{card.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="row g-4 mb-4">
                {/* Traffic Overview */}
                <div className="col-12 col-lg-8">
                    <div className="content-card">
                        <div className="content-card-header">
                            <h5 className="content-card-title mb-0">Traffic Overview</h5>
                            <div className="d-flex gap-3 small">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle bg-primary" style={{width: '8px', height: '8px'}} />
                                    <span className="text-muted">Page Views</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle bg-success" style={{width: '8px', height: '8px'}} />
                                    <span className="text-muted">Visitors</span>
                                </div>
                            </div>
                        </div>

                        <div className="content-card-body">
                            <div className="chart-container">
                                <div className="h-100 d-flex align-items-end justify-content-between gap-2">
                                    {[65, 45, 80, 55, 70, 90, 60].map((height, i) => (
                                        <div key={i} className="flex-fill d-flex flex-column align-items-center gap-2">
                                            <div
                                                className="chart-bar w-100"
                                                style={{ height: `${height}%`, minHeight: '30px' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3 text-muted small">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <span key={day} className="flex-fill text-center">{day}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="col-12 col-lg-4">
                    <div className="content-card h-100">
                        <div className="content-card-header">
                            <h5 className="content-card-title mb-0">Traffic Sources</h5>
                        </div>

                        <div className="content-card-body">
                            <div className="vstack gap-3 mb-4">
                                {trafficSources.map((source) => (
                                    <div key={source.source}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="small fw-medium">{source.source}</span>
                                            <span className="small fw-bold">{source.percentage}%</span>
                                        </div>
                                        <div className="progress-custom">
                                            <div
                                                className={`progress-custom-bar ${source.color}`}
                                                style={{ width: `${source.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-top pt-3">
                                <div className="row text-center">
                                    <div className="col-6">
                                        <p className="h4 fw-bold mb-1">68%</p>
                                        <p className="text-muted small">Desktop</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="h4 fw-bold mb-1">32%</p>
                                        <p className="text-muted small">Mobile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Pages Table */}
            <div className="content-card">
                <div className="content-card-header">
                    <h5 className="content-card-title mb-0">Top Pages</h5>
                    <button className="btn btn-link text-decoration-none fw-semibold">View all</button>
                </div>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Page</th>
                                <th className="text-end">Page Views</th>
                                <th className="text-end">Unique Visitors</th>
                                <th className="text-end">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topPages.map((page) => (
                                <tr key={page.path}>
                                    <td>
                                        <span className="fw-medium">{page.path}</span>
                                    </td>
                                    <td className="text-end">
                                        <span className="fw-semibold">{page.views}</span>
                                    </td>
                                    <td className="text-end">
                                        <span className="text-muted">{page.visitors}</span>
                                    </td>
                                    <td className="text-end">
                                        <span className={`d-inline-flex align-items-center gap-1 small fw-semibold ${
                                            page.trend.startsWith('+') ? 'text-success' : 'text-danger'
                                        }`}>
                                            {page.trend.startsWith('+') ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                            {page.trend}
                                        </span>
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
