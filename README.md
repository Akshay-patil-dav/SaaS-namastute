
https://saa-s-namastute.vercel.app/login


# 📦 Namastute — SaaS Inventory & POS Platform
> **Full Project Documentation** · v1.0 · May 2026

---

## 📸 UI Preview

### Admin Dashboard
![Dashboard 1](./screenshots/dashboard1.png)

### Dashboard 2 — Analytics
![Dashboard 2](./screenshots/dashboard2.png)

---

## 🏗️ System Architecture

![System Architecture](./images/system_architecture.png)

| Layer | Technology | Port |
|-------|-----------|------|
| Frontend (Client) | React 19 + Vite | `:5173` |
| Backend (API) | Spring Boot 3.2 + Java 21 | `:3000` |
| Database | PostgreSQL | `:5432` |
| Tunnel (Dev) | ngrok | Dynamic |

---

## 🔐 Authentication & RBAC

![RBAC Flow](./images/rbac_flow.png)

### Auth Methods
- **Email/Password** → JWT token (24h expiry)
- **Google OAuth2** → via Spring OAuth2 client
- **Facebook OAuth2** → via Spring OAuth2 client

### Roles & Access

| Role | Accessible Modules |
|------|--------------------|
| `SUPER_ADMIN` | All modules + Companies, Subscriptions, Packages |
| `ADMIN` | Dashboard, Products, Sales, Purchases, Stock, Settings |
| `CLIENT` | Main Dashboard only |

---

## 🗄️ Database Schema

![Database Schema](./images/db_schema.png)

### Tables Overview

| Table | Description |
|-------|-------------|
| `users` | User accounts (email, password, full_name) |
| `roles` | SUPER_ADMIN, ADMIN, CLIENT |
| `user_roles` | Junction table (many-to-many) |
| `products` | Products with SKU, price, stock, images |
| `categories` | Product categories |
| `sub_categories` | Sub-categories linked to categories |
| `brands` | Brand name + logo image |
| `units` | Units of measurement |
| `warranties` | Warranty types & durations |
| `purchases` | Purchase orders from suppliers |
| `purchase_returns` | Purchase return transactions |
| `sale_orders` | Online sale orders |
| `pos_orders` | In-store POS terminal sales |
| `sales_returns` | Sale return transactions |
| `stocks` | Stock entries per warehouse/store |
| `stock_transfers` | Stock moved between warehouses |

---

## 🛠️ Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.x | UI Framework |
| Vite | 8.x | Build Tool |
| React Router DOM | 7.x | Routing |
| Axios | 1.x | HTTP Client |
| Recharts | 3.x | Charts |
| Lucide React | 0.577 | Icons |
| Bootstrap | 5.3 | Base CSS |
| React DnD | 16.x | Page Builder Drag & Drop |
| React QR Code | 2.x | QR Generation |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Spring Boot | 3.2.4 | Framework |
| Spring Security | 6.x | Auth & CORS |
| Spring Data JPA | — | ORM |
| Spring OAuth2 Client | — | Social Login |
| JJWT | 0.12.5 | JWT Tokens |
| PostgreSQL | — | Database |
| Java | 21 LTS | Runtime |

---

## 📁 Project Structure

```
SaaS-namastute/
├── backend/
│   ├── .env                      ← All config (DB, JWT, OAuth2)
│   ├── pom.xml
│   └── src/main/java/com/example/otpauth/
│       ├── config/               ← Security, JWT, OAuth2, DataSeeder
│       ├── controller/           ← 15 REST controllers
│       ├── service/              ← 17 service classes
│       ├── model/                ← 20 JPA entities
│       ├── repository/           ← Spring Data JPA repos
│       └── dto/
│
├── frontend/
│   ├── .env                      ← VITE_API_URL
│   ├── package.json
│   └── src/
│       ├── App.jsx               ← All routes defined here
│       ├── context/              ← AuthContext, ConfirmContext
│       ├── components/
│       │   ├── layout/           ← Sidebar, Header, PosLayout
│       │   ├── auth/             ← ProtectedRoute, GuestRoute
│       │   └── *.jsx             ← 28 modal components
│       └── pages/                ← 50+ page components
│
└── docs/                         ← This documentation
    ├── DOCUMENTATION.md
    ├── screenshots/
    └── images/
```

---

## 🔌 API Endpoints

| Module | Endpoint | Methods |
|--------|----------|---------|
| Auth | `/api/auth/login`, `/api/auth/register` | POST |
| Products | `/api/products`, `/api/products/{id}` | GET, POST, PUT, DELETE |
| Categories | `/api/categories`, `/api/categories/{id}` | GET, POST, PUT, DELETE |
| Sub-Categories | `/api/subcategories`, `/api/subcategories/{id}` | GET, POST, PUT, DELETE |
| Brands | `/api/brands`, `/api/brands/{id}` | GET, POST, PUT, DELETE |
| Units | `/api/units`, `/api/units/{id}` | GET, POST, PUT, DELETE |
| Warranties | `/api/warranties`, `/api/warranties/{id}` | GET, POST, PUT, DELETE |
| Purchases | `/api/purchases`, `/api/purchases/{id}` | GET, POST, PUT, DELETE |
| Purchase Returns | `/api/purchase-returns`, `/api/purchase-returns/{id}` | GET, POST, PUT, DELETE |
| Sales | `/api/sales`, `/api/sales/{id}` | GET, POST, PUT, DELETE |
| POS Sales | `/api/pos-sales`, `/api/pos-sales/{id}` | GET, POST, PUT, DELETE |
| Sales Returns | `/api/sales-returns`, `/api/sales-returns/{id}` | GET, POST, PUT, DELETE |
| Stocks | `/api/stocks`, `/api/stocks/{id}` | GET, POST, PUT, DELETE |
| Transfers | `/api/transfers`, `/api/transfers/{id}` | GET, POST, PUT, DELETE |

---

## 🖥️ Pages & Routes

### Public (No Login Required)
| Route | Page | Description |
|-------|------|-------------|
| `/` | LandingPage | Marketing homepage |
| `/blog` | BlogPage | Blog listing |
| `/blog/:slug` | BlogDetail | Single blog post |
| `/login` | Login | Email + OAuth2 login |
| `/register` | Register | New account |

### Admin + Super Admin
| Route | Page |
|-------|------|
| `/dashboard` | Main KPI Dashboard |
| `/dashboard/sales` | Sales Analytics |
| `/dashboard/manage-stock` | Stock Overview |
| `/dashboard/stock-adjustment` | Adjust Stock |
| `/dashboard/stock-transfer` | Transfer Stock |
| `/dashboard/sales-online` | Online Orders |
| `/dashboard/sales-pos` | POS Orders |
| `/dashboard/sales-return` | Sales Returns |
| `/products` | Product List |
| `/create-product` | Add Product |
| `/edit-product/:id` | Edit Product |
| `/expired-products` | Expired Items |
| `/low-stocks` | Low Stock Alerts |
| `/category` | Categories |
| `/sub-category` | Sub-Categories |
| `/brands` | Brands |
| `/units` | Units |
| `/warranties` | Warranties |
| `/purchases` | Purchases |
| `/add-purchase` | Add Purchase |
| `/edit-purchase/:id` | Edit Purchase |
| `/purchase-return` | Purchase Returns |
| `/add-purchase-return` | Add Return |
| `/print-barcode` | Print Barcodes |
| `/print-qrcode` | Print QR Codes |
| `/settings` | Settings |

### Super Admin Only
| Route | Page |
|-------|------|
| `/dashboard/super-dashboard` | Platform KPIs |
| `/dashboard/super-companies` | Manage Companies |
| `/dashboard/super-subscriptions` | Subscriptions |
| `/dashboard/super-packages` | Packages/Plans |

---

## ⚙️ Environment Variables

### `backend/.env`
```env
SERVER_PORT=3000
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/otp_auth_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=root
JWT_SECRET=<hex-key>
JWT_EXPIRATION=86400000
APP_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
CORS_EXTRA_ORIGINS=http://localhost:5174,http://localhost:3000
GOOGLE_CLIENT_ID=YOUR_ID
GOOGLE_CLIENT_SECRET=YOUR_SECRET
SUPER_ADMIN_EMAIL=admin@gmail.com
SUPER_ADMIN_PASSWORD=Admin@12345
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Local Setup

### 1. Database
```sql
CREATE DATABASE otp_auth_db;
```

### 2. Backend
```bash
cd backend
# Edit .env with your DB credentials
.\restart-backend.ps1
# OR: mvn spring-boot:run
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Open: http://localhost:5173
```

### 4. Default Login
```
Email:    admin@gmail.com
Password: Admin@12345
```

---

## 📊 Module Status

| Module | Status |
|--------|--------|
| JWT + OAuth2 Authentication | ✅ Done |
| Landing Page + Blog | ✅ Done |
| Admin Dashboard (KPIs + Charts) | ✅ Done |
| Products CRUD + Images | ✅ Done |
| Categories / Sub-Categories | ✅ Done |
| Brands / Units / Warranties | ✅ Done |
| Stock Management | ✅ Done |
| Stock Adjustments + Transfers | ✅ Done |
| Online Sales Orders | ✅ Done |
| POS Sales Orders | ✅ Done |
| Sales Returns | ✅ Done |
| Purchases + Returns | ✅ Done |
| Print Barcode / QR Code | ✅ Done |
| Expired Products Alert | ✅ Done |
| Low Stock Alerts | ✅ Done |
| Settings Page | ✅ Done |
| Super Admin Panel | ✅ Done |
| Invoice Generation | ✅ Done |
| Page Builder (Blog) | ✅ Done |
| Supplier Management | ❌ Pending |
| Customer Management | ❌ Pending |
| Payment Gateway | ❌ Pending |
| Email/SMS Notifications | ❌ Pending |
| Docker / CI-CD | ❌ Pending |
| Mobile / PWA | ❌ Pending |

---

## 🔮 Future Roadmap

### Phase 2 — Core
- [ ] Supplier & Customer Management modules
- [ ] Full Warehouse CRUD with address
- [ ] Product Variants (size, color, weight)
- [ ] Hardware barcode scanner integration in POS

### Phase 3 — Finance
- [ ] Profit & Loss Reports
- [ ] GST/VAT tax reports (PDF export)
- [ ] Expense tracking module
- [ ] Accounts Payable/Receivable
- [ ] Multi-currency support

### Phase 4 — eCommerce
- [ ] Customer-facing online storefront
- [ ] Payment Gateway (Razorpay / Stripe)
- [ ] Coupon & discount engine
- [ ] Quotation/Estimate module
- [ ] Delivery management & tracking

### Phase 5 — Automation
- [ ] Email alerts (low stock, payment due)
- [ ] SMS notifications (Twilio / MSG91)
- [ ] Scheduled auto-reports
- [ ] CSV/Excel bulk import/export
- [ ] Full audit logs

### Phase 6 — DevOps
- [ ] Docker Compose setup
- [ ] GitHub Actions CI/CD pipeline
- [ ] Cloud deployment (AWS / Railway)
- [ ] Automated DB backups
- [ ] Multi-language / i18n support

### Phase 7 — Mobile
- [ ] Progressive Web App (offline POS)
- [ ] React Native mobile app
- [ ] Thermal receipt printer support
- [ ] Customer loyalty points system

---

*Namastute SaaS POS — Documentation v1.0 · May 2026*
