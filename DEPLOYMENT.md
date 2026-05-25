# 🚀 Deployment Guide — Namastute POS

> **Stack**: React (Vite) on **Vercel** · Spring Boot on **Render** · PostgreSQL on **Render**

---

## 1. Frontend Deployment (Vercel)

### First-time Setup

1. Push your code to GitHub (main branch).
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo.
3. Set the **Root Directory** to `frontend`.
4. Vercel auto-detects Vite. Leave the build command as `npm run build`.

### Environment Variables (REQUIRED)

In Vercel Dashboard → **Project → Settings → Environment Variables**, add all of these:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://springboot-app-pb1v.onrender.com/api` |
| `VITE_BACKEND_BASE_URL` | `https://springboot-app-pb1v.onrender.com` |
| `VITE_FRONTEND_URL` | `https://saa-s-namastute.vercel.app` |
| `VITE_APP_NAME` | `Namastute POS` |
| `VITE_APP_VERSION` | `1.0.0` |
| `VITE_ENABLE_GOOGLE_LOGIN` | `true` |
| `VITE_ENABLE_FACEBOOK_LOGIN` | `true` |
| `VITE_ENABLE_BLOG` | `true` |

> ⚠️ **IMPORTANT**: After adding/changing env vars, you MUST trigger a new deployment (Redeploy) for them to take effect. Vite bakes these into the bundle at build time.

### SPA Routing Fix (Already Done)

The `frontend/vercel.json` file is already configured to rewrite all URLs to `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This is what prevents the **404 on page reload** issue. ✅

---

## 2. Backend Deployment (Render)

### Environment Variables (REQUIRED)

In Render Dashboard → **Your Service → Environment**, add all of these:

| Variable | Value |
|----------|-------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://dpg-d88p9cek1jcs73fpc33g-a.oregon-postgres.render.com:5432/namustutam_db?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | `namustutam_db_user` |
| `SPRING_DATASOURCE_PASSWORD` | `V1EyJzIg7Ca4vzf2X12tc8Oszb1eifxR` |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_EXPIRATION` | `86400000` |
| `APP_BASE_URL` | `https://springboot-app-pb1v.onrender.com` |
| `FRONTEND_URL` | `https://saa-s-namastute.vercel.app` |
| `CORS_EXTRA_ORIGINS` | `http://localhost:5173,http://localhost:5174` |
| `SUPER_ADMIN_EMAIL` | `admin@gmail.com` |
| `SUPER_ADMIN_PASSWORD` | `Admin@12345` |
| `SUPER_ADMIN_NAME` | `Super Admin` |
| `SERVER_PORT` | `3000` |
| `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID` | *(your Google client ID)* |
| `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET` | *(your Google client secret)* |

### Build & Start Commands

In Render Dashboard → **Your Service → Settings**:

| Field | Value |
|-------|-------|
| **Build Command** | `mvn clean package -DskipTests` |
| **Start Command** | `java -jar target/*.jar` |
| **Root Directory** | `backend` |

---

## 3. Google OAuth2 Setup

For Google Login to work, the OAuth2 redirect URI must be registered:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://springboot-app-pb1v.onrender.com/login/oauth2/code/google
   ```
4. Under **Authorized JavaScript origins**, add:
   ```
   https://springboot-app-pb1v.onrender.com
   https://saa-s-namastute.vercel.app
   ```

---

## 4. Local Development

### Backend
```bash
cd backend
# Make sure backend/.env has your local DB credentials (see comments in the file)
./mvnw spring-boot:run
# OR: mvn spring-boot:run
# Backend runs on http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Local `.env` for Frontend (`frontend/.env`)
The `.env` already points to the production backend. For local backend testing, change:
```env
VITE_API_BASE_URL=http://localhost:3000/api , https://springboot-app-pb1v.onrender.com/api
VITE_BACKEND_BASE_URL=http://localhost:3000 , https://springboot-app-pb1v.onrender.com
```

---

## 5. Verifying the Deployment

After deploying both services:

- [ ] Visit `https://saa-s-namastute.vercel.app` → Landing page loads
- [ ] Visit `https://saa-s-namastute.vercel.app/login` → Login page loads
- [ ] Log in with `admin@gmail.com` / `Admin@12345` → redirects to `/dashboard`
- [ ] **Hard-reload** (Ctrl+Shift+R) on `/dashboard` → page must NOT 404 ✅
- [ ] Navigate sidebar → must navigate without full page reload (instant)
- [ ] Header store name → shows actual company name from settings (not "Freshmart")

---

## 6. Common Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| 404 on page refresh | `vercel.json` missing or not deployed | Ensure `vercel.json` is in `frontend/` and committed |
| CORS errors in console | Backend `CORS_EXTRA_ORIGINS` missing frontend URL | Add the origin to `CORS_EXTRA_ORIGINS` in Render env vars |
| Login returns 401 | JWT_SECRET mismatch | Ensure same secret in Render env and local |
| Google login fails | OAuth redirect URI not registered | Add Render URL to Google Console authorized redirect URIs |
| Render backend cold start | Free tier sleeps after 15 mins | First API call after sleep takes ~30s — expected behavior |
| Env vars not in build | Vite env vars set after build | Redeploy on Vercel after setting env vars |
