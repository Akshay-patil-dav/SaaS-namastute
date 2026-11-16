import apiClient from '@/api/config';

/**
 * WhatsApp Web Service (Client-Side)
 * 
 * Communicates with:
 * 1. Spring Boot backend proxy (`/api/whatsapp/*`), which auto-fails over between
 *    local microservice (port 3005) and cloud backup (`https://whatsapp-service-chi.vercel.app`).
 * 2. Seamless client-side direct fallback:
 *    - Primary direct: `http://localhost:3005`
 *    - Backup direct: `https://whatsapp-service-chi.vercel.app`
 * 
 * If the local service is offline or unreachable, traffic automatically switches
 * to the backup cloud instance without disruption.
 */

const LOCAL_URL = (import.meta.env?.VITE_WHATSAPP_LOCAL_URL || 'http://localhost:3005').replace(/\/+$/, '');
const BACKUP_URL = (import.meta.env?.VITE_WHATSAPP_FALLBACK_URL || 'https://whatsapp-service-chi.vercel.app').replace(/\/+$/, '');
const API_KEY = (import.meta.env?.VITE_WHATSAPP_API_KEY || 'wa_sec_9f7a8b3e2d1c4b5a6f7e8d9c0b1a2f3e').trim();

// Track active endpoint discovered dynamically: { url, isBackup, mode }
let activeEndpoint = {
    url: LOCAL_URL,
    isBackup: false,
    mode: 'backend'
};

export function getWhatsAppActiveEndpoint() {
    return activeEndpoint;
}

/**
 * Direct fetch with timeout and standard WhatsApp service headers
 */
async function fetchDirect(baseUrl, path, options = {}, timeoutMs = 2500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const url = `${baseUrl}${cleanPath}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-WA-API-Key': API_KEY,
            ...(options.headers || {})
        };
        const res = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers
        });
        clearTimeout(timer);
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
        }
        return await res.json();
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

/**
 * Execute direct request with automatic failover (localhost:3005 -> Vercel backup)
 */
async function fetchWithFailover(path, options = {}) {
    // 1. Try local port 3005 first (fast timeout)
    try {
        const data = await fetchDirect(LOCAL_URL, path, options, 1500);
        activeEndpoint = { url: LOCAL_URL, isBackup: false, mode: 'direct_local' };
        return { data, isBackup: false, endpoint: LOCAL_URL };
    } catch (localErr) {
        // 2. Automatic switch to cloud backup
        try {
            const data = await fetchDirect(BACKUP_URL, path, options, 8000);
            activeEndpoint = { url: BACKUP_URL, isBackup: true, mode: 'direct_backup' };
            return { data, isBackup: true, endpoint: BACKUP_URL };
        } catch (backupErr) {
            throw new Error(`WhatsApp service unreachable on both localhost:3005 and backup (${BACKUP_URL})`);
        }
    }
}

/**
 * Check overall WhatsApp microservice health and status
 */
export async function getWhatsAppServiceStatus() {
    try {
        const res = await apiClient.get('/whatsapp/status');
        const isBackup = res.headers?.['x-whatsapp-fallback'] === 'true' || !!res.data?.isBackupEndpoint;
        const endpoint = res.headers?.['x-whatsapp-endpoint'] || res.data?.activeEndpoint || (isBackup ? BACKUP_URL : LOCAL_URL);
        activeEndpoint = { url: endpoint, isBackup, mode: 'backend' };
        return { success: true, data: res.data, isBackup, endpoint };
    } catch (err) {
        // Direct browser failover if backend proxy call failed
        try {
            const direct = await fetchWithFailover('/status');
            return { success: true, data: direct.data, isBackup: direct.isBackup, endpoint: direct.endpoint };
        } catch (directErr) {
            return {
                success: false,
                error: err.response?.data?.error || directErr.message || 'WhatsApp service unreachable'
            };
        }
    }
}

/**
 * List all active sessions on the WhatsApp service
 */
export async function getWhatsAppSessions() {
    try {
        const res = await apiClient.get('/whatsapp/sessions');
        const isBackup = res.headers?.['x-whatsapp-fallback'] === 'true' || !!res.data?.isBackupEndpoint;
        const endpoint = res.headers?.['x-whatsapp-endpoint'] || (isBackup ? BACKUP_URL : LOCAL_URL);
        return { success: true, sessions: res.data?.sessions || [], isBackup, endpoint };
    } catch (err) {
        try {
            const direct = await fetchWithFailover('/sessions');
            return { success: true, sessions: direct.data?.sessions || [], isBackup: direct.isBackup, endpoint: direct.endpoint };
        } catch (directErr) {
            return {
                success: false,
                sessions: [],
                error: err.response?.data?.error || directErr.message
            };
        }
    }
}

/**
 * Fetch tenant's persisted WhatsApp configuration directly from database
 */
export async function getWhatsAppConfig() {
    try {
        const res = await apiClient.get('/whatsapp/config');
        return { success: true, data: res.data };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.error || err.message
        };
    }
}

/**
 * Fetch tenant's message delivery audit logs from database
 */
export async function getWhatsAppLogs() {
    try {
        const res = await apiClient.get('/whatsapp/logs');
        return { success: true, data: res.data || [] };
    } catch (err) {
        return {
            success: false,
            data: [],
            error: err.response?.data?.error || err.message
        };
    }
}

/**
 * Start/initialize a WhatsApp Web session (launches browser and prepares QR code)
 * @param {string} sessionId
 * @param {boolean} force Force refresh/purge existing session
 */
export async function startWhatsAppSession(sessionId = '', force = false) {
    try {
        const res = await apiClient.post('/whatsapp/session/start', { sessionId, force });
        const isBackup = res.headers?.['x-whatsapp-fallback'] === 'true' || !!res.data?.isBackupEndpoint;
        const endpoint = res.headers?.['x-whatsapp-endpoint'] || (isBackup ? BACKUP_URL : LOCAL_URL);
        return { success: true, data: res.data, isBackup, endpoint };
    } catch (err) {
        try {
            const direct = await fetchWithFailover('/session/start', {
                method: 'POST',
                body: JSON.stringify({ sessionId, force })
            });
            return { success: true, data: direct.data, isBackup: direct.isBackup, endpoint: direct.endpoint };
        } catch (directErr) {
            return {
                success: false,
                error: err.response?.data?.error || directErr.message || 'Failed to start WhatsApp session'
            };
        }
    }
}

/**
 * Get status of a specific session
 * @param {string} sessionId
 */
export async function getWhatsAppSessionStatus(sessionId = '') {
    const apiPath = sessionId ? `/whatsapp/session/${encodeURIComponent(sessionId)}/status` : '/whatsapp/session/status';
    const directPath = sessionId ? `/session/${encodeURIComponent(sessionId)}/status` : '/session/status';
    try {
        const res = await apiClient.get(apiPath);
        const isBackup = res.headers?.['x-whatsapp-fallback'] === 'true' || !!res.data?.isBackupEndpoint;
        const endpoint = res.headers?.['x-whatsapp-endpoint'] || res.data?.activeEndpoint || (isBackup ? BACKUP_URL : LOCAL_URL);
        activeEndpoint = { url: endpoint, isBackup, mode: 'backend' };
        return { success: true, data: res.data, isBackup, endpoint };
    } catch (err) {
        try {
            const direct = await fetchWithFailover(directPath);
            return { success: true, data: direct.data, isBackup: direct.isBackup, endpoint: direct.endpoint };
        } catch (directErr) {
            return {
                success: false,
                error: err.response?.data?.error || directErr.message
            };
        }
    }
}

/**
 * Get current QR code data URL for a session
 * @param {string} sessionId
 */
export async function getWhatsAppSessionQr(sessionId = '') {
    const apiPath = sessionId ? `/whatsapp/session/${encodeURIComponent(sessionId)}/qr` : '/whatsapp/session/qr';
    const directPath = sessionId ? `/session/${encodeURIComponent(sessionId)}/qr` : '/session/qr';
    try {
        const res = await apiClient.get(apiPath);
        const isBackup = res.headers?.['x-whatsapp-fallback'] === 'true' || !!res.data?.isBackupEndpoint;
        const endpoint = res.headers?.['x-whatsapp-endpoint'] || (isBackup ? BACKUP_URL : LOCAL_URL);
        return { success: true, data: res.data, isBackup, endpoint };
    } catch (err) {
        try {
            const direct = await fetchWithFailover(directPath);
            return { success: true, data: direct.data, isBackup: direct.isBackup, endpoint: direct.endpoint };
        } catch (directErr) {
            return {
                success: false,
                error: err.response?.data?.error || directErr.message
            };
        }
    }
}

/**
 * Log out and destroy a session
 * @param {string} sessionId
 */
export async function logoutWhatsAppSession(sessionId = '') {
    const apiPath = sessionId ? `/whatsapp/session/${encodeURIComponent(sessionId)}/logout` : '/whatsapp/session/logout';
    const directPath = sessionId ? `/session/${encodeURIComponent(sessionId)}/logout` : '/session/logout';
    try {
        const res = await apiClient.delete(apiPath);
        return { success: true, data: res.data };
    } catch (err) {
        try {
            const direct = await fetchWithFailover(directPath, { method: 'DELETE' });
            return { success: true, data: direct.data };
        } catch (directErr) {
            return {
                success: false,
                error: err.response?.data?.error || directErr.message
            };
        }
    }
}

/**
 * Send a WhatsApp message via WhatsApp Web (whatsapp-web.js)
 * @param {object} params
 * @param {string} params.to Phone number with country code (e.g. 919876543210)
 * @param {string} params.message Text message content
 * @param {string} [params.sessionId='']
 * @param {string} [params.triggerType='MANUAL']
 */
export async function sendWhatsAppWebMessage({ to, message, sessionId = '', triggerType = 'MANUAL' }) {
    if (!to || !message) {
        throw new Error('Both recipient number and message are required.');
    }
    const cleanTo = String(to).replace(/[^0-9]/g, '');
    const payload = {
        sessionId,
        to: cleanTo,
        message: String(message).trim(),
        triggerType
    };

    try {
        const res = await apiClient.post('/whatsapp/send', payload);
        return res.data;
    } catch (err) {
        // If backend proxy failed, try direct send with failover
        try {
            const direct = await fetchWithFailover('/send', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            return direct.data;
        } catch (directErr) {
            throw err;
        }
    }
}

/**
 * Unwraps and normalizes any WhatsApp-related API error into a clear, actionable human message.
 * Shields users from raw "Internal Server Error" strings.
 */
export function parseWhatsAppError(err, defaultMsg = 'Failed to send WhatsApp message.') {
    if (!err) return defaultMsg;

    // Check if network / connection error
    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        return 'Network connection error: Unable to reach the server. Please verify your internet connection.';
    }

    const status = err.response?.status;
    const data = err.response?.data;

    // 503 or service unavailable
    if (status === 503 || (typeof data?.error === 'string' && data.error.includes('unavailable'))) {
        return 'WhatsApp engine is unreachable on both localhost:3005 and backup (whatsapp-service-chi.vercel.app). Please verify local service or internet connectivity.';
    }

    let extracted = '';
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            extracted = parsed.error || parsed.message || '';
        } catch {
            if (data.includes('Internal Server Error')) {
                extracted = '';
            } else if (data.length < 300) {
                extracted = data;
            }
        }
    } else if (data && typeof data === 'object') {
        if (data.error && data.error !== 'Internal Server Error') {
            extracted = data.error;
        } else if (data.message && data.message !== 'Internal Server Error') {
            extracted = data.message;
        } else if (data.error) {
            extracted = data.error;
        }
    }

    if (!extracted && err.message) {
        extracted = err.message;
    }

    // Handle frame detachment / page transition gracefully
    if (extracted.includes('detached Frame') || extracted.includes('Execution context was destroyed') || extracted.includes('Target closed')) {
        return 'WhatsApp engine refreshed its internal frame. Connection re-synchronized. Please click "Send Live Test Message" once more.';
    }

    // Shield from generic "Internal Server Error"
    if (!extracted || extracted === 'Internal Server Error' || extracted.includes('status code 500')) {
        return 'WhatsApp service encountered an issue while dispatching. Please ensure your device is linked in "Device Pairing & QR" and the recipient number is registered on WhatsApp.';
    }

    return extracted;
}

export default {
    getWhatsAppServiceStatus,
    getWhatsAppSessions,
    getWhatsAppConfig,
    getWhatsAppLogs,
    startWhatsAppSession,
    getWhatsAppSessionStatus,
    getWhatsAppSessionQr,
    logoutWhatsAppSession,
    sendWhatsAppWebMessage,
    parseWhatsAppError,
    getWhatsAppActiveEndpoint
};
