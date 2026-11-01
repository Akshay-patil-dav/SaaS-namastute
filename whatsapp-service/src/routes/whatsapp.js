import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const sendLimiter = rateLimit({
    windowMs: 60_000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many send requests. Max 60 messages per minute.' },
});

/**
 * Validate sessionId against directory traversal or injection attacks
 */
function isValidSessionId(id) {
    return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(id);
}

/**
 * @param {import('../whatsapp/manager.js').WhatsAppManager} waManager
 */
export function createWhatsAppRouter(waManager) {
    const router = Router();

    // GET / or /status — overall service status
    router.get(['/', '/status'], (_req, res) => {
        res.json({
            service: 'whatsapp-web.js',
            status: 'operational',
            sessions: waManager.listSessions(),
            ts: new Date().toISOString(),
        });
    });

    // GET /sessions — list all active sessions
    router.get('/sessions', (_req, res) => {
        res.json({ sessions: waManager.listSessions() });
    });

    // POST /session/start — initialize (or re-use) a session
    // Body: { sessionId?: string }
    router.post('/session/start', async (req, res) => {
        const sessionId = (req.body?.sessionId || 'default').trim();
        if (!isValidSessionId(sessionId)) {
            return res.status(400).json({ error: 'Invalid sessionId format. Use alphanumeric, dashes, or underscores (max 64 chars).' });
        }

        try {
            const session = await waManager.getOrCreateSession(sessionId);
            res.json({
                success: true,
                sessionId,
                status: session.status,
                hasQr: !!session.qrCode,
                qr: session.qrCode || null
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // GET /session/:sessionId/status AND /session/status
    router.get(['/session/:sessionId/status', '/session/status'], (req, res) => {
        const sessionId = req.params.sessionId || req.query.sessionId || 'default';
        if (!isValidSessionId(sessionId)) {
            return res.status(400).json({ error: 'Invalid sessionId format.' });
        }

        let status = waManager.getStatus(sessionId);
        if (status === 'not_initialized' && waManager.hasSessionOnDisk(sessionId)) {
            waManager.getOrCreateSession(sessionId).catch(() => {});
            status = 'initializing';
        }
        const info = waManager.getInfo(sessionId);
        const qr = waManager.getQr(sessionId);

        res.json({
            sessionId,
            status,
            isReady: status === 'ready',
            hasQr: !!qr,
            hasSavedSession: waManager.hasSessionOnDisk(sessionId),
            info
        });
    });

    // GET /session/:sessionId/qr AND /session/qr AND /qr
    router.get(['/session/:sessionId/qr', '/session/qr', '/qr'], (req, res) => {
        const sessionId = req.params.sessionId || req.query.sessionId || 'default';
        if (!isValidSessionId(sessionId)) {
            return res.status(400).json({ error: 'Invalid sessionId format.' });
        }

        const status = waManager.getStatus(sessionId);
        const qr = waManager.getQr(sessionId);

        res.json({
            sessionId,
            status,
            hasQr: !!qr,
            qr: qr || null
        });
    });

    // DELETE /session/:sessionId/logout AND /session/logout
    router.delete(['/session/:sessionId/logout', '/session/logout'], async (req, res) => {
        const sessionId = req.params.sessionId || req.body?.sessionId || req.query.sessionId || 'default';
        if (!isValidSessionId(sessionId)) {
            return res.status(400).json({ error: 'Invalid sessionId format.' });
        }

        try {
            await waManager.logoutSession(sessionId);
            res.json({ success: true, message: `Session [${sessionId}] logged out.` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // POST /send — send a WhatsApp message
    // Body: { sessionId?: string, to: string, message: string }
    router.post('/send', sendLimiter, async (req, res) => {
        const { sessionId = 'default', to, message } = req.body || {};

        if (!isValidSessionId(sessionId)) {
            return res.status(400).json({ error: 'Invalid sessionId format.' });
        }

        if (!to || !message) {
            return res.status(400).json({ error: 'Both "to" (phone number with country code) and "message" are required.' });
        }
        if (typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ error: '"message" must be a non-empty string.' });
        }
        if (message.length > 4096) {
            return res.status(400).json({ error: '"message" exceeds 4096 character limit.' });
        }

        try {
            const result = await waManager.sendMessage(sessionId, to.trim(), message.trim());
            res.json({ success: true, ...result });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
}
