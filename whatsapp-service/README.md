# WhatsApp Web.js Microservice

A Node.js microservice that connects real WhatsApp via QR code scan and exposes a secure REST API for the Namustutam SaaS platform.

## Architecture

```
Frontend (React)
   │
   ├─ REST calls → Spring Boot (:3000) → /api/whatsapp/** → proxy → whatsapp-service (:3001)
   │
   └─ SSE stream → whatsapp-service (:3001) /qr-stream  (direct, for real-time QR)
```

## Prerequisites

- Node.js 18+ (ESM support required)
- Google Chrome / Chromium (used by Puppeteer under the hood)
- The Spring Boot backend running on port 3000

## Setup

### 1. Install dependencies

```bash
cd whatsapp-service
npm install
```

> ⚠️ `whatsapp-web.js` uses Puppeteer which downloads a bundled Chromium (~170 MB). Make sure you have enough disk space and internet access.

### 2. Configure environment

Copy `.env.example` to `.env` and edit:

```bash
cp .env.example .env
```

Key settings:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Port the service listens on |
| `SERVICE_API_KEY` | `change-me-...` | **Change this!** Secret key for internal API auth |
| `ALLOWED_ORIGINS` | localhost, ngrok, vercel | Comma-separated CORS origins |
| `PUPPETEER_NO_SANDBOX` | `false` | Set `true` on Linux servers without sandbox support |
| `WA_SESSION_DIR` | `./wa-sessions` | Where session data is persisted |

### 3. Run the service

```bash
# Production
npm start

# Development (with auto-restart on file changes)
npm run dev
```

## API Reference

All endpoints under `/api/whatsapp/*` require the `X-WA-API-Key` header (set to `SERVICE_API_KEY`).

> In production, the frontend never calls this service directly for REST endpoints — it goes through Spring Boot's proxy which adds the API key server-side. Only the SSE `/qr-stream` endpoint is accessed directly with the key as a query param.

### Health Check

```
GET /health
```
No auth required. Returns `{ status: "ok" }`.

### QR Code SSE Stream

```
GET /qr-stream?sessionId=default&apiKey=<key>
```
Opens a Server-Sent Events stream. Events:

- `{ status: "initializing" }` — session starting
- `{ qr: "<base64 data URL>", status: "qr" }` — QR code ready to scan
- `{ status: "authenticated" }` — QR scanned, logging in
- `{ status: "ready" }` — fully connected
- `{ status: "disconnected" }` — session ended

### Session Management

```
POST   /api/whatsapp/session/start          { sessionId?: string }
GET    /api/whatsapp/session/:id/status
GET    /api/whatsapp/session/:id/qr         (Returns latest base64 QR data URL)
DELETE /api/whatsapp/session/:id/logout
GET    /api/whatsapp/sessions
GET    /api/whatsapp/status
```

### Send Message

```
POST /api/whatsapp/send
Content-Type: application/json

{
  "to": "919876543210",      // Phone with country code, no + or spaces
  "message": "Hello!",
  "sessionId": "default"     // optional
}
```

Rate limited to **30 messages/minute per IP**.

## Spring Boot Integration

The Spring Boot backend proxies all `/api/whatsapp/**` requests to this service. Configure in `application.yml`:

```yaml
whatsapp:
  service:
    url: ${WHATSAPP_SERVICE_URL:http://localhost:3005}
    api-key: ${WHATSAPP_SERVICE_API_KEY:dev-secret-key-change-in-production}
```

Set the same `SERVICE_API_KEY` in both this service's `.env` and your Spring Boot environment.

## Session Persistence

Sessions are stored in `wa-sessions/` (gitignored). Once authenticated, the service will auto-reconnect on restart without requiring a new QR scan — until the WhatsApp session expires or is explicitly logged out.

## Linux/Server Deployment

On a Linux server without a display:

```env
PUPPETEER_NO_SANDBOX=true
```

And ensure Chromium dependencies are installed:

```bash
# Ubuntu/Debian
apt-get install -y chromium-browser libgbm-dev
```

## Security Notes

- The `SERVICE_API_KEY` is **never** sent to the browser — only the Spring Boot backend holds it.
- The `qr-stream` SSE endpoint accepts `apiKey` as a query param (necessary for `EventSource` which can't set headers). Rotate this key periodically.
- Rate limiting is applied globally (100 req/min) and on `/send` (30 req/min).
