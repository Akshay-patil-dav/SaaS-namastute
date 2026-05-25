import React, { useState } from 'react';
import { 
    Cpu, Settings, Wrench, AlertTriangle, Play, Pause,
    CheckCircle2, Clock, Calendar, BarChart2, Plus, Trash2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import '../inventory-pages-custom.css';

// Initial Mock Machines
const initialMachines = [
    { id: 'MCH-01', name: 'Injection Molding Press A', type: 'Molding press', status: 'Running', utilization: '94%', temp: '210°C', pressure: '120 Bar', logs: 2 },
    { id: 'MCH-02', name: 'CNC Router & Profile Extruder B', type: 'Extrusion', status: 'Running', utilization: '88%', temp: '190°C', pressure: '95 Bar', logs: 1 },
    { id: 'MCH-03', name: 'Aluminium Leg Assembly Robot C', type: 'Robot Arm', status: 'Idle', utilization: '72%', temp: '42°C', pressure: '0 Bar', logs: 0 },
    { id: 'MCH-04', name: 'Heavy Duty Metal Stamping Press D', type: 'Hydraulic Press', status: 'Offline', utilization: '0%', temp: '22°C', pressure: '0 Bar', logs: 4 },
];

const initialSchedules = [
    { id: 'MNT-121', machine: 'Injection Molding Press A', type: 'Hydraulic Seals Replace', date: '2026-06-03', priority: 'High' },
    { id: 'MNT-122', machine: 'CNC Router & Profile Extruder B', type: 'Screw Barrel Cleaning', date: '2026-06-08', priority: 'Medium' },
    { id: 'MNT-123', machine: 'Aluminium Leg Assembly Robot C', type: 'Servo Joint Lubrication', date: '2026-06-15', priority: 'Low' },
];

const initialDowntimeLogs = [
    { id: 'DT-441', machine: 'Heavy Duty Metal Stamping Press D', duration: '2.5 hrs', reason: 'Hydraulic hose rupture', date: '2026-05-24' },
    { id: 'DT-442', machine: 'Injection Molding Press A', duration: '45 mins', reason: 'Nozzle temperature drop fluctuation', date: '2026-05-22' },
];

export default function Machines() {
    const [machines, setMachines] = useState(initialMachines);
    const [schedules, setSchedules] = useState(initialSchedules);
    const [downtimes, setDowntimes] = useState(initialDowntimeLogs);

    // Form states
    const [newMaintMachine, setNewMaintMachine] = useState('Injection Molding Press A');
    const [newMaintType, setNewMaintType] = useState('');
    const [newMaintDate, setNewMaintDate] = useState('');
    const [newMaintPriority, setNewMaintPriority] = useState('Medium');

    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Cycle Status Handlers
    const handleStatusSwitch = (id) => {
        const statuses = ['Running', 'Idle', 'Under Maintenance', 'Offline'];
        setMachines(machines.map(m => {
            if (m.id === id) {
                const nextIdx = (statuses.indexOf(m.status) + 1) % statuses.length;
                const nextStatus = statuses[nextIdx];
                const updatedUtil = nextStatus === 'Running' ? '90%' : nextStatus === 'Idle' ? '50%' : '0%';
                const updatedTemp = nextStatus === 'Running' ? '200°C' : '30°C';
                const updatedPressure = nextStatus === 'Running' ? '110 Bar' : '0 Bar';
                return { ...m, status: nextStatus, utilization: updatedUtil, temp: updatedTemp, pressure: updatedPressure };
            }
            return m;
        }));
        showToast('Machine operation status cycled successfully!');
    };

    // Add schedule
    const handleAddSchedule = (e) => {
        e.preventDefault();
        if (!newMaintType || !newMaintDate) return;
        const newObj = {
            id: `MNT-${schedules.length + 124}`,
            machine: newMaintMachine,
            type: newMaintType,
            date: newMaintDate,
            priority: newMaintPriority
        };
        setSchedules([newObj, ...schedules]);
        setNewMaintType('');
        setNewMaintDate('');
        showToast(`Scheduled maintenance job ${newObj.id}`);
    };

    const handleDeleteSchedule = (id) => {
        setSchedules(schedules.filter(s => s.id !== id));
        showToast('Maintenance task marked as completed!');
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
                    <h2 className="ss-page-title">Machine & Equipment Management</h2>
                    <p className="ss-page-subtitle">Live status telemetry, predictive maintenance alerts, and downtime tracking ledger</p>
                </div>
            </div>

            {/* Metrics cards Row */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 shadow-sm bg-white border d-flex justify-content-between align-items-center">
                        <div>
                            <span className="small text-muted d-block fw-semibold mb-1">Average Plant OEE Utilization</span>
                            <h3 className="fw-bold mb-0 text-indigo" style={{color: '#4f46e5'}}>85.6%</h3>
                        </div>
                        <div className="p-2.5 rounded bg-indigo-subtle text-indigo" style={{background: '#eff6ff', color: '#4f46e5'}}>
                            <BarChart2 size={24} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 shadow-sm bg-white border d-flex justify-content-between align-items-center">
                        <div>
                            <span className="small text-muted d-block fw-semibold mb-1">Active Running Lines</span>
                            <h3 className="fw-bold mb-0 text-success">2 / 4 Units</h3>
                        </div>
                        <div className="p-2.5 rounded bg-success-subtle text-success" style={{background: '#eff6ff', color: '#16a34a'}}>
                            <Play size={24} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 shadow-sm bg-white border d-flex justify-content-between align-items-center">
                        <div>
                            <span className="small text-muted d-block fw-semibold mb-1">Upcoming Maintenance Job</span>
                            <h3 className="fw-bold mb-0 text-warning">3 Tasks Scheduled</h3>
                        </div>
                        <div className="p-2.5 rounded bg-warning-subtle text-warning" style={{background: '#eff6ff', color: '#d97706'}}>
                            <Wrench size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Area: Telemetry & Schedules */}
            <div className="row g-4 mb-4">
                {/* Live Machines Roster */}
                <div className="col-12 col-xl-8">
                    <div className="ss-main-panel shadow-sm bg-white">
                        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2"><Cpu size={18} /> Live Machinery Telemetry Roster</h5>
                            <span className="small text-muted">Click `Cycle Status` to simulate operation changes</span>
                        </div>
                        <div className="table-responsive">
                            <table className="ss-table align-middle">
                                <thead>
                                    <tr>
                                        <th>Machine Code</th>
                                        <th>Machine Name</th>
                                        <th>Status Badge</th>
                                        <th>OEE Usage</th>
                                        <th>Core Temp</th>
                                        <th>Line Pressure</th>
                                        <th style={{ textAlign: 'center' }}>Telemetry Switch</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {machines.map((m) => (
                                        <tr key={m.id}>
                                            <td><span className="ss-code-badge font-monospace">{m.id}</span></td>
                                            <td>
                                                <h6 className="fw-bold mb-0 small text-dark">{m.name}</h6>
                                                <span className="text-secondary small" style={{ fontSize: '10px' }}>{m.type}</span>
                                            </td>
                                            <td>
                                                <span className={`badge py-1.5 px-3 rounded-pill text-white fw-bold ${
                                                    m.status === 'Running' ? 'bg-success' : 
                                                    m.status === 'Idle' ? 'bg-warning text-dark' : 
                                                    m.status === 'Under Maintenance' ? 'bg-info' : 'bg-danger'
                                                }`}>
                                                    {m.status}
                                                </span>
                                            </td>
                                            <td className="fw-bold text-dark">{m.utilization}</td>
                                            <td className="small font-monospace">{m.temp}</td>
                                            <td className="small font-monospace">{m.pressure}</td>
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-outline-secondary py-1 px-2.5 font-semibold text-nowrap" style={{ fontSize: '11px' }} onClick={() => handleStatusSwitch(m.id)}>
                                                    Cycle Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Maintenance Scheduler Panel */}
                <div className="col-12 col-xl-4">
                    <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2" style={{ fontSize: '18px' }}>
                            <Wrench size={18} className="text-indigo" color="#6366f1" />
                            Schedule Maintenance
                        </h4>
                        <form onSubmit={handleAddSchedule}>
                            <div className="mb-2">
                                <label className="form-label small fw-bold text-secondary">Target Machinery *</label>
                                <select className="form-select form-select-sm p-2" value={newMaintMachine} onChange={(e) => setNewMaintMachine(e.target.value)}>
                                    {machines.map(m => (
                                        <option key={m.id} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-bold text-secondary">Job Description / Action *</label>
                                <input type="text" className="form-control form-control-sm p-2" placeholder="e.g. Clean feed screw barrel" value={newMaintType} onChange={(e) => setNewMaintType(e.target.value)} required />
                            </div>
                            <div className="row g-2 mb-3">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Planned Date *</label>
                                    <input type="date" className="form-control form-control-sm p-2" value={newMaintDate} onChange={(e) => setNewMaintDate(e.target.value)} required />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-secondary">Priority</label>
                                    <select className="form-select form-select-sm p-2" value={newMaintPriority} onChange={(e) => setNewMaintPriority(e.target.value)}>
                                        <option value="High">High Priority</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="ss-btn-orange w-100 d-flex justify-content-center align-items-center gap-1.5" style={{ background: '#ff9b29' }}>
                                <Plus size={16} /> Schedule Task
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Row 3: Maintenance List & Downtime Log */}
            <div className="row g-4">
                {/* Active Maintenance Tasks List */}
                <div className="col-12 col-xl-6">
                    <div className="ss-main-panel shadow-sm bg-white">
                        <div className="p-3 border-bottom bg-light">
                            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2"><Clock size={18} /> Active Maintenance Queue</h5>
                        </div>
                        <div className="ss-table-wrapper">
                            <table className="ss-table align-middle">
                                <thead>
                                    <tr>
                                        <th>Job ID</th>
                                        <th>Machine Name</th>
                                        <th>Maintenance Job</th>
                                        <th>Priority</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.map((s) => (
                                        <tr key={s.id}>
                                            <td><span className="ss-code-badge font-monospace">{s.id}</span></td>
                                            <td className="fw-bold small text-dark">{s.machine}</td>
                                            <td className="small">{s.type}</td>
                                            <td>
                                                <span className={`badge py-1 px-2.5 rounded ${s.priority === 'High' ? 'bg-danger text-white' : s.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-secondary text-white'}`}>{s.priority}</span>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-success py-1 px-2.5 rounded" style={{ fontSize: '11px' }} onClick={() => handleDeleteSchedule(s.id)}>Mark Done</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Downtime Incidents Logs */}
                <div className="col-12 col-xl-6">
                    <div className="ss-main-panel shadow-sm bg-white">
                        <div className="p-3 border-bottom bg-light">
                            <h5 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2"><AlertTriangle size={18} /> Machine Downtime Incident log</h5>
                        </div>
                        <div className="ss-table-wrapper">
                            <table className="ss-table align-middle">
                                <thead>
                                    <tr>
                                        <th>Incident ID</th>
                                        <th>Machine Name</th>
                                        <th>Downtime Duration</th>
                                        <th>Fault Reason</th>
                                        <th>Fault Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {downtimes.map((d) => (
                                        <tr key={d.id}>
                                            <td><span className="ss-code-badge bg-danger-subtle text-danger font-monospace">{d.id}</span></td>
                                            <td className="fw-bold small text-dark">{d.machine}</td>
                                            <td className="text-danger fw-bold">{d.duration}</td>
                                            <td className="small text-muted">{d.reason}</td>
                                            <td className="small">{d.date}</td>
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
