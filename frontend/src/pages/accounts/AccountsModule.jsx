import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, DollarSign, Calculator,
    FileText, CheckCircle2, RotateCcw, AlertTriangle, ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import '../inventory-pages-custom.css';

// Initial Mock Ledger
const initialLedger = [
    { id: 'TX-901', title: 'Raw Resin Purchase (Batch A)', type: 'Expense', category: 'Raw Materials', amount: 240000, date: '2026-05-18' },
    { id: 'TX-902', title: 'Wholesale Invoice #SO-901 Paid', type: 'Income', category: 'Product Sales', amount: 150000, date: '2026-05-20' },
    { id: 'TX-903', title: 'Factory Electricity Bill', type: 'Expense', category: 'Utility Overheads', amount: 35000, date: '2026-05-22' },
    { id: 'TX-904', title: 'Maintenance Seals Mold A', type: 'Expense', category: 'Machinery Maint', amount: 12000, date: '2026-05-23' },
];

export default function AccountsModule() {
    const [subTab, setSubTab] = useState('pl'); // 'pl', 'ledger', 'tax', 'bank'
    const [ledger, setLedger] = useState(initialLedger);

    // Form inputs
    const [newTitle, setNewTitle] = useState('');
    const [newType, setNewType] = useState('Expense');
    const [newCategory, setNewCategory] = useState('Raw Materials');
    const [newAmount, setNewAmount] = useState('');

    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Calculations
    const totalIncome = ledger.filter(l => l.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = ledger.filter(l => l.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
    const grossProfit = totalIncome - totalExpenses;

    const handleAddTransaction = (e) => {
        e.preventDefault();
        if (!newTitle || !newAmount) return;
        const newObj = {
            id: `TX-90${ledger.length + 1}`,
            title: newTitle,
            type: newType,
            category: newCategory,
            amount: parseFloat(newAmount) || 0,
            date: new Date().toISOString().split('T')[0]
        };
        setLedger([newObj, ...ledger]);
        setNewTitle('');
        setNewAmount('');
        showToast(`Transaction logged under ${newType}!`);
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
                    <h2 className="ss-page-title">Accounts & Financial ERP Panel</h2>
                    <p className="ss-page-subtitle">Formulate Profit & Loss statements, log corporate general ledgers, and audit GST/VAT taxes</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => setSubTab('pl')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'pl' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Profit & Loss Statements</button>
                <button onClick={() => setSubTab('ledger')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'ledger' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>General Ledger Sheet</button>
                <button onClick={() => setSubTab('tax')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'tax' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>GST/VAT Tax Audits</button>
                <button onClick={() => setSubTab('bank')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'bank' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Cashbook & Bank balances</button>
            </div>

            {/* TAB CONTENT: Profit & Loss */}
            {subTab === 'pl' && (
                <div className="row g-4">
                    {/* PL Statement */}
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Calculator size={18} className="text-indigo" color="#6366f1" /> Corporate Profit & Loss Summary: FY 2025-2026</h5>
                            
                            <div className="d-flex flex-column gap-3.5 mt-2">
                                <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                    <span className="fw-semibold text-dark">Wholesale Product Revenue (Income):</span>
                                    <span className="fw-bold text-success fs-5">₹{totalIncome.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="ps-3 d-flex flex-column gap-2 text-secondary small">
                                    <div className="d-flex justify-content-between">
                                        <span>• Factory Direct Goods Sales:</span>
                                        <span>₹{totalIncome.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mt-3">
                                    <span className="fw-semibold text-dark">Total Cost of Goods Sold (Expenses):</span>
                                    <span className="fw-bold text-danger fs-5">₹{totalExpenses.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="ps-3 d-flex flex-column gap-2 text-secondary small">
                                    {ledger.filter(l => l.type === 'Expense').map(l => (
                                        <div className="d-flex justify-content-between" key={l.id}>
                                            <span>• {l.title} ({l.category}):</span>
                                            <span>₹{l.amount.toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 rounded-3 mt-4 d-flex justify-content-between align-items-center" style={{ 
                                    background: grossProfit >= 0 ? '#ecfdf5' : '#fef2f2', 
                                    borderLeft: grossProfit >= 0 ? '4px solid #10b981' : '4px solid #ef4444' 
                                }}>
                                    <div>
                                        <h6 className="mb-0 fw-bold text-dark">Net Operating Margin (P&L):</h6>
                                        <span className="small text-muted">Income minus Expenses</span>
                                    </div>
                                    <span className={`fw-bold fs-4 ${grossProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                        ₹{grossProfit.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Info */}
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold text-dark mb-3">Profit Analysis Tips</h5>
                                <ul className="small text-secondary ps-3 mb-0 d-flex flex-column gap-2.5">
                                    <li>Maintaining OEE efficiency above **92%** decreases plastic component unit overhead costs by **4.2%**.</li>
                                    <li>Procuring Polypropylene resin in lots exceeding **5,000 kg** yields bulk discount credits from Advanced Poly Chem!</li>
                                </ul>
                            </div>
                            <button className="ss-btn-orange w-100 d-flex justify-content-center mt-3" style={{ background: '#ff9b29' }} onClick={() => showToast('Financial audit sheets exported successfully!')}>
                                <FileText size={16} /> Export Financial Audits (PDF)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: General Ledger */}
            {subTab === 'ledger' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="p-3 border-bottom bg-light">
                                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2"><FileText size={18} /> General Corporate Ledger</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Ref Number</th>
                                            <th>Transaction Description</th>
                                            <th>Log Type</th>
                                            <th>Accounts Category</th>
                                            <th>Transaction Amount</th>
                                            <th>Receipt Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ledger.map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge font-monospace">{item.id}</span></td>
                                                <td className="ss-item-name">{item.title}</td>
                                                <td>
                                                    <span className={`badge py-1 px-2.5 rounded ${
                                                        item.type === 'Income' ? 'bg-success text-white' : 'bg-danger text-white'
                                                    }`}>{item.type}</span>
                                                </td>
                                                <td><span className="ss-category-tag">{item.category}</span></td>
                                                <td className={`fw-bold ${item.type === 'Income' ? 'text-success' : 'text-danger'}`}>
                                                    {item.type === 'Income' ? '+' : '-'} ₹{item.amount.toLocaleString('en-IN')}
                                                </td>
                                                <td className="small">{item.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Add Form */}
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2" style={{ fontSize: '18px' }}>
                                <Plus size={18} className="text-orange" color="#ff9b29" />
                                Record Transaction
                            </h4>
                            <form onSubmit={handleAddTransaction}>
                                <div className="mb-2">
                                    <label className="form-label small fw-bold text-secondary">Transaction Description *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Factory Staff Salary, Custom order..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
                                </div>
                                <div className="row g-2 mb-2">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">Txn Type *</label>
                                        <select className="form-select form-select-sm p-2" value={newType} onChange={(e) => setNewType(e.target.value)}>
                                            <option value="Expense">Expense</option>
                                            <option value="Income">Income</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-secondary">ERP Category *</label>
                                        <select className="form-select form-select-sm p-2" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                                            <option value="Raw Materials">Raw Materials</option>
                                            <option value="Product Sales">Product Sales</option>
                                            <option value="Utility Overheads">Utility Overheads</option>
                                            <option value="Machinery Maint">Machinery Maint</option>
                                            <option value="HR Payroll">HR Payroll</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Transaction Cost (INR) *</label>
                                    <input type="number" className="form-control form-control-sm p-2" placeholder="e.g. 35000" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} required />
                                </div>
                                <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }}>
                                    <Plus size={16} /> Save Transaction
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: GST/VAT Tax Audits */}
            {subTab === 'tax' && (
                <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Calculator size={18} /> GST / VAT Tax Liability calculations</h5>
                    
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <div className="p-3 border rounded-3 bg-light-subtle h-100">
                                <h6 className="fw-bold text-success mb-2">Output Tax collected (on Sales)</h6>
                                <p className="small text-muted mb-2">Total tax collected on wholesale invoices issued</p>
                                <span className="fw-bold text-dark fs-5">₹{(totalIncome * 0.18).toLocaleString('en-IN')} (18% GST)</span>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="p-3 border rounded-3 bg-light-subtle h-100">
                                <h6 className="fw-bold text-danger mb-2">Input Tax Credit claimed (on Purchases)</h6>
                                <p className="small text-muted mb-2">Total eligible tax credits paid on raw material inputs</p>
                                <span className="fw-bold text-dark fs-5">₹{(totalExpenses * 0.18).toLocaleString('en-IN')} (18% GST)</span>
                            </div>
                        </div>
                        
                        <div className="col-12 mt-4">
                            <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center" style={{ borderLeft: '4px solid #ff9b29' }}>
                                <div>
                                    <h6 className="mb-0 fw-bold text-dark">Estimated Net GST / VAT tax Payable:</h6>
                                    <span className="small text-muted">Output Tax collected minus Input Tax Credits</span>
                                </div>
                                <span className="fw-bold text-indigo fs-4">
                                    ₹{Math.max(0, (totalIncome * 0.18) - (totalExpenses * 0.18)).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Cashbook & Bank balances */}
            {subTab === 'bank' && (
                <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><DollarSign size={18} /> Cashbook ledger & Corporate Bank sync</h5>
                    
                    <div className="row g-3">
                        <div className="col-12 col-md-4">
                            <div className="p-3 border rounded-3 bg-light-subtle text-center">
                                <h6 className="fw-semibold text-secondary small mb-1">State Bank of India (SBI)</h6>
                                <span className="small text-muted font-monospace">A/C: *******8891</span>
                                <h4 className="fw-bold text-dark mt-2">₹12,45,690.40</h4>
                                <button className="btn btn-sm btn-outline-secondary w-100 mt-3" style={{ fontSize: '11px' }} onClick={() => showToast('Bank transaction ledger synced!')}>Sync Transactions</button>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="p-3 border rounded-3 bg-light-subtle text-center">
                                <h6 className="fw-semibold text-secondary small mb-1">HDFC Corporate Bank</h6>
                                <span className="small text-muted font-monospace">A/C: *******0042</span>
                                <h4 className="fw-bold text-dark mt-2">₹4,89,120.00</h4>
                                <button className="btn btn-sm btn-outline-secondary w-100 mt-3" style={{ fontSize: '11px' }} onClick={() => showToast('HDFC transaction ledger synced!')}>Sync Transactions</button>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="p-3 border rounded-3 bg-light-subtle text-center">
                                <h6 className="fw-semibold text-secondary small mb-1">In-Hand Cash Reserves</h6>
                                <span className="small text-muted font-monospace">Petty cash vault</span>
                                <h4 className="fw-bold text-dark mt-2">₹85,000.00</h4>
                                <button className="btn btn-sm btn-outline-secondary w-100 mt-3" style={{ fontSize: '11px' }} onClick={() => showToast('Petty cash log updated!')}>Reconcile petty cash</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
