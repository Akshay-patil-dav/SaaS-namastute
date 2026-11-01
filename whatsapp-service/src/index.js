import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createWhatsAppRouter } from './routes/whatsapp.js';
import { WhatsAppManager } from './whatsapp/manager.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3005', 10);
const HOST = process.env.HOST || '0.0.0.0';
const SERVICE_API_KEY = process.env.SERVICE_API_KEY || 'wa_sec_9f7a8b3e2d1c4b5a6f7e8d9c0b1a2f3e';

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
}));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://localhost:5174,http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,https://awhile-venus-unlearned.ngrok-free.dev,https://namustutamsaas.vercel.app')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        // Allow requests with no origin (mobile apps, curl, or backend-to-backend proxies)
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-WA-API-Key', 'Authorization', 'ngrok-skip-browser-warning'],
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));

// ── Request Logger ────────────────────────────────────────────────────────────
app.use((req, _res, next) => {
    console.log(`[WhatsApp Service] ${new Date().toLocaleTimeString()} ${req.method} ${req.originalUrl}`);
    next();
});

// ── API Key authentication middleware ─────────────────────────────────────────
function requireApiKey(req, res, next) {
    const authHeader = req.headers['authorization'];
    const bearerKey = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const key = (req.headers['x-wa-api-key'] || bearerKey || req.query.apiKey || '').toString().trim();

    if (!key || key !== SERVICE_API_KEY.trim()) {
        console.warn(`[Auth 401] Invalid or missing key: "${key}" from ${req.ip} for ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ error: 'Unauthorized: invalid or missing WhatsApp service API key.' });
    }
    next();
}

// ── WhatsApp Manager (singleton — manages all WA client sessions) ─────────────
const waManager = new WhatsAppManager();

// ── Health check (public, for monitoring) ─────────────────────────────────────
app.get(['/health', '/api/whatsapp/health'], (_req, res) => {
    res.json({
        status: 'ok',
        service: 'whatsapp-service',
        engine: 'whatsapp-web.js',
        ts: new Date().toISOString()
    });
});

// ── QR code SSE stream ────────────────────────────────────────────────────────
// Streams real-time QR updates to clients as Server-Sent Events.
app.get(['/qr-stream', '/api/whatsapp/qr-stream'], requireApiKey, (req, res) => {
    const sessionId = (req.query.sessionId || 'default').toString().trim();
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    // Send current status immediately
    const currentStatus = waManager.getStatus(sessionId);
    const existingQr = waManager.getQr(sessionId);
    res.write(`data: ${JSON.stringify({ status: currentStatus, qr: existingQr })}\n\n`);

    const onQr = (qrDataUrl) => {
        res.write(`data: ${JSON.stringify({ qr: qrDataUrl, status: 'qr' })}\n\n`);
    };
    const onReady = (info) => {
        res.write(`data: ${JSON.stringify({ status: 'ready', info })}\n\n`);
    };
    const onAuthenticated = () => {
        res.write(`data: ${JSON.stringify({ status: 'authenticated' })}\n\n`);
    };
    const onDisconnected = (reason) => {
        res.write(`data: ${JSON.stringify({ status: 'disconnected', reason })}\n\n`);
    };

    waManager.on(`qr:${sessionId}`, onQr);
    waManager.on(`ready:${sessionId}`, onReady);
    waManager.on(`authenticated:${sessionId}`, onAuthenticated);
    waManager.on(`disconnected:${sessionId}`, onDisconnected);

    req.on('close', () => {
        waManager.off(`qr:${sessionId}`, onQr);
        waManager.off(`ready:${sessionId}`, onReady);
        waManager.off(`authenticated:${sessionId}`, onAuthenticated);
        waManager.off(`disconnected:${sessionId}`, onDisconnected);
    });
});

// ── WhatsApp API routes (Mounted at BOTH /api/whatsapp AND / for full compatibility) ──
const waRouter = createWhatsAppRouter(waManager);
app.use('/api/whatsapp', requireApiKey, waRouter);
app.use('/', requireApiKey, waRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    console.warn(`[WhatsApp Service 404] Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Endpoint not found on WhatsApp service.',
        method: req.method,
        path: req.originalUrl,
        availableRoutes: [
            'GET /health',
            'GET /status',
            'GET /api/whatsapp/status',
            'GET /sessions',
            'GET /api/whatsapp/sessions',
            'POST /session/start',
            'POST /api/whatsapp/session/start',
            'GET /session/:sessionId/status',
            'GET /api/whatsapp/session/:sessionId/status',
            'GET /session/:sessionId/qr',
            'GET /api/whatsapp/session/:sessionId/qr',
            'DELETE /session/:sessionId/logout',
            'DELETE /api/whatsapp/session/:sessionId/logout',
            'POST /send',
            'POST /api/whatsapp/send'
        ]
    });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('[WhatsApp Service Error]', err.message);
    res.status(500).json({ error: err.message || 'Internal WhatsApp service error' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const server = app.listen(PORT, HOST, () => {
    console.log(`[WhatsApp Service] Running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`[WhatsApp Service] Allowed origins: ${allowedOrigins.join(', ')}`);
    // Automatically restore preserved sessions from disk
    waManager.autoRestoreSessions();
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        console.error(`[WhatsApp Service Fatal] Port ${PORT} cannot be bound (${err.code}). Check if port ${PORT} is reserved or in use.`);
    } else {
        console.error('[WhatsApp Service Fatal]', err);
    }
    process.exit(1);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
async function shutdown() {
    console.log('[WhatsApp Service] Shutting down gracefully...');
    await waManager.destroyAll();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
