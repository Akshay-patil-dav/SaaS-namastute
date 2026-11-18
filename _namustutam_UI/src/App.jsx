import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LandingPageProvider, useLandingPage } from './context/LandingPageContext';
import { CompanyProvider } from './context/CompanyContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute/GuestRoute';
import ChatBot from './components/ChatBot/ChatBot.jsx';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import { isAdminPanelDisabled } from './utils/domainConfig';

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
const TermsOfService = lazy(() => import('./pages/website/TermsOfService/TermsOfService.jsx'));
const CookiePolicy = lazy(() => import('./pages/website/CookiePolicy/CookiePolicy.jsx'));
const RefundPolicy = lazy(() => import('./pages/website/RefundPolicy/RefundPolicy.jsx'));
const PosSoftware = lazy(() => import('./pages/website/PosSoftware/PosSoftware.jsx'));
const NotFound = lazy(() => import('./pages/website/NotFound/NotFound.jsx'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin/AdminLogin.jsx'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel/AdminPanel.jsx'));

// Dashboard Blog Management
const BlogPosts = lazy(() => import('./pages/webapp/BlogPosts/BlogPosts.jsx'));
const AddBlogPost = lazy(() => import('./pages/webapp/AddBlogPost/AddBlogPost.jsx'));
const EditBlogPost = lazy(() => import('./pages/webapp/EditBlogPost/EditBlogPost.jsx'));

// ── Preload high-traffic public pages on idle for instant 0ms routing ────────
if (typeof window !== 'undefined') {
    const idlePreload = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    idlePreload(() => {
        import('./pages/website/WebDevelopment/WebDevelopment.jsx');
        import('./pages/website/PosSoftware/PosSoftware.jsx');
        import('./pages/website/ProjectWorks/ProjectWorks.jsx');
        import('./pages/website/ContactUs/ContactUs.jsx');
        import('./pages/website/BlogPage/BlogPage.jsx');
    });
}

// ── Scroll to Top on every route transition & handle hash anchor scroll ─────
function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        } else {
            const cleanId = hash.replace(/^#/, '');
            const elem = document.getElementById(cleanId);
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [pathname, hash]);

    return null;
}

// ── Non-blocking Top Progress Bar (Replaces jarring full-screen black spinner) ──
function PageLoader() {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                zIndex: 999999,
                background: 'linear-gradient(90deg, #ff5b00, #ff902f, #ffb86c)',
                animation: 'pageProgress 1s ease-in-out infinite',
            }}
            role="progressbar"
            aria-label="Loading page"
        >
            <style>{`
                @keyframes pageProgress {
                    0% { transform: scaleX(0); transform-origin: left; }
                    50% { transform: scaleX(0.7); transform-origin: left; }
                    100% { transform: scaleX(1); transform-origin: right; }
                }
            `}</style>
        </div>
    );
}

// ── Routes ──────────────────────────────────────────────────────────────────
function AppRoutes() {
    const adminDisabled = isAdminPanelDisabled();

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Root → IT Portfolio Landing Page */}
                <Route path="/" element={<ITPortfolio />} />
                <Route path="/Akshay-Patil" element={<AkshayPatil />} />

                {/* Admin Routes — Disabled when running on https://namustutam.vercel.app/ */}
                {adminDisabled ? (
                    <>
                        <Route path="/admin" element={<NotFound />} />
                        <Route path="/admin/:section" element={<NotFound />} />
                        <Route path="/admin/*" element={<NotFound />} />
                        <Route path="/admin/login" element={<NotFound />} />
                        <Route path="/login" element={<NotFound />} />
                        <Route path="/dashboard/*" element={<NotFound />} />
                    </>
                ) : (
                    <>
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

                        {/* Dashboard Blog Management */}
                        <Route path="/dashboard/blog-posts" element={<BlogPosts />} />
                        <Route path="/dashboard/add-blog-post" element={<AddBlogPost />} />
                        <Route path="/dashboard/edit-blog-post/:id" element={<EditBlogPost />} />
                    </>
                )}

                {/* Blog & Public Content */}
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
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
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/cookies" element={<Navigate to="/cookie-policy" replace />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/refunds" element={<Navigate to="/refund-policy" replace />} />
                
                {/* ── POS & Retail SaaS Software ────────────────────────── */}
                <Route path="/possoftware" element={<PosSoftware />} />
                <Route path="/pos-software" element={<Navigate to="/possoftware" replace />} />
                <Route path="/retail-saas-platform" element={<Navigate to="/possoftware" replace />} />

                {/* Quick Navigation Aliases */}
                <Route path="/portfolio" element={<Navigate to="/project-works" replace />} />
                <Route path="/projects" element={<Navigate to="/project-works" replace />} />
                <Route path="/about" element={<Navigate to="/Akshay-Patil" replace />} />
                <Route path="/about-us" element={<Navigate to="/Akshay-Patil" replace />} />
                <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
                <Route path="/services" element={<Navigate to="/services/web-development" replace />} />

                {/* 404 Fallback for any unknown route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}

// ── Dynamic Announcement Banner (Rendered only when enabled in Admin Studio) ──
const TopHeaderBars = () => {
    const location = useLocation();
    const { landingData } = useLandingPage();

    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    const visibility = landingData?.sectionVisibility || {};
    const announcement = landingData?.announcement;
    const isAnnouncementVisible = Boolean(announcement?.enabled) && visibility.announcement !== false && Boolean(announcement?.text);

    if (!isAnnouncementVisible) return null;

    const bannerHeight = 36;

    return (
        <>
            <style>{`
                body {
                    padding-top: ${bannerHeight}px !important;
                }
                .lp-nav {
                    top: ${bannerHeight}px !important;
                }
                .pos-sidebar {
                    top: ${bannerHeight}px !important;
                    height: calc(100vh - ${bannerHeight}px) !important;
                }
                .pos-header {
                    top: ${bannerHeight}px !important;
                }
            `}</style>

            <aside
                style={{
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
                    height: `${bannerHeight}px`,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}
                aria-label="Important Announcement"
            >
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
            </aside>
        </>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <LandingPageProvider>
                <CompanyProvider>
                    <ConfirmProvider>
                        <BrowserRouter>
                            <ScrollToTop />
                            <TopHeaderBars />
                            <ChatBot />
                            <ErrorBoundary>
                                <AppRoutes />
                            </ErrorBoundary>
                        </BrowserRouter>
                    </ConfirmProvider>
                </CompanyProvider>
            </LandingPageProvider>
        </AuthProvider>
    );
}
