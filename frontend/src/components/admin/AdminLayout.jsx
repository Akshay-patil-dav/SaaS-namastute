import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { initSidebarState } from '../../assets/admin.js';

export default function AdminLayout({ children }) {
    const { user, loading, isAdmin } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Initialize sidebar state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState) {
            setSidebarCollapsed(savedState === 'true');
        }
    }, []);

    // Save sidebar state
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    }, [sidebarCollapsed]);

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-custom mb-3"></div>
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect non-admin users
    if (!user || !isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="d-flex min-vh-100 bg-light">
            <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
            <main className={`admin-main flex-grow-1 ${sidebarCollapsed ? 'expanded' : ''}`}>
                <div className="container-fluid py-4 px-4 px-lg-5">
                    {children}
                </div>
            </main>
        </div>
    );
}
