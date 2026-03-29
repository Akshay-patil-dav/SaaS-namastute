import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import AdminLayout from './components/layout/AdminLayout';

import PageBuilder from './pages/PageBuilder';
import AcceptInvite from './pages/AcceptInvite';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { RealtimeProvider } from './context/RealtimeContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    
    if (!user) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/register" 
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/page-builder" 
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <PageBuilder />
                        </AdminLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/page-builder/:pageId" 
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <PageBuilder />
                        </AdminLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/invite/accept/:token" 
                element={
                    <ProtectedRoute>
                        <AcceptInvite />
                    </ProtectedRoute>
                } 
            />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <WorkspaceProvider>
                <RealtimeProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </RealtimeProvider>
            </WorkspaceProvider>
        </AuthProvider>
    );
}

export default App;
