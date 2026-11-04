import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    CheckCircle2,
    X,
    ExternalLink,
    RefreshCw,
    Send,
    ShieldCheck,
    Activity,
    Zap,
    AlertCircle,
    Info,
    Smartphone,
    QrCode,
    Loader2,
    LogOut,
    PhoneCall,
    UserCheck,
    Clock,
    MessageSquare,
    Sliders,
    Check,
    Copy,
    Terminal,
    Sparkles,
    FileText
} from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import { useAuth } from '../../../context/AuthContext';
import {
    sendWhatsAppMessage,
    formatWhatsAppPhone,
    compileWhatsAppTemplate,
    DEFAULT_WHATSAPP_TEMPLATE,
    DEFAULT_META_PHONE_ID,
    DEFAULT_META_TOKEN,
    dispatchWhatsAppLink,
    getWhatsAppDirectUrl
} from '../../../services/whatsappService';
import {
    getWhatsAppSessionStatus,
    getWhatsAppSessionQr,
    startWhatsAppSession,
    logoutWhatsAppSession,
    sendWhatsAppWebMessage,
    getWhatsAppServiceStatus,
    getWhatsAppLogs,
    getWhatsAppConfig,
    parseWhatsAppError
} from '../../../services/whatsappWebService';
import './connected-apps.css';

// ── App Brand Logos (Clean SVGs) ──────────────────────────────
const Logos = {
    whatsapp: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" color="#25D366">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z" />
        </svg>
    )
};

export const ConnectedApps = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();
    const { user } = useAuth();

    // ── Active Navigation Tab ──────────────────────────────────
    const [activeTab, setActiveTab] = useState('pairing'); // 'pairing' | 'automation' | 'template' | 'tester' | 'logs'

    // ── Test & Notification State ──────────────────────────────
    const [testOutput, setTestOutput] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [testPhone, setTestPhone] = useState('');
    const [copiedToken, setCopiedToken] = useState(null);

    // ── WhatsApp Web.js Session State (Multi-Tenant & RBAC) ────
    const [waWebStatus, setWaWebStatus] = useState('not_initialized'); // 'not_initialized' | 'initializing' | 'qr' | 'authenticated' | 'ready' | 'disconnected'
    const [waWebQr, setWaWebQr] = useState(null);
    const [waWebInfo, setWaWebInfo] = useState(null);
    const [waWebLoading, setWaWebLoading] = useState(false);
    const [waWebActionLoading, setWaWebActionLoading] = useState(false);
    const [waWebHealth, setWaWebHealth] = useState(null);
    const [waCustomTestMsg, setWaCustomTestMsg] = useState('🧾 Namustutam POS: Tax Invoice #INV-1001 for ₹1,499.00 sent successfully! Thank you for your business ✨');

    // Audit logs state
    const [waLogs, setWaLogs] = useState([]);
    const [loadingWaLogs, setLoadingWaLogs] = useState(false);

    // Textarea ref for template variable injection
    const templateTextareaRef = useRef(null);

    // Multi-tenant & RBAC context
    const tenantId = user?.activeProjectId || user?.id || 'default';
    const tenantSessionId = `tenant_${tenantId}`;
    const isOwnerOrAdmin = !user?.activeProjectId || user.activeProjectId === user.id || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    // Show toast notifications
    const showToast = (msg, type = 'success') => {
        setToastMessage({ text: msg, type });
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Copy to clipboard helper
    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedToken(id);
        setTimeout(() => setCopiedToken(null), 2000);
        showToast('Copied to clipboard!', 'info');
    };

    // Fetch tenant message audit logs from database
    const loadWaLogs = useCallback(async () => {
        setLoadingWaLogs(true);
        try {
            const res = await getWhatsAppLogs();
            if (res.success && Array.isArray(res.data)) {
                setWaLogs(res.data);
            }
        } catch {
            // Silently catch background errors
        } finally {
            setLoadingWaLogs(false);
        }
    }, []);

    // WhatsApp Web Session status check & polling
    const checkWaWebStatus = useCallback(async (isManual = false) => {
        if (isManual) setWaWebLoading(true);
        try {
            const sid = settings.whatsappSessionId || tenantSessionId;
            const res = await getWhatsAppSessionStatus(sid);
            if (res.success) {
                setWaWebHealth(true);
                const s = res.data?.status || 'not_initialized';
                setWaWebStatus(s);
                setWaWebInfo(res.data?.info || null);

                if (s === 'ready') {
                    setWaWebQr(null);
                    if (settings.whatsappConnected !== 'true') {
                        handleChange('whatsappConnected', 'true');
                    }
                    if (res.data?.info?.phone && settings.whatsappPhone !== res.data.info.phone) {
                        handleChange('whatsappPhone', res.data.info.phone);
                    }
                } else if (s === 'qr' || res.data?.hasQr || s === 'initializing') {
                    if (res.data?.qr) {
                        setWaWebQr(res.data.qr);
                    } else {
                        const qrRes = await getWhatsAppSessionQr(sid);
                        if (qrRes.success && qrRes.data?.qr) {
                            setWaWebQr(qrRes.data.qr);
                        }
                    }
                }
                if (isManual) {
                    showToast(`WhatsApp Web connection status: ${s.toUpperCase()}`, 'info');
                    loadWaLogs();
                }
            } else {
                const health = await getWhatsAppServiceStatus();
                setWaWebHealth(health.success);
                if (!health.success) {
                    setWaWebStatus('offline');
                }
                if (isManual) {
                    showToast('WhatsApp microservice on port 3005 is offline or unreachable.', 'error');
                }
            }
        } catch {
            setWaWebHealth(false);
            setWaWebStatus('offline');
        } finally {
            if (isManual) setWaWebLoading(false);
        }
    }, [settings.whatsappSessionId, tenantSessionId, settings.whatsappConnected, settings.whatsappPhone, handleChange, loadWaLogs]);

    const handleStartWaWeb = async () => {
        setWaWebActionLoading(true);
        try {
            const sid = settings.whatsappSessionId || tenantSessionId;
            const res = await startWhatsAppSession(sid);
            if (res.success) {
                const s = res.data?.status || 'initializing';
                setWaWebStatus(s);
                if (res.data?.qr) {
                    setWaWebQr(res.data.qr);
                    showToast('QR code ready! Please scan with WhatsApp.', 'success');
                } else {
                    showToast('Starting WhatsApp Web engine... QR code will appear shortly.', 'info');
                }
                setTimeout(() => checkWaWebStatus(), 800);
            } else {
                showToast(res.error || 'Failed to start WhatsApp Web session.', 'error');
            }
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        } finally {
            setWaWebActionLoading(false);
        }
    };

    const handleLogoutWaWeb = async () => {
        if (!window.confirm('Disconnect this WhatsApp Web session? You will need to scan the QR code again to reconnect.')) return;
        setWaWebActionLoading(true);
        try {
            const sid = settings.whatsappSessionId || tenantSessionId;
            await logoutWhatsAppSession(sid);
            setWaWebStatus('disconnected');
            setWaWebQr(null);
            setWaWebInfo(null);
            handleChange('whatsappConnected', 'false');
            showToast('WhatsApp Web session disconnected successfully.');
        } catch (err) {
            showToast('Failed to disconnect: ' + err.message, 'error');
        } finally {
            setWaWebActionLoading(false);
        }
    };

    const handleSendWaWebTest = async (phoneToUse) => {
        const defaultCode = settings.whatsappCountryCode || '91';
        let rawPhone = phoneToUse || testPhone || settings.whatsappPhone || user?.phone || '';
        let cleanPhone = formatWhatsAppPhone(rawPhone, defaultCode);

        if (!cleanPhone) {
            setTestOutput({
                error: true,
                message: 'Please enter a valid recipient mobile number with country code.'
            });
            showToast('Please enter a recipient phone number first.', 'error');
            return;
        }

        if (waWebHealth === false || waWebStatus === 'offline') {
            setTestOutput({
                error: true,
                type: 'error',
                message: 'WhatsApp engine microservice on port 3005 is offline. Please start the service (npm start in whatsapp-service/) to send live messages.'
            });
            showToast('WhatsApp engine is offline. Start port 3005 service first.', 'error');
            return;
        }

        if (waWebStatus !== 'ready') {
            const statusLabel = waWebStatus === 'qr' ? 'waiting for QR scan' : (waWebStatus || 'not linked');
            setTestOutput({
                error: true,
                type: 'error',
                notLinked: true,
                message: `WhatsApp is not linked yet (status: ${statusLabel}). Please head to the "Device Pairing & QR" tab and link your WhatsApp device before sending messages.`
            });
            showToast('Please link your WhatsApp device in the Device Pairing tab first.', 'warning');
            return;
        }

        setIsTesting(true);
        setTestOutput(`Dispatching live message to +${cleanPhone} via WhatsApp Web...`);

        try {
            const msgToSend = waCustomTestMsg.trim() || '🧾 Namustutam POS Receipt: Test message verified!';
            const sid = settings.whatsappSessionId || tenantSessionId;
            const res = await sendWhatsAppWebMessage({
                to: cleanPhone,
                message: msgToSend,
                sessionId: sid,
                triggerType: 'TEST_MESSAGE'
            });

            setTestOutput({
                type: 'whatsapp_web',
                success: true,
                phone: cleanPhone,
                messageId: res.messageId,
                note: `Dispatched directly from your linked WhatsApp! (Message ID: ${res.messageId || 'delivered'})`
            });
            showToast(`Test message dispatched to +${cleanPhone}!`);
            loadWaLogs();
        } catch (err) {
            const parsedMsg = parseWhatsAppError(err, 'Failed to send via WhatsApp Web.');
            const isNotLinked = parsedMsg.includes('not connected') || parsedMsg.includes('Please link') || waWebStatus !== 'ready';
            setTestOutput({
                error: true,
                type: 'error',
                notLinked: isNotLinked,
                message: parsedMsg
            });
            showToast('Send failed: ' + parsedMsg, 'error');
            setTimeout(() => checkWaWebStatus(), 1500);
        } finally {
            setIsTesting(false);
        }
    };

    // Master enable / disable toggle
    const handleToggleMaster = async () => {
        const next = settings.whatsappConnected === 'false' ? 'true' : 'false';
        handleChange('whatsappConnected', next);
        await saveSettings({ whatsappConnected: next });
        showToast(`WhatsApp integration is now ${next === 'true' ? 'Enabled' : 'Disabled'}.`);
    };

    // Save all WhatsApp configuration settings
    const handleSaveAll = async () => {
        const payload = {
            whatsappConnected: settings.whatsappConnected !== 'false' ? 'true' : 'false',
            whatsappPhone: settings.whatsappPhone || '',
            whatsappCountryCode: settings.whatsappCountryCode || '91',
            whatsappMode: settings.whatsappMode || 'whatsapp_web',
            whatsappBackgroundAutoSend: settings.whatsappBackgroundAutoSend || 'true',
            whatsappBackgroundProvider: settings.whatsappBackgroundProvider || 'whatsapp_web',
            whatsappSessionId: settings.whatsappSessionId || tenantSessionId,
            whatsappAutoSendInvoice: settings.whatsappAutoSendInvoice !== 'false' ? 'true' : 'false',
            whatsappTemplate: settings.whatsappTemplate !== undefined ? settings.whatsappTemplate : DEFAULT_WHATSAPP_TEMPLATE
        };
        const res = await saveSettings(payload);
        if (res?.success) {
            showToast('WhatsApp Business & Web configuration saved successfully!');
        }
    };

    // Insert variable token into template textarea at cursor position
    const insertToken = (tag) => {
        const cur = settings.whatsappTemplate !== undefined
            ? settings.whatsappTemplate
            : DEFAULT_WHATSAPP_TEMPLATE;

        const textarea = templateTextareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart || 0;
            const end = textarea.selectionEnd || 0;
            const newText = cur.substring(0, start) + ' ' + tag + ' ' + cur.substring(end);
            handleChange('whatsappTemplate', newText);
            setTimeout(() => {
                textarea.focus();
                const pos = start + tag.length + 2;
                textarea.setSelectionRange(pos, pos);
            }, 0);
        } else {
            handleChange('whatsappTemplate', cur + ' ' + tag);
        }
    };

    // Lifecycle Polling
    const checkWaWebStatusRef = useRef(checkWaWebStatus);
    checkWaWebStatusRef.current = checkWaWebStatus;
    const loadWaLogsRef = useRef(loadWaLogs);
    loadWaLogsRef.current = loadWaLogs;

    useEffect(() => {
        checkWaWebStatusRef.current();
        loadWaLogsRef.current();
    }, []);

    // Fast adaptive polling: 1.2s when initializing, 2.5s when QR is displayed, 15s when ready
    useEffect(() => {
        const intervalDelay = (waWebStatus === 'initializing')
            ? 1200
            : (waWebStatus === 'qr')
                ? 2500
                : (waWebStatus === 'ready')
                    ? 15000
                    : 8000;

        const timer = setTimeout(() => {
            checkWaWebStatusRef.current();
        }, intervalDelay);

        return () => clearTimeout(timer);
    }, [waWebStatus]);

    // Prefill test phone
    useEffect(() => {
        if (!testPhone) {
            const dynamicPhone = settings?.whatsappPhone || user?.phone || '';
            if (dynamicPhone) setTestPhone(dynamicPhone);
        }
    }, [settings?.whatsappPhone, user?.phone, testPhone]);

    // Live compiled preview for the chat bubble
    const activeTemplate = settings.whatsappTemplate !== undefined ? settings.whatsappTemplate : DEFAULT_WHATSAPP_TEMPLATE;
    const storeName = settings.companyName || user?.companyName || 'Samrajya Store';
    const previewCompiled = compileWhatsAppTemplate(activeTemplate, {
        customerName: 'Aarav Sharma',
        storeName: storeName,
        invoiceNo: 'POS-2024-8841',
        amount: '₹3,498.00',
        items: '• Cotton Casual Shirt (x1) - ₹1,499.00\n• Slim Fit Trousers (x1) - ₹1,999.00',
        paymentStatus: 'PAID',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        due_amount: '₹0.00',
        payment_link: 'upi://pay?pa=store@upi&pn=' + encodeURIComponent(storeName)
    });

    if (loading) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <RefreshCw size={28} className="spin" style={{ animation: 'spin 1s linear infinite', color: '#25D366' }} />
                <p style={{ marginTop: '14px', fontSize: '0.95rem', fontWeight: 600 }}>Loading WhatsApp Business Integration...</p>
            </div>
        );
    }

    return (
        <div className="ca-wa-dashboard">
            {/* ── 1. Hero Header Banner ── */}
            <div className="ca-wa-hero-card">
                <div className="ca-wa-hero-left">
                    <div className="ca-wa-hero-logo">
                        {Logos.whatsapp}
                    </div>
                    <div>
                        <div className="ca-wa-hero-title-row">
                            <h2>WhatsApp Business & Web</h2>
                            <span className={`ca-wa-status-pill-lg ${settings.whatsappConnected !== 'false' ? 'active' : 'inactive'}`}>
                                <span className="pulse-dot"></span>
                                {settings.whatsappConnected !== 'false' ? 'Integration Active' : 'Integration Disabled'}
                            </span>
                        </div>
                        <p className="ca-wa-hero-sub">
                            Deliver automated tax invoices, POS billing receipts, and Khata ledger reminders directly to your customers' WhatsApp numbers with zero popup windows.
                        </p>
                    </div>
                </div>

                <div className="ca-wa-hero-actions">
                    <button
                        type="button"
                        className="ca-wa-btn-refresh-top"
                        onClick={() => checkWaWebStatus(true)}
                        disabled={waWebLoading}
                        title="Check Engine Status"
                    >
                        <RefreshCw size={14} className={waWebLoading ? 'spin' : ''} />
                        <span>Check Engine</span>
                    </button>

                    <div className="ca-wa-switch-box" title="Toggle WhatsApp Integration ON/OFF">
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                            {settings.whatsappConnected !== 'false' ? 'Enabled' : 'Disabled'}
                        </span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.whatsappConnected !== 'false'}
                                onChange={handleToggleMaster}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <button
                        type="button"
                        className="ca-wa-btn-save-top"
                        onClick={handleSaveAll}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <Loader2 size={15} className="spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={15} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ── 2. Health & KPI Overview Bar ── */}
            <div className="ca-wa-kpi-grid">
                {/* Engine Service KPI */}
                <div className="ca-wa-kpi-card">
                    <div className={`ca-wa-kpi-icon ${waWebHealth === true ? 'green' : (waWebHealth === false ? 'amber' : 'blue')}`}>
                        <Activity size={22} />
                    </div>
                    <div className="ca-wa-kpi-content">
                        <span className="ca-wa-kpi-title">WhatsApp Engine</span>
                        <span className="ca-wa-kpi-val" style={{ color: waWebHealth === true ? '#059669' : (waWebHealth === false ? '#dc2626' : '#2563eb') }}>
                            {waWebHealth === true ? 'Online (Port 3005)' : (waWebHealth === false ? 'Engine Offline' : 'Checking Engine...')}
                        </span>
                        <span className="ca-wa-kpi-sub">
                            {waWebHealth === true ? 'Headless Puppeteer Service' : 'Run: cd whatsapp-service && npm start'}
                        </span>
                    </div>
                </div>

                {/* Device Link Status KPI */}
                <div className="ca-wa-kpi-card">
                    <div className={`ca-wa-kpi-icon ${waWebStatus === 'ready' ? 'green' : (waWebStatus === 'qr' ? 'blue' : 'purple')}`}>
                        <Smartphone size={22} />
                    </div>
                    <div className="ca-wa-kpi-content">
                        <span className="ca-wa-kpi-title">Linked Device</span>
                        <span className="ca-wa-kpi-val">
                            {waWebStatus === 'ready' ? (
                                `+${waWebInfo?.phone || settings.whatsappPhone || 'Active'}`
                            ) : waWebStatus === 'qr' ? (
                                'Waiting for QR Scan'
                            ) : (
                                'Device Not Paired'
                            )}
                        </span>
                        <span className="ca-wa-kpi-sub">
                            {waWebInfo?.pushname ? `${waWebInfo.pushname} • Linked` : `Session: ${settings.whatsappSessionId || tenantSessionId}`}
                        </span>
                    </div>
                </div>

                {/* Dispatch Mode KPI */}
                <div className="ca-wa-kpi-card">
                    <div className="ca-wa-kpi-icon blue">
                        <Zap size={22} />
                    </div>
                    <div className="ca-wa-kpi-content">
                        <span className="ca-wa-kpi-title">Dispatch Mode</span>
                        <span className="ca-wa-kpi-val">
                            {settings.whatsappMode === 'direct' ? 'Direct wa.me' : 'Background Auto'}
                        </span>
                        <span className="ca-wa-kpi-sub">
                            {settings.whatsappBackgroundAutoSend === 'true' ? 'Zero Browser Windows' : 'Browser Link Trigger'}
                        </span>
                    </div>
                </div>

                {/* Audit Messages KPI */}
                <div className="ca-wa-kpi-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('logs')}>
                    <div className="ca-wa-kpi-icon green">
                        <FileText size={22} />
                    </div>
                    <div className="ca-wa-kpi-content">
                        <span className="ca-wa-kpi-title">Dispatched Receipts</span>
                        <span className="ca-wa-kpi-val">{waLogs.length} Messages</span>
                        <span className="ca-wa-kpi-sub" style={{ color: '#059669', fontWeight: 600 }}>
                            Click to View Audit Trail →
                        </span>
                    </div>
                </div>
            </div>

            {/* ── 3. Tab Navigation Bar ── */}
            <div className="ca-wa-tabs-bar">
                <button
                    type="button"
                    className={`ca-wa-tab-button ${activeTab === 'pairing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pairing')}
                >
                    <QrCode size={16} />
                    <span>Device Pairing & QR</span>
                    <span className={`ca-wa-tab-badge ${waWebStatus === 'ready' ? 'green' : (waWebStatus === 'qr' ? 'blue' : 'gray')}`}>
                        {waWebStatus === 'ready' ? 'Linked' : (waWebStatus === 'qr' ? 'Scan' : 'Unlinked')}
                    </span>
                </button>

                <button
                    type="button"
                    className={`ca-wa-tab-button ${activeTab === 'automation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('automation')}
                >
                    <Zap size={16} />
                    <span>Automation & Settings</span>
                </button>

                <button
                    type="button"
                    className={`ca-wa-tab-button ${activeTab === 'template' ? 'active' : ''}`}
                    onClick={() => setActiveTab('template')}
                >
                    <MessageSquare size={16} />
                    <span>Invoice Template & Preview</span>
                </button>

                <button
                    type="button"
                    className={`ca-wa-tab-button ${activeTab === 'tester' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tester')}
                >
                    <Send size={16} />
                    <span>Live Message Tester</span>
                </button>

                <button
                    type="button"
                    className={`ca-wa-tab-button ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('logs');
                        loadWaLogs();
                    }}
                >
                    <Clock size={16} />
                    <span>Message Audit Trail</span>
                    <span className="ca-wa-tab-badge gray">{waLogs.length}</span>
                </button>
            </div>

            {/* ── 4. Tab 1: Device Pairing & QR ── */}
            {activeTab === 'pairing' && (
                <div className="ca-wa-panel-body">
                    <div className="ca-wa-panel-title-area">
                        <h3 className="ca-wa-panel-title">WhatsApp Business Device Connection</h3>
                        <p className="ca-wa-panel-desc">
                            Link your store phone via WhatsApp Web QR code to enable automated invoice receipts and payment reminders directly from your number.
                        </p>
                    </div>

                    {/* State A: Engine Offline Warning */}
                    {waWebHealth === false ? (
                        <div style={{
                            background: '#fff1f2',
                            border: '1.5px solid #fecdd3',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    background: '#fee2e2',
                                    color: '#e11d48',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <AlertCircle size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#9f1239', marginBottom: '4px' }}>
                                        WhatsApp Web Engine Microservice is Offline
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#881337', lineHeight: 1.5 }}>
                                        The background WhatsApp engine on port 3005 is not reachable. Live automated background delivery of receipts and Khata reminders is currently paused.
                                    </p>
                                    {(waWebInfo?.phone || settings.whatsappPhone) && (
                                        <div style={{ marginTop: '10px', fontSize: '0.84rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Smartphone size={14} color="#64748b" />
                                            <span>Saved Business Account: <strong>+{waWebInfo?.phone || settings.whatsappPhone}</strong> (session preserved on disk)</span>
                                        </div>
                                    )}
                                    <div style={{
                                        marginTop: '14px',
                                        background: '#0f172a',
                                        color: '#f8fafc',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontFamily: 'monospace',
                                        fontSize: '0.84rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '10px'
                                    }}>
                                        <span style={{ color: '#94a3b8' }}>Start engine in your terminal:</span>
                                        <code style={{ color: '#38bdf8', fontWeight: 600 }}>cd whatsapp-service && npm start</code>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px solid #ffe4e6', paddingTop: '12px' }}>
                                {(waWebInfo?.phone || settings.whatsappPhone) && (
                                    <button
                                        type="button"
                                        className="ca-wa-btn-unlink"
                                        onClick={handleLogoutWaWeb}
                                        disabled={waWebActionLoading}
                                        style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                                    >
                                        <LogOut size={14} /> Reset Saved Session
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="ca-btn-test"
                                    onClick={() => checkWaWebStatus(true)}
                                    disabled={waWebLoading}
                                    style={{ fontSize: '0.82rem', padding: '7px 16px' }}
                                >
                                    <RefreshCw size={14} className={waWebLoading ? 'spin' : ''} />
                                    Retry Service Connection
                                </button>
                            </div>
                        </div>
                    ) : waWebStatus === 'ready' ? (
                        /* State B: Connected & Active Banner */
                        <div>
                            <div className="ca-wa-connected-banner">
                                <div className="ca-wa-connected-left">
                                    <div className="ca-wa-connected-icon">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>WhatsApp Business Connected & Active</span>
                                            <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px' }}>
                                                Verified Ready
                                            </span>
                                        </div>
                                        <div className="ca-wa-connected-meta" style={{ marginTop: '6px' }}>
                                            {waWebInfo?.phone && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: '#064e3b' }}>
                                                    <PhoneCall size={14} /> +{waWebInfo.phone}
                                                </span>
                                            )}
                                            {waWebInfo?.pushname && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#047857' }}>
                                                    <UserCheck size={14} /> {waWebInfo.pushname}
                                                </span>
                                            )}
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', opacity: 0.9 }}>
                                                <ShieldCheck size={14} /> End-to-End Encrypted Session
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        className="ca-btn-test"
                                        onClick={() => setActiveTab('tester')}
                                        style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                                    >
                                        <Send size={14} /> Send Test Message
                                    </button>
                                    <button
                                        type="button"
                                        className="ca-wa-btn-unlink"
                                        onClick={handleLogoutWaWeb}
                                        disabled={waWebActionLoading}
                                    >
                                        <LogOut size={14} />
                                        {waWebActionLoading ? 'Disconnecting...' : 'Disconnect WhatsApp'}
                                    </button>
                                </div>
                            </div>

                            {/* Quick Live Message Box inside Pairing view for instant gratification */}
                            <div className="ca-wa-test-hub">
                                <div className="ca-wa-test-hub-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Send size={16} color="#2563eb" />
                                        <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                                            Quick Live Test Dispatch
                                        </strong>
                                    </div>
                                    <span style={{ fontSize: '0.74rem', color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '10px', border: '1px solid #a7f3d0', fontWeight: 700 }}>
                                        ✓ Linked and Ready to Send
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <input
                                        type="text"
                                        placeholder={`Recipient Mobile Number (e.g. ${settings.whatsappCountryCode || '91'}XXXXXXXXXX)`}
                                        value={testPhone}
                                        onChange={(e) => setTestPhone(e.target.value)}
                                        style={{ flex: 1, minWidth: '220px', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        type="button"
                                        className="ca-wa-primary-btn"
                                        style={{ padding: '9px 20px', fontSize: '0.85rem' }}
                                        onClick={() => handleSendWaWebTest(testPhone)}
                                        disabled={isTesting}
                                    >
                                        {isTesting ? (
                                            <>
                                                <Loader2 size={15} className="spin" /> Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={15} /> Send Quick Receipt Test
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (waWebStatus === 'qr' && waWebQr) ? (
                        /* State C: QR Code Scanner View */
                        <div className="ca-wa-qr-grid" style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div className="ca-wa-qr-display">
                                <div className="ca-wa-qr-frame">
                                    <img
                                        src={waWebQr}
                                        alt="Scan this WhatsApp QR Code with phone"
                                        className="ca-wa-qr-img"
                                    />
                                    <div className="ca-wa-qr-center-logo" title="WhatsApp">
                                        <div className="ca-wa-qr-logo-inner">
                                            {Logos.whatsapp}
                                        </div>
                                    </div>
                                </div>
                                <div className="ca-wa-qr-indicator">
                                    <Loader2 size={12} className="spin" /> Auto-refreshing live QR code...
                                </div>
                                <button
                                    type="button"
                                    style={{
                                        marginTop: '10px',
                                        background: '#ffffff',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        padding: '5px 12px',
                                        fontSize: '0.78rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: '#334155',
                                        fontWeight: 600
                                    }}
                                    onClick={() => checkWaWebStatus(true)}
                                >
                                    <RefreshCw size={12} /> Refresh QR Code
                                </button>
                            </div>

                            <div>
                                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>{Logos.whatsapp}</span>
                                    Scan QR Code to Pair WhatsApp Business
                                </div>
                                <ol className="ca-wa-qr-steps-list">
                                    <li>Open <strong>WhatsApp</strong> on your mobile device.</li>
                                    <li>Tap <strong>Menu</strong> (Android <span style={{ color: '#64748b' }}>⋮</span>) or <strong>Settings</strong> (iPhone <span style={{ color: '#64748b' }}>⚙️</span>).</li>
                                    <li>Select <strong>Linked Devices</strong>, then tap <strong>Link a Device</strong>.</li>
                                    <li>Point your camera at this QR code to complete pairing.</li>
                                </ol>

                                <div className="ca-wa-security-pill" style={{ marginTop: '20px' }}>
                                    <ShieldCheck size={20} color="#2563eb" style={{ flexShrink: 0 }} />
                                    <span>
                                        <strong>End-to-End Encrypted Session:</strong> Credentials stay strictly inside your local server directory. Invoices deliver directly from your phone with no third-party cloud forwarding.
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : waWebStatus === 'initializing' ? (
                        /* State D: Initializing Engine */
                        <div className="ca-wa-cta-box" style={{ padding: '40px 20px', borderStyle: 'dashed' }}>
                            <Loader2 size={40} color="#25D366" className="spin" style={{ margin: '0 auto 14px' }} />
                            <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#0f172a' }}>
                                Launching Headless WhatsApp Engine...
                            </div>
                            <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '460px', margin: '8px auto 0' }}>
                                Initializing secure browser session. Your pairing QR code will appear right here in seconds...
                            </p>
                            <div style={{ marginTop: '14px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                    type="button"
                                    className="ca-btn-test"
                                    onClick={() => checkWaWebStatus(true)}
                                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                >
                                    <RefreshCw size={13} /> Check Status
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* State E: Not Linked / Disconnected Hero CTA */
                        <div className="ca-wa-cta-box" style={{ padding: '36px 24px', background: '#f8fafc', border: '1.5px dashed #cbd5e1' }}>
                            <div className="ca-wa-cta-avatar" style={{ width: '60px', height: '60px' }}>
                                <QrCode size={32} />
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                                Link Your WhatsApp Business via QR Code
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '540px', margin: '8px auto 20px', lineHeight: '1.6' }}>
                                Pair your store phone in seconds. Automated tax invoices, digital receipts, and Khata ledger reminders will be delivered directly from your phone with zero browser tabs or popups!
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    className="ca-wa-primary-btn"
                                    onClick={handleStartWaWeb}
                                    disabled={waWebActionLoading}
                                >
                                    {waWebActionLoading ? (
                                        <>
                                            <Loader2 size={18} className="spin" /> Launching Engine...
                                        </>
                                    ) : (
                                        <>
                                            <QrCode size={18} /> 📱 Scan QR Code to Link WhatsApp Business
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="ca-btn-test"
                                    onClick={() => checkWaWebStatus(true)}
                                    disabled={waWebLoading}
                                    style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                                >
                                    <RefreshCw size={15} className={waWebLoading ? 'spin' : ''} />
                                    Check Service Health
                                </button>
                            </div>
                            {waWebHealth === false && (
                                <div style={{ marginTop: '16px', fontSize: '0.82rem', color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 16px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={16} />
                                    WhatsApp microservice is offline. Ensure <code>npm start</code> is running in <code>whatsapp-service/</code> on port 3005.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── 5. Tab 2: Automation & Settings ── */}
            {activeTab === 'automation' && (
                <div className="ca-wa-panel-body">
                    <div className="ca-wa-panel-title-area">
                        <h3 className="ca-wa-panel-title">Automated Receipt Delivery & Methods</h3>
                        <p className="ca-wa-panel-desc">
                            Configure how receipts are dispatched during POS checkout and default phone parameters.
                        </p>
                    </div>

                    {/* Auto-Send in Background Toggle */}
                    <div className="ca-toggle-item" style={{
                        background: settings.whatsappBackgroundAutoSend === 'true' ? '#ecfdf5' : '#f8fafc',
                        border: `1.5px solid ${settings.whatsappBackgroundAutoSend === 'true' ? '#10b981' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        padding: '16px 20px',
                        marginBottom: '20px',
                        transition: 'all 0.2s ease'
                    }}>
                        <div className="ca-toggle-label">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    background: settings.whatsappBackgroundAutoSend === 'true' ? '#10b981' : '#94a3b8',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Zap size={18} />
                                </div>
                                <span className="ca-toggle-label-title" style={{
                                    fontSize: '1rem',
                                    color: settings.whatsappBackgroundAutoSend === 'true' ? '#065f46' : '#1e293b',
                                    fontWeight: '700'
                                }}>
                                    Auto-Send in Background (Without Opening WhatsApp Tabs)
                                </span>
                            </div>
                            <span className="ca-toggle-label-sub" style={{ marginTop: '6px', fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                                Invoices are delivered silently via background service upon POS checkout. Zero browser windows, popups, or external tabs will ever open on cashier screens!
                            </span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.whatsappBackgroundAutoSend === 'true'}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    handleChange('whatsappBackgroundAutoSend', isChecked ? 'true' : 'false');
                                    if (isChecked && (!settings.whatsappMode || settings.whatsappMode === 'direct')) {
                                        handleChange('whatsappMode', 'whatsapp_web');
                                    }
                                }}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* Method Selector */}
                    <div className="ca-form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                            Dispatch Method
                        </label>
                        <div className="ca-wa-method-grid">
                            {[
                                {
                                    id: 'whatsapp_web',
                                    title: 'WhatsApp Web (whatsapp-web.js)',
                                    badge: '⭐ Recommended',
                                    desc: 'Automated background delivery via linked phone. Free, instant, zero Meta API approvals.',
                                    icon: <QrCode size={18} />
                                },
                                {
                                    id: 'direct',
                                    title: 'Direct Click-to-Chat (wa.me)',
                                    badge: 'Browser Fallback',
                                    desc: 'Generates wa.me click-to-chat links for cashiers to click. Useful if running without microservice.',
                                    icon: <ExternalLink size={18} />
                                }
                            ].map((m) => {
                                const effectiveMode = settings.whatsappMode === 'direct' ? 'direct' : 'whatsapp_web';
                                const isSelected = effectiveMode === m.id;
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        className={`ca-wa-method-btn ${isSelected ? 'active' : ''}`}
                                        onClick={() => {
                                            handleChange('whatsappMode', m.id);
                                            handleChange('whatsappBackgroundAutoSend', m.id === 'whatsapp_web' ? 'true' : 'false');
                                        }}
                                        style={{ padding: '16px' }}
                                    >
                                        <div className="ca-wa-method-top">
                                            <div className="ca-wa-method-title" style={{ fontSize: '0.95rem' }}>
                                                {m.icon}
                                                <span>{m.title}</span>
                                            </div>
                                            {m.badge && (
                                                <span className="ca-wa-method-tag" style={{
                                                    backgroundColor: isSelected ? '#dcfce7' : '#f1f5f9',
                                                    color: isSelected ? '#15803d' : '#64748b',
                                                    borderColor: isSelected ? '#86efac' : '#e2e8f0'
                                                }}>
                                                    {m.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="ca-wa-method-desc" style={{ marginTop: '6px' }}>{m.desc}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Country Code & Fast-Pills */}
                    <div className="ca-form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                            Default Country Code <span className="hint">Prefix applied when mobile numbers are entered without country code</span>
                        </label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                            <input
                                type="text"
                                placeholder="91"
                                value={settings.whatsappCountryCode || '91'}
                                onChange={(e) => handleChange('whatsappCountryCode', e.target.value.replace(/[^0-9]/g, ''))}
                                style={{ width: '110px', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                            />
                            <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Quick Select:</span>
                        </div>
                        <div className="ca-country-presets" style={{ marginTop: '10px' }}>
                            {[
                                { code: '91', label: '🇮🇳 +91 India' },
                                { code: '1', label: '🇺🇸 +1 USA / Canada' },
                                { code: '44', label: '🇬🇧 +44 UK' },
                                { code: '971', label: '🇦🇪 +971 UAE' },
                                { code: '966', label: '🇸🇦 +966 Saudi Arabia' },
                                { code: '65', label: '🇸🇬 +65 Singapore' },
                                { code: '61', label: '🇦🇺 +61 Australia' }
                            ].map(item => (
                                <button
                                    key={item.code}
                                    type="button"
                                    className={`ca-country-pill ${(settings.whatsappCountryCode || '91') === item.code ? 'active' : ''}`}
                                    onClick={() => handleChange('whatsappCountryCode', item.code)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Store Sender Phone */}
                    <div className="ca-form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                            Store Sender Phone (Optional) <span className="hint">Displayed on customer receipts</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 9876543210"
                            value={settings.whatsappPhone || ''}
                            onChange={(e) => handleChange('whatsappPhone', e.target.value)}
                            style={{ padding: '9px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        />
                    </div>

                    {/* Auto Prompt on POS Checkout Toggle */}
                    <div className="ca-toggle-item" style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '16px 20px',
                        marginBottom: '24px'
                    }}>
                        <div className="ca-toggle-label">
                            <span className="ca-toggle-label-title" style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                                Auto-Dispatch Receipts Upon POS Sale Completion
                            </span>
                            <span className="ca-toggle-label-sub" style={{ marginTop: '4px', fontSize: '0.82rem', color: '#64748b' }}>
                                When enabled, successfully completed sales immediately trigger a WhatsApp receipt to the customer's phone number without additional confirmation prompts.
                            </span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.whatsappAutoSendInvoice !== 'false'}
                                onChange={(e) => handleChange('whatsappAutoSendInvoice', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            className="ca-wa-primary-btn"
                            onClick={handleSaveAll}
                            disabled={saving}
                        >
                            <CheckCircle2 size={16} />
                            {saving ? 'Saving...' : 'Save Automation Settings'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── 6. Tab 3: Invoice Template & Live Preview ── */}
            {activeTab === 'template' && (
                <div className="ca-wa-panel-body">
                    <div className="ca-wa-panel-title-area">
                        <h3 className="ca-wa-panel-title">Invoice Message Template & Live Chat Mockup</h3>
                        <p className="ca-wa-panel-desc">
                            Customize the message format sent to customers. Dynamic variables are resolved in real-time from checkout data.
                        </p>
                    </div>

                    <div className="ca-wa-split-grid">
                        {/* Left: Template Editor */}
                        <div>
                            {/* Variable Token Bar */}
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                                        Insert Dynamic Variable Chips:
                                    </span>
                                    <button
                                        type="button"
                                        className="ca-reset-template-btn"
                                        onClick={() => handleChange('whatsappTemplate', DEFAULT_WHATSAPP_TEMPLATE)}
                                    >
                                        Reset to Default
                                    </button>
                                </div>
                                <div className="ca-tokens-bar" style={{ flexWrap: 'wrap', gap: '6px' }}>
                                    {[
                                        { tag: '{customer_name}', label: '👤 Customer' },
                                        { tag: '{store_name}', label: '🏪 Store' },
                                        { tag: '{invoice_no}', label: '🧾 Invoice #' },
                                        { tag: '{amount}', label: '💰 Amount' },
                                        { tag: '{items}', label: '📦 Items' },
                                        { tag: '{payment_status}', label: '💳 Status' },
                                        { tag: '{date}', label: '📅 Date' },
                                        { tag: '{time}', label: '⏰ Time' },
                                        { tag: '{due_amount}', label: '⚠️ Due' },
                                        { tag: '{payment_link}', label: '📲 UPI Pay' }
                                    ].map(item => (
                                        <button
                                            key={item.tag}
                                            type="button"
                                            className="ca-token-chip"
                                            onClick={() => insertToken(item.tag)}
                                            title={`Click to insert ${item.tag} into template`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Template Textarea */}
                            <div className="ca-form-group">
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                                    Template Content <span className="hint">Supports WhatsApp *bold*, _italics_, and line breaks</span>
                                </label>
                                <textarea
                                    ref={templateTextareaRef}
                                    rows="9"
                                    value={settings.whatsappTemplate !== undefined ? settings.whatsappTemplate : DEFAULT_WHATSAPP_TEMPLATE}
                                    onChange={(e) => handleChange('whatsappTemplate', e.target.value)}
                                    placeholder="Enter your custom WhatsApp invoice message format..."
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        border: '1.5px solid #cbd5e1',
                                        fontSize: '0.86rem',
                                        fontFamily: 'inherit',
                                        lineHeight: 1.55,
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '14px' }}>
                                <button
                                    type="button"
                                    className="ca-wa-primary-btn"
                                    onClick={handleSaveAll}
                                    disabled={saving}
                                >
                                    <CheckCircle2 size={16} />
                                    {saving ? 'Saving...' : 'Save Template Changes'}
                                </button>
                            </div>
                        </div>

                        {/* Right: Authentic WhatsApp Chat Simulator */}
                        <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Sparkles size={14} color="#16a34a" /> Live Dynamic Customer Preview:
                            </div>

                            <div className="ca-wa-preview-box">
                                <div className="ca-wa-preview-header">
                                    <div className="ca-wa-avatar">
                                        {(storeName).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ca-wa-header-info">
                                        <span className="ca-wa-header-name">{storeName} (Official)</span>
                                        <span className="ca-wa-header-status">Online • WhatsApp Verified ✓</span>
                                    </div>
                                </div>
                                <div className="ca-wa-chat-canvas">
                                    <div className="ca-wa-bubble">
                                        {previewCompiled}
                                        <div className="ca-wa-bubble-footer">
                                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="ca-wa-ticks">✓✓</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '10px', fontSize: '0.76rem', color: '#64748b', textAlign: 'center' }}>
                                💡 Placeholders above reflect actual POS checkout data in production.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 7. Tab 4: Live Message Tester ── */}
            {activeTab === 'tester' && (
                <div className="ca-wa-panel-body">
                    <div className="ca-wa-panel-title-area">
                        <h3 className="ca-wa-panel-title">Live Message Dispatch & Engine Verification</h3>
                        <p className="ca-wa-panel-desc">
                            Send test receipts or custom WhatsApp messages to verify your linked phone and engine health in real time.
                        </p>
                    </div>

                    {waWebStatus !== 'ready' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            background: '#fffbeb',
                            border: '1.5px solid #fde68a',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '16px',
                            color: '#92400e'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                <AlertCircle size={18} color="#d97706" />
                                <div>
                                    <strong>Device Not Paired:</strong> Your WhatsApp engine is currently <em>{waWebStatus === 'qr' ? 'waiting for QR scan' : (waWebStatus || 'not initialized')}</em>. Pair your phone in the QR tab to test live messages.
                                </div>
                            </div>
                            <button
                                type="button"
                                className="ca-btn-save"
                                style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#d97706', display: 'flex', alignItems: 'center', gap: '6px' }}
                                onClick={() => setActiveTab('qr')}
                            >
                                <QrCode size={14} /> Link Device Now
                            </button>
                        </div>
                    )}

                    <div className="ca-wa-test-hub" style={{ margin: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 2fr', gap: '16px', marginBottom: '16px' }}>
                            {/* Left Input: Recipient */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                                    Recipient Mobile Number <span className="hint">with country code</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={`e.g. ${settings.whatsappCountryCode || '91'}XXXXXXXXXX`}
                                    value={testPhone}
                                    onChange={(e) => setTestPhone(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.88rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                    {settings.whatsappPhone && (
                                        <button
                                            type="button"
                                            className="ca-wa-test-chip"
                                            onClick={() => setTestPhone(settings.whatsappPhone)}
                                        >
                                            Use Store Phone
                                        </button>
                                    )}
                                    {user?.phone && (
                                        <button
                                            type="button"
                                            className="ca-wa-test-chip"
                                            onClick={() => setTestPhone(user.phone)}
                                        >
                                            Use My Phone
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Input: Message content */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', margin: 0 }}>
                                        Test Message Content
                                    </label>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            type="button"
                                            className="ca-wa-test-chip"
                                            onClick={() => setWaCustomTestMsg('🧾 *TAX INVOICE / RECEIPT*\nInvoice: #POS-2024-8841\nAmount: ₹1,499.00 (PAID)\nStore: ' + storeName + '\nThank you for shopping with us! ✨')}
                                        >
                                            Receipt
                                        </button>
                                        <button
                                            type="button"
                                            className="ca-wa-test-chip"
                                            onClick={() => setWaCustomTestMsg('⚠️ *KHATA PAYMENT REMINDER*\nDear Customer, an outstanding balance of ₹2,450.00 is due for ' + storeName + '. Please clear via UPI: pay@upi')}
                                        >
                                            Khata
                                        </button>
                                        <button
                                            type="button"
                                            className="ca-wa-test-chip"
                                            onClick={() => setWaCustomTestMsg('Hello! This is a test message from ' + storeName + ' via WhatsApp Web. ✨')}
                                        >
                                            Hello
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    rows="4"
                                    value={waCustomTestMsg}
                                    onChange={(e) => setWaCustomTestMsg(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.85rem',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Dispatch Button & Disclaimer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                💡 Delivered directly through your linked WhatsApp number with zero browser tabs or popups.
                            </div>

                            <button
                                type="button"
                                className="ca-wa-primary-btn"
                                style={{ padding: '9px 24px', fontSize: '0.9rem' }}
                                disabled={isTesting}
                                onClick={() => handleSendWaWebTest(testPhone)}
                            >
                                {isTesting ? (
                                    <>
                                        <Loader2 size={16} className="spin" /> Dispatching Message...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} /> Send Live Test Message
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Success Feedback Card */}
                        {testOutput && typeof testOutput === 'object' && testOutput.type === 'whatsapp_web' && testOutput.success && (
                            <div style={{
                                marginTop: '16px',
                                background: '#f0fdf4',
                                border: '1.5px solid #a7f3d0',
                                borderRadius: '10px',
                                padding: '14px 18px',
                                color: '#065f46'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.92rem' }}>
                                        <CheckCircle2 size={18} color="#10b981" />
                                        Message Delivered Successfully to +{testOutput.phone}!
                                    </div>
                                    <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                                        ✓ Zero Windows Open
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.84rem', color: '#047857' }}>
                                    {testOutput.note || `Delivered from your linked WhatsApp phone.`}
                                    {testOutput.messageId && (
                                        <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#059669' }}>
                                            WhatsApp Message ID: <code>{testOutput.messageId}</code>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Error Feedback Card */}
                        {testOutput && typeof testOutput === 'object' && (testOutput.error || testOutput.type === 'error') && (
                            <div style={{
                                marginTop: '16px',
                                background: '#fef2f2',
                                border: '1.5px solid #fecaca',
                                borderRadius: '10px',
                                padding: '14px 18px',
                                color: '#991b1b'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.92rem' }}>
                                        <AlertCircle size={18} color="#ef4444" />
                                        {testOutput.notLinked ? 'WhatsApp Device Not Linked' : 'Delivery Failed'}
                                    </div>
                                    {(testOutput.notLinked || waWebStatus !== 'ready') && (
                                        <button
                                            type="button"
                                            className="ca-btn-save"
                                            style={{ padding: '4px 12px', fontSize: '0.78rem', background: '#dc2626', display: 'flex', alignItems: 'center', gap: '5px' }}
                                            onClick={() => setActiveTab('qr')}
                                        >
                                            <QrCode size={13} /> Link Device Now
                                        </button>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.84rem' }}>
                                    {testOutput.message}
                                </div>
                                {(testOutput.notLinked || waWebStatus !== 'ready') && (
                                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>
                                        👉 Please head to the "Device Pairing & QR" tab and link your WhatsApp device before sending.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── 8. Tab 5: Message Audit Trail ── */}
            {activeTab === 'logs' && (
                <div className="ca-wa-panel-body">
                    <div className="ca-wa-panel-title-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                            <h3 className="ca-wa-panel-title">WhatsApp Message Delivery Audit Trail</h3>
                            <p className="ca-wa-panel-desc">
                                Database log of all transactional receipts and messages dispatched for this store workspace.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="ca-btn-test"
                            onClick={loadWaLogs}
                            disabled={loadingWaLogs}
                            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                        >
                            <RefreshCw size={13} className={loadingWaLogs ? 'spin' : ''} />
                            <span>Refresh Logs</span>
                        </button>
                    </div>

                    {loadingWaLogs ? (
                        <div style={{ textAlign: 'center', padding: '36px', color: '#64748b', fontSize: '0.88rem' }}>
                            <Loader2 size={22} className="spin" style={{ display: 'inline-block', marginRight: '8px' }} />
                            Fetching real-time logs from database...
                        </div>
                    ) : waLogs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                            <FileText size={32} style={{ margin: '0 auto 10px', opacity: 0.6 }} />
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>No WhatsApp Messages Logged Yet</div>
                            <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>
                                Messages sent during POS checkout or via the Live Tester will automatically appear in this audit log.
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <table style={{ width: '100%', fontSize: '0.84rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                                        <th style={{ padding: '10px 14px' }}>Time</th>
                                        <th style={{ padding: '10px 14px' }}>Recipient</th>
                                        <th style={{ padding: '10px 14px' }}>Trigger</th>
                                        <th style={{ padding: '10px 14px' }}>Status</th>
                                        <th style={{ padding: '10px 14px' }}>Message ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {waLogs.map((log) => (
                                        <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px 14px', color: '#64748b' }}>
                                                {log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}
                                            </td>
                                            <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                                                +{log.recipientPhone}
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '8px', background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                                                    {log.triggerType || 'MANUAL'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <span style={{
                                                    fontSize: '0.74rem',
                                                    fontWeight: 700,
                                                    padding: '3px 10px',
                                                    borderRadius: '12px',
                                                    background: log.status === 'SENT' ? '#dcfce7' : '#fee2e2',
                                                    color: log.status === 'SENT' ? '#15803d' : '#b91c1c'
                                                }}>
                                                    {log.status === 'SENT' ? '✓ SENT' : 'FAILED'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>
                                                {log.messageId ? log.messageId : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Toast Notification ── */}
            {toastMessage && (
                <div className={`ca-toast ${toastMessage.type}`}>
                    <CheckCircle2 size={16} />
                    <span>{toastMessage.text}</span>
                </div>
            )}
        </div>
    );
};

export default ConnectedApps;
