import { EventEmitter } from 'node:events';
import whatsappWeb from 'whatsapp-web.js';
const { Client, LocalAuth } = whatsappWeb;
import qrcode from 'qrcode';
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WA_SESSION_DIR = process.env.WA_SESSION_DIR
    ? (process.env.WA_SESSION_DIR.startsWith('.')
        ? join(__dirname, '..', '..', process.env.WA_SESSION_DIR)
        : process.env.WA_SESSION_DIR)
    : join(__dirname, '..', '..', 'wa-sessions');

try { mkdirSync(WA_SESSION_DIR, { recursive: true }); } catch {}

/**
 * Detect available Chrome or Edge binary path if Puppeteer default is not available
 */
function resolveChromePath() {
    if (process.env.PUPPETEER_EXECUTABLE_PATH && existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
        return process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    const commonWindowsPaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    for (const p of commonWindowsPaths) {
        if (existsSync(p)) return p;
    }
    return undefined; // Puppeteer uses its own installed Chromium
}

export class WhatsAppManager extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
        /** @type {Map<string, { client: Client, status: string, info: object|null, qrCode: string|null, qrTimestamp: number|null, readyAt: string|null }>} */
        this._sessions = new Map();
    }

    /**
     * Get an existing session or create a new one
     * @param {string} sessionId
     */
    async getOrCreateSession(sessionId = 'default') {
        const existing = this._sessions.get(sessionId);
        if (existing) {
            return existing;
        }
        return this._createSession(sessionId);
    }

    /**
     * Check if saved credentials exist for a session on disk
     * @param {string} sessionId
     */
    hasSessionOnDisk(sessionId) {
        if (!sessionId) return false;
        return existsSync(join(WA_SESSION_DIR, `session-${sessionId}`));
    }

    /**
     * Automatically restore preserved sessions from disk on boot
     */
    async autoRestoreSessions() {
        try {
            if (!existsSync(WA_SESSION_DIR)) return;
            const entries = readdirSync(WA_SESSION_DIR, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory() && entry.name.startsWith('session-')) {
                    const sessionId = entry.name.slice('session-'.length);
                    if (sessionId && !sessionId.includes('_tenant_') && !this._sessions.has(sessionId)) {
                        console.log(`[WhatsApp Manager] Auto-restoring preserved session [${sessionId}] from disk...`);
                        this.getOrCreateSession(sessionId).catch(err => {
                            console.warn(`[WhatsApp Manager] Auto-restore session [${sessionId}] failed:`, err.message);
                        });
                    }
                }
            }
        } catch (e) {
            console.warn('[WhatsApp Manager] Auto-restore scan failed:', e.message);
        }
    }

    /**
     * Create and initialize a new WhatsApp client session
     * @param {string} sessionId
     */
    async _createSession(sessionId) {
        const chromeExe = resolveChromePath();
        const puppeteerArgs = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ];

        console.log(`[WhatsApp Manager] Initializing session [${sessionId}]...`);
        if (chromeExe) {
            console.log(`[WhatsApp Manager] Using Chrome executable: ${chromeExe}`);
        }

        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: sessionId,
                dataPath: WA_SESSION_DIR,
            }),
            puppeteer: {
                headless: true,
                args: puppeteerArgs,
                executablePath: chromeExe || undefined,
            },
            webVersionCache: {
                type: 'remote',
                remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1015901744-alpha/index.html',
            },
        });

        const session = {
            client,
            status: 'initializing',
            info: null,
            qrCode: null,
            qrRaw: null,
            qrTimestamp: null,
            readyAt: null,
            error: null
        };
        this._sessions.set(sessionId, session);

        // ── Event: QR Code received ──────────────────────────────────────────
        client.on('qr', async (qr) => {
            session.status = 'qr';
            session.qrRaw = qr;
            session.qrTimestamp = Date.now();
            try {
                const qrDataUrl = await qrcode.toDataURL(qr, {
                    margin: 2,
                    scale: 7,
                    errorCorrectionLevel: 'H'
                });
                session.qrCode = qrDataUrl;
                this.emit(`qr:${sessionId}`, qrDataUrl);
                console.log(`[WhatsApp Manager] Session [${sessionId}] QR code generated.`);
            } catch (err) {
                console.error(`[WhatsApp Manager] Session [${sessionId}] QR generation error:`, err.message);
            }
        });

        // ── Event: Client Ready ──────────────────────────────────────────────
        client.on('ready', () => {
            session.status = 'ready';
            session.qrCode = null;
            session.qrRaw = null;
            session.info = client.info || null;
            session.readyAt = new Date().toISOString();
            console.log(`[WhatsApp Manager] Session [${sessionId}] is READY! Phone: ${client.info?.wid?.user || 'unknown'}`);
            this.emit(`ready:${sessionId}`, session.info);
        });

        // ── Event: Authenticated ─────────────────────────────────────────────
        client.on('authenticated', () => {
            session.status = 'authenticated';
            session.qrCode = null;
            session.qrRaw = null;
            console.log(`[WhatsApp Manager] Session [${sessionId}] authenticated.`);
            this.emit(`authenticated:${sessionId}`);
        });

        // ── Event: Auth Failure ──────────────────────────────────────────────
        client.on('auth_failure', (msg) => {
            session.status = 'auth_failure';
            session.qrCode = null;
            session.error = msg;
            console.error(`[WhatsApp Manager] Session [${sessionId}] auth failure:`, msg);
            this.emit(`auth_failure:${sessionId}`, msg);
            this._cleanupClient(sessionId);
        });

        // ── Event: Disconnected ──────────────────────────────────────────────
        client.on('disconnected', (reason) => {
            session.status = 'disconnected';
            session.qrCode = null;
            session.info = null;
            console.warn(`[WhatsApp Manager] Session [${sessionId}] disconnected:`, reason);
            this.emit(`disconnected:${sessionId}`, reason);
            this._cleanupClient(sessionId);
        });

        // ── Event: Message ACK ───────────────────────────────────────────────
        client.on('message_ack', (msg, ack) => {
            // ack: 1=sent, 2=received, 3=read
            console.log(`[WhatsApp Manager] Session [${sessionId}] Msg ${msg.id.id} ack=${ack}`);
        });

        // Initialize Puppeteer & WhatsApp Web
        client.initialize().catch((err) => {
            console.error(`[WhatsApp Manager] Session [${sessionId}] initialization failed:`, err.message);
            session.status = 'error';
            session.error = err.message;
            this._cleanupClient(sessionId);
        });

        return session;
    }

    /**
     * Safely cleanup a client instance
     */
    async _cleanupClient(sessionId) {
        const session = this._sessions.get(sessionId);
        if (!session) return;
        try {
            await session.client.destroy();
        } catch {}
        this._sessions.delete(sessionId);
    }

    /**
     * Get the status string for a session
     * @param {string} sessionId
     */
    getStatus(sessionId = 'default') {
        return this._sessions.get(sessionId)?.status || 'not_initialized';
    }

    /**
     * Get the latest QR code Data URL (base64)
     * @param {string} sessionId
     */
    getQr(sessionId = 'default') {
        const session = this._sessions.get(sessionId);
        if (!session) return null;
        return session.qrCode || null;
    }

    /**
     * Get full info about an active session
     * @param {string} sessionId
     */
    getInfo(sessionId = 'default') {
        const session = this._sessions.get(sessionId);
        if (!session) return null;
        return {
            status: session.status,
            phone: session.info?.wid?.user || null,
            pushname: session.info?.pushname || null,
            readyAt: session.readyAt || null,
            platform: session.info?.platform || null,
            error: session.error || null,
            hasQr: !!session.qrCode
        };
    }

    /**
     * Send a WhatsApp message
     * @param {string} sessionId
     * @param {string} to Phone number with country code (e.g. 919876543210)
     * @param {string} message Text message content
     */
    async sendMessage(sessionId = 'default', to, message) {
        const session = this._sessions.get(sessionId);
        if (!session || session.status !== 'ready') {
            const currentStatus = session?.status || 'not_initialized';
            throw new Error(`WhatsApp session [${sessionId}] is not connected (current status: ${currentStatus}). Please link your WhatsApp first.`);
        }

        const cleanDigits = String(to).replace(/[^0-9]/g, '');
        if (!cleanDigits || cleanDigits.length < 8) {
            throw new Error(`Invalid recipient phone number: "${to}". Must include country code and valid mobile digits.`);
        }

        const chatId = to.includes('@') ? to : `${cleanDigits}@c.us`;

        // Check WhatsApp registration
        try {
            const isRegistered = await session.client.isRegisteredUser(chatId);
            if (isRegistered === false) {
                throw new Error(`The phone number +${cleanDigits} is not registered on WhatsApp.`);
            }
        } catch (checkErr) {
            if (checkErr.message.includes('not registered')) {
                throw checkErr;
            }
            // If the query times out or fails transiently, proceed with direct send
            console.warn(`[WhatsApp Manager] Registration pre-check skipped: ${checkErr.message}`);
        }

        const msg = await session.client.sendMessage(chatId, message);
        const messageId = msg?.id?._serialized || msg?.id?.id || (typeof msg?.id === 'string' ? msg.id : `wamid_${Date.now()}`);
        console.log(`[WhatsApp Manager] Message successfully sent to ${chatId}. Message ID: ${messageId}`);

        return {
            messageId,
            to: chatId,
            timestamp: msg?.timestamp || Math.floor(Date.now() / 1000),
            status: 'sent'
        };
    }

    /**
     * Log out and destroy a session
     * @param {string} sessionId
     */
    async logoutSession(sessionId = 'default') {
        const session = this._sessions.get(sessionId);
        if (!session) return;
        try {
            await session.client.logout();
        } catch {}
        try {
            await session.client.destroy();
        } catch {}
        this._sessions.delete(sessionId);
        console.log(`[WhatsApp Manager] Session [${sessionId}] logged out and removed.`);
    }

    /**
     * Destroy all sessions (graceful shutdown)
     */
    async destroyAll() {
        const ids = [...this._sessions.keys()];
        for (const id of ids) {
            await this.logoutSession(id);
        }
    }

    /**
     * List all current sessions
     */
    listSessions() {
        return [...this._sessions.entries()].map(([id, s]) => ({
            sessionId: id,
            status: s.status,
            phone: s.info?.wid?.user || null,
            pushname: s.info?.pushname || null,
            hasQr: !!s.qrCode,
            readyAt: s.readyAt || null
        }));
    }
}
