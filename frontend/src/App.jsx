import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard.jsx';
import Dashboard2 from './pages/Dashboard2.jsx';
import SalesDashboard from './pages/SalesDashboard.jsx';
import SuperDashboard from './pages/SuperDashboard.jsx';
import SuperCompanies from './pages/SuperCompanies.jsx';
import SuperSubscriptions from './pages/SuperSubscriptions.jsx';
import SuperPackages from './pages/SuperPackages.jsx';
import PosLayout from './components/layout/PosLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminContent from './pages/admin/AdminContent';
import AdminRoles from './pages/admin/AdminRoles';
import AdminNotifications from './pages/admin/AdminNotifications';
import ManageStock from './pages/ManageStock.jsx';
import StockAdjustment from './pages/StockAdjustment.jsx';
import StockTransfer from './pages/StockTransfer.jsx';
import OnlineOrders from './pages/OnlineOrders.jsx';
import ProductLayout from './components/layout/ProductLayout.jsx';
import Products from './pages/Products.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import ExpiredProducts from './pages/ExpiredProducts.jsx';
import LowStocks from './pages/LowStocks.jsx';
import Category from './pages/Category.jsx';
import SubCategory from './pages/SubCategory.jsx';
import Brands from './pages/Brands.jsx';
import Units from './pages/Units.jsx';
import VariantAttributes from './pages/VariantAttributes.jsx';
import Warranties from './pages/Warranties.jsx';
import PrintBarcode from './pages/PrintBarcode.jsx';
import PrintQRCode from './pages/PrintQRCode.jsx';

function AppRoutes() {
    return (
        <Routes>
            {/* Make Dashboard the root page */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route
                path="/dashboard"
                element={
                    <PosLayout><Dashboard /></PosLayout>
                }
            />
            <Route
                path="/dashboard/super-dashboard"
                element={
                    <PosLayout><SuperDashboard /></PosLayout>
                }
            />
            <Route
                path="/dashboard/super-companies"
                element={
                    <PosLayout><SuperCompanies /></PosLayout>
                }
            />
            <Route
                path="/dashboard/super-subscriptions"
                element={
                    <PosLayout><SuperSubscriptions /></PosLayout>
                }
            />
            <Route
                path="/dashboard/super-packages"
                element={
                    <PosLayout><SuperPackages /></PosLayout>
                }
            />
            <Route
                path="/dashboard/admin2"
                element={
                    <PosLayout><Dashboard2 /></PosLayout>
                }
            />
            <Route
                path="/dashboard/sales"
                element={
                    <PosLayout><SalesDashboard /></PosLayout>
                }
            />
            <Route
                path="/dashboard/manage-stock"
                element={
                    <PosLayout><ManageStock /></PosLayout>
                }
            />
            <Route
                path="/dashboard/stock-adjustment"
                element={
                    <PosLayout><StockAdjustment /></PosLayout>
                }
            />
            <Route
                path="/dashboard/stock-transfer"
                element={
                    <PosLayout><StockTransfer /></PosLayout>
                }
            />
            <Route
                path="/dashboard/sales-online"
                element={
                    <PosLayout><OnlineOrders /></PosLayout>
                }
            />
            {/* New Products Layout */}
            <Route
                path="/products"
                element={
                    <PosLayout><Products /></PosLayout>
                }
            />
            <Route
                path="/create-product"
                element={
                    <PosLayout><CreateProduct /></PosLayout>
                }
            />
            <Route
                path="/expired-products"
                element={
                    <PosLayout><ExpiredProducts /></PosLayout>
                }
            />
            <Route
                path="/low-stocks"
                element={
                    <PosLayout><LowStocks /></PosLayout>
                }
            />
            <Route
                path="/category"
                element={
                    <PosLayout><Category /></PosLayout>
                }
            />
            <Route
                path="/sub-category"
                element={
                    <PosLayout><SubCategory /></PosLayout>
                }
            />
            <Route
                path="/brands"
                element={
                    <PosLayout><Brands /></PosLayout>
                }
            />
            <Route
                path="/units"
                element={
                    <PosLayout><Units /></PosLayout>
                }
            />
            <Route
                path="/variant-attributes"
                element={
                    <PosLayout><VariantAttributes /></PosLayout>
                }
            />
            <Route
                path="/warranties"
                element={
                    <PosLayout><Warranties /></PosLayout>
                }
            />
            <Route
                path="/print-barcode"
                element={
                    <PosLayout><PrintBarcode /></PosLayout>
                }
            />
            <Route
                path="/print-qrcode"
                element={
                    <PosLayout><PrintQRCode /></PosLayout>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <AdminLayout><AdminDashboard /></AdminLayout>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <AdminLayout><UserManagement /></AdminLayout>
                }
            />
            <Route
                path="/admin/analytics"
                element={
                    <AdminLayout><AdminAnalytics /></AdminLayout>
                }
            />
            <Route
                path="/admin/content"
                element={
                    <AdminLayout><AdminContent /></AdminLayout>
                }
            />
            <Route
                path="/admin/roles"
                element={
                    <AdminLayout><AdminRoles /></AdminLayout>
                }
            />
            <Route
                path="/admin/notifications"
                element={
                    <AdminLayout><AdminNotifications /></AdminLayout>
                }
            />
            <Route
                path="/admin/settings"
                element={
                    <AdminLayout><AdminSettings /></AdminLayout>
                }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
