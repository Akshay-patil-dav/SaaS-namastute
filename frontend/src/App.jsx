import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard.jsx';
import Dashboard2 from './pages/Dashboard2.jsx';
import SalesDashboard from './pages/SalesDashboard.jsx';
import SuperDashboard from './pages/SuperDashboard.jsx';
import SuperCompanies from './pages/SuperCompanies.jsx';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import AppLayout from './components/layout/AppLayout';
import PosLayout from './components/layout/PosLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminContent from './pages/admin/AdminContent';
import AdminRoles from './pages/admin/AdminRoles';
import AdminNotifications from './pages/admin/AdminNotifications';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
    if (!user) return <Navigate to="/" replace />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
    if (user) return <Navigate to="/dashboard" replace />;
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        {/* Swapped AppLayout to PosLayout for the new UI */}
                        <PosLayout><Dashboard /></PosLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/super-dashboard"
                element={
                    <ProtectedRoute>
                        <PosLayout><SuperDashboard /></PosLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/super-companies"
                element={
                    <ProtectedRoute>
                        <PosLayout><SuperCompanies /></PosLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/admin2"
                element={
                    <ProtectedRoute>
                        <PosLayout><Dashboard2 /></PosLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/sales"
                element={
                    <ProtectedRoute>
                        <PosLayout><SalesDashboard /></PosLayout>
                    </ProtectedRoute>
                }
            />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout><AdminDashboard /></AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute>
                        <AdminLayout><UserManagement /></AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/analytics"
                element={
                    <ProtectedRoute>
                        <AdminLayout><AdminAnalytics /></AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/content"
                element={
                    <ProtectedRoute>
                        <AdminLayout><AdminContent /></AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/roles"
                element={
                    <ProtectedRoute>
                        <AdminLayout><AdminRoles /></AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/notifications"
                element={
                    <ProtectedRoute>
                        <AdminLayout><AdminNotifications /></AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/settings"
                element={
                    <ProtectedRoute>
                        <AdminLayout><AdminSettings /></AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
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
