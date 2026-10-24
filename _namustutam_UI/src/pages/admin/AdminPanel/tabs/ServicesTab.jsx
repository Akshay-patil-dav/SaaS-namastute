import React, { useState, useMemo } from 'react';
import { 
    Plus, Edit2, Trash2, CheckCircle2, XCircle, ArrowUpRight, 
    Wrench, X, Search, ExternalLink, Globe, Sparkles, Filter, 
    Check, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import AdminPagination from '../components/AdminPagination';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';

const EMOJI_PRESETS = ['🌐', '💻', '📱', '🛍️', '🤖', '🛠️', '⚡', '☁️', '🔒', '📊', '🚀', '🎯', '🎓', '🎨'];

const SERVICE_TEMPLATES = [
    {
        icon: '🌐',
        title: 'Web Application Development',
        desc: 'High-performance React & Next.js frontend applications, scalable architectures, and responsive digital products.',
        link: '/services/web-application-development'
    },
    {
        icon: '💻',
        title: 'Custom Software & Microservices',
        desc: 'Robust Spring Boot backend services, multi-tenant databases, enterprise APIs, and distributed architectures.',
        link: '/services/custom-development'
    },
    {
        icon: '🤖',
        title: 'AI Automation & Voice Chatbots',
        desc: 'Integrate automated AI assistants, voice calling bots, CRM integrations, and intelligent workflow automation.',
        link: '/services/ai-automation'
    },
    {
        icon: '🛍️',
        title: 'E-commerce Platform Development',
        desc: 'Custom Shopify stores, marketplace platforms, automated checkout pipelines, and fast inventory synchronizations.',
        link: '/services/e-commerce-platform-development'
    },
    {
        icon: '🎓',
        title: 'Education Platform & LMS',
        desc: 'Scalable learning management systems, institute portals, student tracking dashboards, and interactive video suites.',
        link: '/services/education-platform-development'
    },
    {
        icon: '🛠️',
        title: 'Dedicated Support & SLA Maintenance',
        desc: '24/7 technical monitoring, security audits, database backups, and dedicated engineering assistance.',
        link: '/contact'
    }
];

export default function ServicesTab() {
    const { landingData, addService, updateService, deleteService } = useLandingPage();
    const services = landingData.services || [];

    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [editingSrv, setEditingSrv] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [formData, setFormData] = useState({
        icon: '🌐',
        title: '',
        desc: '',
        link: '/services/web-development',
        active: true
    });

    const openCreateModal = () => {
        setFormData({
            icon: '⚡',
            title: '',
            desc: '',
            link: '/services/custom-development',
            active: true
        });
        setModalMode('create');
    };

    const openEditModal = (srv) => {
        setEditingSrv(srv);
        setFormData({
            icon: srv.icon || '🌐',
            title: srv.title || '',
            desc: srv.desc || '',
            link: srv.link || '/contact',
            active: srv.active !== false
        });
        setModalMode('edit');
    };

    const applyTemplate = (tpl) => {
        setFormData(prev => ({
            ...prev,
            icon: tpl.icon,
            title: tpl.title,
            desc: tpl.desc,
            link: tpl.link
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Service title is required');
            return;
        }

        if (modalMode === 'create') {
            addService(formData);
        } else if (modalMode === 'edit' && editingSrv) {
            updateService(editingSrv.id, formData);
        }
        setModalMode(null);
    };

    const toggleActive = (srv) => {
        updateService(srv.id, { active: srv.active === false ? true : false });
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"? This will remove it from the website services section.`)) {
            deleteService(id);
        }
    };

    // Filter and search
    const filteredServices = useMemo(() => {
        return services.filter(srv => {
            const matchesSearch = !searchTerm.trim() || 
                srv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                srv.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                srv.link?.toLowerCase().includes(searchTerm.toLowerCase());

            const isActive = srv.active !== false;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && isActive) ||
                (statusFilter === 'inactive' && !isActive);

            return matchesSearch && matchesStatus;
        });
    }, [services, searchTerm, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedServices = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return filteredServices.slice(start, start + pageSize);
    }, [filteredServices, safeCurrentPage, pageSize]);

    const activeCount = services.filter(s => s.active !== false).length;
    const inactiveCount = services.filter(s => s.active === false).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SectionVisibilityBanner 
                sectionKey="services" 
                sectionName="Services Catalog" 
                description="Controls whether the capabilities & engineering solutions catalog grid is rendered on the public website."
            />

            {/* Top KPI Metrics Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
            }}>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted, #94a3b8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Services
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                        {services.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-dim, #64748b)', marginTop: '2px' }}>
                        Configured in database
                    </div>
                </div>

                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted, #94a3b8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Live on Public Site
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                        {activeCount}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-dim, #64748b)', marginTop: '2px' }}>
                        Displayed on Landing Page
                    </div>
                </div>

                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted, #94a3b8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Draft / Hidden
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: inactiveCount > 0 ? '#fbbf24' : '#64748b', marginTop: '4px' }}>
                        {inactiveCount}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-dim, #64748b)', marginTop: '2px' }}>
                        Hidden from visitors
                    </div>
                </div>

                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted, #94a3b8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Public Service Links
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#818cf8', marginTop: '10px' }}>
                        <a 
                            href="/#services" 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: '#818cf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                            <span>Open Public Section</span>
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Control Bar: Title, Search, Status Filter & Add Button */}
            <div className="admin-card" style={{ padding: '18px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Wrench size={18} color="#10b981" />
                            Services & Capabilities Catalog
                        </h3>
                        <div className="admin-card-subtitle">
                            Configure software, platform development, AI automation, and cloud service offerings
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="admin-btn admin-btn-primary" onClick={openCreateModal}>
                            <Plus size={16} />
                            <span>Add New Service</span>
                        </button>
                    </div>
                </div>

                {/* Filters and search row */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '11px', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search services by title, description, or target link…"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="admin-control-input"
                            style={{ paddingLeft: '34px', fontSize: '13px' }}
                        />
                    </div>

                    {/* Status Filter Buttons */}
                    <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <button
                            type="button"
                            onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                            style={{
                                background: statusFilter === 'all' ? '#6366f1' : 'transparent',
                                color: statusFilter === 'all' ? '#fff' : '#94a3b8',
                                border: 'none',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            All ({services.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStatusFilter('active'); setCurrentPage(1); }}
                            style={{
                                background: statusFilter === 'active' ? '#10b981' : 'transparent',
                                color: statusFilter === 'active' ? '#fff' : '#94a3b8',
                                border: 'none',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Active ({activeCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStatusFilter('inactive'); setCurrentPage(1); }}
                            style={{
                                background: statusFilter === 'inactive' ? '#f59e0b' : 'transparent',
                                color: statusFilter === 'inactive' ? '#fff' : '#94a3b8',
                                border: 'none',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Hidden ({inactiveCount})
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
                <div className="admin-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                    <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>No services match your filter</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 16px' }}>
                        {searchTerm ? `No results for "${searchTerm}".` : 'Try changing your active status filter.'}
                    </p>
                    <button className="admin-btn admin-btn-secondary" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setCurrentPage(1); }}>
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px'
                }}>
                    {paginatedServices.map((srv) => {
                        const isLive = srv.active !== false;
                        return (
                            <div
                                key={srv.id}
                                className="admin-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '14px',
                                    opacity: isLive ? 1 : 0.65,
                                    border: isLive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px dashed rgba(255, 255, 255, 0.12)',
                                    transition: 'all 0.25s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        background: isLive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                        border: isLive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px'
                                    }}>
                                        {srv.icon}
                                    </div>

                                    {/* Status Toggle Switch */}
                                    <button
                                        type="button"
                                        onClick={() => toggleActive(srv)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            background: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                                            border: `1px solid ${isLive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(100, 116, 139, 0.3)'}`,
                                            borderRadius: '20px',
                                            padding: '4px 10px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            color: isLive ? '#34d399' : '#94a3b8'
                                        }}
                                        title={isLive ? 'Click to hide this service' : 'Click to display on website'}
                                    >
                                        {isLive ? <Eye size={12} /> : <EyeOff size={12} />}
                                        <span>{isLive ? 'Live on Site' : 'Hidden'}</span>
                                    </button>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '0 0 6px' }}>
                                        {srv.title}
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.55 }}>
                                        {srv.desc}
                                    </p>
                                </div>

                                {/* Link and Quick Public View */}
                                <div style={{
                                    fontSize: '12px',
                                    color: '#818cf8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: 'auto',
                                    paddingTop: '8px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                                }}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px', color: '#94a3b8' }}>
                                        Target: <strong style={{ color: '#cbd5e1' }}>{srv.link || '/contact'}</strong>
                                    </span>
                                    {srv.link && (
                                        <a
                                            href={srv.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                                            title="View page on website"
                                        >
                                            <span>Visit</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>

                                {/* Actions Row */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '8px',
                                    paddingTop: '10px'
                                }}>
                                    <button
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                        onClick={() => openEditModal(srv)}
                                    >
                                        <Edit2 size={13} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="admin-btn admin-btn-danger"
                                        style={{ padding: '6px 10px', fontSize: '12px' }}
                                        onClick={() => handleDelete(srv.id, srv.title)}
                                        title="Delete service"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {filteredServices.length > 0 && (
                <AdminPagination
                    currentPage={safeCurrentPage}
                    totalItems={filteredServices.length}
                    pageSize={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                    }}
                    pageSizeOptions={[6, 12, 24, 48]}
                    itemLabel="services"
                    theme="dark"
                />
            )}

            {/* Create / Edit Modal */}
            {modalMode && (
                <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
                    <div className="admin-modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">
                                {modalMode === 'create' ? 'Add Service Offering' : `Edit: ${formData.title}`}
                            </h3>
                            <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Quick Presets Picker */}
                        <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <Sparkles size={14} /> Quick Service Presets (Click to autofill):
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {SERVICE_TEMPLATES.map((tpl, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => applyTemplate(tpl)}
                                        style={{
                                            background: formData.title === tpl.title ? '#6366f1' : 'rgba(255, 255, 255, 0.06)',
                                            color: '#ffffff',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '6px',
                                            padding: '4px 10px',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <span>{tpl.icon}</span>
                                        <span>{tpl.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="admin-form-grid">
                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Service Icon (Emoji)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <input
                                            type="text"
                                            className="admin-control-input"
                                            style={{ fontSize: '20px', width: '70px', textAlign: 'center' }}
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            required
                                        />
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {EMOJI_PRESETS.map((emoji, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon: emoji })}
                                                    style={{
                                                        background: formData.icon === emoji ? '#6366f1' : 'rgba(255,255,255,0.06)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        fontSize: '15px',
                                                        padding: '4px 7px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Service Title *</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. AI Automation & Intelligent Chatbots"
                                    />
                                </div>

                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Service Description *</label>
                                    <textarea
                                        className="admin-control-textarea"
                                        rows={3}
                                        required
                                        value={formData.desc}
                                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                        placeholder="Describe the capabilities, value proposition, and benefits of this service..."
                                    />
                                </div>

                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Destination Link / Target Route</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="e.g. /services/web-development or /contact"
                                    />
                                    <span style={{ fontSize: '11px', color: 'var(--admin-text-dim, #64748b)', marginTop: '4px' }}>
                                        Routes can be internal paths (e.g. <code>/services/ai-automation</code>) or anchors (<code>#contact</code>).
                                    </span>
                                </div>

                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff', fontSize: '13px' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                                        />
                                        <span>Display this service on the public website</span>
                                    </label>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalMode(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {modalMode === 'create' ? 'Create Service Offering' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
