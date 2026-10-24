/**
 * api/config.js — Centralized API Configuration with Automatic Fallback
 * ─────────────────────────────────────────────────────────────────────────────
 * Connection Architecture:
 * - Frontend Connection:
 *     Primary:  https://namustutam.vercel.app/
 *     Fallback: http://localhost:4000
 *
 * - Backend Connection:
 *     Primary:  http://localhost:3000  (API: /api)
 *     Fallback: https://awhile-venus-unlearned.ngrok-free.dev (API: /api)
 *
 * Automatic Failover:
 *   If localhost:3000 is unreachable (offline, network error, or 5xx),
 *   apiClient automatically retries requests on ngrok, and switches the active
 *   backend dynamically for seamless operation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';

// ── Connection Endpoints ──────────────────────────────────────────────────────
export const BACKEND_ENDPOINTS = {
  LOCAL_API: 'http://localhost:3000/api',
  LOCAL_BASE: 'http://localhost:3000',
  NGROK_API: 'https://awhile-venus-unlearned.ngrok-free.dev/api',
  NGROK_BASE: 'https://awhile-venus-unlearned.ngrok-free.dev',
};

export const FRONTEND_ENDPOINTS = {
  PRIMARY: 'https://namustutam.vercel.app',
  LOCAL: 'http://localhost:4000',
};

// ── Smart Environment & Host Detection ────────────────────────────────────────
const isBrowser = typeof window !== 'undefined';
const isHttps = isBrowser && window.location.protocol === 'https:';
const isProduction = import.meta.env.PROD === true;

// If active backend was already determined in this browser session, use it
const cachedBackendPreference = isBrowser ? sessionStorage.getItem('namustutam_active_backend') : null;

// Determine Initial Backend Base URLs:
// Note: If running on HTTPS (e.g. deployed on Vercel), modern browsers block mixed content (HTTP calls to localhost),
// so HTTPS origin defaults to ngrok. On local dev (HTTP), it starts with localhost:3000 and auto-falls back to ngrok.
const getInitialBackendUrls = () => {
  if (cachedBackendPreference === 'ngrok') {
    return {
      api: BACKEND_ENDPOINTS.NGROK_API,
      base: BACKEND_ENDPOINTS.NGROK_BASE,
    };
  }

  if (isHttps) {
    return {
      api: import.meta.env.VITE_API_BASE_URL?.startsWith('https:')
        ? import.meta.env.VITE_API_BASE_URL
        : BACKEND_ENDPOINTS.NGROK_API,
      base: import.meta.env.VITE_BACKEND_BASE_URL?.startsWith('https:')
        ? import.meta.env.VITE_BACKEND_BASE_URL
        : BACKEND_ENDPOINTS.NGROK_BASE,
    };
  }

  return {
    api: import.meta.env.VITE_API_BASE_URL || (isProduction ? BACKEND_ENDPOINTS.NGROK_API : BACKEND_ENDPOINTS.LOCAL_API),
    base: import.meta.env.VITE_BACKEND_BASE_URL || (isProduction ? BACKEND_ENDPOINTS.NGROK_BASE : BACKEND_ENDPOINTS.LOCAL_BASE),
  };
};

const initialBackends = getInitialBackendUrls();

// Determine Initial Frontend Connection URL:
// Uses https://namustutam.vercel.app as primary, or window.location.origin, falling back to http://localhost:4000
const getInitialFrontendUrl = () => {
  if (import.meta.env.VITE_FRONTEND_URL) {
    return import.meta.env.VITE_FRONTEND_URL;
  }
  if (isBrowser && window.location.origin) {
    // If running on localhost or 127.0.0.1, use local origin (http://localhost:4000)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin;
    }
    // If running on custom domain or Vercel
    return window.location.origin;
  }
  return FRONTEND_ENDPOINTS.PRIMARY;
};

// ── Raw env values (mutable on failover) ───────────────────────────────────────
export const ENV = {
  API_BASE_URL: initialBackends.api,
  BACKEND_BASE_URL: initialBackends.base,
  FRONTEND_URL: getInitialFrontendUrl(),

  FALLBACK_API_BASE_URL: BACKEND_ENDPOINTS.NGROK_API,
  FALLBACK_BACKEND_BASE_URL: BACKEND_ENDPOINTS.NGROK_BASE,
  FALLBACK_FRONTEND_URL: FRONTEND_ENDPOINTS.LOCAL,

  APP_NAME: import.meta.env.VITE_APP_NAME || 'Namustutam POS',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  ENABLE_GOOGLE_LOGIN: import.meta.env.VITE_ENABLE_GOOGLE_LOGIN !== 'false',
  ENABLE_FACEBOOK_LOGIN: import.meta.env.VITE_ENABLE_FACEBOOK_LOGIN !== 'false',
  ENABLE_BLOG: import.meta.env.VITE_ENABLE_BLOG !== 'false',
};

// ── Derived API endpoint groups ───────────────────────────────────────────────
export const API = {
  BASE: ENV.API_BASE_URL,

  // Auth
  AUTH: `${ENV.API_BASE_URL}/auth`,

  // Products & Inventory
  PRODUCTS: `${ENV.API_BASE_URL}/products`,
  STOCKS: `${ENV.API_BASE_URL}/stocks`,
  CATEGORIES: `${ENV.API_BASE_URL}/categories`,
  SUBCATEGORIES: `${ENV.API_BASE_URL}/subcategories`,
  BRANDS: `${ENV.API_BASE_URL}/brands`,
  UNITS: `${ENV.API_BASE_URL}/units`,
  WARRANTIES: `${ENV.API_BASE_URL}/warranties`,
  TRANSFERS: `${ENV.API_BASE_URL}/transfers`,

  // Sales & Purchases
  SALES: `${ENV.API_BASE_URL}/sales`,
  SALES_RETURNS: `${ENV.API_BASE_URL}/sales-returns`,
  POS_SALES: `${ENV.API_BASE_URL}/pos-sales`,
  PURCHASES: `${ENV.API_BASE_URL}/purchases`,
  PURCHASE_RETURNS: `${ENV.API_BASE_URL}/purchase-returns`,

  // Page Builder & Settings
  BUILDER: `${ENV.API_BASE_URL}/builder`,
  SETTINGS: `${ENV.API_BASE_URL}/settings`,
  UPLOAD: `${ENV.API_BASE_URL}/upload`,

  // AI Helper (per-user, JWT-protected)
  AI: `${ENV.API_BASE_URL}/ai`,

  // OAuth2 redirect URLs (uses backend root, not /api prefix)
  OAUTH_GOOGLE: `${ENV.BACKEND_BASE_URL}/oauth2/authorization/google`,
  OAUTH_FACEBOOK: `${ENV.BACKEND_BASE_URL}/oauth2/authorization/facebook`,
};

/**
 * Synchronize API endpoint object when backend fails over.
 */
export const updateApiEndpoints = (newApiBase, newBackendBase) => {
  ENV.API_BASE_URL = newApiBase;
  ENV.BACKEND_BASE_URL = newBackendBase;

  API.BASE = newApiBase;
  API.AUTH = `${newApiBase}/auth`;
  API.PRODUCTS = `${newApiBase}/products`;
  API.STOCKS = `${newApiBase}/stocks`;
  API.CATEGORIES = `${newApiBase}/categories`;
  API.SUBCATEGORIES = `${newApiBase}/subcategories`;
  API.BRANDS = `${newApiBase}/brands`;
  API.UNITS = `${newApiBase}/units`;
  API.WARRANTIES = `${newApiBase}/warranties`;
  API.TRANSFERS = `${newApiBase}/transfers`;
  API.SALES = `${newApiBase}/sales`;
  API.SALES_RETURNS = `${newApiBase}/sales-returns`;
  API.POS_SALES = `${newApiBase}/pos-sales`;
  API.PURCHASES = `${newApiBase}/purchases`;
  API.PURCHASE_RETURNS = `${newApiBase}/purchase-returns`;
  API.BUILDER = `${newApiBase}/builder`;
  API.SETTINGS = `${newApiBase}/settings`;
  API.UPLOAD = `${newApiBase}/upload`;
  API.AI = `${newApiBase}/ai`;
  API.OAUTH_GOOGLE = `${newBackendBase}/oauth2/authorization/google`;
  API.OAUTH_FACEBOOK = `${newBackendBase}/oauth2/authorization/facebook`;

  if (isBrowser) {
    try {
      sessionStorage.setItem('namustutam_active_backend', newBackendBase.includes('ngrok') ? 'ngrok' : 'local');
    } catch { /* ignore */ }
  }
};

// ── Helper to resolve relative image URLs to active backend absolute URLs ─────
export const resolveImageUrl = (url, fallbackBase = null) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const base = fallbackBase || ENV.BACKEND_BASE_URL;
  return `${base}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

// ── Axios instance ────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  timeout: 45_000, // 45 s — AI calls can take longer
});

// ── Request interceptor: attach JWT ───────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('namustutam_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch {
      // ignore malformed localStorage entries
    }
    // Always attach ngrok bypass header in case request targets ngrok tunnel
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: Auto-failover to ngrok if localhost:3000 is unavailable 
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Identify network failures, connection refused, timeouts, or 5xx server errors
    const isNetworkError = error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      (!error.response && error.message?.toLowerCase().includes('network error'));
    const isServerError = error.response && error.response.status >= 500;

    // Failover from localhost:3000 to ngrok
    if ((isNetworkError || isServerError) && !originalRequest._retriedWithFallback) {
      originalRequest._retriedWithFallback = true;

      const currentTarget = (originalRequest.url && originalRequest.url.startsWith('http'))
        ? originalRequest.url
        : (originalRequest.baseURL || apiClient.defaults.baseURL || '');

      const isCurrentLocal = currentTarget.includes('localhost:3000') || currentTarget.includes('127.0.0.1:3000');

      if (isCurrentLocal) {
        console.warn(`[Backend Failover] Localhost (3000) unavailable. Connecting to fallback ngrok backend: ${BACKEND_ENDPOINTS.NGROK_API}`);

        const fallbackApiUrl = BACKEND_ENDPOINTS.NGROK_API;
        const fallbackBackendUrl = BACKEND_ENDPOINTS.NGROK_BASE;

        // Dynamically update runtime configuration and axios defaults
        updateApiEndpoints(fallbackApiUrl, fallbackBackendUrl);
        apiClient.defaults.baseURL = fallbackApiUrl;

        // Replace URL in original request
        if (originalRequest.url && originalRequest.url.startsWith('http')) {
          originalRequest.url = originalRequest.url
            .replace('http://localhost:3000/api', fallbackApiUrl)
            .replace('http://localhost:3000', fallbackBackendUrl)
            .replace('http://127.0.0.1:3000/api', fallbackApiUrl)
            .replace('http://127.0.0.1:3000', fallbackBackendUrl);
        } else {
          originalRequest.baseURL = fallbackApiUrl;
        }

        // Add bypass header and retry immediately
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['ngrok-skip-browser-warning'] = 'true';

        return apiClient(originalRequest);
      }
    }

    // 401 Unauthorized handling
    if (error.response?.status === 401) {
      const publicPaths = ['/login', '/register', '/', '/blog'];
      const isPublic = isBrowser && publicPaths.some((p) => window.location.pathname.startsWith(p));
      if (!isPublic && isBrowser) {
        localStorage.removeItem('namustutam_auth');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

// ── Smart backend health checker ──────────────────────────────────────────────
export const checkBackendConnection = async () => {
  // Check active backend
  try {
    const res = await apiClient.get('/health', { timeout: 4000 });
    return { ok: true, url: ENV.BACKEND_BASE_URL, data: res.data };
  } catch {
    // If current backend failed and wasn't ngrok, test ngrok directly
    if (!ENV.BACKEND_BASE_URL.includes('ngrok')) {
      try {
        const ngrokRes = await axios.get(`${BACKEND_ENDPOINTS.NGROK_API}/health`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
          timeout: 5000,
        });
        updateApiEndpoints(BACKEND_ENDPOINTS.NGROK_API, BACKEND_ENDPOINTS.NGROK_BASE);
        return { ok: true, url: BACKEND_ENDPOINTS.NGROK_BASE, data: ngrokRes.data, switched: true };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    }
  }
  return { ok: false, error: 'All backends offline' };
};

export default apiClient;
