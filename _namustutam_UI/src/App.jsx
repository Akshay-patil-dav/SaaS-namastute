import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CompanyProvider } from './context/CompanyContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ChatBot from './components/ChatBot/ChatBot.jsx';

const ITPortfolio        = lazy(() => import('./pages/website/ITPortfolio/ITPortfolio.jsx'));
const AkshayPatil        = lazy(() => import('./pages/website/AkshayPatil/AkshayPatil.jsx'));
const BlogPage           = lazy(() => import('./pages/website/BlogPage/BlogPage.jsx'));
const BlogDetail         = lazy(() => import('./pages/website/BlogDetail/BlogDetail.jsx'));
const ServiceDetail      = lazy(() => import('./pages/website/ServiceDetail/ServiceDetail.jsx'));
const WebDevelopment     = lazy(() => import('./pages/website/WebDevelopment/WebDevelopment.jsx'));
const AIAutomation       = lazy(() => import('./pages/website/AIAutomation/AIAutomation.jsx'));
const Ecommerce          = lazy(() => import('./pages/website/Ecommerce/Ecommerce.jsx'));
const WebApplicationDevelopment = lazy(() => import('./pages/website/WebApplicationDevelopment/WebApplicationDevelopment.jsx'));
const ContactUs          = lazy(() => import('./pages/website/ContactUs/ContactUs.jsx'));
const LivePreview        = lazy(() => import('./pages/website/LivePreview/LivePreview.jsx'));
const ProjectWorks       = lazy(() => import('./pages/website/ProjectWorks/ProjectWorks.jsx'));
const ProjectInfo        = lazy(() => import('./pages/website/ProjectInfo/ProjectInfo.jsx'));

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

// ── Routes ──────────────────────────────────────────────────────────────────
function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Root → IT Portfolio Landing Page */}
                <Route path="/" element={<ITPortfolio />} />
                <Route path="/Akshay-Patil" element={<AkshayPatil />} />

                {/* Blog routes – public */}
                <Route path="/blog"       element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/project-works" element={<ProjectWorks />} />
                <Route path="/project-info/:slug" element={<ProjectInfo />} />
                <Route path="/contact"    element={<ContactUs />} />
                <Route path="/services/web-development" element={<WebDevelopment />} />
                <Route path="/services/ai-automation" element={<AIAutomation />} />
                <Route path="/services/e-commerce-platform-development" element={<Ecommerce />} />
                <Route path="/services/web-application-development" element={<WebApplicationDevelopment />} />
                <Route path="/services/:serviceId" element={<ServiceDetail />} />
                <Route path="/live-preview" element={<LivePreview />} />
            </Routes>
        </Suspense>
    );
}

const WarningBanner = () => {
    const text = '⚠️ WARNING: This web application and business is currently under development. ⚠️';
    
    return (
        <div style={{
            // background: 'linear-gradient(135deg, #ffb38a 0%, #ff9666 100%)',
            background: 'linear-gradient(135deg, rgb(255 98 11) 0%, rgb(255, 150, 102) 100%)',
            color: '#ffffff',
            padding: '0',
            fontWeight: '600',
            fontSize: '14px',
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            height: '34px'
        }}>
            <style>{`
                body {
                    padding-top: 34px !important;
                }
                .lp-nav {
                    top: 34px !important;
                }
                .pos-sidebar {
                    top: 34px !important;
                    height: calc(100vh - 34px) !important;
                }
                .pos-header {
                    top: 34px !important;
                }
                .lp-mobile-menu {
                    top: calc(68px + 34px) !important;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marquee 50s linear infinite;
                }
                .marquee-item {
                    padding-right: 60px;
                    white-space: nowrap;
                    line-height: 34px;
                }
            `}</style>
            <div className="marquee-track">
                {Array(20).fill(text).map((t, i) => (
                    <div key={i} className="marquee-item">{t}</div>
                ))}
            </div>
        </div>
    );
};

export default function App() {
    return (
        <CompanyProvider>
            <ConfirmProvider>
                <WarningBanner />
                <ChatBot />
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ConfirmProvider>
        </CompanyProvider>
    );
}
