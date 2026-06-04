import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute/GuestRoute';
import { ConfirmProvider } from './context/ConfirmContext';
import PosLayout from './components/layout/PosLayout/PosLayout';

// ── Lazy-loaded Pages (code splitting — each route loads its JS on demand) ──
const Login              = lazy(() => import('./pages/auth/Login/Login.jsx'));
const Register           = lazy(() => import('./pages/auth/Register/Register.jsx'));
const LandingPage        = lazy(() => import('./pages/website/LandingPage/LandingPage.jsx'));
const ITPortfolio        = lazy(() => import('./pages/website/ITPortfolio/ITPortfolio.jsx'));
const AkshayPatil        = lazy(() => import('./pages/website/AkshayPatil/AkshayPatil.jsx'));
const BlogPage           = lazy(() => import('./pages/website/BlogPage/BlogPage.jsx'));
const BlogDetail         = lazy(() => import('./pages/website/BlogDetail/BlogDetail.jsx'));
const Unauthorized       = lazy(() => import('./pages/auth/Unauthorized/Unauthorized.jsx'));
const Dashboard          = lazy(() => import('./pages/dashboard/Dashboard/Dashboard.jsx'));
const Dashboard2         = lazy(() => import('./pages/dashboard/Dashboard2/Dashboard2.jsx'));
const SalesDashboard     = lazy(() => import('./pages/dashboard/SalesDashboard/SalesDashboard.jsx'));
const SuperDashboard     = lazy(() => import('./pages/superadmin/SuperDashboard/SuperDashboard.jsx'));
const SuperCompanies     = lazy(() => import('./pages/superadmin/SuperCompanies/SuperCompanies.jsx'));
const SuperSubscriptions = lazy(() => import('./pages/superadmin/SuperSubscriptions/SuperSubscriptions.jsx'));
const SuperPackages      = lazy(() => import('./pages/superadmin/SuperPackages/SuperPackages.jsx'));
const ManageStock        = lazy(() => import('./pages/inventory/ManageStock/ManageStock.jsx'));
const StockAdjustment    = lazy(() => import('./pages/inventory/StockAdjustment/StockAdjustment.jsx'));
const StockTransfer      = lazy(() => import('./pages/inventory/StockTransfer/StockTransfer.jsx'));
const OnlineOrders       = lazy(() => import('./pages/sales/OnlineOrders/OnlineOrders.jsx'));
const PosOrders          = lazy(() => import('./pages/sales/PosOrders/PosOrders.jsx'));
const POS                = lazy(() => import('./pages/sales/POS/POS.jsx'));
const SalesReturn        = lazy(() => import('./pages/sales/SalesReturn/SalesReturn.jsx'));
const Products           = lazy(() => import('./pages/inventory/Products/Products.jsx'));
const CreateProduct      = lazy(() => import('./pages/inventory/CreateProduct/CreateProduct.jsx'));
const EditProduct        = lazy(() => import('./pages/inventory/EditProduct/EditProduct.jsx'));
const ExpiredProducts    = lazy(() => import('./pages/inventory/ExpiredProducts/ExpiredProducts.jsx'));
const LowStocks          = lazy(() => import('./pages/inventory/LowStocks/LowStocks.jsx'));
const Category           = lazy(() => import('./pages/inventory/Category/Category.jsx'));
const SubCategory        = lazy(() => import('./pages/inventory/SubCategory/SubCategory.jsx'));
const Brands             = lazy(() => import('./pages/inventory/Brands/Brands.jsx'));
const Units              = lazy(() => import('./pages/inventory/Units/Units.jsx'));
const Warranties         = lazy(() => import('./pages/inventory/Warranties/Warranties.jsx'));
const PrintBarcode       = lazy(() => import('./pages/inventory/PrintBarcode/PrintBarcode.jsx'));
const PrintQRCode        = lazy(() => import('./pages/inventory/PrintQRCode/PrintQRCode.jsx'));
const Purchases          = lazy(() => import('./pages/purchases/Purchases/Purchases.jsx'));
const AddPurchase        = lazy(() => import('./pages/purchases/AddPurchase/AddPurchase.jsx'));
const EditPurchase       = lazy(() => import('./pages/purchases/EditPurchase/EditPurchase.jsx'));
const PurchaseReturn     = lazy(() => import('./pages/purchases/PurchaseReturn/PurchaseReturn.jsx'));
const AddPurchaseReturn  = lazy(() => import('./pages/purchases/AddPurchaseReturn/AddPurchaseReturn.jsx'));
const EditPurchaseReturn = lazy(() => import('./pages/purchases/EditPurchaseReturn/EditPurchaseReturn.jsx'));
const Settings           = lazy(() => import('./pages/settings/Settings/Settings.jsx'));
const WebsiteBuilder     = lazy(() => import('./pages/website/WebsiteBuilder/WebsiteBuilder.jsx'));
const ServiceDetail      = lazy(() => import('./pages/website/ServiceDetail/ServiceDetail.jsx'));
const WebDevelopment     = lazy(() => import('./pages/website/WebDevelopment/WebDevelopment.jsx'));
const AIAutomation       = lazy(() => import('./pages/website/AIAutomation/AIAutomation.jsx'));
const Ecommerce          = lazy(() => import('./pages/website/Ecommerce/Ecommerce.jsx'));
const ContactUs          = lazy(() => import('./pages/website/ContactUs/ContactUs.jsx'));
const LivePreview        = lazy(() => import('./pages/website/LivePreview/LivePreview.jsx'));
const WebsiteThemeEditor = lazy(() => import('./pages/website/WebsiteThemeEditor/WebsiteThemeEditor.jsx'));





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
                <Route path="/Akshay-Patil" element={<AkshayPatil />} />

                {/* Blog routes – public */}
                <Route path="/blog"       element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact"    element={<ContactUs />} />
                <Route path="/services/web-development" element={<WebDevelopment />} />
                <Route path="/services/ai-automation" element={<AIAutomation />} />
                <Route path="/services/e-commerce-platform-development" element={<Ecommerce />} />
                <Route path="/services/:serviceId" element={<ServiceDetail />} />

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
                <Route
                    path="/builder-preview"
                    element={<LivePreview />}
                />
                <Route
                    path="/website-theme-editor"
                    element={<PosPage roles={CLIENT_ADMIN_ROLES}><WebsiteThemeEditor /></PosPage>}
                />



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
