/**
 * api/config.js — Centralized API Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL API base URLs, keys, and flags are read from the .env / .env.production
 * files here. Pages/components should import from this file, NOT use
 * import.meta.env directly.
 *
 * Local dev  →  frontend/.env           →  points to http://localhost:3000
 * Production →  frontend/.env.production →  points to https://springboot-app-pb1v.onrender.com
 *               (or override via Vercel Dashboard → Settings → Environment Variables)
 *
 * After changing .env files restart the dev server: npm run dev
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';

// ── Smart environment detection ─────────────────────────────────────────────
// Vite sets import.meta.env.PROD = true during `vite build`, false in dev
const isProduction = import.meta.env.PROD === true;

const DEFAULT_API_BASE_URL = isProduction
  ? 'https://springboot-app-pb1v.onrender.com/api'
  : 'http://localhost:3000/api';

const DEFAULT_BACKEND_BASE_URL = isProduction
  ? 'https://springboot-app-pb1v.onrender.com'
  : 'http://localhost:3000';

const DEFAULT_FRONTEND_URL = isProduction
  ? 'https://saa-s-namustutam.vercel.app'
  : 'http://localhost:5173';

// ── Raw env values ─────────────────────────────────────────────────────────
export const ENV = {
  /** e.g.  http://localhost:3000/api   or   https://springboot-app-pb1v.onrender.com/api */
  API_BASE_URL:     import.meta.env.VITE_API_BASE_URL     || DEFAULT_API_BASE_URL,

  /** e.g.  http://localhost:3000  (no trailing slash) */
  BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL || DEFAULT_BACKEND_BASE_URL,

  /** e.g.  https://saa-s-namustutam.vercel.app  or  http://localhost:5173 */
  FRONTEND_URL:     import.meta.env.VITE_FRONTEND_URL     || DEFAULT_FRONTEND_URL,

  /** App branding */
  APP_NAME:    import.meta.env.VITE_APP_NAME    || 'Namustutam POS',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  /** Feature flags */
  ENABLE_GOOGLE_LOGIN:   import.meta.env.VITE_ENABLE_GOOGLE_LOGIN   !== 'false',
  ENABLE_FACEBOOK_LOGIN: import.meta.env.VITE_ENABLE_FACEBOOK_LOGIN !== 'false',
  ENABLE_BLOG:           import.meta.env.VITE_ENABLE_BLOG           !== 'false',
};

// ── Derived API endpoint groups ────────────────────────────────────────────
// Use these constants instead of building URL strings in every component.
export const API = {
  BASE:          ENV.API_BASE_URL,

  // Auth
  AUTH:          `${ENV.API_BASE_URL}/auth`,

  // Products & Inventory
  PRODUCTS:      `${ENV.API_BASE_URL}/products`,
  STOCKS:        `${ENV.API_BASE_URL}/stocks`,
  CATEGORIES:    `${ENV.API_BASE_URL}/categories`,
  SUBCATEGORIES: `${ENV.API_BASE_URL}/subcategories`,
  BRANDS:        `${ENV.API_BASE_URL}/brands`,
  UNITS:         `${ENV.API_BASE_URL}/units`,
  WARRANTIES:    `${ENV.API_BASE_URL}/warranties`,
  TRANSFERS:     `${ENV.API_BASE_URL}/transfers`,

  // Sales & Purchases
  SALES:           `${ENV.API_BASE_URL}/sales`,
  SALES_RETURNS:   `${ENV.API_BASE_URL}/sales-returns`,
  POS_SALES:       `${ENV.API_BASE_URL}/pos-sales`,
  PURCHASES:       `${ENV.API_BASE_URL}/purchases`,
  PURCHASE_RETURNS:`${ENV.API_BASE_URL}/purchase-returns`,

  // Page Builder & Settings
  BUILDER:  `${ENV.API_BASE_URL}/builder`,
  SETTINGS: `${ENV.API_BASE_URL}/settings`,
  UPLOAD:   `${ENV.API_BASE_URL}/upload`,

  // AI Helper (per-user, JWT-protected)
  AI: `${ENV.API_BASE_URL}/ai`,

  // OAuth2 redirect URLs (uses backend root, not /api prefix)
  OAUTH_GOOGLE:   `${ENV.BACKEND_BASE_URL}/oauth2/authorization/google`,
  OAUTH_FACEBOOK: `${ENV.BACKEND_BASE_URL}/oauth2/authorization/facebook`,
};

// ── Axios instance ─────────────────────────────────────────────────────────
/**
 * Pre-configured Axios instance — USE THIS EVERYWHERE instead of raw axios.
 *
 * Features:
 *  - baseURL auto-set from .env (local) or .env.production (Vercel build)
 *  - JWT token auto-attached via request interceptor (reads from localStorage)
 *  - 401 responses auto-redirect to /login
 *  - 45 s timeout for AI calls
 *
 * Usage:
 *   import apiClient from '@/api/config';
 *   const res = await apiClient.get('/products');        // hits ENV.API_BASE_URL/products
 *
 *   import { API } from '@/api/config';
 *   const res = await apiClient.get(API.PRODUCTS);       // same, explicit constant
 */
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 45_000, // 45 s — AI calls can take longer
});

// ── Request interceptor: attach JWT ─────────────────────────────────────────
// Auth context stores the session at 'namustutam_auth' as JSON {token, user}
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
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 globally ───────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicPaths = ['/login', '/register', '/', '/blog'];
      const isPublic = publicPaths.some((p) => window.location.pathname.startsWith(p));
      if (!isPublic) {
        localStorage.removeItem('namustutam_auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
