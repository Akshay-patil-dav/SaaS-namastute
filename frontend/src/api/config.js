/**
 * api/config.js — Centralized API Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL API base URLs, keys, and flags are read from the .env file here.
 * Pages/components should import from this file, NOT use import.meta.env directly.
 *
 * To change the backend URL:  edit frontend/.env  →  VITE_API_BASE_URL
 * To change the backend root: edit frontend/.env  →  VITE_BACKEND_BASE_URL
 * Then restart the dev server (npm run dev).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';

// ── Raw env values ─────────────────────────────────────────────────────────
export const ENV = {
  /** e.g.  http://localhost:3000/api   or   https://xxxx.ngrok-free.app/api */
  API_BASE_URL:      import.meta.env.VITE_API_BASE_URL      || 'http://localhost:3000/api',

  /** e.g.  http://localhost:3000  (no trailing slash) */
  BACKEND_BASE_URL:  import.meta.env.VITE_BACKEND_BASE_URL  || 'http://localhost:3000',

  /** e.g.  http://localhost:5173 */
  FRONTEND_URL:      import.meta.env.VITE_FRONTEND_URL      || 'http://localhost:5173',

  /** App branding */
  APP_NAME:          import.meta.env.VITE_APP_NAME          || 'Namastute POS',
  APP_VERSION:       import.meta.env.VITE_APP_VERSION       || '1.0.0',

  /** Feature flags */
  ENABLE_GOOGLE_LOGIN:   import.meta.env.VITE_ENABLE_GOOGLE_LOGIN   !== 'false',
  ENABLE_FACEBOOK_LOGIN: import.meta.env.VITE_ENABLE_FACEBOOK_LOGIN !== 'false',
  ENABLE_BLOG:           import.meta.env.VITE_ENABLE_BLOG           !== 'false',
};

// ── Derived API endpoint groups ────────────────────────────────────────────
// Add or change endpoint prefixes here — no need to touch individual pages.
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

  // Sales
  SALES:         `${ENV.API_BASE_URL}/sales`,
  SALES_RETURNS: `${ENV.API_BASE_URL}/sales-returns`,
  POS_SALES:     `${ENV.API_BASE_URL}/pos-sales`,
  PURCHASES:     `${ENV.API_BASE_URL}/purchases`,

  // Page Builder
  BUILDER:       `${ENV.API_BASE_URL}/builder`,

  // OAuth2 redirect URLs (uses backend root, not /api prefix)
  OAUTH_GOOGLE:  `${ENV.BACKEND_BASE_URL}/oauth2/authorization/google`,
  OAUTH_FACEBOOK:`${ENV.BACKEND_BASE_URL}/oauth2/authorization/facebook`,
};

// ── Axios instance ─────────────────────────────────────────────────────────
/**
 * Pre-configured Axios instance.
 * - baseURL set from .env automatically
 * - JWT token is attached via request interceptor (reads from localStorage)
 * - 401 responses auto-redirect to /login
 *
 * Usage:
 *   import apiClient from '@/api/config';
 *   const res = await apiClient.get('/products');        // hits API_BASE_URL/products
 *   const res = await apiClient.get(API.PRODUCTS);       // same, explicit
 */
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 s
});

// Attach JWT token from localStorage to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global error handling — redirect to login on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on public pages
      const publicPaths = ['/login', '/register', '/', '/blog'];
      const isPublic = publicPaths.some((p) => window.location.pathname.startsWith(p));
      if (!isPublic) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
