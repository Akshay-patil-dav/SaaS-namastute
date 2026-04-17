import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ConfirmProvider } from './context/ConfirmContext';


// ── Pages ──────────────────────────────────────────────────────────────────
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Dashboard2 from './pages/Dashboard2.jsx';
import SalesDashboard from './pages/SalesDashboard.jsx';
import SuperDashboard from './pages/SuperDashboard.jsx';
import SuperCompanies from './pages/SuperCompanies.jsx';
import SuperSubscriptions from './pages/SuperSubscriptions.jsx';
import SuperPackages from './pages/SuperPackages.jsx';
import ManageStock from './pages/ManageStock.jsx';
import StockAdjustment from './pages/StockAdjustment.jsx';
import StockTransfer from './pages/StockTransfer.jsx';
import OnlineOrders from './pages/OnlineOrders.jsx';
import PosOrders from './pages/PosOrders.jsx';
import Products from './pages/Products.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import EditProduct from './pages/EditProduct.jsx';
import ExpiredProducts from './pages/ExpiredProducts.jsx';
import LowStocks from './pages/LowStocks.jsx';
import Category from './pages/Category.jsx';
import SubCategory from './pages/SubCategory.jsx';
import Brands from './pages/Brands.jsx';
import Units from './pages/Units.jsx';
// import VariantAttributes from './pages/VariantAttributes.jsx';
import Warranties from './pages/Warranties.jsx';
import PrintBarcode from './pages/PrintBarcode.jsx';
import PrintQRCode from './pages/PrintQRCode.jsx';

// ── Admin Pages ─────────────────────────────────────────────────────────────
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminContent from './pages/admin/AdminContent';
import AdminRoles from './pages/admin/AdminRoles';
import AdminNotifications from './pages/admin/AdminNotifications';

// ── Layouts ─────────────────────────────────────────────────────────────────
import PosLayout from './components/layout/PosLayout';
import AdminLayout from './components/admin/AdminLayout';

// ── Role constants ───────────────────────────────────────────────────────────
const ALL_ROLES          = ['SUPER_ADMIN', 'ADMIN', 'CLIENT'];
const ADMIN_ROLES        = ['SUPER_ADMIN', 'ADMIN'];
const SUPER_ADMIN_ROLES  = ['SUPER_ADMIN'];

// ── Helpers ──────────────────────────────────────────────────────────────────
const PosPage = ({ roles, children }) => (
    <ProtectedRoute allowedRoles={roles}>
        <PosLayout>{children}</PosLayout>
    </ProtectedRoute>
);

const AdminPage = ({ children }) => (
    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
        <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
);

// ── Routes ───────────────────────────────────────────────────────────────────
function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login"        element={<Login />} />
            <Route path="/register"     element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Root → landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* ── CLIENT + ADMIN + SUPER ADMIN ───────────────────────── */}
            <Route
                path="/dashboard"
                element={<PosPage roles={ALL_ROLES}><Dashboard /></PosPage>}
            />

            {/* ── ADMIN + SUPER ADMIN ─────────────────────────────────── */}
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

            {/* Products — ADMIN + SUPER ADMIN */}
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
{/* <Route
                path="/variant-attributes"
                element={<PosPage roles={ADMIN_ROLES}><VariantAttributes /></PosPage>}
            /> */}
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

            {/* ── Admin Layout (ADMIN + SUPER ADMIN) ─────────────────── */}
            <Route path="/admin"                  element={<AdminPage><AdminDashboard /></AdminPage>} />
            <Route path="/admin/users"            element={<AdminPage><UserManagement /></AdminPage>} />
            <Route path="/admin/analytics"        element={<AdminPage><AdminAnalytics /></AdminPage>} />
            <Route path="/admin/content"          element={<AdminPage><AdminContent /></AdminPage>} />
            <Route path="/admin/roles"            element={<AdminPage><AdminRoles /></AdminPage>} />
            <Route path="/admin/notifications"    element={<AdminPage><AdminNotifications /></AdminPage>} />
            <Route path="/admin/category"         element={<AdminPage><Category /></AdminPage>} />
            <Route path="/admin/sub-category"     element={<AdminPage><SubCategory /></AdminPage>} />
            <Route path="/admin/settings"         element={<AdminPage><AdminSettings /></AdminPage>} />

            {/* Catch-all → login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <ConfirmProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ConfirmProvider>
        </AuthProvider>
    );
}
