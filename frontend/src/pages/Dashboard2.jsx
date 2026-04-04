import React from 'react';
import { 
    ShoppingBag, DollarSign, ArrowDown, ArrowUp, 
    User, UserCheck, Receipt, FileText, 
    Edit, Trash2 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer 
} from 'recharts';
import './Dashboard2.css';

const chartData = [
  { name: 'Jan', sales: 130, purchase: -150 },
  { name: 'Feb', sales: 210, purchase: -90 },
  { name: 'Mar', sales: 300, purchase: -50 },
  { name: 'Apr', sales: 290, purchase: -180 },
  { name: 'May', sales: 150, purchase: -50 },
  { name: 'Jun', sales: 50, purchase: -70 },
  { name: 'Jul', sales: 210, purchase: -100 },
  { name: 'Aug', sales: 280, purchase: -90 },
  { name: 'Sep', sales: 100, purchase: -100 },
];

const recentProducts = [
    { id: 1, name: 'Lenovo 3rd Generation', price: '$12500', color: 'bg-primary' },
    { id: 2, name: 'Bold V3.2', price: '$1600', color: 'bg-danger' },
    { id: 3, name: 'Nike Jordan', price: '$2000', color: 'bg-dark' },
    { id: 4, name: 'Apple Series 5 Watch', price: '$800', color: 'bg-secondary' },
];

const expiredProducts = [
    { id: 1, name: 'Red Premium Handy', sku: 'PT006', mfg: '17 Jan 2023', exp: '29 Mar 2023', color: 'bg-danger' },
    { id: 2, name: 'Iphone 14 Pro', sku: 'PT007', mfg: '22 Feb 2023', exp: '04 Apr 2023', color: 'bg-dark' },
    { id: 3, name: 'Black Slim 200', sku: 'PT008', mfg: '18 Mar 2023', exp: '13 May 2023', color: 'bg-secondary' },
    { id: 4, name: 'Woodcraft Sandal', sku: 'PT009', mfg: '29 Mar 2023', exp: '27 May 2023', color: 'bg-success' },
];

export default function Dashboard2() {
    return (
        <div className="dash2-wrapper">
            
            {/* Top White Metric Cards */}
            <div className="row g-3 mb-3">
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="dash2-card d-flex align-items-center gap-3">
                        <div className="dash2-icon-box icon-box-orange">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <p className="dash2-val">$307144</p>
                            <p className="dash2-label mb-0">Total Purchase Due</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="dash2-card d-flex align-items-center gap-3">
                        <div className="dash2-icon-box icon-box-green">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="dash2-val">$4385</p>
                            <p className="dash2-label mb-0">Total Sales Due</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="dash2-card d-flex align-items-center gap-3">
                        <div className="dash2-icon-box icon-box-blue">
                            <ArrowDown size={20} />
                        </div>
                        <div>
                            <p className="dash2-val">$385656.5</p>
                            <p className="dash2-label mb-0">Total Sale Amount</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="dash2-card d-flex align-items-center gap-3">
                        <div className="dash2-icon-box icon-box-red">
                            <ArrowUp size={20} />
                        </div>
                        <div>
                            <p className="dash2-val">$40000</p>
                            <p className="dash2-label mb-0">Total Expense Amount</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Colored Metric Cards */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="dash2-color-card bg-orange">
                        <div>
                            <p className="dash2-color-val">100</p>
                            <p className="dash2-color-label">Customers</p>
                        </div>
                        <User size={36} opacity={0.9} />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="dash2-color-card bg-blue">
                        <div>
                            <p className="dash2-color-val">110</p>
                            <p className="dash2-color-label">Suppliers</p>
                        </div>
                        <UserCheck size={36} opacity={0.9} />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="dash2-color-card bg-navy">
                        <div>
                            <p className="dash2-color-val">150</p>
                            <p className="dash2-color-label">Purchase Invoice</p>
                        </div>
                        <Receipt size={36} opacity={0.9} />
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="dash2-color-card bg-green">
                        <div>
                            <p className="dash2-color-val">170</p>
                            <p className="dash2-color-label">Sales Invoice</p>
                        </div>
                        <FileText size={36} opacity={0.9} />
                    </div>
                </div>
            </div>

            {/* Charts and Recent Products Row */}
            <div className="row g-3 mb-4">
                
                {/* Chart Section */}
                <div className="col-12 col-xl-7">
                    <div className="dash2-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="dash2-section-title mb-0">Purchase & Sales</h5>
                            <div className="d-flex gap-3 align-items-center">
                                <div className="d-flex align-items-center gap-1">
                                    <span style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e'}}></span>
                                    <span className="small text-muted">Sales</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <span style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444'}}></span>
                                    <span className="small text-muted">Purchase</span>
                                </div>
                                <select className="form-select form-select-sm" style={{width: 'auto', fontSize: '0.75rem'}}>
                                    <option>2026</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <ReferenceLine y={0} stroke="#e2e8f0" />
                                    <Bar dataKey="sales" fill="#22c55e" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="purchase" fill="#ef4444" radius={[0, 0, 2, 2]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recently Added Products */}
                <div className="col-12 col-xl-5">
                    <div className="dash2-card p-0 overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center p-4 pb-3 border-bottom">
                            <h5 className="dash2-section-title mb-0">Recently Added Products</h5>
                            <span className="dash2-link">View All</span>
                        </div>
                        <div className="table-responsive">
                            <table className="dash2-table table table-borderless">
                                <thead>
                                    <tr>
                                        <th style={{paddingLeft: '1.5rem'}}>#</th>
                                        <th>Products</th>
                                        <th className="text-end" style={{paddingRight: '1.5rem'}}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProducts.map((p, idx) => (
                                        <tr key={p.id}>
                                            <td style={{paddingLeft: '1.5rem'}}>{idx + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className={`dash2-table-image ${p.color}`}></div>
                                                    <span className="fw-semibold text-dark">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-end text-muted" style={{paddingRight: '1.5rem'}}>{p.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expired Products Row */}
            <div className="row g-3">
                <div className="col-12">
                    <div className="dash2-card p-0 overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center p-4 pb-3 border-bottom">
                            <h5 className="dash2-section-title mb-0">Expired Products</h5>
                            <span className="dash2-link">View All</span>
                        </div>
                        <div className="table-responsive">
                            <table className="dash2-table table table-borderless mb-0">
                                <thead>
                                    <tr style={{backgroundColor: '#f8fafc'}}>
                                        <th style={{paddingLeft: '1.5rem', width: '40px'}}>
                                            <input type="checkbox" className="form-check-input dash2-checkbox" />
                                        </th>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Manufactured Date</th>
                                        <th>Expired Date</th>
                                        <th className="text-end" style={{paddingRight: '1.5rem'}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expiredProducts.map((p) => (
                                        <tr key={p.id}>
                                            <td style={{paddingLeft: '1.5rem'}}>
                                                <input type="checkbox" className="form-check-input dash2-checkbox" />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className={`dash2-table-image ${p.color}`}></div>
                                                    <span className="fw-semibold text-dark">{p.name}</span>
                                                </div>
                                            </td>
                                            <td>{p.sku}</td>
                                            <td>{p.mfg}</td>
                                            <td>{p.exp}</td>
                                            <td className="text-end" style={{paddingRight: '1.5rem'}}>
                                                <button className="dash2-action-btn"><Edit size={14} /></button>
                                                <button className="dash2-action-btn"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
