import apiClient from '@/api/config';

/**
 * WhatsApp Web Service (Client-Side)
 * 
 * Communicates with the Spring Boot backend (`/api/whatsapp/*`), which in turn
 * proxies to the internal `whatsapp-web.js` microservice.
 * All requests are automatically authenticated via the user's JWT token.
 * Sessions are strictly isolated per tenant in multi-tenant mode.
 * Internal microservice API keys are never exposed in browser requests.
 */

/**
 * Check overall WhatsApp microservice health and status
 */
export async function getWhatsAppServiceStatus() {
    try {
        const res = await apiClient.get('/whatsapp/status');
        return { success: true, data: res.data };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.error || err.message || 'WhatsApp service unreachable'
        };
    }
}

/**
 * List all active sessions on the WhatsApp service
 */
export async function getWhatsAppSessions() {
    try {
        const res = await apiClient.get('/whatsapp/sessions');
        return { success: true, sessions: res.data?.sessions || [] };
    } catch (err) {
        return {
            success: false,
            sessions: [],
            error: err.response?.data?.error || err.message
        };
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
 */
export async function startWhatsAppSession(sessionId = '') {
    try {
        const res = await apiClient.post('/whatsapp/session/start', { sessionId });
        return { success: true, data: res.data };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.error || err.message || 'Failed to start WhatsApp session'
        };
    }
}

/**
 * Get status of a specific session
 * @param {string} sessionId
 */
export async function getWhatsAppSessionStatus(sessionId = '') {
    try {
        const url = sessionId ? `/whatsapp/session/${encodeURIComponent(sessionId)}/status` : '/whatsapp/session/status';
        const res = await apiClient.get(url);
        return { success: true, data: res.data };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.error || err.message
        };
    }
}

/**
 * Get current QR code data URL for a session
 * @param {string} sessionId
 */
export async function getWhatsAppSessionQr(sessionId = '') {
    try {
        const url = sessionId ? `/whatsapp/session/${encodeURIComponent(sessionId)}/qr` : '/whatsapp/session/qr';
        const res = await apiClient.get(url);
        return { success: true, data: res.data };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.error || err.message
        };
    }
}

/**
 * Log out and destroy a session
 * @param {string} sessionId
 */
export async function logoutWhatsAppSession(sessionId = '') {
    try {
        const url = sessionId ? `/whatsapp/session/${encodeURIComponent(sessionId)}/logout` : '/whatsapp/session/logout';
        const res = await apiClient.delete(url);
        return { success: true, data: res.data };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.error || err.message
        };
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
    const res = await apiClient.post('/whatsapp/send', {
        sessionId,
        to: cleanTo,
        message: String(message).trim(),
        triggerType
    });
    return res.data;
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
    sendWhatsAppWebMessage
};
