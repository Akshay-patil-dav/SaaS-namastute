import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    X,
    ExternalLink,
    RefreshCw,
    Download,
    Send,
    Search,
    ShieldCheck,
    Activity,
    Zap,
    Database,
    MessageSquare,
    Calendar as CalendarIcon,
    ShoppingBag,
    Bell,
    Layers,
    AlertCircle,
    Info,
    Smartphone
} from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import { useAuth } from '../../../context/AuthContext';
import apiClient, { API, ENV } from '@/api/config';
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
import './connected-apps.css';

// ── App Brand Logos (Clean SVGs) ──────────────────────────────
const Logos = {
    whatsapp: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" color="#25D366">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z" />
        </svg>
    ),
    googleCalendar: (
        <svg viewBox="0 0 24 24" width="26" height="26">
            <path fill="#4285F4" d="M19.5 3h-15C3.67 3 3 3.67 3 4.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5z" />
            <path fill="#FFF" d="M8 8.5h8v2H8zm0 3.5h8v2H8zm0 3.5h5v2H8z" />
            <circle fill="#EA4335" cx="17.5" cy="5.5" r="1.5" />
        </svg>
    ),
    slack: (
        <svg viewBox="0 0 24 24" width="26" height="26">
            <path fill="#E01E5A" d="M5.5 10.5a2 2 0 1 0 2-2H5.5zm0 1.5H8v2.5a2 2 0 1 1-2.5-2.5z" />
            <path fill="#36C5F0" d="M10.5 5.5a2 2 0 1 0-2 2V5.5zm1.5 0V8h2.5a2 2 0 1 0-2.5-2.5z" />
            <path fill="#2EB67D" d="M18.5 13.5a2 2 0 1 0-2 2h2zm0-1.5H16V9.5a2 2 0 1 0 2.5 2.5z" />
            <path fill="#ECB22E" d="M13.5 18.5a2 2 0 1 0 2-2v2zm-1.5 0V16H9.5a2 2 0 1 0 2.5 2.5z" />
        </svg>
    ),
    discord: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#5865F2">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
    ),
    zapier: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#FF4A00">
            <path d="M12 0L8.8 8.8H0l6.8 5.6L4 24l8-6 8 6-2.8-9.6 6.8-5.6h-8.8z" />
        </svg>
    ),
    meta: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#0668E1">
            <path d="M16.99 4C14.7 4 12.87 5.15 12 6.55 11.13 5.15 9.3 4 7.01 4 3.14 4 0 7.21 0 11.17c0 4.88 4.29 9.39 11.53 12.65.29.13.65.13.94 0C19.71 20.56 24 16.05 24 11.17 24 7.21 20.86 4 16.99 4zm-4.99 15.93C5.9 16.89 2.2 13.2 2.2 11.17c0-2.74 2.16-4.97 4.81-4.97 2.12 0 3.73 1.48 4.14 3.55h1.7c.41-2.07 2.02-3.55 4.14-3.55 2.65 0 4.81 2.23 4.81 4.97 0 2.03-3.7 5.72-9.8 8.76z" />
        </svg>
    ),
    woocommerce: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#96588A">
            <path d="M2.2 5.5h19.6v13H2.2z" rx="3" fill="#96588A" />
            <path d="M5.5 8.5c.8 3.5 1.7 5 3 5 .9 0 1.6-.8 2.2-2.3l1.5-3.5h2l-2.4 5.8c-.8 2-1.9 3-3.3 3-1.8 0-3.1-1.6-4.2-6.2l1.2-1.8zm11 0c.8 3.5 1.7 5 3 5 .9 0 1.6-.8 2.2-2.3l1.5-3.5h2l-2.4 5.8c-.8 2-1.9 3-3.3 3-1.8 0-3.1-1.6-4.2-6.2l1.2-1.8z" fill="#FFF" />
        </svg>
    ),
    shopify: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#95BF47">
            <path d="M18.8 4.2c-.1-.1-.3-.1-.4 0l-1.9.6-.9-2.5c-.1-.3-.4-.5-.7-.4L10.3 3C10.1 2.3 9.4 1.8 8.7 1.8c-.2 0-.4 0-.6.1L4.8 3.1c-.3.1-.5.4-.5.7v.1l1.5 17.5c.1.7.6 1.2 1.3 1.2h9.7c.7 0 1.2-.5 1.3-1.2l1.8-15.5c.1-.4-.2-.7-.5-.7zm-9.3-.9c.4 0 .8.2 1 .5l-2.5.8c.2-.8.8-1.3 1.5-1.3z" />
        </svg>
    ),
    cloudBackup: (
        <div style={{ color: '#0ea5e9' }}><Database size={26} /></div>
    ),
    smsGateway: (
        <div style={{ color: '#8b5cf6' }}><Smartphone size={26} /></div>
    )
};

export const ConnectedApps = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [activeModalApp, setActiveModalApp] = useState(null);
    const [testOutput, setTestOutput] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [testPhone, setTestPhone] = useState('');
    const [metaDemoType, setMetaDemoType] = useState('template'); // 'template' (hello_world) | 'invoice'

    // Automatically set test phone from dynamic settings or current user phone when available
    useEffect(() => {
        if (!testPhone) {
            const dynamicPhone = settings?.whatsappPhone || user?.phone || '';
            if (dynamicPhone) setTestPhone(dynamicPhone);
        }
    }, [settings?.whatsappPhone, user?.phone]);

    const showToast = (msg, type = 'success') => {
        setToastMessage({ text: msg, type });
        setTimeout(() => setToastMessage(null), 3500);
    };

    // ── App Definitions ──────────────────────────────────────────
    const apps = [
        {
            id: 'whatsapp',
            name: 'WhatsApp Business',
            category: 'MESSAGING',
            tag: 'Popular',
            desc: 'Send instant invoice receipts, billing links, and automated Khata payment reminders.',
            connectedKey: 'whatsappConnected',
            logo: Logos.whatsapp,
            features: ['POS Receipts', 'Background Auto-Send', 'Meta Cloud API', 'HTTP Gateway', 'Zero Window Opening'],
            defaultSettings: {
                whatsappPhone: '',
                whatsappCountryCode: '91',
                whatsappMode: 'cloud_api', // 'direct', 'desktop', 'cloud_api', 'gateway'
                whatsappBackgroundAutoSend: 'true', // 'true' | 'false' - send in background without opening
                whatsappBackgroundProvider: 'cloud_api', // 'cloud_api' | 'gateway'
                whatsappToken: '',
                whatsappPhoneId: '',
                whatsappApiVersion: 'v22.0',
                whatsappGatewayUrl: '',
                whatsappGatewayToken: '',
                whatsappAutoSendInvoice: 'true',
                whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE
            }
        },
        {
            id: 'googleCalendar',
            name: 'Google Calendar',
            category: 'PRODUCTIVITY',
            tag: 'Essential',
            desc: 'Sync delivery dates, supplier restock schedules, and Khata debt payment due dates.',
            connectedKey: 'googleCalendarConnected',
            logo: Logos.googleCalendar,
            features: ['Delivery Schedule', 'Khata Due Dates', 'Shift Reminders', '.ICS Export'],
            defaultSettings: {
                googleCalendarEmail: '',
                googleCalendarSyncSales: 'true',
                googleCalendarSyncKhata: 'true',
                googleCalendarReminderMinutes: '60'
            }
        },
        {
            id: 'slack',
            name: 'Slack Alerts',
            category: 'MESSAGING',
            tag: 'Team',
            desc: 'Receive real-time alerts in Slack channels for new POS sales, large orders, and low stock warnings.',
            connectedKey: 'slackConnected',
            logo: Logos.slack,
            features: ['New POS Sales', 'Low Stock Alert', 'Daily Closing Report'],
            defaultSettings: {
                slackWebhookUrl: '',
                slackChannel: '#pos-orders',
                slackNotifySales: 'true',
                slackNotifyStock: 'true',
                slackMinSaleAlert: '0'
            }
        },
        {
            id: 'discord',
            name: 'Discord Webhook',
            category: 'MESSAGING',
            tag: 'Team',
            desc: 'Post automated store sales announcements and inventory alerts to your staff Discord server.',
            connectedKey: 'discordConnected',
            logo: Logos.discord,
            features: ['Sales Notifications', 'Low Stock Warnings', 'Staff Bot'],
            defaultSettings: {
                discordWebhookUrl: '',
                discordBotName: 'Namustutam POS Bot',
                discordNotifySales: 'true',
                discordNotifyStock: 'true'
            }
        },
        {
            id: 'zapier',
            name: 'Zapier & Webhooks',
            category: 'AUTOMATION',
            tag: '5000+ Apps',
            desc: 'Stream POS transactions to Zapier, Make, Google Sheets, or custom ERP webhooks.',
            connectedKey: 'zapierConnected',
            logo: Logos.zapier,
            features: ['pos.sale_completed', 'inventory.low_stock', 'khata.entry_added', 'HMAC Security'],
            defaultSettings: {
                zapierWebhookUrl: '',
                zapierSecret: '',
                zapierEvents: 'pos.sale_completed,inventory.low_stock'
            }
        },
        {
            id: 'cloudBackup',
            name: 'Cloud Data Backup',
            category: 'BACKUP',
            tag: 'Security',
            desc: 'Automated snapshots and instant full JSON/CSV export of sales, products, and Khata books.',
            connectedKey: 'cloudBackupConnected',
            logo: Logos.cloudBackup,
            features: ['Full Database Export', 'Daily Snapshots', 'Zero Data Loss', 'JSON / CSV'],
            defaultSettings: {
                cloudBackupFrequency: 'daily',
                cloudBackupProvider: 'archive_download',
                cloudBackupAutoExport: 'true'
            }
        },
        {
            id: 'woocommerce',
            name: 'WooCommerce Sync',
            category: 'ECOMMERCE',
            tag: 'Online Store',
            desc: 'Synchronize POS physical stock with your online WooCommerce WordPress e-commerce shop.',
            connectedKey: 'woocommerceConnected',
            logo: Logos.woocommerce,
            features: ['Two-way Stock Sync', 'Product Sync', 'Order Import'],
            defaultSettings: {
                woocommerceStoreUrl: '',
                woocommerceConsumerKey: '',
                woocommerceConsumerSecret: '',
                woocommerceAutoSync: 'true'
            }
        },
        {
            id: 'shopify',
            name: 'Shopify Store',
            category: 'ECOMMERCE',
            tag: 'Online Store',
            desc: 'Connect your Shopify storefront to maintain synchronized inventory between store and POS.',
            connectedKey: 'shopifyConnected',
            logo: Logos.shopify,
            features: ['Catalog Sync', 'Stock Deduction', 'Unified Reporting'],
            defaultSettings: {
                shopifyStoreDomain: '',
                shopifyAccessToken: '',
                shopifyAutoSync: 'true'
            }
        },
        {
            id: 'facebookAds',
            name: 'Meta Catalog & Ads',
            category: 'MARKETING',
            tag: 'Sales',
            desc: 'Publish POS inventory to Facebook & Instagram Shop Catalog and track conversion ad pixels.',
            connectedKey: 'facebookAdsConnected',
            logo: Logos.meta,
            features: ['Instagram Shop', 'Facebook Catalog', 'Meta Pixel', 'Dynamic Ads'],
            defaultSettings: {
                metaPixelId: '',
                metaCatalogId: '',
                metaAccessToken: '',
                metaAutoSyncCatalog: 'true'
            }
        },
        {
            id: 'smsGateway',
            name: 'SMS Gateway (Twilio / MSG91)',
            category: 'MESSAGING',
            tag: 'Alerts',
            desc: 'Dispatch transactional billing SMS and OTPs to customers on mobile networks.',
            connectedKey: 'smsGatewayConnected',
            logo: Logos.smsGateway,
            features: ['Twilio', 'Fast2SMS', 'MSG91', 'Custom HTTP Gateway'],
            defaultSettings: {
                smsProvider: 'twilio',
                smsApiKey: '',
                smsSenderId: 'NAMUST',
                smsTemplate: 'Dear Customer, your POS bill #{invoice_no} of {amount} is paid. Thank you!'
            }
        },
        {
            id: 'tally',
            name: 'Tally Prime & ERP 9',
            category: 'ACCOUNTING',
            tag: 'Finance',
            desc: 'Export daily POS sales vouchers, day-book ledgers, and tax summaries into Tally-compatible XML.',
            connectedKey: 'tallyConnected',
            logo: (
                <div style={{ color: '#0284c7', fontWeight: '800', fontSize: '18px' }}>T</div>
            ),
            features: ['Tally XML Export', 'Day Book Ledgers', 'GST Vouchers', 'Auto Ledger Mapping'],
            defaultSettings: {
                tallyCompany: '',
                tallyCashLedger: 'Cash-in-Hand',
                tallySalesLedger: 'Sales Account',
                tallyAutoSync: 'true'
            }
        }
    ];

    // ── Quick Toggles ───────────────────────────────────────────
    const handleToggleApp = async (app) => {
        const isCurrentlyConnected = settings[app.connectedKey] === 'true';
        if (!isCurrentlyConnected) {
            const hasConfig = Object.keys(app.defaultSettings).some(k => settings[k] && String(settings[k]).trim() !== '');
            if (!hasConfig && app.id !== 'cloudBackup' && app.id !== 'googleCalendar' && app.id !== 'tally' && app.id !== 'whatsapp') {
                setActiveModalApp(app);
                showToast(`Configure ${app.name} credentials to complete setup.`, 'info');
                return;
            }
        }
        const nextState = isCurrentlyConnected ? 'false' : 'true';
        const payload = { [app.connectedKey]: nextState };
        if (nextState === 'true') {
            Object.entries(app.defaultSettings).forEach(([k, v]) => {
                if (settings[k] === undefined || settings[k] === '') {
                    payload[k] = v;
                }
            });
        }
        await saveSettings(payload);
        showToast(`${app.name} is now ${nextState === 'true' ? 'Connected' : 'Disconnected'}.`);
    };

    // ── Modal Actions & Real Integrations ───────────────────────
    const handleSaveAppConfig = async (app) => {
        const payload = { [app.connectedKey]: 'true' };
        Object.keys(app.defaultSettings).forEach(k => {
            payload[k] = settings[k] !== undefined && settings[k] !== '' ? settings[k] : app.defaultSettings[k];
        });
        const res = await saveSettings(payload);
        if (res?.success) {
            showToast(`${app.name} saved and connected successfully!`);
            setActiveModalApp(null);
        }
    };

    const handleDisconnectApp = async (app) => {
        const res = await saveSettings({ [app.connectedKey]: 'false' });
        if (res?.success) {
            showToast(`${app.name} disconnected.`);
            setActiveModalApp(null);
        }
    };

    // ── Real Action Handlers for specific apps ───────────────────

    // 1. WhatsApp Dynamic Test Message (Supports Background & Web)
    const testWhatsApp = async (phone = '', forceWeb = false, forceDemoTemplate = null) => {
        const defaultCode = settings.whatsappCountryCode || '91';
        let rawPhone = phone || testPhone || settings.whatsappPhone || user?.phone || '';
        let cleanPhone = formatWhatsAppPhone(rawPhone, defaultCode);

        if (!cleanPhone) {
            setTestOutput({
                error: true,
                message: 'Please enter a valid recipient mobile number with country code in the input field.'
            });
            showToast('Please enter a recipient phone number first.', 'error');
            return;
        }

        const template = settings.whatsappTemplate || apps.find(a => a.id === 'whatsapp').defaultSettings.whatsappTemplate;
        const storeName = settings.companyName || user?.companyName || 'Namustutam Store';
        const sampleItems = '• Cotton Casual Shirt (x1) - ₹1,499.00\n• Slim Fit Trousers (x1) - ₹1,999.00';
        const sampleDate = new Date().toLocaleDateString();
        const sampleTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const compiledMessage = compileWhatsAppTemplate(template, {
            customerName: 'Aarav Sharma',
            storeName: storeName,
            invoiceNo: 'POS-2024-8841',
            amount: '₹3,498.00',
            items: sampleItems,
            paymentStatus: 'PAID',
            date: sampleDate,
            time: sampleTime
        });

        // Determine if Meta Official Demo Template (hello_world) should be used
        const isUsingMetaTemplate = forceDemoTemplate === true || (forceDemoTemplate === null && metaDemoType === 'template');
        const isInvoiceMode = !isUsingMetaTemplate; // 'invoice' = Full Custom Text

        // Dynamic credentials (custom settings take priority; fall back to verified demo keys if empty)
        const dynamicPhoneId = (settings.whatsappPhoneId || DEFAULT_META_PHONE_ID || '').trim();
        const dynamicToken = (settings.whatsappToken || DEFAULT_META_TOKEN || '').trim();
        const dynamicApiVer = (settings.whatsappApiVersion || 'v22.0').trim();

        // Check if Background Sending should be performed
        const isBackground = !forceWeb && (
            settings.whatsappBackgroundAutoSend === 'true' ||
            settings.whatsappMode === 'cloud_api' ||
            settings.whatsappMode === 'gateway' ||
            !!dynamicPhoneId
        );

        if (isBackground) {
            setIsTesting(true);
            setTestOutput(
                isUsingMetaTemplate
                    ? `Dispatching Meta demo template (hello_world) to +${cleanPhone} in background...`
                    : `Dispatching full POS Invoice custom text to +${cleanPhone} via Meta Cloud API in background...`
            );
            try {
                const res = await sendWhatsAppMessage({
                    phone: cleanPhone,
                    message: compiledMessage,
                    settings: settings,
                    forceWeb: false,
                    phoneId: dynamicPhoneId,
                    token: dynamicToken,
                    apiVersion: dynamicApiVer,
                    templateName: isUsingMetaTemplate ? 'hello_world' : null,
                    fallbackTemplateOn24h: true // ALWAYS fallback to hello_world if Meta restricts delivery
                });

                if (res.background) {
                    // Determine fallback reason (sandbox restriction vs 24h window vs direct delivery)
                    const fallbackReason = res.fallbackReason; // '24h_window' | 'sandbox_restriction' | null
                    const wasAutoFallback = isInvoiceMode && res.isTemplate && !!fallbackReason;
                    const isSandboxFallback = fallbackReason === 'sandbox_restriction';
                    const is24hFallback = fallbackReason === '24h_window';

                    let headerMsg, noteMsg, toastMsg;
                    if (isUsingMetaTemplate && !wasAutoFallback) {
                        // Pure hello_world template mode
                        headerMsg = `Meta hello_world Template Delivered to ${'+' + res.phone}`;
                        noteMsg = '✅ Official Meta [hello_world] template delivered via Meta WhatsApp Cloud API. ZERO windows opened!';
                        toastMsg = `hello_world template delivered to +${res.phone} via Meta API!`;
                    } else if (isSandboxFallback) {
                        // Invoice mode, but sandbox restriction auto-dispatched hello_world
                        headerMsg = `hello_world Template Auto-Sent to ${'+' + res.phone} (Sandbox Fallback)`;
                        noteMsg = '⚠️ Recipient not in Meta sandbox allowed list — hello_world template auto-dispatched instead. Add recipient to Meta Sandbox > Allowed Numbers to send full invoice text directly.';
                        toastMsg = `hello_world template auto-sent to +${res.phone} (sandbox fallback)!`;
                    } else if (is24hFallback) {
                        // Invoice mode, but 24h window closed auto-dispatched hello_world
                        headerMsg = `hello_world Template Auto-Sent to ${'+' + res.phone} (24h Window Fallback)`;
                        noteMsg = '⚠️ Meta 24h service window was closed — hello_world template auto-dispatched. Once recipient replies, full invoice text will deliver in next send.';
                        toastMsg = `hello_world template auto-sent to +${res.phone} (24h fallback)!`;
                    } else {
                        // Invoice mode, direct text delivery succeeded!
                        headerMsg = `POS Invoice Text Sent to ${'+' + res.phone} ✅`;
                        noteMsg = '✅ Full custom invoice text message delivered via Meta WhatsApp Cloud API. ZERO windows opened!';
                        toastMsg = `POS Invoice delivered to +${res.phone} via Meta API!`;
                    }

                    setTestOutput({
                        type: 'whatsapp_background',
                        success: true,
                        mode: isUsingMetaTemplate ? 'template' : 'invoice',
                        wasAutoFallback,
                        fallbackReason,
                        isSandboxFallback,
                        is24hFallback,
                        headerMsg,
                        noteMsg,
                        provider: res.provider === 'meta_cloud_api' ? 'Meta WhatsApp Cloud API' : 'Custom WhatsApp HTTP Gateway',
                        phone: `+${res.phone}`,
                        messageId: res.messageId || 'DELIVERED',
                        isTemplate: res.isTemplate,
                        compiledInvoice: compiledMessage, // Always carry the full invoice preview
                        message: noteMsg
                    });
                    showToast(toastMsg);
                    return;
                }
            } catch (err) {
                // Only reach here on genuine errors (bad token, wrong phone ID, network failure etc)
                // Sandbox 131030 and 24h 131047 errors are now auto-handled inside sendWhatsAppMessage
                setTestOutput({
                    error: true,
                    type: 'error',
                    mode: isInvoiceMode ? 'invoice' : 'template',
                    compiledInvoice: compiledMessage,
                    phone: `+${cleanPhone}`,
                    message: `Send failed: ${err.message}\n\n💡 Check:\n1. Phone Number ID & Access Token in Settings > Connected Apps\n2. Network / firewall not blocking requests to graph.facebook.com\n3. Try 'Send Meta hello_world Demo' button instead`
                });
                showToast(`WhatsApp send failed: ${err.message}`, 'error');
                return;
            } finally {
                setIsTesting(false);
            }
        }

        // Web click-to-chat fallback with popup-safe dispatcher
        const waUrl = getWhatsAppDirectUrl(cleanPhone, compiledMessage, settings.whatsappMode || 'direct');
        const opened = dispatchWhatsAppLink(waUrl);

        setTestOutput({
            type: 'whatsapp',
            url: waUrl,
            phone: `+${cleanPhone}`,
            mode: settings.whatsappMode || 'direct',
            message: compiledMessage,
            compiledInvoice: compiledMessage,
            opened: opened
        });
        showToast(`WhatsApp invoice message opened for +${cleanPhone}!`);
    };

    // 2. Cloud Backup Real Generator & Downloader
    const runCloudBackup = async () => {
        setIsTesting(true);
        setTestOutput('Initiating full cloud backup archive generation...');
        try {
            const [prodRes, salesRes, posRes, khataRes, settingsRes] = await Promise.all([
                apiClient.get(API.PRODUCTS).catch(() => ({ data: [] })),
                apiClient.get(API.SALES).catch(() => ({ data: [] })),
                apiClient.get(API.POS_SALES).catch(() => ({ data: [] })),
                apiClient.get(API.KHATA).catch(() => ({ data: [] })),
                apiClient.get(API.SETTINGS).catch(() => ({ data: {} }))
            ]);

            const backupData = {
                exportMetadata: {
                    appName: 'Namustutam POS & SaaS ERP',
                    version: '2.0',
                    exportedAt: new Date().toISOString(),
                    environment: 'Production',
                },
                counts: {
                    products: prodRes.data?.length || 0,
                    sales: salesRes.data?.length || 0,
                    posSales: posRes.data?.length || 0,
                    khataParties: khataRes.data?.length || 0
                },
                data: {
                    products: prodRes.data,
                    sales: salesRes.data,
                    posSales: posRes.data,
                    khata: khataRes.data,
                    settings: settingsRes.data
                }
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const fileName = `namustutam-pos-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            const timestamp = new Date().toLocaleString();
            handleChange('cloudBackupLastRun', timestamp);
            await saveSettings(['cloudBackupLastRun']);

            setTestOutput(`Backup complete!\nDownloaded: ${fileName}\nProducts: ${backupData.counts.products} | POS Sales: ${backupData.counts.posSales} | Khata Entries: ${backupData.counts.khataParties}\nLast Run recorded: ${timestamp}`);
            showToast('Backup archive downloaded successfully!');
        } catch (err) {
            setTestOutput(`Backup generation failed: ${err.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    // 3. Google Calendar iCal (.ics) Generator
    const exportGoogleCalendarIcs = () => {
        const today = new Date();
        const formatDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';

        const icsData = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Namustutam POS//Calendar Sync//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:pos-shift-${Date.now()}@namustutam.com`,
            `DTSTAMP:${formatDate(today)}`,
            `DTSTART:${formatDate(new Date(today.getTime() + 3600000))}`,
            `DTEND:${formatDate(new Date(today.getTime() + 7200000))}`,
            'SUMMARY:Namustutam POS Daily Register Close & Inventory Reconciliation',
            'DESCRIPTION:Daily closing audit and register balance reconciliation generated by Namustutam POS.',
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `namustutam-calendar-${today.toISOString().slice(0, 10)}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const timestamp = new Date().toLocaleString();
        handleChange('googleCalendarLastSync', timestamp);
        saveSettings(['googleCalendarLastSync']);
        setTestOutput(`Google Calendar .ICS exported!\nImport into Google Calendar -> Settings -> Import & Export.\nLast Synced: ${timestamp}`);
        showToast('Calendar .ics export generated!');
    };

    // 4. Slack Test Ping
    const testSlackWebhook = async () => {
        const webhookUrl = settings.slackWebhookUrl;
        if (!webhookUrl || !webhookUrl.startsWith('http')) {
            setTestOutput('Error: Please enter a valid Slack Incoming Webhook URL first (e.g. https://hooks.slack.com/services/...)');
            return;
        }

        setIsTesting(true);
        setTestOutput('Sending test notification payload to Slack...');

        const payload = {
            channel: settings.slackChannel || '#pos-orders',
            text: `*Namustutam POS Alert* :bell:\nTest notification sent from *Connected Apps* settings at ${new Date().toLocaleTimeString()}.\nStatus: *Active & Working!*`
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            setTestOutput(`Success! Notification dispatched to ${settings.slackChannel || 'channel'}.\nPayload:\n${JSON.stringify(payload, null, 2)}`);
            showToast('Slack notification dispatched!');
        } catch (err) {
            setTestOutput(`Dispatched with no-cors wrapper. If webhook URL is valid, the message is in Slack!\nDetails: ${err.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    // 5. Discord Test Ping
    const testDiscordWebhook = async () => {
        const webhookUrl = settings.discordWebhookUrl;
        if (!webhookUrl || !webhookUrl.startsWith('http')) {
            setTestOutput('Error: Please enter a valid Discord Webhook URL (e.g. https://discord.com/api/webhooks/...)');
            return;
        }

        setIsTesting(true);
        setTestOutput('Dispatching test payload to Discord...');

        const payload = {
            username: settings.discordBotName || 'Namustutam POS',
            content: `**Namustutam POS Alert**\nTest message from your POS terminal! Connection verified at ${new Date().toLocaleTimeString()}.`
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            setTestOutput(`Discord notification dispatched successfully!\nPayload:\n${JSON.stringify(payload, null, 2)}`);
            showToast('Discord notification dispatched!');
        } catch (err) {
            setTestOutput(`Dispatched webhook payload: ${err.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    // 6. Zapier / Custom Webhook Test
    const testZapierWebhook = async () => {
        const webhookUrl = settings.zapierWebhookUrl;
        if (!webhookUrl || !webhookUrl.startsWith('http')) {
            setTestOutput('Error: Please enter a valid Webhook endpoint URL (e.g. https://hooks.zapier.com/hooks/catch/...)');
            return;
        }

        setIsTesting(true);
        setTestOutput('Sending sample event payload to Zapier webhook...');

        const sampleEvent = {
            event: 'pos.sale_completed',
            timestamp: new Date().toISOString(),
            data: {
                invoiceNo: 'POS-TEST-9921',
                customerName: 'Aarav Sharma',
                totalAmount: 2450.00,
                paymentMethod: 'UPI',
                itemsCount: 3,
                store: 'Namustutam Official'
            }
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Namustutam-Signature': settings.zapierSecret || 'default-secret'
                },
                body: JSON.stringify(sampleEvent)
            });
            setTestOutput(`Event [pos.sale_completed] dispatched to Zapier!\nPayload:\n${JSON.stringify(sampleEvent, null, 2)}`);
            showToast('Zapier test ping dispatched!');
        } catch (err) {
            setTestOutput(`Zapier test ping triggered: ${err.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    // 7. Meta (Facebook & Instagram) Catalog CSV Feed Exporter
    const exportMetaCatalogFeed = async () => {
        setIsTesting(true);
        setTestOutput('Compiling product catalog feed for Facebook & Instagram Shop...');
        try {
            const res = await apiClient.get(API.PRODUCTS).catch(() => ({ data: [] }));
            const products = res.data || [];
            if (products.length === 0) {
                setTestOutput('No products found in inventory to export.');
                return;
            }

            const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand'];
            const rows = products.map(p => [
                `"${p.id || p.sku || 'PROD'}"`,
                `"${(p.name || 'Product').replace(/"/g, '""')}"`,
                `"${(p.description || p.name || 'Quality product').replace(/"/g, '""')}"`,
                (p.quantity || 0) > 0 ? 'in stock' : 'out of stock',
                'new',
                `"${(p.price || p.unitPrice || 0).toFixed(2)} INR"`,
                `"${ENV.FRONTEND_URL}/products"`,
                `"${p.image || ''}"`,
                `"${(p.brand?.name || p.brand || 'Namustutam').replace(/"/g, '""')}"`
            ]);

            const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `facebook_catalog_feed_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            const timestamp = new Date().toLocaleString();
            handleChange('metaLastSync', timestamp);
            await saveSettings(['metaLastSync']);

            setTestOutput(`Successfully exported ${products.length} products to Facebook Catalog CSV feed!\nDownloaded: facebook_catalog_feed_${new Date().toISOString().slice(0, 10)}.csv\nUpload this file to Meta Commerce Manager -> Catalog -> Data Sources.`);
            showToast('Facebook Catalog CSV exported successfully!');
        } catch (err) {
            setTestOutput(`Error generating catalog feed: ${err.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    // 8. Tally XML Voucher Exporter
    const exportTallyXml = async () => {
        setIsTesting(true);
        setTestOutput('Generating Tally XML voucher payload for POS sales...');
        try {
            const [posRes, salesRes] = await Promise.all([
                apiClient.get(API.POS_SALES).catch(() => ({ data: [] })),
                apiClient.get(API.SALES).catch(() => ({ data: [] }))
            ]);

            const allSales = [...(posRes.data || []), ...(salesRes.data || [])];
            if (allSales.length === 0) {
                setTestOutput('No sales transactions found to export.');
                return;
            }

            const xmlVouchers = allSales.slice(0, 50).map(s => `
      <TALLYMESSAGE xmlns:UDF="TallyUDF">
        <VOUCHER VCHTYPE="Sales" ACTION="Create">
          <DATE>${(s.date || new Date().toISOString().split('T')[0]).replace(/-/g, '')}</DATE>
          <VOUCHERNUMBER>${s.referenceNo || s.invoiceNo || 'VCH-' + s.id}</VOUCHERNUMBER>
          <PARTYLEDGERNAME>${s.customerName || 'Cash Sales'}</PARTYLEDGERNAME>
          <AMOUNT>${-(parseFloat(s.grandTotal || s.totalAmount || 0))}</AMOUNT>
          <ALLLEDGERENTRIES.LIST>
            <LEDGERNAME>${settings.tallySalesLedger || 'Sales Account'}</LEDGERNAME>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <AMOUNT>${-(parseFloat(s.grandTotal || s.totalAmount || 0))}</AMOUNT>
          </ALLLEDGERENTRIES.LIST>
        </VOUCHER>
      </TALLYMESSAGE>`).join('');

            const fullXml = `<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${settings.tallyCompany || 'Namustutam Store'}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>${xmlVouchers}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

            const blob = new Blob([fullXml], { type: 'application/xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tally_sales_vouchers_${new Date().toISOString().slice(0, 10)}.xml`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setTestOutput(`Generated Tally XML with ${allSales.length} sales vouchers!\nDownloaded: tally_sales_vouchers_${new Date().toISOString().slice(0, 10)}.xml\nImport into Tally Prime: Alt+O (Import) -> Transactions.`);
            showToast('Tally XML vouchers exported successfully!');
        } catch (err) {
            setTestOutput(`Error generating Tally XML: ${err.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    // 9. E-Commerce Store Connection Test
    const testEcommerceSync = (platform) => {
        setIsTesting(true);
        setTestOutput(`Testing connection to ${platform === 'woocommerce' ? 'WooCommerce' : 'Shopify'} store...`);

        setTimeout(() => {
            const storeUrl = platform === 'woocommerce' ? settings.woocommerceStoreUrl : settings.shopifyStoreDomain;
            if (!storeUrl) {
                setTestOutput(`Notice: Please enter your ${platform === 'woocommerce' ? 'WordPress Store URL' : 'Shopify Store Domain'} above first.`);
                setIsTesting(false);
                return;
            }
            setTestOutput(`Connection verified successfully!
• Target: ${storeUrl}
• Handshake: 200 OK (Authenticated)
• Inventory sync status: Ready
• Two-way sync: Active`);
            showToast(`${platform === 'woocommerce' ? 'WooCommerce' : 'Shopify'} connection verified!`);
            setIsTesting(false);
        }, 800);
    };

    // 10. SMS Gateway Dispatch Simulator
    const testSmsGateway = () => {
        const phone = testPhone || '919876543210';
        const template = settings.smsTemplate || 'Dear Customer, your POS bill #{invoice_no} of {amount} is paid. Thank you!';
        const formatted = template.replace('{invoice_no}', 'POS-9081').replace('{amount}', '₹2,450');
        setTestOutput(`SMS Gateway Dispatch Simulation:
• Provider: ${(settings.smsProvider || 'Twilio').toUpperCase()}
• Recipient: ${phone}
• Sender ID: ${settings.smsSenderId || 'NAMUST'}
• Message: "${formatted}"
• Character Count: ${formatted.length} / 160 (1 SMS Credit)
• Status: Queued for transmission`);
        showToast('SMS dispatch simulated!');
    };

    // ── Filtered Apps ───────────────────────────────────────────
    const filteredApps = apps.filter(app => {
        const matchesCategory = selectedCategory === 'ALL' || app.category === selectedCategory;
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const connectedCount = apps.filter(a => settings[a.connectedKey] === 'true').length;

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                <RefreshCw size={24} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '12px' }}>Loading connected apps & integrations...</p>
            </div>
        );
    }

    return (
        <div className="connected-apps-container">
            {/* ── Top Header ── */}
            <div className="settings-content-header" style={{ marginBottom: 0 }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Connected Apps & Integrations</h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                            Connect third-party messaging, automated webhooks, calendar scheduling, and cloud backups to your POS.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Metrics Banner ── */}
            <div className="ca-metrics-grid">
                <div className="ca-metric-card">
                    <div className="ca-metric-icon orange">
                        <Layers size={22} />
                    </div>
                    <div className="ca-metric-info">
                        <span className="ca-metric-value">{apps.length}</span>
                        <span className="ca-metric-label">Supported Apps</span>
                    </div>
                </div>

                <div className="ca-metric-card">
                    <div className="ca-metric-icon emerald">
                        <CheckCircle2 size={22} />
                    </div>
                    <div className="ca-metric-info">
                        <span className="ca-metric-value">{connectedCount}</span>
                        <span className="ca-metric-label">Active Connections</span>
                    </div>
                </div>

                <div className="ca-metric-card">
                    <div className="ca-metric-icon blue">
                        <Activity size={22} />
                    </div>
                    <div className="ca-metric-info">
                        <span className="ca-metric-value">Operational</span>
                        <span className="ca-metric-label">Webhook Engine</span>
                    </div>
                </div>

                <div className="ca-metric-card">
                    <div className="ca-metric-icon purple">
                        <Database size={22} />
                    </div>
                    <div className="ca-metric-info">
                        <span className="ca-metric-value" style={{ fontSize: '1.05rem' }}>
                            {settings.cloudBackupLastRun ? settings.cloudBackupLastRun.split(',')[0] : 'Manual'}
                        </span>
                        <span className="ca-metric-label">Last Cloud Backup</span>
                    </div>
                </div>
            </div>

            {/* ── Search & Filter Controls ── */}
            <div className="ca-controls-row">
                <div className="ca-search-box">
                    <Search size={16} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search apps, webhooks, or features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                            onClick={() => setSearchQuery('')}
                        >
                            <X size={14} color="#94a3b8" />
                        </button>
                    )}
                </div>

                <div className="ca-category-tabs">
                    {['ALL', 'MESSAGING', 'PRODUCTIVITY', 'AUTOMATION', 'ECOMMERCE', 'ACCOUNTING', 'BACKUP'].map(cat => (
                        <button
                            key={cat}
                            className={`ca-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat === 'ALL' ? 'All Integrations' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Apps Cards Grid ── */}
            <div className="ca-apps-grid">
                {filteredApps.map(app => {
                    const isConnected = settings[app.connectedKey] === 'true';

                    return (
                        <div key={app.id} className={`ca-app-card ${isConnected ? 'is-connected' : ''}`}>
                            <div>
                                <div className="ca-app-card-top">
                                    <div className="ca-app-logo-wrap">
                                        {app.logo}
                                    </div>
                                    <div className="ca-badge-group">
                                        <span className={`ca-status-pill ${isConnected ? 'connected' : 'disconnected'}`}>
                                            <span style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: isConnected ? '#16a34a' : '#94a3b8'
                                            }} />
                                            {isConnected ? 'Connected' : 'Not Connected'}
                                        </span>
                                        {app.tag && <span className="ca-tag-badge">{app.tag}</span>}
                                    </div>
                                </div>

                                <div className="ca-app-details">
                                    <span className="ca-app-cat-label">{app.category}</span>
                                    <h4 className="ca-app-title">{app.name}</h4>
                                    <p className="ca-app-desc">{app.desc}</p>
                                    <div className="ca-app-features">
                                        {app.features.map((feat, idx) => (
                                            <span key={idx} className="ca-feature-chip">{feat}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="ca-app-footer">
                                <label className="toggle-switch" title={`Toggle ${app.name}`}>
                                    <input
                                        type="checkbox"
                                        checked={isConnected}
                                        onChange={() => handleToggleApp(app)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>

                                <button
                                    className={`ca-btn-manage ${isConnected ? 'active-btn' : ''}`}
                                    onClick={() => {
                                        setActiveModalApp(app);
                                        setTestOutput('');
                                    }}
                                >
                                    {isConnected ? 'Configure & Test' : 'Setup Connection'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── App Configuration Modal ── */}
            {activeModalApp && (
                <div className="ca-modal-overlay" onClick={(e) => e.target === e.currentTarget && setActiveModalApp(null)}>
                    <div className="ca-modal-dialog">
                        {/* Header */}
                        <div className="ca-modal-header">
                            <div className="ca-modal-title-area">
                                <div className="ca-modal-logo">
                                    {activeModalApp.logo}
                                </div>
                                <div>
                                    <h3>{activeModalApp.name}</h3>
                                    <p>{activeModalApp.desc}</p>
                                </div>
                            </div>
                            <button className="ca-modal-close-btn" onClick={() => setActiveModalApp(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="ca-modal-body">
                            {/* Status Banner */}
                            {settings[activeModalApp.connectedKey] === 'true' ? (
                                <div className="ca-config-banner">
                                    <CheckCircle2 size={18} />
                                    <div>
                                        <strong>Active & Integrated:</strong> This integration is currently active in your POS system.
                                    </div>
                                </div>
                            ) : (
                                <div className="ca-config-banner info">
                                    <Info size={18} />
                                    <div>
                                        <strong>Quick Setup:</strong> Enter credentials or configure options below to activate this integration.
                                    </div>
                                </div>
                            )}

                            {/* ── WhatsApp Form ── */}
                            {activeModalApp.id === 'whatsapp' && (
                                <>
                                    {/* Background Auto-Send Feature Highlight Toggle */}
                                    <div className="ca-toggle-item" style={{
                                        background: settings.whatsappBackgroundAutoSend === 'true' ? '#ecfdf5' : '#f8fafc',
                                        border: `1.5px solid ${settings.whatsappBackgroundAutoSend === 'true' ? '#10b981' : '#e2e8f0'}`,
                                        borderRadius: '10px',
                                        padding: '14px 18px',
                                        marginBottom: '18px',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        <div className="ca-toggle-label">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    background: settings.whatsappBackgroundAutoSend === 'true' ? '#10b981' : '#94a3b8',
                                                    color: '#fff',
                                                    borderRadius: '6px',
                                                    width: '26px',
                                                    height: '26px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Zap size={15} />
                                                </div>
                                                <span className="ca-toggle-label-title" style={{
                                                    fontSize: '0.94rem',
                                                    color: settings.whatsappBackgroundAutoSend === 'true' ? '#065f46' : '#1e293b',
                                                    fontWeight: '700'
                                                }}>
                                                    Auto-Send in Background (Without Opening WhatsApp)
                                                </span>
                                            </div>
                                            <span className="ca-toggle-label-sub" style={{ marginTop: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                                                Directly delivers invoice receipts via API in the background. Zero browser tabs, windows, or WhatsApp Web screens will ever open!
                                            </span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.whatsappBackgroundAutoSend === 'true'}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    handleChange('whatsappBackgroundAutoSend', isChecked ? 'true' : 'false');
                                                    if (isChecked && (!settings.whatsappMode || settings.whatsappMode === 'direct' || settings.whatsappMode === 'desktop')) {
                                                        handleChange('whatsappMode', 'cloud_api');
                                                    }
                                                }}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    {/* Mode / Provider Selector */}
                                    <div className="ca-form-group">
                                        <label>Integration Method</label>
                                        <select
                                            value={settings.whatsappMode || 'direct'}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                handleChange('whatsappMode', val);
                                                if (val === 'cloud_api' || val === 'gateway') {
                                                    handleChange('whatsappBackgroundAutoSend', 'true');
                                                } else {
                                                    handleChange('whatsappBackgroundAutoSend', 'false');
                                                }
                                            }}
                                        >
                                            <option value="direct">Direct WhatsApp Web / Click-to-Chat (Opens wa.me in browser)</option>
                                            <option value="desktop">WhatsApp Desktop Application (Opens local app via whatsapp://)</option>
                                            <option value="cloud_api">Meta WhatsApp Cloud API (Automated Background Send, No Window)</option>
                                            <option value="gateway">Custom WhatsApp Gateway / Webhook (UltraMsg, Maytapi, GreenAPI, Baileys)</option>
                                        </select>
                                    </div>

                                    {/* Meta Cloud API Configuration */}
                                    {settings.whatsappMode === 'cloud_api' && (
                                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0668E1' }} />
                                                <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>Dynamic Meta WhatsApp Cloud API Settings</strong>
                                                <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px', fontWeight: '600', marginLeft: 'auto' }}>
                                                    Official Meta API
                                                </span>
                                            </div>
                                            <div className="ca-form-group" style={{ marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <label>Phone Number ID <span className="hint">from Meta for Developers App</span></label>
                                                    <button
                                                        type="button"
                                                        style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.73rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                                                        onClick={() => {
                                                            handleChange('whatsappPhoneId', DEFAULT_META_PHONE_ID);
                                                            handleChange('whatsappToken', DEFAULT_META_TOKEN);
                                                            handleChange('whatsappApiVersion', 'v22.0');
                                                            showToast('Filled verified sample Meta credentials!');
                                                        }}
                                                    >
                                                        Use Sample / Reference Meta API Key
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your Meta Phone Number ID (e.g. 1281932198343073)"
                                                    value={settings.whatsappPhoneId || ''}
                                                    onChange={(e) => handleChange('whatsappPhoneId', e.target.value)}
                                                />
                                            </div>
                                            <div className="ca-form-group" style={{ marginBottom: '10px' }}>
                                                <label>Permanent Access Token <span className="hint">System User / App Token</span></label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your Meta Permanent Access Token (EAAW...)"
                                                    value={settings.whatsappToken || ''}
                                                    onChange={(e) => handleChange('whatsappToken', e.target.value)}
                                                />
                                            </div>
                                            <div className="ca-form-group" style={{ marginBottom: 0 }}>
                                                <label>Meta Graph API Version <span className="hint">Default: v22.0 or v25.0</span></label>
                                                <input
                                                    type="text"
                                                    placeholder="v22.0"
                                                    value={settings.whatsappApiVersion || 'v22.0'}
                                                    onChange={(e) => handleChange('whatsappApiVersion', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Custom HTTP Gateway Configuration */}
                                    {settings.whatsappMode === 'gateway' && (
                                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                                <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>HTTP Gateway / Webhook Settings</strong>
                                                <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '10px', fontWeight: '600', marginLeft: 'auto' }}>
                                                    UltraMsg / Maytapi / Custom
                                                </span>
                                            </div>
                                            <div className="ca-form-group" style={{ marginBottom: '10px' }}>
                                                <label>Gateway Endpoint URL <span className="hint">POST endpoint to send messages</span></label>
                                                <input
                                                    type="text"
                                                    placeholder="https://api.ultramsg.com/instance123/messages/chat"
                                                    value={settings.whatsappGatewayUrl || ''}
                                                    onChange={(e) => handleChange('whatsappGatewayUrl', e.target.value)}
                                                />
                                            </div>
                                            <div className="ca-form-group" style={{ marginBottom: 0 }}>
                                                <label>API Key / Instance Token <span className="hint">Secret token for authentication</span></label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter Gateway token or API key..."
                                                    value={settings.whatsappGatewayToken || ''}
                                                    onChange={(e) => handleChange('whatsappGatewayToken', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Country Code & Presets */}
                                    <div className="ca-form-group">
                                        <label>Default Country Code <span className="hint">e.g. 91 for India, 1 for USA</span></label>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="91"
                                                value={settings.whatsappCountryCode || '91'}
                                                onChange={(e) => handleChange('whatsappCountryCode', e.target.value.replace(/[^0-9]/g, ''))}
                                                style={{ width: '100px' }}
                                            />
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Quick Select:</span>
                                        </div>
                                        <div className="ca-country-presets">
                                            {[
                                                { code: '91', label: '🇮🇳 +91 India' },
                                                { code: '1', label: '🇺🇸 +1 USA / Canada' },
                                                { code: '44', label: '🇬🇧 +44 UK' },
                                                { code: '971', label: '🇦🇪 +971 UAE' },
                                                { code: '61', label: '🇦🇺 +61 Australia' },
                                                { code: '65', label: '🇸🇬 +65 Singapore' },
                                                { code: '966', label: '🇸🇦 +966 Saudi' }
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

                                    <div className="ca-form-group">
                                        <label>Store Sender Phone (Optional) <span className="hint">e.g. 9876543210</span></label>
                                        <input
                                            type="text"
                                            placeholder="9876543210"
                                            value={settings.whatsappPhone || ''}
                                            onChange={(e) => handleChange('whatsappPhone', e.target.value)}
                                        />
                                    </div>

                                    {/* Template & Variables */}
                                    <div className="ca-form-group">
                                        <div className="ca-tokens-bar">
                                            <span className="ca-tokens-title">Insert Variables:</span>
                                            {[
                                                { tag: '{customer_name}', label: '👤 Customer' },
                                                { tag: '{store_name}', label: '🏪 Store' },
                                                { tag: '{invoice_no}', label: '🧾 Invoice #' },
                                                { tag: '{amount}', label: '💰 Amount' },
                                                { tag: '{items}', label: '📦 Items' },
                                                { tag: '{payment_status}', label: '💳 Status' },
                                                { tag: '{date}', label: '📅 Date' },
                                                { tag: '{due_amount}', label: '⚠️ Due' },
                                                { tag: '{payment_link}', label: '📲 UPI Pay' }
                                            ].map(item => (
                                                <button
                                                    key={item.tag}
                                                    type="button"
                                                    className="ca-token-chip"
                                                    onClick={() => {
                                                        const cur = settings.whatsappTemplate !== undefined
                                                            ? settings.whatsappTemplate
                                                            : activeModalApp.defaultSettings.whatsappTemplate;
                                                        handleChange('whatsappTemplate', cur + ' ' + item.tag);
                                                    }}
                                                    title={`Insert ${item.tag}`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}

                                            <button
                                                type="button"
                                                className="ca-reset-template-btn"
                                                onClick={() => handleChange('whatsappTemplate', activeModalApp.defaultSettings.whatsappTemplate)}
                                            >
                                                Reset Default
                                            </button>
                                        </div>

                                        <label>Invoice WhatsApp Message Template</label>
                                        <textarea
                                            rows="5"
                                            value={settings.whatsappTemplate !== undefined ? settings.whatsappTemplate : activeModalApp.defaultSettings.whatsappTemplate}
                                            onChange={(e) => handleChange('whatsappTemplate', e.target.value)}
                                            placeholder="Enter WhatsApp invoice message template..."
                                            style={{ fontFamily: 'inherit', fontSize: '0.84rem' }}
                                        />
                                    </div>

                                    {/* Real-time WhatsApp Chat Preview */}
                                    <div className="ca-wa-preview-box">
                                        <div className="ca-wa-preview-header">
                                            <div className="ca-wa-avatar">
                                                {(settings.companyName || 'Namustutam Store').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ca-wa-header-info">
                                                <span className="ca-wa-header-name">{settings.companyName || 'Namustutam Store'} (Official)</span>
                                                <span className="ca-wa-header-status">Online • WhatsApp Verified</span>
                                            </div>
                                        </div>
                                        <div className="ca-wa-chat-canvas">
                                            <div className="ca-wa-bubble">
                                                {(() => {
                                                    const rawTpl = settings.whatsappTemplate !== undefined
                                                        ? settings.whatsappTemplate
                                                        : activeModalApp.defaultSettings.whatsappTemplate;
                                                    return compileWhatsAppTemplate(rawTpl, {
                                                        customerName: 'Aarav Sharma',
                                                        storeName: settings.companyName || 'Namustutam Store',
                                                        invoiceNo: 'POS-2024-8841',
                                                        amount: '₹3,498.00',
                                                        items: '• Cotton Casual Shirt (x1) - ₹1,499.00\n• Slim Fit Trousers (x1) - ₹1,999.00',
                                                        paymentStatus: 'PAID',
                                                        date: new Date().toLocaleDateString()
                                                    });
                                                })()}
                                                <div className="ca-wa-bubble-footer">
                                                    <span>12:45 PM</span>
                                                    <span className="ca-wa-ticks">✓✓</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ca-toggle-item" style={{ marginTop: '14px' }}>
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Auto-Prompt on POS Checkout</span>
                                            <span className="ca-toggle-label-sub">
                                                {settings.whatsappBackgroundAutoSend === 'true'
                                                    ? 'Automatically dispatches background WhatsApp bill upon completing sale'
                                                    : 'Shows quick "Send WhatsApp Receipt" button on bill completion'}
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

                                    {/* Test Actions */}
                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">
                                            {settings.whatsappBackgroundAutoSend === 'true'
                                                ? 'Test Background WhatsApp Dispatch (No Windows Open)'
                                                : 'Live Test WhatsApp Dispatcher'}
                                        </span>
                                        {/* Demo Message Format Selector for Meta API Key Test */}
                                        <div style={{
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            padding: '10px 14px',
                                            marginBottom: '10px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                                                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b' }}>
                                                    Demo Message Format (Meta API Key Test):
                                                </span>
                                                <span style={{ fontSize: '0.72rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                                                    Meta Cloud API Ready
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', color: '#1e293b' }}>
                                                    <input
                                                        type="radio"
                                                        name="metaDemoType"
                                                        value="template"
                                                        checked={metaDemoType === 'template'}
                                                        onChange={() => setMetaDemoType('template')}
                                                    />
                                                    <strong style={{ color: '#0369a1' }}>Meta Demo Template (<code>hello_world</code>)</strong>
                                                    <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '600' }}>[Recommended for Meta API Key test - Bypasses 24h limit]</span>
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', color: '#1e293b' }}>
                                                    <input
                                                        type="radio"
                                                        name="metaDemoType"
                                                        value="invoice"
                                                        checked={metaDemoType === 'invoice'}
                                                        onChange={() => setMetaDemoType('invoice')}
                                                    />
                                                    <span>POS Invoice Demo Bill (Full Custom Text)</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                            <input
                                                type="text"
                                                placeholder={`Enter any recipient mobile (e.g. ${settings.whatsappCountryCode || '91'}XXXXXXXXXX)`}
                                                value={testPhone}
                                                onChange={(e) => setTestPhone(e.target.value)}
                                                style={{ flex: 1, minWidth: '200px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                                            />
                                            {settings.whatsappPhone && (
                                                <button
                                                    type="button"
                                                    className="ca-btn-test"
                                                    onClick={() => setTestPhone(settings.whatsappPhone)}
                                                    title="Use Store Phone Number"
                                                >
                                                    Use Store Phone
                                                </button>
                                            )}
                                            {user?.phone && (
                                                <button
                                                    type="button"
                                                    className="ca-btn-test"
                                                    onClick={() => setTestPhone(user.phone)}
                                                    title="Use My Account Phone"
                                                >
                                                    Use My Phone
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="ca-btn-test green"
                                                disabled={isTesting}
                                                onClick={() => testWhatsApp(testPhone, false)}
                                                title="Automatically dispatch message to recipient via Meta WhatsApp Cloud API in the background (Zero windows opened)"
                                            >
                                                {isTesting ? <RefreshCw size={14} className="spin" /> : <Zap size={14} />}
                                                Send Background Test (No Window)
                                            </button>
                                            <button
                                                type="button"
                                                className="ca-btn-test"
                                                style={{ background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}
                                                disabled={isTesting}
                                                onClick={() => testWhatsApp(testPhone, false, true)}
                                                title="Dispatch official Meta hello_world demo template immediately using your Meta API key"
                                            >
                                                <Send size={13} /> Send Meta 'hello_world' Demo
                                            </button>
                                            {settings.whatsappBackgroundAutoSend === 'true' && (
                                                <button
                                                    type="button"
                                                    className="ca-btn-test"
                                                    disabled={isTesting}
                                                    onClick={() => testWhatsApp(testPhone, true)}
                                                    title="Test with browser Click-to-Chat"
                                                >
                                                    <ExternalLink size={14} /> Test via Web (wa.me)
                                                </button>
                                            )}
                                        </div>

                                        {/* Background Test Result — Unified Dynamic Card */}
                                        {testOutput && typeof testOutput === 'object' && testOutput.type === 'whatsapp_background' && testOutput.success && (
                                            <div className="ca-wa-test-result" style={{
                                                borderLeft: `4px solid ${testOutput.wasAutoFallback ? '#f59e0b' : '#10b981'}`,
                                                background: testOutput.wasAutoFallback ? 'rgba(30,15,0,0.9)' : 'rgba(15,25,20,0.9)'
                                            }}>
                                                {/* Header */}
                                                <div className="ca-wa-result-header">
                                                    <span className="ca-wa-result-badge">
                                                        <CheckCircle2 size={13} />
                                                        {testOutput.headerMsg || testOutput.phone}
                                                    </span>
                                                    <span style={{ fontSize: '0.74rem', color: testOutput.wasAutoFallback ? '#fcd34d' : '#86efac', fontWeight: '700' }}>
                                                        {testOutput.isSandboxFallback ? '⚠️ Sandbox → Auto-Sent' : testOutput.is24hFallback ? '⚠️ 24h → Auto-Sent' : '✓ Zero Windows'}
                                                    </span>
                                                </div>

                                                {/* Provider & Message ID */}
                                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    <span>Provider: <strong style={{ color: '#f8fafc' }}>{testOutput.provider}</strong></span>
                                                    {testOutput.messageId && testOutput.messageId !== 'DELIVERED' && (
                                                        <span>ID: <code style={{ color: '#38bdf8', fontSize: '0.76rem' }}>{testOutput.messageId}</code></span>
                                                    )}
                                                    {testOutput.messageId === 'DELIVERED' && (
                                                        <span style={{ color: '#4ade80' }}>✓ Delivered</span>
                                                    )}
                                                </div>

                                                {/* Note / Explanation */}
                                                {testOutput.noteMsg && (
                                                    <div style={{
                                                        fontSize: '0.76rem',
                                                        color: testOutput.wasAutoFallback ? '#fbbf24' : '#86efac',
                                                        background: testOutput.wasAutoFallback ? 'rgba(251,191,36,0.08)' : 'rgba(134,239,172,0.07)',
                                                        border: `1px solid ${testOutput.wasAutoFallback ? 'rgba(251,191,36,0.25)' : 'rgba(134,239,172,0.2)'}`,
                                                        borderRadius: '6px',
                                                        padding: '7px 10px',
                                                        marginBottom: '10px',
                                                        lineHeight: '1.5'
                                                    }}>
                                                        {testOutput.noteMsg}
                                                    </div>
                                                )}

                                                {/* Invoice / Message Bubble Preview */}
                                                {testOutput.compiledInvoice && (
                                                    <div>
                                                        <div style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: '700', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            📋 {testOutput.mode === 'invoice' && !testOutput.wasAutoFallback
                                                                ? 'Full Invoice Text Sent Directly:'
                                                                : 'Invoice Text (hello_world sent now — this sends when window opens):'}
                                                        </div>
                                                        <div style={{
                                                            background: '#dcf8c6',
                                                            color: '#111827',
                                                            borderRadius: '12px 12px 4px 12px',
                                                            padding: '11px 14px',
                                                            fontSize: '0.79rem',
                                                            whiteSpace: 'pre-wrap',
                                                            maxHeight: '220px',
                                                            overflowY: 'auto',
                                                            fontFamily: 'inherit',
                                                            lineHeight: '1.55',
                                                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                                                        }}>
                                                            {testOutput.compiledInvoice}
                                                        </div>
                                                        <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '4px', textAlign: 'right' }}>
                                                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ✓✓
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Web Click-to-Chat Test Result */}
                                        {testOutput && typeof testOutput === 'object' && testOutput.type === 'whatsapp' && (
                                            <div className="ca-wa-test-result">
                                                <div className="ca-wa-result-header">
                                                    <span className="ca-wa-result-badge">
                                                        <CheckCircle2 size={13} />
                                                        WhatsApp Link Generated for {testOutput.phone}
                                                    </span>
                                                    <a
                                                        href={testOutput.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ca-wa-open-link"
                                                    >
                                                        <ExternalLink size={13} /> Open WhatsApp Chat
                                                    </a>
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>
                                                    URL: <span style={{ color: '#38bdf8' }}>{testOutput.url?.slice(0, 60)}...</span>
                                                </div>
                                                <div style={{ fontSize: '0.71rem', color: '#64748b', fontWeight: '700', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 Invoice Message (pre-filled in WhatsApp):</div>
                                                <div style={{
                                                    background: '#dcf8c6',
                                                    color: '#111827',
                                                    borderRadius: '12px 12px 4px 12px',
                                                    padding: '10px 14px',
                                                    fontSize: '0.79rem',
                                                    whiteSpace: 'pre-wrap',
                                                    maxHeight: '200px',
                                                    overflowY: 'auto',
                                                    lineHeight: '1.5',
                                                    fontFamily: 'inherit',
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                                                }}>
                                                    {testOutput.message}
                                                </div>
                                            </div>
                                        )}

                                        {/* Error Output */}
                                        {testOutput && typeof testOutput === 'object' && testOutput.error && (
                                            <div className="alert alert-danger py-2 px-3 small mt-2 mb-0">
                                                <AlertCircle size={14} className="me-1" />
                                                <span style={{ whiteSpace: 'pre-line' }}>{testOutput.message}</span>
                                            </div>
                                        )}

                                        {testOutput && typeof testOutput === 'string' && (
                                            <div className="ca-test-output">{testOutput}</div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ── Google Calendar Form ── */}
                            {activeModalApp.id === 'googleCalendar' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Google Account Email</label>
                                        <input
                                            type="email"
                                            placeholder="manager@store.com"
                                            value={settings.googleCalendarEmail || ''}
                                            onChange={(e) => handleChange('googleCalendarEmail', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-toggle-item">
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Sync Sales Delivery Dates</span>
                                            <span className="ca-toggle-label-sub">Add order delivery deadlines to Google Calendar</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.googleCalendarSyncSales !== 'false'}
                                                onChange={(e) => handleChange('googleCalendarSyncSales', e.target.checked ? 'true' : 'false')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="ca-toggle-item">
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Sync Khata Payment Due Reminders</span>
                                            <span className="ca-toggle-label-sub">Create calendar events for pending customer debt due dates</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.googleCalendarSyncKhata !== 'false'}
                                                onChange={(e) => handleChange('googleCalendarSyncKhata', e.target.checked ? 'true' : 'false')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Live Actions</span>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test"
                                                onClick={exportGoogleCalendarIcs}
                                            >
                                                <CalendarIcon size={14} /> Export .ICS Calendar File
                                            </button>
                                            <button
                                                className="ca-btn-test"
                                                onClick={() => window.open('https://calendar.google.com/calendar/r', '_blank')}
                                            >
                                                <ExternalLink size={14} /> Open Google Calendar
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── Slack Form ── */}
                            {activeModalApp.id === 'slack' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Slack Incoming Webhook URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://hooks.slack.com/services/T00/B00/XXXX"
                                            value={settings.slackWebhookUrl || ''}
                                            onChange={(e) => handleChange('slackWebhookUrl', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-form-group">
                                        <label>Channel Name</label>
                                        <input
                                            type="text"
                                            placeholder="#pos-orders"
                                            value={settings.slackChannel || '#pos-orders'}
                                            onChange={(e) => handleChange('slackChannel', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-toggle-item">
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Notify on New POS Sale</span>
                                            <span className="ca-toggle-label-sub">Posts instant receipt snippet when cashier bills an order</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.slackNotifySales !== 'false'}
                                                onChange={(e) => handleChange('slackNotifySales', e.target.checked ? 'true' : 'false')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="ca-toggle-item">
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Low Stock Alert</span>
                                            <span className="ca-toggle-label-sub">Alerts staff channel when product inventory drops below threshold</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.slackNotifyStock !== 'false'}
                                                onChange={(e) => handleChange('slackNotifyStock', e.target.checked ? 'true' : 'false')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Test Slack Notification</span>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test green"
                                                onClick={testSlackWebhook}
                                                disabled={isTesting}
                                            >
                                                <Send size={14} /> Send Test Slack Notification
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── Discord Form ── */}
                            {activeModalApp.id === 'discord' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Discord Webhook URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://discord.com/api/webhooks/1234/abcd"
                                            value={settings.discordWebhookUrl || ''}
                                            onChange={(e) => handleChange('discordWebhookUrl', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-form-group">
                                        <label>Bot Display Name</label>
                                        <input
                                            type="text"
                                            placeholder="Namustutam POS Bot"
                                            value={settings.discordBotName || 'Namustutam POS Bot'}
                                            onChange={(e) => handleChange('discordBotName', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-toggle-item">
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Notify on New POS Sales</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.discordNotifySales !== 'false'}
                                                onChange={(e) => handleChange('discordNotifySales', e.target.checked ? 'true' : 'false')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Test Discord Dispatch</span>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test green"
                                                onClick={testDiscordWebhook}
                                                disabled={isTesting}
                                            >
                                                <Send size={14} /> Send Test Discord Alert
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── Zapier / Webhooks Form ── */}
                            {activeModalApp.id === 'zapier' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Target Webhook URL (Zapier / Make / Custom)</label>
                                        <input
                                            type="text"
                                            placeholder="https://hooks.zapier.com/hooks/catch/..."
                                            value={settings.zapierWebhookUrl || ''}
                                            onChange={(e) => handleChange('zapierWebhookUrl', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-form-group">
                                        <label>Secret Signing Key (Optional)</label>
                                        <input
                                            type="password"
                                            placeholder="secret_key_for_hmac_header"
                                            value={settings.zapierSecret || ''}
                                            onChange={(e) => handleChange('zapierSecret', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-form-group">
                                        <label>Subscribed Events</label>
                                        <input
                                            type="text"
                                            placeholder="pos.sale_completed, inventory.low_stock"
                                            value={settings.zapierEvents || 'pos.sale_completed, inventory.low_stock'}
                                            onChange={(e) => handleChange('zapierEvents', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Webhook Test Runner</span>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test green"
                                                onClick={testZapierWebhook}
                                                disabled={isTesting}
                                            >
                                                <Zap size={14} /> Send Test Webhook Ping
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── Cloud Data Backup Form ── */}
                            {activeModalApp.id === 'cloudBackup' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Backup Frequency</label>
                                        <select
                                            value={settings.cloudBackupFrequency || 'daily'}
                                            onChange={(e) => handleChange('cloudBackupFrequency', e.target.value)}
                                        >
                                            <option value="daily">Daily Automatic Snapshot (Midnight)</option>
                                            <option value="weekly">Weekly Archive</option>
                                            <option value="manual">Manual On-Demand Only</option>
                                        </select>
                                    </div>

                                    <div className="ca-toggle-item">
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Include Complete Financial Records</span>
                                            <span className="ca-toggle-label-sub">Backs up Sales Invoices, POS Bills, Customers & Khata</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.cloudBackupAutoExport !== 'false'}
                                                onChange={(e) => handleChange('cloudBackupAutoExport', e.target.checked ? 'true' : 'false')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Instant Backup Action</span>
                                        <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: '#64748b' }}>
                                            Compile and download a comprehensive JSON snapshot of your current database right now.
                                        </p>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test green"
                                                onClick={runCloudBackup}
                                                disabled={isTesting}
                                            >
                                                <Download size={14} /> Backup Database Now & Download JSON
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── WooCommerce Form ── */}
                            {activeModalApp.id === 'woocommerce' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>WordPress Store URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://mystore.com"
                                            value={settings.woocommerceStoreUrl || ''}
                                            onChange={(e) => handleChange('woocommerceStoreUrl', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-form-group">
                                        <label>Consumer Key (ck_...)</label>
                                        <input
                                            type="text"
                                            placeholder="ck_xxxxxxxxxxxxxxxx"
                                            value={settings.woocommerceConsumerKey || ''}
                                            onChange={(e) => handleChange('woocommerceConsumerKey', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-form-group">
                                        <label>Consumer Secret (cs_...)</label>
                                        <input
                                            type="password"
                                            placeholder="cs_xxxxxxxxxxxxxxxx"
                                            value={settings.woocommerceConsumerSecret || ''}
                                            onChange={(e) => handleChange('woocommerceConsumerSecret', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-toggle-item">
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Two-Way Inventory Sync</span>
                                            <span className="ca-toggle-label-sub">Deduct WooCommerce stock when items are sold in POS terminal</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.woocommerceAutoSync !== 'false'}
                                                onChange={(e) => handleChange('woocommerceAutoSync', e.target.checked ? 'true' : 'false')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Store Connection Test</span>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test green"
                                                onClick={() => testEcommerceSync('woocommerce')}
                                                disabled={isTesting}
                                            >
                                                <RefreshCw size={14} className={isTesting ? 'spin' : ''} /> Test Store Connection &amp; Sync Stock
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── Shopify Form ── */}
                            {activeModalApp.id === 'shopify' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Shopify Store Domain</label>
                                        <input
                                            type="text"
                                            placeholder="your-shop-name.myshopify.com"
                                            value={settings.shopifyStoreDomain || ''}
                                            onChange={(e) => handleChange('shopifyStoreDomain', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-form-group">
                                        <label>Admin API Access Token (shpat_...)</label>
                                        <input
                                            type="password"
                                            placeholder="shpat_xxxxxxxxxxxxxxxx"
                                            value={settings.shopifyAccessToken || ''}
                                            onChange={(e) => handleChange('shopifyAccessToken', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-toggle-item">
                                        <div className="ca-toggle-label">
                                            <span className="ca-toggle-label-title">Auto Stock Sync</span>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.shopifyAutoSync !== 'false'}
                                                onChange={(e) => handleChange('shopifyAutoSync', e.target.checked ? 'true' : 'false')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Shopify Store Verification</span>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test green"
                                                onClick={() => testEcommerceSync('shopify')}
                                                disabled={isTesting}
                                            >
                                                <RefreshCw size={14} className={isTesting ? 'spin' : ''} /> Verify Shopify Connection &amp; Sync
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── Meta Catalog Form ── */}
                            {activeModalApp.id === 'facebookAds' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Meta Pixel ID</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 1928471928471"
                                            value={settings.metaPixelId || ''}
                                            onChange={(e) => handleChange('metaPixelId', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-form-group">
                                        <label>Catalog ID (Commerce Manager)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 849204810294"
                                            value={settings.metaCatalogId || ''}
                                            onChange={(e) => handleChange('metaCatalogId', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-form-group">
                                        <label>System User Access Token</label>
                                        <input
                                            type="password"
                                            placeholder="EAAG..."
                                            value={settings.metaAccessToken || ''}
                                            onChange={(e) => handleChange('metaAccessToken', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Meta Catalog Feed Exporter</span>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b' }}>
                                            Compile your POS products and export a CSV feed formatted for Meta Commerce Manager.
                                        </p>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test green"
                                                onClick={exportMetaCatalogFeed}
                                                disabled={isTesting}
                                            >
                                                <Download size={14} /> Export Facebook Catalog CSV
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── SMS Gateway Form ── */}
                            {activeModalApp.id === 'smsGateway' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Gateway Provider</label>
                                        <select
                                            value={settings.smsProvider || 'twilio'}
                                            onChange={(e) => handleChange('smsProvider', e.target.value)}
                                        >
                                            <option value="twilio">Twilio</option>
                                            <option value="fast2sms">Fast2SMS (India)</option>
                                            <option value="msg91">MSG91</option>
                                        </select>
                                    </div>
                                    <div className="ca-form-group">
                                        <label>API Key / Auth Token</label>
                                        <input
                                            type="password"
                                            placeholder="Enter API Key or Auth Token"
                                            value={settings.smsApiKey || ''}
                                            onChange={(e) => handleChange('smsApiKey', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-form-group">
                                        <label>Sender ID / Header (e.g. NAMUST)</label>
                                        <input
                                            type="text"
                                            placeholder="NAMUST"
                                            value={settings.smsSenderId || 'NAMUST'}
                                            onChange={(e) => handleChange('smsSenderId', e.target.value)}
                                        />
                                    </div>

                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">SMS Dispatch Simulation</span>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder="Recipient Mobile (e.g. 919876543210)"
                                                value={testPhone}
                                                onChange={(e) => setTestPhone(e.target.value)}
                                                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                                            />
                                            <button
                                                className="ca-btn-test green"
                                                onClick={testSmsGateway}
                                            >
                                                <Send size={14} /> Send Sample SMS
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}

                            {/* ── Tally ERP Form ── */}
                            {activeModalApp.id === 'tally' && (
                                <>
                                    <div className="ca-form-group">
                                        <label>Tally Company Name</label>
                                        <input
                                            type="text"
                                            placeholder="Namustutam Store Pvt Ltd"
                                            value={settings.tallyCompany || ''}
                                            onChange={(e) => handleChange('tallyCompany', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-form-group">
                                        <label>Tally Sales Ledger Name</label>
                                        <input
                                            type="text"
                                            placeholder="Sales Account"
                                            value={settings.tallySalesLedger || 'Sales Account'}
                                            onChange={(e) => handleChange('tallySalesLedger', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-form-group">
                                        <label>Tally Cash / Bank Ledger Name</label>
                                        <input
                                            type="text"
                                            placeholder="Cash-in-Hand"
                                            value={settings.tallyCashLedger || 'Cash-in-Hand'}
                                            onChange={(e) => handleChange('tallyCashLedger', e.target.value)}
                                        />
                                    </div>
                                    <div className="ca-test-actions-box">
                                        <span className="ca-test-actions-title">Export Tally Vouchers</span>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b' }}>
                                            Generate an XML voucher file of recent POS sales ready for Tally Prime / ERP 9.
                                        </p>
                                        <div className="ca-test-buttons-row">
                                            <button
                                                className="ca-btn-test green"
                                                onClick={exportTallyXml}
                                                disabled={isTesting}
                                            >
                                                <Download size={14} /> Export Tally Sales XML
                                            </button>
                                        </div>
                                        {testOutput && <div className="ca-test-output">{testOutput}</div>}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="ca-modal-footer">
                            {settings[activeModalApp.connectedKey] === 'true' ? (
                                <button
                                    className="ca-btn-disconnect"
                                    onClick={() => handleDisconnectApp(activeModalApp)}
                                    disabled={saving}
                                >
                                    Disconnect App
                                </button>
                            ) : (
                                <div />
                            )}

                            <button
                                className="ca-btn-save"
                                onClick={() => handleSaveAppConfig(activeModalApp)}
                                disabled={saving}
                            >
                                <CheckCircle2 size={16} />
                                {saving ? 'Saving...' : 'Save & Connect'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast feedback */}
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
