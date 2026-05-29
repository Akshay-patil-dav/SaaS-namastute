import React, { useState } from 'react';
import { 
    Search, Plus, Layers, Calendar, Play, CheckCircle2, User,
    TrendingUp, ShieldCheck, Settings, AlertTriangle, FileText, Download,
    ArrowRight, Clock, Trash2, HelpCircle
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell
} from 'recharts';
import '../inventory-pages-custom.css';

// Initial Mock Datasets
const initialWorkTasks = [
    { id: 'WO-101', name: 'Plastic Outer Shell Injection', product: 'Classic Plastic Chair', status: 'In Progress', worker: 'Satish Patil', machine: 'Molding Machine A' },
    { id: 'WO-102', name: 'Aluminium Framing Extrusion', product: 'Steel Frame Folding Bench', status: 'Pending', worker: 'Sunil Rane', machine: 'CNC Extruder B' },
    { id: 'WO-103', name: 'Shell-to-Leg Assembly & Bolting', product: 'Premium Office Ergonomic Chair', status: 'Completed', worker: 'Anita Deshpukh', machine: 'Assembly Station C' },
    { id: 'WO-104', name: 'Packaging & Barcode Attachment', product: 'Classic Plastic Chair', status: 'In Testing', worker: 'Ravi Verma', machine: 'Packaging Line D' },
];

const initialScrapLogs = [
    { id: 'SCR-01', material: 'Polypropylene Sprues & runners', scrapQty: '25.4 kg', reusability: '100% Recyclable', action: 'Granulated & Blended', date: '2026-05-20' },
    { id: 'SCR-02', material: 'Deformed shell molding scrap', scrapQty: '12.0 kg', reusability: '90% Recyclable', action: 'Granulated', date: '2026-05-22' },
    { id: 'SCR-03', material: 'Aluminium extrusion cuttings', scrapQty: '8.5 kg', reusability: 'Sellable Scrap', action: 'Stored in scrap bin 4', date: '2026-05-24' },
];

export default function ManufacturingWorkspace() {
    const [subTab, setSubTab] = useState('workorders'); // 'workorders', 'planning', 'process', 'allocation', 'shifts', 'costing', 'scrap', 'reports'
    const [searchTerm, setSearchTerm] = useState('');
    
    // Core state
    const [tasks, setTasks] = useState(initialWorkTasks);
    const [scrapLogs, setScrapLogs] = useState(initialScrapLogs);

    // Form inputs
    const [newScrapMaterial, setNewScrapMaterial] = useState('');
    const [newScrapQty, setNewScrapQty] = useState('');
    const [newScrapAction, setNewScrapAction] = useState('Granulated & Blended');

    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Cycle task states
    const cycleTaskStatus = (id) => {
        const statuses = ['Pending', 'In Progress', 'In Testing', 'Completed'];
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const nextIdx = (statuses.indexOf(t.status) + 1) % statuses.length;
                return { ...t, status: statuses[nextIdx] };
            }
            return t;
        }));
        showToast('Work order task updated!');
    };

    // Add scrap log
    const handleAddScrap = (e) => {
        e.preventDefault();
        if (!newScrapMaterial || !newScrapQty) return;
        const newObj = {
            id: `SCR-0${scrapLogs.length + 1}`,
            material: newScrapMaterial,
            scrapQty: `${newScrapQty} kg`,
            reusability: '100% Recyclable',
            action: newScrapAction,
            date: new Date().toISOString().split('T')[0]
        };
        setScrapLogs([newObj, ...scrapLogs]);
        setNewScrapMaterial('');
        setNewScrapQty('');
        showToast('Scrap/Wastage recorded successfully');
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
                    <h2 className="ss-page-title">Manufacturing Operations Board</h2>
                    <p className="ss-page-subtitle">Unified ERP dashboard managing Work Orders, Schedules, Machine Allocations, Shifts, and Wastage</p>
                </div>
            </div>

            {/* Sub Tabs Panel */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => setSubTab('workorders')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'workorders' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Work Orders (Kanban)</button>
                <button onClick={() => setSubTab('planning')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'planning' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Production Planning</button>
                <button onClick={() => setSubTab('process')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'process' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Production Process Stepper</button>
                <button onClick={() => setSubTab('allocation')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'allocation' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Machine Allocation</button>
                <button onClick={() => setSubTab('shifts')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'shifts' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Shift Management</button>
                <button onClick={() => setSubTab('costing')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'costing' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Production Costing</button>
                <button onClick={() => setSubTab('scrap')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'scrap' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Scrap & Wastage</button>
                <button onClick={() => setSubTab('reports')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'reports' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Production Reports</button>
            </div>

            {/* TAB CONTENT: Work Orders Kanban */}
            {subTab === 'workorders' && (
                <div>
                    <div className="alert alert-info py-2 small mb-3 border-0 d-flex align-items-center gap-2" style={{background: '#eff6ff', color: '#1d4ed8'}}>
                        <Play size={14} />
                        <span>Click **Cycle Stage** on any task to instantly promote its processing status.</span>
                    </div>
                    <div className="row g-3">
                        {['Pending', 'In Progress', 'In Testing', 'Completed'].map(col => (
                            <div className="col-12 col-md-6 col-xl-3" key={col}>
                                <div className="p-3 rounded-3 shadow-sm h-100" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0 text-dark">{col} Tasks</h6>
                                        <span className="badge bg-secondary-subtle text-secondary px-2 rounded">{tasks.filter(t => t.status === col).length}</span>
                                    </div>
                                    <div className="d-flex flex-column gap-2">
                                        {tasks.filter(t => t.status === col).map(t => (
                                            <div className="p-3 bg-white border rounded-3 shadow-sm" key={t.id}>
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="small font-monospace fw-bold text-indigo">{t.id}</span>
                                                    <button className="btn btn-sm text-primary p-0 font-semibold" style={{fontSize:'10px'}} onClick={() => cycleTaskStatus(t.id)}>Cycle Stage &gt;</button>
                                                </div>
                                                <h6 className="fw-bold mb-1 text-dark small">{t.name}</h6>
                                                <p className="small text-muted mb-2">{t.product}</p>
                                                <div className="border-top pt-2 d-flex justify-content-between align-items-center" style={{fontSize: '11px'}}>
                                                    <span className="text-secondary"><User size={10} /> {t.worker}</span>
                                                    <span className="text-secondary font-monospace">{t.machine}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Production Planning */}
            {subTab === 'planning' && (
                <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                    <h5 className="fw-bold text-dark mb-3"><Calendar size={18} className="me-2 text-indigo" /> Production Scheduler Calendar</h5>
                    <div className="table-responsive border rounded-3">
                        <table className="table table-bordered mb-0 align-middle text-center">
                            <thead className="table-light">
                                <tr>
                                    <th>Planned Date</th>
                                    <th>Lot / batch</th>
                                    <th>Allocated Shift</th>
                                    <th>Target Product</th>
                                    <th>Planned Volume</th>
                                    <th>Production Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="small">26 May 2026</td>
                                    <td><code>LOT-26A-CHAIR</code></td>
                                    <td>Morning (06:00 - 14:00)</td>
                                    <td className="fw-semibold text-dark text-start">Classic Plastic Chair (Red)</td>
                                    <td className="fw-bold">1,000 Units</td>
                                    <td><span className="badge bg-primary text-white">Scheduled</span></td>
                                </tr>
                                <tr>
                                    <td className="small">27 May 2026</td>
                                    <td><code>LOT-27B-ERGO</code></td>
                                    <td>Evening (14:00 - 22:00)</td>
                                    <td className="fw-semibold text-dark text-start">Premium Office Ergonomic Chair</td>
                                    <td className="fw-bold">300 Units</td>
                                    <td><span className="badge bg-warning text-dark">Awaiting Setup</span></td>
                                </tr>
                                <tr>
                                    <td className="small">28 May 2026</td>
                                    <td><code>LOT-28C-BENCH</code></td>
                                    <td>Night (22:00 - 06:00)</td>
                                    <td className="fw-semibold text-dark text-start">Steel Frame Folding Bench</td>
                                    <td className="fw-bold">50 Units</td>
                                    <td><span className="badge bg-secondary text-white">Materials Staged</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Production Process Stepper */}
            {subTab === 'process' && (
                <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                    <h5 className="fw-bold text-dark mb-4"><Layers size={18} className="me-2 text-orange" /> Real-time Stepper Tracker: Lot `LOT-26A-CHAIR`</h5>
                    
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-4 mt-3">
                        {[
                            { name: '1. Extrusion & Blend', desc: 'Raw granules mixed & heated', active: 'completed' },
                            { name: '2. Injection Molding', desc: 'Active molding of chair seat shells', active: 'active' },
                            { name: '3. Assembly Frame', desc: 'Bolting shells onto aluminium frames', active: 'pending' },
                            { name: '4. QA & Weight Check', desc: 'Checking dimensional accuracy', active: 'pending' },
                            { name: '5. Packaging & Stock', desc: 'Printing QR & boxing item', active: 'pending' }
                        ].map((s, i) => (
                            <React.Fragment key={i}>
                                <div className="d-flex flex-column align-items-center text-center" style={{ flex: 1, minWidth: '150px' }}>
                                    <div 
                                        className={`rounded-circle d-flex align-items-center justify-content-center fw-bold mb-2 ${
                                            s.active === 'completed' ? 'bg-success text-white' : 
                                            s.active === 'active' ? 'bg-primary text-white animate-pulse' : 'bg-light text-secondary border'
                                        }`} 
                                        style={{ width: '40px', height: '40px' }}
                                    >
                                        {i + 1}
                                    </div>
                                    <h6 className="fw-bold mb-1 small text-dark">{s.name}</h6>
                                    <p className="text-muted mb-0" style={{ fontSize: '10px' }}>{s.desc}</p>
                                </div>
                                {i < 4 && <ArrowRight size={16} className="text-secondary d-none d-md-block" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Machine Allocation */}
            {subTab === 'allocation' && (
                <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                    <h5 className="fw-bold text-dark mb-3"><Settings size={18} className="me-2 text-indigo" /> Machine-to-Work-Order Allocation Matrix</h5>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <div className="p-3 border rounded-3 bg-light-subtle mb-3">
                                <h6 className="fw-bold text-dark">Molding Machine A</h6>
                                <p className="small text-muted mb-2">Capacity: 450 cycles/hr</p>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="small text-secondary fw-semibold">Currently Allocated:</span>
                                    <span className="badge bg-primary text-white">WO-101 (Plastic Shells)</span>
                                </div>
                            </div>
                            <div className="p-3 border rounded-3 bg-light-subtle">
                                <h6 className="fw-bold text-dark">CNC Extruder B</h6>
                                <p className="small text-muted mb-2">Capacity: 120 meters/hr</p>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="small text-secondary fw-semibold">Currently Allocated:</span>
                                    <span className="badge bg-secondary text-white">Idle / Available</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="p-3 border rounded-3 bg-light-subtle mb-3">
                                <h6 className="fw-bold text-dark">Assembly Station C</h6>
                                <p className="small text-muted mb-2">Capacity: 50 assembled chairs/hr</p>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="small text-secondary fw-semibold">Currently Allocated:</span>
                                    <span className="badge bg-success text-white">WO-103 Completed</span>
                                </div>
                            </div>
                            <div className="p-3 border rounded-3 bg-light-subtle">
                                <h6 className="fw-bold text-dark">Packaging Line D</h6>
                                <p className="small text-muted mb-2">Capacity: 600 prints/hr</p>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="small text-secondary fw-semibold">Currently Allocated:</span>
                                    <span className="badge bg-warning text-dark">WO-104 in QC check</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Shift Management */}
            {subTab === 'shifts' && (
                <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                    <h5 className="fw-bold text-dark mb-3"><Clock size={18} className="me-2 text-indigo" /> Today's Shift Roster Scheduling</h5>
                    <div className="row g-3">
                        {[
                            { name: 'Shift 1: Morning', time: '06:00 - 14:00', supervisor: 'Ramesh Patil', operators: '12 Operators', state: 'Active' },
                            { name: 'Shift 2: Evening', time: '14:00 - 22:00', supervisor: 'Sanjay Deshmukh', operators: '10 Operators', state: 'Scheduled' },
                            { name: 'Shift 3: Night Graveyard', time: '22:00 - 06:00', supervisor: 'Vikram Joshi', operators: '6 Operators', state: 'Scheduled' },
                        ].map((s, idx) => (
                            <div className="col-12 col-md-4" key={idx}>
                                <div className="p-3 border rounded-3 h-100 d-flex flex-column justify-content-between" style={{ background: '#f8fafc' }}>
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="fw-bold mb-0 text-dark">{s.name}</h6>
                                            <span className={`badge py-1 px-2.5 rounded ${s.state === 'Active' ? 'bg-success text-white' : 'bg-secondary text-white'}`}>{s.state}</span>
                                        </div>
                                        <p className="small text-indigo mb-3 font-monospace">{s.time}</p>
                                        <p className="small text-muted mb-1">Supervisor: **{s.supervisor}**</p>
                                        <p className="small text-muted mb-0">Roster Count: {s.operators}</p>
                                    </div>
                                    <button className="btn btn-sm btn-outline-secondary w-100 mt-3" style={{ fontSize: '11px' }}>Manage Staff Roster</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Production Costing */}
            {subTab === 'costing' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h5 className="fw-bold text-dark mb-4"><TrendingUp size={18} className="me-2 text-indigo" /> Manufacturing cost structure (Direct vs Overheads)</h5>
                            <div style={{ width: '100%', height: 260 }}>
                                <ResponsiveContainer>
                                    <BarChart 
                                        data={[
                                            { name: 'Classic Chair', rawCost: 280, overhead: 42 },
                                            { name: 'Office Chair', rawCost: 1100, overhead: 165 },
                                            { name: 'Dining Table', rawCost: 3200, overhead: 480 },
                                            { name: 'Folding Bench', rawCost: 850, overhead: 127 },
                                        ]}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        barSize={20}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip />
                                        <Bar dataKey="rawCost" fill="#3b82f6" stackId="a" name="Direct Material Cost" />
                                        <Bar dataKey="overhead" fill="#ff9b29" stackId="a" name="Labor & Overhead (15%)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold text-dark mb-3">Cost Optimization Tips</h5>
                                <ul className="small text-secondary ps-3 mb-0 d-flex flex-column gap-2.5">
                                    <li>**Raw resin volume** accounts for **85%** of plastic components' direct cost structure.</li>
                                    <li>Recycling mold run sprue spouts back into grinding grinders saves **₹12,450 weekly** in resin cost margins!</li>
                                    <li>Running molding lines in Night Shifts captures lower electricity tariff rates (off-peak load pricing).</li>
                                </ul>
                            </div>
                            <div className="p-3 bg-light rounded-3 mt-3">
                                <span className="small text-muted d-block">This Month's Overhead Saving:</span>
                                <span className="fw-bold text-success fs-5">₹48,900.00 Saved</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Scrap & Wastage */}
            {subTab === 'scrap' && (
                <div className="row g-3">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm">
                            <div className="p-3 border-bottom bg-light">
                                <h5 className="fw-bold mb-0 text-danger"><AlertTriangle size={18} className="me-2" /> Scrap & Material Wastage logs</h5>
                            </div>
                            <div className="ss-table-wrapper">
                                <table className="ss-table">
                                    <thead>
                                        <tr>
                                            <th>Scrap ID</th>
                                            <th>Waste Material</th>
                                            <th>Wastage Quantity</th>
                                            <th>Reusability Index</th>
                                            <th>Action Taken</th>
                                            <th>Record Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scrapLogs.map((item) => (
                                            <tr key={item.id}>
                                                <td><span className="ss-code-badge bg-danger-subtle text-danger">{item.id}</span></td>
                                                <td className="ss-item-name">{item.material}</td>
                                                <td className="text-danger fw-bold">{item.scrapQty}</td>
                                                <td><span className="badge bg-success-subtle text-success py-1 px-2.5 rounded">{item.reusability}</span></td>
                                                <td className="small">{item.action}</td>
                                                <td className="small">{item.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#ef4444', fontSize: '18px' }}>
                                <AlertTriangle size={18} className="text-danger" color="#ef4444" />
                                Record Production Wastage
                            </h4>
                            <form onSubmit={handleAddScrap}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Waste Description / Material *</label>
                                    <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. PP Runner overflow spalls" value={newScrapMaterial} onChange={(e) => setNewScrapMaterial(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Wastage Weight (kg) *</label>
                                    <input type="number" className="form-control form-control-sm p-2" placeholder="e.g. 12" value={newScrapQty} onChange={(e) => setNewScrapQty(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Corrective Action Taken</label>
                                    <select className="form-select form-select-sm p-2" value={newScrapAction} onChange={(e) => setNewScrapAction(e.target.value)}>
                                        <option value="Granulated & Blended">Granulated & blended back to extruder</option>
                                        <option value="Sold to Recycle Partner">Sold to local industrial recycle vendor</option>
                                        <option value="Scrapped / Landfill">Scrapped / Landfill disposal</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-danger w-100 d-flex justify-content-center align-items-center gap-2 mt-2" style={{ background: '#ef4444', border:'none', padding: '10px' }}>
                                    <AlertTriangle size={16} /> File Wastage Record
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Production Reports */}
            {subTab === 'reports' && (
                <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 text-center py-5">
                    <FileText size={48} className="text-indigo mb-3" color="#6366f1" />
                    <h4 className="fw-bold mb-2">Production Analytics & PDF Report Center</h4>
                    <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '450px' }}>
                        Generate comprehensive summaries of all raw resin utilization counts, overall equipment OEE metrics, shift timetables, and wastage summaries.
                    </p>
                    
                    <div className="d-flex justify-content-center gap-3">
                        <button className="ss-btn-orange d-flex align-items-center gap-2" style={{ background: '#ff9b29' }} onClick={() => showToast('PDF Report generated! Check Downloads folder.')}>
                            <Download size={16} /> Download Manufacturing Summary (PDF)
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => showToast('Excel Sheet compiled! Check Downloads folder.')}>
                            <Download size={16} /> Export Shift Telemetry logs (XLSX)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
