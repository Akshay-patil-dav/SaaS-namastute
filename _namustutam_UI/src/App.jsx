import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LandingPageProvider, useLandingPage } from './context/LandingPageContext';
import { CompanyProvider } from './context/CompanyContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute/GuestRoute';
import ChatBot from './components/ChatBot/ChatBot.jsx';

// Public pages
const ITPortfolio = lazy(() => import('./pages/website/ITPortfolio/ITPortfolio.jsx'));
const AkshayPatil = lazy(() => import('./pages/website/AkshayPatil/AkshayPatil.jsx'));
const BlogPage = lazy(() => import('./pages/website/BlogPage/BlogPage.jsx'));
const BlogDetail = lazy(() => import('./pages/website/BlogDetail/BlogDetail.jsx'));
const ServiceDetail = lazy(() => import('./pages/website/ServiceDetail/ServiceDetail.jsx'));
const WebDevelopment = lazy(() => import('./pages/website/WebDevelopment/WebDevelopment.jsx'));
const AIAutomation = lazy(() => import('./pages/website/AIAutomation/AIAutomation.jsx'));
const Ecommerce = lazy(() => import('./pages/website/Ecommerce/Ecommerce.jsx'));
const WebApplicationDevelopment = lazy(() => import('./pages/website/WebApplicationDevelopment/WebApplicationDevelopment.jsx'));
const ContactUs = lazy(() => import('./pages/website/ContactUs/ContactUs.jsx'));
const LivePreview = lazy(() => import('./pages/website/LivePreview/LivePreview.jsx'));
const ProjectWorks = lazy(() => import('./pages/website/ProjectWorks/ProjectWorks.jsx'));
const ProjectInfo = lazy(() => import('./pages/website/ProjectInfo/ProjectInfo.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/website/PrivacyPolicy/PrivacyPolicy.jsx'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin/AdminLogin.jsx'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel/AdminPanel.jsx'));

// Dashboard Blog Management
const BlogPosts = lazy(() => import('./pages/webapp/BlogPosts/BlogPosts.jsx'));
const AddBlogPost = lazy(() => import('./pages/webapp/AddBlogPost/AddBlogPost.jsx'));
const EditBlogPost = lazy(() => import('./pages/webapp/EditBlogPost/EditBlogPost.jsx'));

// ── Global page loading fallback ─────────────────────────────────────────────
function PageLoader() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#090d16',
            color: '#94a3b8',
            fontSize: '15px',
            fontFamily: 'Inter, sans-serif',
            gap: '12px',
        }}>
            <div style={{
                width: '26px',
                height: '26px',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span>Loading Namustutam...</span>
        </div>
    );
}

// ── Routes ──────────────────────────────────────────────────────────────────
function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Root → IT Portfolio Landing Page */}
                <Route path="/" element={<ITPortfolio />} />
                <Route path="/Akshay-Patil" element={<AkshayPatil />} />

                {/* Admin Routes */}
                <Route
                    path="/admin/login"
                    element={
                        <GuestRoute>
                            <AdminLogin />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <AdminLogin />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/:section"
                    element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />

                {/* Blog & Public Content */}
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/dashboard/blog-posts" element={<BlogPosts />} />
                <Route path="/dashboard/add-blog-post" element={<AddBlogPost />} />
                <Route path="/dashboard/edit-blog-post/:id" element={<EditBlogPost />} />
                <Route path="/project-works" element={<ProjectWorks />} />
                <Route path="/project-info/:slug" element={<ProjectInfo />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/services/web-development" element={<WebDevelopment />} />
                <Route path="/services/ai-automation" element={<AIAutomation />} />
                <Route path="/services/e-commerce-platform-development" element={<Ecommerce />} />
                <Route path="/services/web-application-development" element={<WebApplicationDevelopment />} />
                <Route path="/services/:serviceId" element={<ServiceDetail />} />
                <Route path="/live-preview" element={<LivePreview />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

// ── Dynamic Announcement Banner ──────────────────────────────────────────────
const AnnouncementBanner = () => {
    const { landingData } = useLandingPage();
    const announcement = landingData?.announcement;

    if (!announcement || !announcement.enabled) {
        return null;
    }

    return (
        <div style={{
            background: announcement.bgColor || 'linear-gradient(135deg, rgb(255 98 11) 0%, rgb(255, 150, 102) 100%)',
            color: announcement.textColor || '#ffffff',
            padding: '0 16px',
            fontWeight: '600',
            fontSize: '13px',
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
            <style>{`
                body {
                    padding-top: 36px !important;
                }
                .lp-nav {
                    top: 36px !important;
                }
                .pos-sidebar {
                    top: 36px !important;
                    height: calc(100vh - 36px) !important;
                }
                .pos-header {
                    top: 36px !important;
                }
            `}</style>
            <span>{announcement.text}</span>
            {announcement.link && (
                <a
                    href={announcement.link}
                    style={{
                        marginLeft: '12px',
                        color: '#ffffff',
                        textDecoration: 'underline',
                        fontWeight: '700'
                    }}
                >
                    Learn More →
                </a>
            )}
        </div>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <LandingPageProvider>
                <CompanyProvider>
                    <ConfirmProvider>
                        <BrowserRouter>
                            <AnnouncementBanner />
                            <ChatBot />
                            <AppRoutes />
                        </BrowserRouter>
                    </ConfirmProvider>
                </CompanyProvider>
            </LandingPageProvider>
        </AuthProvider>
    );
}
