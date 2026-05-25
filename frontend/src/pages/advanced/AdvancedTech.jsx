import React, { useState, useEffect } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, Cpu, Barcode, Globe, Database,
    CheckCircle2, RotateCcw, AlertTriangle, Play, Sparkles, Server, ShieldCheck
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import '../inventory-pages-custom.css';

// Barcode simulated scanner catalog
const barcodeDB = {
    '440129881': { name: 'Classic Plastic Chair (Red)', price: '₹450.00', stock: '1,450 Units', sku: 'PC-RED-1', weight: '2.1 kg' },
    '998230041': { name: 'Premium Office Ergonomic Chair', price: '₹3,500.00', stock: '340 Units', sku: 'OC-ERGO-9', weight: '8.4 kg' },
    '112445892': { name: 'Plastic Dining Table (Oval)', price: '₹6,800.00', stock: '85 Units', sku: 'PT-OVAL-2', weight: '12.0 kg' }
};

const initialAIPredictions = [
    { month: 'Jun', actual: 7100, predicted: 7200 },
    { month: 'Jul', actual: null, predicted: 7600 },
    { month: 'Aug', actual: null, predicted: 8100 },
    { month: 'Sep', actual: null, predicted: 8400 },
    { month: 'Oct', actual: null, predicted: 8900 },
];

export default function AdvancedTech() {
    const [subTab, setSubTab] = useState('scanner'); // 'scanner', 'ai', 'iot', 'cloud'
    const [scannedCode, setScannedCode] = useState('');
    const [scannedItem, setScannedItem] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    
    // IoT live telemetry
    const [iotData, setIotData] = useState([
        { time: '10:00', temp: 205, pressure: 118 },
        { time: '10:05', temp: 208, pressure: 120 },
        { time: '10:10', temp: 210, pressure: 121 },
        { time: '10:15', temp: 212, pressure: 119 },
    ]);

    const [toastMessage, setToastMessage] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Simulate scanning
    const triggerScan = (code) => {
        setIsScanning(true);
        setScannedItem(null);
        setTimeout(() => {
            setIsScanning(false);
            setScannedCode(code);
            const match = barcodeDB[code];
            if (match) {
                setScannedItem(match);
                showToast('Barcode scanned & decoded successfully!');
            } else {
                showToast('Unknown barcode detected', 'error');
            }
        }, 1500);
    };

    // Simulate real-time IoT updates
    useEffect(() => {
        if (subTab !== 'iot') return;
        const interval = setInterval(() => {
            setIotData(prev => {
                const last = prev[prev.length - 1];
                const lastTimeParts = last.time.split(':');
                let min = parseInt(lastTimeParts[1]) + 5;
                let hr = parseInt(lastTimeParts[0]);
                if (min >= 60) { min = 0; hr = (hr + 1) % 24; }
                const newTime = `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                
                // Add minor temperature / pressure fluctuation
                const newTemp = Math.round(210 + (Math.random() * 6 - 3));
                const newPress = Math.round(120 + (Math.random() * 4 - 2));

                const nextData = [...prev.slice(1), { time: newTime, temp: newTemp, pressure: newPress }];
                return nextData;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [subTab]);

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
                    <h2 className="ss-page-title">Advanced ERP Telemetries</h2>
                    <p className="ss-page-subtitle">Immersive workspace demonstrating high-precision simulated Barcode scanning, AI demand forecasting, and IoT sensor analytics</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => setSubTab('scanner')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'scanner' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Barcode & QR Scanner</button>
                <button onClick={() => setSubTab('ai')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'ai' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>AI Demand Forecasting</button>
                <button onClick={() => setSubTab('iot')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'iot' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>IoT Machinery Telemetry</button>
                <button onClick={() => setSubTab('cloud')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${subTab === 'cloud' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Cloud Backup & Multi-Branch</button>
            </div>

            {/* TAB CONTENT: Barcode Scanner */}
            {subTab === 'scanner' && (
                <div className="row g-4">
                    <div className="col-12 col-xl-6">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 text-center">
                            <h5 className="fw-bold text-dark text-start mb-3"><Barcode size={18} className="me-2" /> Live simulated Barcode Camera Viewport</h5>
                            
                            {/* Simulated Camera container */}
                            <div className="position-relative bg-dark rounded-3 overflow-hidden d-flex flex-column align-items-center justify-content-center border" style={{ height: '240px' }}>
                                {isScanning ? (
                                    <div className="text-white text-center">
                                        <div className="spinner-border text-warning mb-2" role="status" style={{ width: '40px', height: '40px' }} />
                                        <p className="small mb-0 text-white-50">Auditing lens focal points... Decoding code spalls</p>
                                    </div>
                                ) : (
                                    <div className="text-white text-center">
                                        <Barcode size={48} className="text-secondary mb-2 opacity-50" />
                                        <p className="small mb-0 text-white-50">Lens Staged • Waiting for barcode pass</p>
                                    </div>
                                )}

                                {/* Animated Laser line */}
                                {isScanning && (
                                    <div className="position-absolute w-100 bg-danger" style={{ 
                                        height: '2px', 
                                        top: 0, 
                                        boxShadow: '0 0 10px #ef4444', 
                                        animation: 'scanLaser 1.5s infinite ease-in-out' 
                                    }} />
                                )}
                                <style>{`
                                    @keyframes scanLaser {
                                        0% { top: 10%; }
                                        50% { top: 90%; }
                                        100% { top: 10%; }
                                    }
                                `}</style>
                            </div>

                            {/* Click to Scan Demo options */}
                            <div className="mt-4 border-top pt-3 text-start">
                                <h6 className="fw-bold mb-3 text-dark small">Pass simulated barcode under scanner:</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    <button className="btn btn-sm btn-outline-secondary font-monospace" onClick={() => triggerScan('440129881')}>Scan Chair (Code 440129881)</button>
                                    <button className="btn btn-sm btn-outline-secondary font-monospace" onClick={() => triggerScan('998230041')}>Scan Office Chair (Code 998230041)</button>
                                    <button className="btn btn-sm btn-outline-secondary font-monospace" onClick={() => triggerScan('112445892')}>Scan Table (Code 112445892)</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scanned product info */}
                    <div className="col-12 col-xl-6">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 border">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2 border-bottom pb-2"><ShieldCheck size={18} className="text-indigo" color="#6366f1" /> Decoded Product Specifications</h5>
                            
                            {scannedItem ? (
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex justify-content-between border-bottom pb-2">
                                        <span className="small text-secondary">Decoded Code:</span>
                                        <span className="fw-bold text-indigo font-monospace">{scannedCode}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom pb-2">
                                        <span className="small text-secondary">Product Name:</span>
                                        <span className="fw-extrabold text-dark">{scannedItem.name}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom pb-2">
                                        <span className="small text-secondary">Product SKU Reference:</span>
                                        <span className="fw-semibold text-secondary font-monospace"><code>{scannedItem.sku}</code></span>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom pb-2">
                                        <span className="small text-secondary">Unit Weight:</span>
                                        <span className="fw-semibold text-dark">{scannedItem.weight}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom pb-2">
                                        <span className="small text-secondary">Unit Price Value:</span>
                                        <span className="fw-bold text-success fs-5">{scannedItem.price}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="small text-secondary">Warehouse Stock Level:</span>
                                        <span className="fw-bold text-dark">{scannedItem.stock}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <Barcode size={48} className="text-secondary mb-3 opacity-30" />
                                    <h6 className="fw-bold mb-1 text-dark">No scanned data available</h6>
                                    <p className="text-muted small mb-0">Scan a simulated barcode code on the left viewport to inspect product specifications.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: AI Demand Forecasting */}
            {subTab === 'ai' && (
                <div className="row g-4">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Sparkles size={18} className="text-indigo" color="#6366f1" /> AI Projections Sales Demand Forecasting (Next 5 Months)</h5>
                            
                            <div style={{ width: '100%', height: 280 }}>
                                <ResponsiveContainer>
                                    <LineChart data={initialAIPredictions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} name="AI Predicted Demand" />
                                        <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual Wholesale Orders" strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold text-dark mb-3"><Sparkles size={18} className="text-indigo" color="#6366f1" /> ML Forecasting Model</h5>
                                <p className="small text-secondary mb-3">
                                    Our **Sales Prophet ML** forecasting model analyzes historic sales, category trends, and regional monsoon timings.
                                </p>
                                <p className="small text-secondary">
                                    It predicts a **15.2% demand swell** in August, recommending stockpiling **Polypropylene granules** raw resins in July.
                                </p>
                            </div>
                            <button className="ss-btn-orange w-100 d-flex justify-content-center align-items-center gap-1.5" style={{ background: '#ff9b29' }} onClick={() => showToast('AI Procurement order draft generated!')}>
                                Draft recommended purchases
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: IoT Machinery Telemetry */}
            {subTab === 'iot' && (
                <div className="row g-4">
                    <div className="col-12 col-xl-8">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Cpu size={18} className="text-indigo" color="#6366f1" /> Real-Time IoT Machine telemetry stream: Molding Press A</h5>
                            
                            <div style={{ width: '100%', height: 280 }}>
                                <ResponsiveContainer>
                                    <LineChart data={iotData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} name="Core Temperature (°C)" />
                                        <Line type="monotone" dataKey="pressure" stroke="#0ea5e9" strokeWidth={2} name="Line Pressure (Bar)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-4">
                        <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold text-dark mb-3">IoT Telemetry Metrics</h5>
                                <p className="small text-secondary mb-3">
                                    Current sensor stream reads **Nominal** telemetry. Live data points are received via MQTT brokers in Pune factory lines.
                                </p>
                                <p className="small text-secondary">
                                    Automatic shutoffs trigger if Molding Temp exceeds **230°C** or Hydraulic Pressure exceeds **140 Bar**.
                                </p>
                            </div>
                            <span className="badge bg-success-subtle text-success py-2.5 rounded text-center fw-bold fs-6">
                                Telemetry State: NOMINAL
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Cloud Backup & Multi-Branch */}
            {subTab === 'cloud' && (
                <div className="ss-main-panel shadow-sm p-4 bg-white rounded-3">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Server size={18} /> Cloud Backup & Multi-Branch Sync Settings</h5>
                    
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <div className="p-4 border rounded-3 bg-light-subtle h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <h6 className="fw-bold text-dark mb-2">Multi-Branch Sync Logs</h6>
                                    <p className="small text-secondary mb-2">Sync Pune Main Factory, Mumbai Logistics Hub, and Delhi distribution outlets.</p>
                                    <span className="small text-muted font-monospace d-block mb-3">• Last Auto-sync: 3 mins ago (Sync clear)</span>
                                </div>
                                <button className="btn btn-sm btn-outline-secondary w-100" onClick={() => showToast('Inter-branch data synced successfully!')}>Force sync branches</button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="p-4 border rounded-3 bg-light-subtle h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <h6 className="fw-bold text-dark mb-2">Cloud Database Backup (AWS S3)</h6>
                                    <p className="small text-secondary mb-2">Create encrypted secure snapshots of general corporate ledgers, inventory turn weights, and customer rosters.</p>
                                    <span className="small text-muted font-monospace d-block mb-3">• Last Backup size: 12.4 MB (Encrypted Gzip)</span>
                                </div>
                                <button className="ss-btn-orange w-100 d-flex justify-content-center mt-2" style={{ background: '#ff9b29' }} onClick={() => showToast('Full cloud backup snapshot pushed!')}>Trigger AWS Cloud Backup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
