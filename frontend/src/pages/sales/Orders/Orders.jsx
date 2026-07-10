import React, { useState } from 'react';
import { 
    Package, 
    ChevronDown, 
    Calendar, 
    Search, 
    Columns,
    ArrowDown,
    ArrowUpDown
} from 'lucide-react';
import './orders.css';

const MOCK_ORDERS = [
    {
        id: '#1002101',
        date: 'Mar 16 at 2:39 pm',
        customer: 'Akshay Patil',
        fulfillBy: '',
        channel: 'Online Store',
        total: '₹138.38',
        paymentStatus: 'Paid',
        fulfillmentStatus: 'Fulfilled',
        items: '1 item',
        deliveryStatus: 'Delivered',
        deliveryMethod: 'Local delivery',
        tags: ''
    },
    {
        id: '#1001101',
        date: 'Mar 5 at 6:47 pm',
        customer: 'Rahul Mane',
        fulfillBy: '',
        channel: 'Online Store',
        total: '₹140.63',
        paymentStatus: 'Paid',
        fulfillmentStatus: 'Fulfilled',
        items: '1 item',
        deliveryStatus: 'Delivered',
        deliveryMethod: 'Local delivery',
        tags: ''
    }
];

export default function Orders() {
    const [orders] = useState(MOCK_ORDERS);
    const [selectedRows, setSelectedRows] = useState([]);

    const toggleRow = id =>
        setSelectedRows(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id]);
    const toggleAll = () =>
        setSelectedRows(p => p.length === orders.length ? [] : orders.map(r => r.id));

    const renderStatusBadge = (status) => {
        let styleClass = 'shop-badge-default';
        if (status === 'Paid' || status === 'Fulfilled' || status === 'Delivered') {
            styleClass = 'shop-badge-success';
        }
        return (
            <span className={`shop-badge ${styleClass}`}>
                <span className="shop-badge-dot"></span>
                {status}
            </span>
        );
    };

    return (
        <div className="shopify-orders-container">
            {/* Header */}
            <div className="shop-header">
                <div className="shop-header-title">
                    <Package size={24} strokeWidth={1.5} />
                    <h1>Orders</h1>
                </div>
                <div className="shop-header-actions">
                    <button className="shop-btn shop-btn-secondary">Export</button>
                    <button className="shop-btn shop-btn-secondary">
                        More actions <ChevronDown size={14} />
                    </button>
                    <button className="shop-btn shop-btn-primary">Create order</button>
                </div>
            </div>

            {/* KPI Bar */}
            <div className="shop-kpi-card">
                <div className="shop-kpi-left">
                    <Calendar size={14} className="shop-kpi-icon" />
                    <span>Today</span>
                </div>
                <div className="shop-kpi-metrics">
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Orders</div>
                        <div className="kpi-value">
                            0 <span className="kpi-dash">—</span>
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Items ordered</div>
                        <div className="kpi-value">
                            0 <span className="kpi-dash">—</span>
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Returns</div>
                        <div className="kpi-value">
                            ₹0 <span className="kpi-dash">—</span>
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Orders fulfilled</div>
                        <div className="kpi-value">
                            0 <span className="kpi-dash">—</span>
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Orders delivered</div>
                        <div className="kpi-value">
                            0 <span className="kpi-dash">—</span>
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-flat"></div>
                    </div>
                    <div className="shop-kpi-item">
                        <div className="kpi-label">Order to fulfillment time</div>
                        <div className="kpi-value empty-space">
                            &nbsp;
                        </div>
                        <div className="kpi-sparkline kpi-sparkline-time"></div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="shop-table-card">
                {/* Search & Filter Bar */}
                <div className="shop-table-toolbar">
                    <div className="shop-tabs">
                        <button className="shop-tab active">
                            All <ArrowUpDown size={12} className="shop-tab-icon" />
                        </button>
                    </div>
                    <div className="shop-search-wrapper">
                        <Search size={16} className="shop-search-icon" />
                        <input 
                            type="text" 
                            className="shop-search-input" 
                            placeholder="Search and filter" 
                        />
                    </div>
                    <div className="shop-toolbar-actions">
                        <button className="shop-btn-icon" title="Columns">
                            <Columns size={16} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="shop-table-wrapper">
                    <table className="shop-table">
                        <thead>
                            <tr>
                                <th className="shop-col-cb">
                                    <input 
                                        type="checkbox" 
                                        className="shop-checkbox" 
                                        checked={orders.length > 0 && selectedRows.length === orders.length}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>Order</th>
                                <th>
                                    Date <ArrowDown size={12} className="sort-icon active" />
                                </th>
                                <th>Customer</th>
                                <th>Fulfill by</th>
                                <th>Channel</th>
                                <th className="text-right">Total</th>
                                <th>Payment status</th>
                                <th>Fulfillment status</th>
                                <th>Items</th>
                                <th>Delivery status</th>
                                <th>Delivery method</th>
                                <th>Tags</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className={selectedRows.includes(order.id) ? 'selected-row' : ''}>
                                    <td className="shop-col-cb">
                                        <input 
                                            type="checkbox" 
                                            className="shop-checkbox"
                                            checked={selectedRows.includes(order.id)}
                                            onChange={() => toggleRow(order.id)}
                                        />
                                    </td>
                                    <td className="font-semibold text-gray-900">{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.fulfillBy}</td>
                                    <td>{order.channel}</td>
                                    <td className="text-right">{order.total}</td>
                                    <td>{renderStatusBadge(order.paymentStatus)}</td>
                                    <td>{renderStatusBadge(order.fulfillmentStatus)}</td>
                                    <td>{order.items}</td>
                                    <td>{renderStatusBadge(order.deliveryStatus)}</td>
                                    <td>{order.deliveryMethod}</td>
                                    <td>{order.tags}</td>
                                </tr>
                            ))}
                            {orders.length > 0 && (
                                <tr>
                                    <td colSpan="13" className="shop-table-footer-text">
                                        Learn more about orders
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
