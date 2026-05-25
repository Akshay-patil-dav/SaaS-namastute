# 📦 Namastute — SaaS Inventory & POS Platform

> **Comprehensive System Documentation** · v1.5 · May 2026  
> A premium, scalable, multi-tenant Software-as-a-Service (SaaS) POS and Inventory Management system powered by **Spring Boot 3.x (Java 21)** and **React 19 + Vite 8**.

---

## 🔗 Live Application
* **Production URL:** [https://saa-s-namastute.vercel.app/login](https://saa-s-namastute.vercel.app/login)
* **Default Super Admin Credentials:**
  * **Email:** `admin@gmail.com`
  * **Password:** `Admin@12345`

---

## 📸 UI Showcase & Previews

### 🔐 Multi-Auth Login Gateway
<img width="100%" alt="Namastute Login Gateway" src="https://github.com/user-attachments/assets/3c25d413-6456-4179-bd14-d1ccba31e8a3" />

### 📊 Admin Analytics Dashboard
<img width="100%" alt="Admin Dashboard Overview" src="https://github.com/user-attachments/assets/dc4ccee2-66e0-4c90-8078-838dfd89f9f0" />

### 📈 Product Portfolio & Rich POS Additions
<img width="100%" alt="Inventory Analytics and Forms" src="https://github.com/user-attachments/assets/c2c4a60e-335d-43c6-9694-9c4ee1e22ad0" />
<img width="100%" alt="Add Product Panel" src="https://github.com/user-attachments/assets/7a58f6b3-310b-490b-812b-eeaa975c841b" />

---

## 🏗️ System Architecture

The platform utilizes a modern decoupled client-server architecture built to withstand high concurrency and ensure real-time data integrity.

<img width="100%" alt="System Architecture Diagram" src="https://github.com/user-attachments/assets/2f65c3fa-e097-4bfa-900d-9796c3c5aefb" />

### Core Port Allocation & Topology

| Service | Technology Layer | Port | Hosting Target |
| :--- | :--- | :---: | :--- |
| **Frontend Client** | React 19 + Vite 8 + Tailwind CSS 4.0 | `:5173` | Vercel (SPA) |
| **Backend API** | Spring Boot 3.2.4 + Java 21 + Spring Security | `:3000` | Render (Web Service) |
| **Database** | PostgreSQL Server | `:5432` | Render (Managed Database) |
| **Tunneling Gateway** | ngrok (Development Proxy) | *Dynamic* | Local Machine Tunnel |

---

## 🔑 Security, Authentication & Dynamic RBAC

Namastute implements enterprise-grade Role-Based Access Control (RBAC) alongside secure federated identity integrations.

<img width="100%" alt="Authentication Flow" src="https://github.com/user-attachments/assets/b94a969d-6b61-4ba3-befa-aa716caef9dd" />

### 🛡️ Identity & Authentication Mechanics
1. **JWT Stateful Tokenization:** Formulated securely using JJWT (`0.12.5`), issuing signed tokens containing roles, permissions, and user context with an adjustable 24-hour expiration window.
2. **Social Login Orchestration:** Leverages Spring Security OAuth2 Client for single-click federated sign-ons via **Google** and **Facebook**, auto-syncing profiles with local PostgreSQL persistence.
3. **Double-Layered Encryption:** Spring Security `BCryptPasswordEncoder` safeguards traditional user passwords, while a custom AES-256-GCM hardware key provider manages secondary platform tokens.

### 👥 Access Permission Matrix

| User Role | Accessible Systems & Views | Actions Allowed |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | Platform Control Panel, Companies Management, Subscription Package Modeler, Database Backups, Core System Config. | full management access across all entities, billing structures, and system configurations. |
| `ADMIN` | Main KPI Dashboard, Inventory, Purchases, Sales, POS Checkout Terminal, Stock Control, Store Settings. | full workspace management (Create, Read, Update, Delete) of product catalogs, orders, and local store parameters. |
| `CLIENT` | Simplified Customer Portal, Purchase Invoices, Support Ticketing, Limited Dashboard view. | View purchases, print receipt PDFs, request returns, customize customer settings. |

---

## 🗄️ Database Entity Schema

The PostgreSQL database is fully normalized, maintaining referential integrity across sales transactions, real-time stock adjustments, and multi-tenant structures.

<img width="100%" alt="Database Schema Diagram" src="https://github.com/user-attachments/assets/44a8ca52-5d43-4e93-9690-52087a41fa1e" />

### Database Layer Highlights
* **JPA Hibernate DDL Auto:** Defaults to `update` for agile schema migrations.
* **Auto-Indexing & Cascades:** Transactions cascade safely across orders, products, and inventory tables.
* **Collaboration & Page Builder:** Folder-Page tree model supporting direct access sharing tokens and active collaboration.
* **AI Helper Configuration Persistence:** Encrypted GCM schema to securely save API keys on a per-user basis.

---

## 🚀 Advanced Project Features

### 🤖 1. Secure Multi-Model AI Assistant (`/api/ai`)
Namastute features a custom, integrated AI Assistant directly mapped to major artificial intelligence providers. 
* **Supported Model Frameworks:** Google Gemini (Stable free-tier default: `gemini-1.5-flash`), Anthropic Claude, DeepSeek, OpenAI, Groq, Mistral, and OpenRouter.
* **Hardware-grade Security:** Users input their own API keys. On submission, the backend sanitizes the key (stripping bad tabs, whitespaces, and invisible Unicode strings) and encrypts it utilizing a server-side **AES-256-GCM** key. The plain-text key never lands on public database files, browser logs, or client-side variables.
* **Preflight Tester:** Built-in lightweight test suite (`GET /api/ai/test`) to verify connection stability and validate token limits before initiating chat threads.

### 🎨 2. SSE-Powered Page Builder & Collaboration Hub (`/api/builder`)
A sophisticated, drag-and-drop website/blog editor that enables users to design storefronts or landing pages in real time.
* **Hierarchical Page Nesting:** Custom folder and page model with flexible tree structures and custom visual icons.
* **Collaboration Engine:** Instantly share folders/pages with other users via secure single-use invitation tokens (`/api/builder/folders/{id}/invite`).
* **Server-Sent Events (SSE):** Features a live streaming event emitter (`/api/builder/notifications/stream`) that pushes real-time collaboration alerts, changes, and message requests directly to active collaborators' browsers.
* **State Syncing:** Saves complex page blocks dynamically via integrated React DnD state adapters.

---

## 📁 Project Directory Structure

```
SaaS-namastute/
├── backend/
│   ├── .env.example              ← Configuration Template
│   ├── pom.xml                   ← Maven Dependencies
│   └── src/main/java/com/example/otpauth/
│       ├── OtpAuthApplication.java ← Main Boot Loader
│       ├── config/               ← Security, CORS, JWT, DataSeeder, AI key encryption
│       ├── controller/           ← REST Controller Layer (18 Endpoints)
│       ├── dto/                  ← Java Request/Response Payloads
│       ├── model/                ← JPA Entities (PostgreSQL)
│       ├── repository/           ← Data Access Layer (Spring Data JPA)
│       ├── service/              ← Business Logic Implementations
│       └── util/                 ← Sanitizers, Cryptographic utilities
│
├── frontend/
│   ├── .env.example              ← VITE_ API Configuration Template
│   ├── package.json              ← NPM Packages & Scripts
│   ├── vercel.json               ← SPA Rewrite Route Rules
│   └── src/
│       ├── main.jsx              ← React DOM Entrypoint
│       ├── App.jsx               ← React Router (50+ Route Points)
│       ├── context/              ← AuthContext, ConfirmContext
│       ├── hooks/                ← Custom React Hook Bindings
│       ├── components/
│       │   ├── layout/           ← Header, Sidebar, Responsive POS Layout
│       │   ├── auth/             ← Security Route Guards
│       │   └── modal/            ← 28+ Modals (Add, Edit, Adjustments)
│       └── pages/                ← Modern Dashboard Pages & POS Panel
│
└── DEPLOYMENT.md                 ← Production Cloud Deploy Guide
```

---

## 🔌 API Endpoint Inventory

All endpoint routes (except OAuth2 login pipelines) are prefixed with `/api`. Secure authentication requires a standard bearer token: `Authorization: Bearer <JWT_TOKEN>`.

### Authentication & Tenant
| Endpoint | Method | Security | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/login` | `POST` | Public | Authenticates credentials; returns JWT token + user details. |
| `/api/auth/register` | `POST` | Public | Registers a new store account and binds default roles. |
| `/api/auth/oauth2/success` | `GET` | Authenticated | Redirect handshake target for social login credentials. |

### Catalog & POS Stock
| Endpoint | Method | Security | Description |
| :--- | :---: | :---: | :--- |
| `/api/products` | `GET`/`POST` | Permissive | Lists all items or creates new products (includes file upload). |
| `/api/products/{id}` | `PUT`/`DELETE` | Permissive | Modifies product attributes or soft-deletes a record. |
| `/api/categories` | `GET`/`POST` | Permissive | Manages parent category classifications. |
| `/api/subcategories` | `GET`/`POST` | Permissive | Manages nested subcategories linked to parents. |
| `/api/brands` | `GET`/`POST` | Permissive | Manages product brands and logo links. |
| `/api/units` | `GET`/`POST` | Permissive | Controls metrics of measurements (seeded: Pcs, Kg, L, M, G). |
| `/api/warranties` | `GET`/`POST` | Permissive | Configures product customer warranty options. |

### Inventory Operations
| Endpoint | Method | Security | Description |
| :--- | :---: | :---: | :--- |
| `/api/stocks` | `GET`/`POST` | Permissive | Retrieves list of stocks or initializes inventory items. |
| `/api/transfers` | `GET`/`POST` | Permissive | Initiates stock transfers between store locations/warehouses. |
| `/api/sales` | `GET`/`POST` | Permissive | Processes online/offline sales orders and generates invoice. |
| `/api/pos-sales` | `GET`/`POST` | Permissive | Real-time POS checkout transactions with stock deduction. |
| `/api/sales-returns` | `GET`/`POST` | Permissive | Processes sales returns and adjusts inventory levels. |
| `/api/purchases` | `GET`/`POST` | Permissive | Manages supplier purchase invoices and tracks expenses. |
| `/api/purchase-returns` | `GET`/`POST` | Permissive | Handles returns back to suppliers. |
| `/api/settings` | `GET`/`PUT` | Permissive | Global shop details, currency signs, and store banner settings. |
| `/api/upload` | `POST` | Permissive | Uploads files to `/uploads` folder; returns relative file path. |

### AI Assistant Module
| Endpoint | Method | Security | Description |
| :--- | :---: | :---: | :--- |
| `/api/ai/settings` | `GET` | JWT Secured | Retrieves user's active AI provider, model, and masked API key. |
| `/api/ai/settings` | `POST` | JWT Secured | Saves/updates AI settings and encrypts API key using GCM. |
| `/api/ai/settings/key` | `DELETE` | JWT Secured | Wipes user's saved API key from the database. |
| `/api/ai/test` | `GET` | JWT Secured | Executes lightweight connection handshake test to provider. |
| `/api/ai/chat` | `POST` | JWT Secured | Proxies multi-turn message arrays to the user's active AI provider. |

### SSE Page Builder
| Endpoint | Method | Security | Description |
| :--- | :---: | :---: | :--- |
| `/api/builder/notifications/stream` | `GET` | JWT Secured | Opens a continuous Server-Sent Event stream for real-time alerts. |
| `/api/builder/data` | `GET` | JWT Secured | Retrieves user's nested folder and page structure tree. |
| `/api/builder/folders` | `POST` | JWT Secured | Creates a builder directory folder. |
| `/api/builder/pages` | `POST` | JWT Secured | Adds drag-and-drop page canvases inside folders. |
| `/api/builder/pages/{id}/move` | `PUT` | JWT Secured | Moves page elements across parent folders. |
| `/api/builder/pages/{id}/blocks` | `GET`/`PUT` | JWT Secured | Retrieves or saves drag-and-drop layouts. |
| `/api/builder/folders/{id}/invite` | `POST` | JWT Secured | Generates secure token to invite other users to folders. |
| `/api/builder/invite/accept/{token}` | `POST` | JWT Secured | Validates token and hooks user to collaboration folders. |

---

## 🛠️ Complete Local Development Guide

### Prerequisites
* **Java Development Kit (JDK 21 or later)**
* **Node.js (v18 or later)** & npm
* **PostgreSQL Database Engine** (running locally on port 5432)

---

### Step 1: Database Setup
1. Open your terminal or PgAdmin and create a clean database:
   ```sql
   CREATE DATABASE otp_auth_db;
   ```
2. By default, the backend expects user `postgres` with password `root`. You can customize this in the next step.

---

### Step 2: Backend Configuration
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy the configuration template into active load variables:
   ```bash
   copy .env.example .env
   ```
3. Edit the `.env` file to match your PostgreSQL credentials:
   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/otp_auth_db
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your_password
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   ```
4. Start the Spring Boot Application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will boot up, auto-seed the standard database units/roles, and run on `http://localhost:3000`.*

---

### Step 3: Frontend Configuration
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Copy the frontend env template:
   ```bash
   copy .env.example .env
   ```
3. Verify that the variables are pointing to your local backend server:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_BACKEND_BASE_URL=http://localhost:3000
   VITE_FRONTEND_URL=http://localhost:5173
   VITE_ENABLE_GOOGLE_LOGIN=true
   VITE_ENABLE_FACEBOOK_LOGIN=true
   VITE_ENABLE_BLOG=true
   ```
4. Install the required Node packages:
   ```bash
   npm install
   ```
5. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The client interface will build instantly and open at `http://localhost:5173`.*

---

### Step 4: Accessing the Store
Go to `http://localhost:5173/login` in your browser.
* Use the seeded administrator profile to log in:
  * **Email:** `admin@gmail.com`
  * **Password:** `Admin@12345`

---

## ⚡ Technical Stack Specification

### Frontend Technologies
* **React 19 & Vite 8:** Lightweight SPA rendering with Hot Module Replacement (HMR).
* **React Router DOM 7:** Managed client routing, guards, and transition handlers.
* **Bootstrap 5.3 & Tailwind CSS 4.0:** Sleek custom typography and layouts.
* **React DnD & Recharts:** Interactive components and responsive metrics charts.

### Backend Technologies
* **Spring Boot 3.2.4 & Java 21 LTS:** High performance Enterprise core framework.
* **Spring Security 6:** Security layer handling stateless JWT authentication, CORS filters, and OAuth2 setups.
* **PostgreSQL:** Reliable relational storage.
* **JJWT (0.12.5):** Robust JSON Web Token generator and validator.

---

## 📊 Module Status Checklist

| System Component | Development Status |
| :--- | :---: |
| JWT Authentication & Custom Session Handler | ✅ Done |
| Social Login Handshake (Google & Facebook) | ✅ Done |
| Real-time Interactive Point of Sale (POS) | ✅ Done |
| Automated Low Stock Alerts & Expiry Monitors | ✅ Done |
| Custom Secure User AI Assistant Hub | ✅ Done |
| Page Builder with SSE Collaboration Streaming | ✅ Done |
| Multi-tenant Super Admin Controls | ✅ Done |
| Barcode & QR Code Engine Generator | ✅ Done |
| Multi-Warehouse Stock Transfers & Returns | ✅ Done |
| Customer & Supplier Relations Manager | ❌ In Progress |
| Direct Stripe/Razorpay Payment Gateway | ❌ In Progress |
| Automated Email/SMS Notification Dispatcher | ❌ In Progress |

---

*Namastute SaaS POS — Engineered with Passion in 2026.*
