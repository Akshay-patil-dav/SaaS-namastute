import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, FileText, Download,
    RotateCcw, AlertTriangle, BarChart2, TrendingUp, PieChart as PieIcon
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import '../inventory-pages-custom.css';

// Initial Mock Datasets
const productionReportData = [
    { month: 'Jan', actual: 4800, target: 5000 },
    { month: 'Feb', actual: 5200, target: 5000 },
    { month: 'Mar', actual: 6100, target: 5500 },
    { month: 'Apr', actual: 5800, target: 6000 },
    { month: 'May', actual: 6400, target: 6000 },
];

const stockReportData = [
    { name: 'Raw Resins', value: 45, color: '#4f46e5' },
    { name: 'Finished Seats', value: 30, color: '#10b981' },
    { name: 'Metal frames', value: 15, color: '#ff9b29' },
    { name: 'Packaging', value: 10, color: '#ef4444' },
];

const machineOeeData = [
    { name: 'Molder A', oee: 94 },
    { name: 'Extruder B', oee: 88 },
    { name: 'Robot C', oee: 72 },
    { name: 'Press D', oee: 68 },
];

const financialTrendData = [
    { month: 'Jan', sales: 450000, purchase: 310000, profit: 140000 },
    { month: 'Feb', sales: 520000, purchase: 280000, profit: 240000 },
    { month: 'Mar', sales: 680000, purchase: 380000, profit: 300000 },
    { month: 'Apr', sales: 590000, purchase: 320000, profit: 270000 },
    { month: 'May', sales: 710000, purchase: 410000, profit: 300000 },
];

export default function ReportsModule() {
    const [subTab, setSubTab] = useState('production'); // 'production', 'stock', 'machines', 'financial'
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    return (
        <div className="sub-category-page px-3 py-2">
            {toastMessage && (
                <div className="prod-toast prod-toast-success">
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                    <button className="toast-close" onClick={() => setToastMessage('')}>×</button>
                </div>
            )}

            {/* Header Row */}
            <div className="ss-header-row mb-4">
                <div>
                    <h2 className="ss-page-title">Reports & Corporate Analytics</h2>
                    <p className="ss-page-subtitle">Centralized intelligence hub charting production runs, stock asset valuations, and financial bottom lines</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-orange d-flex align-items-center gap-2" style={{ background: '#ff9b29' }} onClick={() => showToast('Full report bundle generated! Ready for print.')}>
                        <Download size={16} /> Export Consolidated Report (PDF)
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => setSubTab('production')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'production' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Production Reports</button>
                <button onClick={() => setSubTab('stock')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'stock' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Stock Assets Audits</button>
                <button onClick={() => setSubTab('machines')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'machines' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Machine OEE telemetries</button>
                <button onClick={() => setSubTab('financial')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'financial' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Financial P&L Trends</button>
            </div>

            {/* TAB CONTENT: Production Reports */}
            {subTab === 'production' && (
                <div className="row g-4">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><BarChart2 size={18} /> Monthly Production Volume Output vs Targets</h5>
                            
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={productionReportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={16}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip />
                                        <Bar dataKey="actual" fill="#6366f1" radius={[4, 4, 0, 0]} name="Actual Output" />
                                        <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Planned Target" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold text-dark mb-3">Key Highlights</h5>
                                <p className="small text-secondary mb-3">
                                    Production in **March & May** exceeded monthly targets by **12% & 6%** respectively, following the activation of Extruder Press B off-peak night shifts.
                                </p>
                                <p className="small text-secondary">
                                    Overall plant output volume grew **33%** over the Jan-May index period!
                                </p>
                            </div>
                            <button className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center gap-2" onClick={() => showToast('Production report sheet exported!')}>
                                <FileText size={16} /> Export Production logs (XLSX)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Stock Asset Audits */}
            {subTab === 'stock' && (
                <div className="row g-4">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><PieIcon size={18} /> Inventory Stock Valuation Distribution</h5>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-5 d-flex justify-content-center">
                                    <div style={{ width: 180, height: 180 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie data={stockReportData} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                                                    {stockReportData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="col-12 col-md-7">
                                    <div className="d-flex flex-column gap-2 mt-3 mt-md-0">
                                        {stockReportData.map((item, idx) => (
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-1.5" key={idx}>
                                                <span className="small text-secondary fw-semibold">
                                                    <span style={{ color: item.color }} className="me-1">●</span> {item.name}
                                                </span>
                                                <span className="fw-bold text-dark">{item.value}% Valuation</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold text-dark mb-3">Inventory Turns</h5>
                                <p className="small text-secondary mb-2">
                                    Inventory Turn Rate is **12.4x annually**, indicating an optimal raw-material-to-finished-good assembly turn circle (avg 29 days).
                                </p>
                            </div>
                            <button className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center gap-2" onClick={() => showToast('Stock audits sheet exported!')}>
                                <FileText size={16} /> Export Asset Ledger (XLSX)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Machine OEE */}
            {subTab === 'machines' && (
                <div className="row g-4">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><BarChart2 size={18} /> Machinery Overall Equipment Effectiveness (OEE %)</h5>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={machineOeeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip />
                                        <Bar dataKey="oee" fill="#10b981" radius={[4, 4, 0, 0]} name="OEE Uptime %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold text-dark mb-3">OEE Targets</h5>
                                <p className="small text-secondary mb-2">
                                    **OEE Target: 85%**. Molding A & Extruder B OEE values represent best-in-class manufacturing configurations (94% & 88%).
                                </p>
                            </div>
                            <button className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center gap-2" onClick={() => showToast('Machinery uptime audits exported!')}>
                                <FileText size={16} /> Export Machine Log (XLSX)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Financial P&L Trends */}
            {subTab === 'financial' && (
                <div className="row g-4">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><TrendingUp size={18} /> Income vs Expenses vs Net Profit margins</h5>
                            
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={financialTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} name="Gross Revenue" />
                                        <Line type="monotone" dataKey="purchase" stroke="#ef4444" strokeWidth={2} name="Expenses (Materials)" />
                                        <Line type="monotone" dataKey="profit" stroke="#6366f1" strokeWidth={3} name="Net Operating Profit" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold text-dark mb-3">Gross Margins</h5>
                                <p className="small text-secondary mb-2">
                                    Gross profit margin averages **42.2%** over the FY 25-26 index chart, representing a strong operating cashflow generation structure.
                                </p>
                            </div>
                            <button className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center gap-2" onClick={() => showToast('PL trends exported!')}>
                                <FileText size={16} /> Export Financial Ledger (XLSX)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Inline fallback since Lucide check circle isn't always present in old packs
function CheckCircle2({ size = 16, className = '' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
