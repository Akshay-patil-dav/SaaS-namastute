import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import { ConfirmProvider } from './context/ConfirmContext';
import PosLayout from './components/layout/PosLayout';

// ── Lazy-loaded Pages (code splitting — each route loads its JS on demand) ──
const Login              = lazy(() => import('./pages/Login.jsx'));
const Register           = lazy(() => import('./pages/Register.jsx'));
const LandingPage        = lazy(() => import('./pages/LandingPage.jsx'));
const ITPortfolio        = lazy(() => import('./pages/ITPortfolio.jsx'));
const BlogPage           = lazy(() => import('./pages/BlogPage.jsx'));
const BlogDetail         = lazy(() => import('./pages/BlogDetail.jsx'));
const Unauthorized       = lazy(() => import('./pages/Unauthorized.jsx'));
const Dashboard          = lazy(() => import('./pages/Dashboard.jsx'));
const Dashboard2         = lazy(() => import('./pages/Dashboard2.jsx'));
const SalesDashboard     = lazy(() => import('./pages/SalesDashboard.jsx'));
const SuperDashboard     = lazy(() => import('./pages/SuperDashboard.jsx'));
const SuperCompanies     = lazy(() => import('./pages/SuperCompanies.jsx'));
const SuperSubscriptions = lazy(() => import('./pages/SuperSubscriptions.jsx'));
const SuperPackages      = lazy(() => import('./pages/SuperPackages.jsx'));
const ManageStock        = lazy(() => import('./pages/ManageStock.jsx'));
const StockAdjustment    = lazy(() => import('./pages/StockAdjustment.jsx'));
const StockTransfer      = lazy(() => import('./pages/StockTransfer.jsx'));
const OnlineOrders       = lazy(() => import('./pages/OnlineOrders.jsx'));
const PosOrders          = lazy(() => import('./pages/PosOrders.jsx'));
const POS                = lazy(() => import('./pages/POS.jsx'));
const SalesReturn        = lazy(() => import('./pages/SalesReturn.jsx'));
const Products           = lazy(() => import('./pages/Products.jsx'));
const CreateProduct      = lazy(() => import('./pages/CreateProduct.jsx'));
const EditProduct        = lazy(() => import('./pages/EditProduct.jsx'));
const ExpiredProducts    = lazy(() => import('./pages/ExpiredProducts.jsx'));
const LowStocks          = lazy(() => import('./pages/LowStocks.jsx'));
const Category           = lazy(() => import('./pages/Category.jsx'));
const SubCategory        = lazy(() => import('./pages/SubCategory.jsx'));
const Brands             = lazy(() => import('./pages/Brands.jsx'));
const Units              = lazy(() => import('./pages/Units.jsx'));
const Warranties         = lazy(() => import('./pages/Warranties.jsx'));
const PrintBarcode       = lazy(() => import('./pages/PrintBarcode.jsx'));
const PrintQRCode        = lazy(() => import('./pages/PrintQRCode.jsx'));
const Purchases          = lazy(() => import('./pages/Purchases.jsx'));
const AddPurchase        = lazy(() => import('./pages/AddPurchase.jsx'));
const EditPurchase       = lazy(() => import('./pages/EditPurchase.jsx'));
const PurchaseReturn     = lazy(() => import('./pages/PurchaseReturn.jsx'));
const AddPurchaseReturn  = lazy(() => import('./pages/AddPurchaseReturn.jsx'));
const EditPurchaseReturn = lazy(() => import('./pages/EditPurchaseReturn.jsx'));
const Settings           = lazy(() => import('./pages/Settings.jsx'));
const WebsiteBuilder     = lazy(() => import('./pages/WebsiteBuilder.jsx'));

// ERP Additions Lazy Imports
const InventoryAdditions     = lazy(() => import('./pages/InventoryAdditions.jsx'));
const BOM                    = lazy(() => import('./pages/manufacturing/BOM.jsx'));
const ProductionOrders       = lazy(() => import('./pages/manufacturing/ProductionOrders.jsx'));
const ManufacturingWorkspace = lazy(() => import('./pages/manufacturing/ManufacturingWorkspace.jsx'));
const Machines               = lazy(() => import('./pages/machines/Machines.jsx'));
const QualityControl         = lazy(() => import('./pages/quality/QualityControl.jsx'));
const PurchasesExtension     = lazy(() => import('./pages/purchases/PurchasesExtension.jsx'));
const SalesExtension         = lazy(() => import('./pages/sales/SalesExtension.jsx'));
const WarehouseModule        = lazy(() => import('./pages/warehouse/WarehouseModule.jsx'));
const AccountsModule         = lazy(() => import('./pages/accounts/AccountsModule.jsx'));
const HRModule               = lazy(() => import('./pages/hr/HRModule.jsx'));
const ReportsModule          = lazy(() => import('./pages/reports/ReportsModule.jsx'));
const NotificationsPage      = lazy(() => import('./pages/NotificationsPage.jsx'));
const AdvancedTech           = lazy(() => import('./pages/advanced/AdvancedTech.jsx'));


// ── Role constants ───────────────────────────────────────────────────────────
const CLIENT_ADMIN_ROLES = ['ADMIN', 'CLIENT'];
const ADMIN_ROLES        = ['ADMIN', 'CLIENT'];
const SUPER_ADMIN_ROLES  = ['SUPER_ADMIN'];

// ── Global page loading fallback ─────────────────────────────────────────────
function PageLoader() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0f172a',
            color: '#94a3b8',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            gap: '12px',
        }}>
            <div style={{
                width: '28px',
                height: '28px',
                border: '3px solid #1e293b',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Loading...
        </div>
    );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const PosPage = ({ roles, children }) => (
    <ProtectedRoute allowedRoles={roles}>
        <PosLayout>{children}</PosLayout>
    </ProtectedRoute>
);

// ── Routes ───────────────────────────────────────────────────────────────────
function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public routes — guests only (logged-in users are redirected to dashboard) */}
                <Route path="/login"        element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register"     element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Root → IT Portfolio Landing Page */}
                <Route path="/" element={<ITPortfolio />} />
                <Route path="/retail-saas-platform" element={<LandingPage />} />

                {/* Blog routes – public */}
                <Route path="/blog"       element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />

                {/* ── CLIENT + ADMIN ───────────────────────── */}
                <Route
                    path="/dashboard"
                    element={<PosPage roles={CLIENT_ADMIN_ROLES}><Dashboard /></PosPage>}
                />

                {/* ── ADMIN ─────────────────────────────────── */}
                <Route
                    path="/dashboard/admin2"
                    element={<PosPage roles={ADMIN_ROLES}><Dashboard2 /></PosPage>}
                />
                <Route
                    path="/dashboard/sales"
                    element={<PosPage roles={ADMIN_ROLES}><SalesDashboard /></PosPage>}
                />
                <Route
                    path="/dashboard/manage-stock"
                    element={<PosPage roles={ADMIN_ROLES}><ManageStock /></PosPage>}
                />
                <Route
                    path="/dashboard/stock-adjustment"
                    element={<PosPage roles={ADMIN_ROLES}><StockAdjustment /></PosPage>}
                />
                <Route
                    path="/dashboard/stock-transfer"
                    element={<PosPage roles={ADMIN_ROLES}><StockTransfer /></PosPage>}
                />
                <Route
                    path="/dashboard/sales-online"
                    element={<PosPage roles={ADMIN_ROLES}><OnlineOrders /></PosPage>}
                />
                <Route
                    path="/dashboard/sales-pos"
                    element={<PosPage roles={ADMIN_ROLES}><PosOrders /></PosPage>}
                />
                <Route
                    path="/pos"
                    element={<ProtectedRoute allowedRoles={CLIENT_ADMIN_ROLES}><POS /></ProtectedRoute>}
                />
                <Route
                    path="/dashboard/sales-return"
                    element={<PosPage roles={ADMIN_ROLES}><SalesReturn /></PosPage>}
                />

                {/* Products */}
                <Route
                    path="/products"
                    element={<PosPage roles={ADMIN_ROLES}><Products /></PosPage>}
                />
                <Route
                    path="/create-product"
                    element={<PosPage roles={ADMIN_ROLES}><CreateProduct /></PosPage>}
                />
                <Route
                    path="/edit-product/:id"
                    element={<PosPage roles={ADMIN_ROLES}><EditProduct /></PosPage>}
                />
                <Route
                    path="/expired-products"
                    element={<PosPage roles={ADMIN_ROLES}><ExpiredProducts /></PosPage>}
                />
                <Route
                    path="/low-stocks"
                    element={<PosPage roles={ADMIN_ROLES}><LowStocks /></PosPage>}
                />
                <Route
                    path="/category"
                    element={<PosPage roles={ADMIN_ROLES}><Category /></PosPage>}
                />
                <Route
                    path="/sub-category"
                    element={<PosPage roles={ADMIN_ROLES}><SubCategory /></PosPage>}
                />
                <Route
                    path="/brands"
                    element={<PosPage roles={ADMIN_ROLES}><Brands /></PosPage>}
                />
                <Route
                    path="/units"
                    element={<PosPage roles={ADMIN_ROLES}><Units /></PosPage>}
                />
                <Route
                    path="/warranties"
                    element={<PosPage roles={ADMIN_ROLES}><Warranties /></PosPage>}
                />
                <Route
                    path="/print-barcode"
                    element={<PosPage roles={ADMIN_ROLES}><PrintBarcode /></PosPage>}
                />
                <Route
                    path="/print-qrcode"
                    element={<PosPage roles={ADMIN_ROLES}><PrintQRCode /></PosPage>}
                />

                {/* Purchases */}
                <Route
                    path="/purchases"
                    element={<PosPage roles={ADMIN_ROLES}><Purchases /></PosPage>}
                />
                <Route
                    path="/add-purchase"
                    element={<PosPage roles={ADMIN_ROLES}><AddPurchase /></PosPage>}
                />
                <Route
                    path="/edit-purchase/:id"
                    element={<PosPage roles={ADMIN_ROLES}><EditPurchase /></PosPage>}
                />
                <Route
                    path="/purchase-return"
                    element={<PosPage roles={ADMIN_ROLES}><PurchaseReturn /></PosPage>}
                />
                <Route
                    path="/add-purchase-return"
                    element={<PosPage roles={ADMIN_ROLES}><AddPurchaseReturn /></PosPage>}
                />
                <Route
                    path="/edit-purchase-return/:id"
                    element={<PosPage roles={ADMIN_ROLES}><EditPurchaseReturn /></PosPage>}
                />

                {/* Settings & Builder */}
                <Route
                    path="/settings/*"
                    element={<PosPage roles={ADMIN_ROLES}><Settings /></PosPage>}
                />
                <Route
                    path="/website-builder"
                    element={<PosPage roles={CLIENT_ADMIN_ROLES}><WebsiteBuilder /></PosPage>}
                />

                {/* ERP Additions Routes */}
                <Route path="/inventory/additions" element={<PosPage roles={ADMIN_ROLES}><InventoryAdditions /></PosPage>} />
                <Route path="/manufacturing/bom" element={<PosPage roles={ADMIN_ROLES}><BOM /></PosPage>} />
                <Route path="/manufacturing/orders" element={<PosPage roles={ADMIN_ROLES}><ProductionOrders /></PosPage>} />
                <Route path="/manufacturing/workspace" element={<PosPage roles={ADMIN_ROLES}><ManufacturingWorkspace /></PosPage>} />
                <Route path="/machines/details" element={<PosPage roles={ADMIN_ROLES}><Machines /></PosPage>} />
                <Route path="/qc/inspection" element={<PosPage roles={ADMIN_ROLES}><QualityControl /></PosPage>} />
                <Route path="/purchases/extension" element={<PosPage roles={ADMIN_ROLES}><PurchasesExtension /></PosPage>} />
                <Route path="/sales/extension" element={<PosPage roles={ADMIN_ROLES}><SalesExtension /></PosPage>} />
                <Route path="/warehouse/list" element={<PosPage roles={ADMIN_ROLES}><WarehouseModule /></PosPage>} />
                <Route path="/accounts/summary" element={<PosPage roles={ADMIN_ROLES}><AccountsModule /></PosPage>} />
                <Route path="/hr/employees" element={<PosPage roles={ADMIN_ROLES}><HRModule /></PosPage>} />
                <Route path="/reports/analytics" element={<PosPage roles={ADMIN_ROLES}><ReportsModule /></PosPage>} />
                <Route path="/alerts/notifications" element={<PosPage roles={ADMIN_ROLES}><NotificationsPage /></PosPage>} />
                <Route path="/advanced/scanners" element={<PosPage roles={ADMIN_ROLES}><AdvancedTech /></PosPage>} />


                {/* ── SUPER ADMIN ONLY ────────────────────────────────────── */}
                <Route
                    path="/dashboard/super-dashboard"
                    element={<PosPage roles={SUPER_ADMIN_ROLES}><SuperDashboard /></PosPage>}
                />
                <Route
                    path="/dashboard/super-companies"
                    element={<PosPage roles={SUPER_ADMIN_ROLES}><SuperCompanies /></PosPage>}
                />
                <Route
                    path="/dashboard/super-subscriptions"
                    element={<PosPage roles={SUPER_ADMIN_ROLES}><SuperSubscriptions /></PosPage>}
                />
                <Route
                    path="/dashboard/super-packages"
                    element={<PosPage roles={SUPER_ADMIN_ROLES}><SuperPackages /></PosPage>}
                />

                {/* Catch-all → login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Suspense>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <CompanyProvider>
                <ConfirmProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </ConfirmProvider>
            </CompanyProvider>
        </AuthProvider>
    );
}
