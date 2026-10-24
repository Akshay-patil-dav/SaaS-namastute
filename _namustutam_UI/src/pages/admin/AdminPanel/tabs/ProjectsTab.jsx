import React, { useState } from 'react';
import { 
    Plus, Search, Edit2, Trash2, ExternalLink, Image, Tag, 
    Check, X, Sparkles, FolderGit2, Layers, Globe, Zap, Code2, 
    Shield, MessageCircle, CheckCircle2 
} from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import AdminPagination from '../components/AdminPagination';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';

const PRESET_IMAGES = [
    { label: 'POS Dashboard 1', url: '/dashboard1.png' },
    { label: 'POS Dashboard 2', url: '/dashboard2.png' },
    { label: 'E-commerce Shop', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' },
    { label: 'Analytics SaaS', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { label: 'Fintech Platform', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
    { label: 'Real Estate Portal', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800' }
];

const DEFAULT_WHATS_INCLUDED = [
    'Full Frontend & Component Source Code',
    'Complete API Integration Guide & Docs',
    'Responsive Mobile, Tablet & Desktop Layouts',
    '6 Months Bug Fixes & Setup Assistance'
];

const DEFAULT_PROJECT_FEATURES = [
    'Responsive Design across mobile, tablet, and desktop viewports',
    'Enterprise component hierarchy with modular styling',
    'Modern state management & rapid rendering',
    'SEO metadata integration & Core Web Vitals optimization'
];

const DEFAULT_LICENSE_TERMS = [
    'Personal or single business deployment rights',
    'Full source code access with zero obfuscation',
    'Lifetime rights for 1 production domain',
    '6 months direct developer support'
];

const DEFAULT_PROJECT_FAQS = [
    {
        q: 'Can I use this for multiple client projects?',
        a: 'Standard licenses are single-use per production domain. Extended licenses are available for agency bulk usage.'
    },
    {
        q: 'Do I need deep coding knowledge to configure this?',
        a: 'No. The codebase is cleanly structured and customizable without complex boilerplate. We also offer setup assistance.'
    },
    {
        q: 'Will I receive software updates?',
        a: 'Yes. All project packages include 6 months of free code updates and vulnerability patches.'
    }
];

const POPULAR_TECHS = [
    'React', 'Node.js', 'Spring Boot', 'PostgreSQL', 'Shopify', 
    'TypeScript', 'Next.js', 'Tailwind', 'MongoDB', 'Docker', 'Python'
];

export default function ProjectsTab() {
    const { landingData, addProject, updateProject, deleteProject, updateSection } = useLandingPage();
    const projects = landingData.projects || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [editingProj, setEditingProj] = useState(null);
    const [modalTab, setModalTab] = useState('general'); // 'general' | 'overview' | 'features' | 'tech' | 'license' | 'faq'

    // Form state for Modal
    const [formData, setFormData] = useState({
        title: '',
        author: 'Namustutam',
        category: 'E-Commerce',
        filter: 'Web Application',
        price: '$99 USD',
        img: '/dashboard1.png',
        description: '',
        techStack: 'React, Node.js',
        liveLink: '#',
        githubLink: '#',
        featured: true,
        architectureDescription: '',
        whatsIncluded: [...DEFAULT_WHATS_INCLUDED],
        features: [...DEFAULT_PROJECT_FEATURES],
        licenseTier: 'Single End Product',
        licenseTerms: [...DEFAULT_LICENSE_TERMS],
        faqs: [...DEFAULT_PROJECT_FAQS]
    });

    // Categories
    const categories = ['ALL', ...new Set(projects.map(p => p.category || 'General'))];

    const filteredProjects = projects.filter(p => {
        const matchesSearch = (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedProjects = filteredProjects.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

    const openCreateModal = () => {
        setFormData({
            title: '',
            author: 'Namustutam',
            category: 'E-Commerce',
            filter: 'Web Application',
            price: '$99 USD',
            img: '/dashboard1.png',
            description: '',
            techStack: 'React, Spring Boot, PostgreSQL',
            liveLink: 'http://localhost:5174',
            githubLink: '#',
            featured: true,
            architectureDescription: '',
            whatsIncluded: [...DEFAULT_WHATS_INCLUDED],
            features: [...DEFAULT_PROJECT_FEATURES],
            licenseTier: 'Single End Product',
            licenseTerms: [...DEFAULT_LICENSE_TERMS],
            faqs: [...DEFAULT_PROJECT_FAQS]
        });
        setModalTab('general');
        setModalMode('create');
    };

    const openEditModal = (proj) => {
        setEditingProj(proj);
        setFormData({
            title: proj.title || '',
            author: proj.author || 'Namustutam',
            category: proj.category || 'E-Commerce',
            filter: proj.filter || 'Web Application',
            price: proj.price || '$99 USD',
            img: proj.img || '/dashboard1.png',
            description: proj.description || '',
            techStack: Array.isArray(proj.techStack) 
                ? proj.techStack.map(t => typeof t === 'string' ? t : t.name).join(', ') 
                : (proj.techStack || ''),
            liveLink: proj.liveLink || '#',
            githubLink: proj.githubLink || '#',
            featured: proj.featured !== false,
            architectureDescription: proj.architectureDescription || '',
            whatsIncluded: Array.isArray(proj.whatsIncluded) && proj.whatsIncluded.length > 0 
                ? proj.whatsIncluded 
                : [...DEFAULT_WHATS_INCLUDED],
            features: Array.isArray(proj.features) && proj.features.length > 0
                ? proj.features.map(f => typeof f === 'string' ? f : f.title || f.name || '')
                : [...DEFAULT_PROJECT_FEATURES],
            licenseTier: proj.licenseTier || 'Single End Product',
            licenseTerms: Array.isArray(proj.licenseTerms) && proj.licenseTerms.length > 0
                ? proj.licenseTerms
                : [...DEFAULT_LICENSE_TERMS],
            faqs: Array.isArray(proj.faqs) && proj.faqs.length > 0
                ? proj.faqs
                : [...DEFAULT_PROJECT_FAQS]
        });
        setModalTab('general');
        setModalMode('edit');
    };

    // Dynamic field helpers
    const handleWhatsIncludedChange = (index, val) => {
        const next = [...formData.whatsIncluded];
        next[index] = val;
        setFormData({ ...formData, whatsIncluded: next });
    };
    const handleAddWhatsIncluded = () => {
        setFormData({ ...formData, whatsIncluded: [...formData.whatsIncluded, ''] });
    };
    const handleRemoveWhatsIncluded = (index) => {
        setFormData({ ...formData, whatsIncluded: formData.whatsIncluded.filter((_, i) => i !== index) });
    };

    const handleFeatureChange = (index, val) => {
        const next = [...formData.features];
        next[index] = val;
        setFormData({ ...formData, features: next });
    };
    const handleAddFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };
    const handleRemoveFeature = (index) => {
        setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
    };

    const handleLicenseTermChange = (index, val) => {
        const next = [...formData.licenseTerms];
        next[index] = val;
        setFormData({ ...formData, licenseTerms: next });
    };
    const handleAddLicenseTerm = () => {
        setFormData({ ...formData, licenseTerms: [...formData.licenseTerms, ''] });
    };
    const handleRemoveLicenseTerm = (index) => {
        setFormData({ ...formData, licenseTerms: formData.licenseTerms.filter((_, i) => i !== index) });
    };

    const handleFaqChange = (index, field, val) => {
        const next = [...formData.faqs];
        next[index] = { ...next[index], [field]: val };
        setFormData({ ...formData, faqs: next });
    };
    const handleAddFaq = () => {
        setFormData({ ...formData, faqs: [...formData.faqs, { q: '', a: '' }] });
    };
    const handleRemoveFaq = (index) => {
        setFormData({ ...formData, faqs: formData.faqs.filter((_, i) => i !== index) });
    };

    const toggleTech = (t) => {
        const current = formData.techStack ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean) : [];
        const index = current.findIndex(item => item.toLowerCase() === t.toLowerCase());
        if (index >= 0) {
            const updated = current.filter((_, i) => i !== index);
            setFormData({ ...formData, techStack: updated.join(', ') });
        } else {
            setFormData({ ...formData, techStack: [...current, t].join(', ') });
        }
    };

    const removeTechTag = (indexToRemove) => {
        const current = formData.techStack ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean) : [];
        const updated = current.filter((_, i) => i !== indexToRemove);
        setFormData({ ...formData, techStack: updated.join(', ') });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const techArray = formData.techStack.split(',').map(s => s.trim()).filter(Boolean);

        const projectPayload = {
            ...formData,
            techStack: techArray,
            whatsIncluded: formData.whatsIncluded.filter(item => item && item.trim()),
            features: formData.features.filter(f => f && f.trim()),
            licenseTerms: formData.licenseTerms.filter(t => t && t.trim()),
            faqs: formData.faqs.filter(f => f.q && f.q.trim())
        };

        if (modalMode === 'create') {
            addProject(projectPayload);
        } else if (modalMode === 'edit' && editingProj) {
            updateProject(editingProj.id, projectPayload);
        }

        setModalMode(null);
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteProject(id);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SectionVisibilityBanner 
                sectionKey="projects" 
                sectionName="Showcase Projects (Portfolio)" 
                description="Controls whether the featured projects Bento grid and live showcase section appear on the public landing page."
            />

            {/* Section Header Settings (Showcase of Brilliance) */}
            <div className="admin-card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Layers size={18} color="#ff620b" />
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>
                            Showcase of Brilliance Header Settings
                        </h3>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Live on landing page portfolio section</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    <div>
                        <label className="admin-control-label" style={{ fontSize: '12.5px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>
                            Section Badge
                        </label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={landingData.portfolioSection?.badge ?? 'Selected Works'}
                            onChange={(e) => updateSection('portfolioSection', { badge: e.target.value })}
                            placeholder="e.g. Selected Works"
                        />
                    </div>
                    <div>
                        <label className="admin-control-label" style={{ fontSize: '12.5px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>
                            Section Title
                        </label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={landingData.portfolioSection?.title ?? 'Showcase of Brilliance'}
                            onChange={(e) => updateSection('portfolioSection', { title: e.target.value })}
                            placeholder="e.g. Showcase of Brilliance"
                        />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-control-label" style={{ fontSize: '12.5px', marginBottom: '6px', display: 'block', color: '#cbd5e1' }}>
                            Section Subtitle
                        </label>
                        <input
                            type="text"
                            className="admin-control-input"
                            value={landingData.portfolioSection?.subtitle ?? 'Explore some of our recent flagship projects and enterprise solutions.'}
                            onChange={(e) => updateSection('portfolioSection', { subtitle: e.target.value })}
                            placeholder="e.g. Explore some of our recent flagship projects and enterprise solutions."
                        />
                    </div>
                </div>
            </div>

            {/* Top Toolbar */}
            <div className="admin-card" style={{ padding: '16px 24px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 320px' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                            <input
                                type="text"
                                className="admin-control-input"
                                style={{ paddingLeft: '38px', height: '40px' }}
                                placeholder="Search projects by name or description..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>

                        {/* Category filter */}
                        <select
                            className="admin-control-select"
                            style={{ height: '40px', width: '160px' }}
                            value={selectedCategory}
                            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        >
                            {categories.map((c, i) => (
                                <option key={i} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="admin-btn admin-btn-primary"
                        onClick={openCreateModal}
                    >
                        <Plus size={16} />
                        <span>Add Project</span>
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px'
            }}>
                {paginatedProjects.map((p) => (
                    <div
                        key={p.id}
                        className="admin-card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            padding: 0
                        }}
                    >
                        {/* Project Thumbnail Image */}
                        <div style={{
                            height: '170px',
                            width: '100%',
                            background: `url(${p.img}) center/cover no-repeat #0a0f1d`,
                            position: 'relative',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            <span style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                background: 'rgba(15, 23, 42, 0.85)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#a5b4fc',
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '4px 10px',
                                borderRadius: '9999px'
                            }}>
                                {p.category}
                            </span>

                            {p.price && (
                                <span style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'rgba(255, 98, 11, 0.9)',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    padding: '4px 10px',
                                    borderRadius: '9999px'
                                }}>
                                    {p.price}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
                                {p.title}
                            </h4>

                            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5, flex: 1 }}>
                                {p.description || 'Custom software solution.'}
                            </p>

                            {/* Tech Stack Tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0' }}>
                                {(Array.isArray(p.techStack) ? p.techStack : [p.techStack]).map((t, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.06)',
                                            color: '#cbd5e1',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            padding: '2px 8px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {typeof t === 'string' ? t : (t?.name || 'Tech')}
                                    </span>
                                ))}
                            </div>

                            {/* Action Bar */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingTop: '12px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                            }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {p.liveLink && p.liveLink !== '#' && (
                                        <a
                                            href={p.liveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="admin-btn admin-btn-secondary"
                                            style={{ padding: '6px 10px', fontSize: '12px' }}
                                        >
                                            <ExternalLink size={13} />
                                            <span>Live</span>
                                        </a>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '6px 10px', fontSize: '12px' }}
                                        onClick={() => openEditModal(p)}
                                    >
                                        <Edit2 size={13} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="admin-btn admin-btn-danger"
                                        style={{ padding: '6px 10px', fontSize: '12px' }}
                                        onClick={() => handleDelete(p.id, p.title)}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProjects.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '48px 24px',
                        background: 'rgba(15, 23, 42, 0.4)',
                        borderRadius: '16px',
                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8'
                    }}>
                        <FolderGit2 size={40} style={{ color: '#4f46e5', marginBottom: '12px' }} />
                        <h4 style={{ color: '#fff', margin: '0 0 6px' }}>No Projects Found</h4>
                        <p style={{ margin: 0, fontSize: '14px' }}>Try adjusting your search query or add a new project.</p>
                    </div>
                )}
            </div>

            {filteredProjects.length > 0 && (
                <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <AdminPagination
                        currentPage={safeCurrentPage}
                        totalItems={filteredProjects.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                        pageSizeOptions={[6, 12, 24, 48]}
                        itemLabel="projects"
                        theme="dark"
                    />
                </div>
            )}

            {/* Modal for Add / Edit Project */}
            {modalMode && (
                <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
                    <div className="admin-modal-content project-modal-wide" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <div>
                                <h3 className="admin-modal-title">
                                    {modalMode === 'create' ? 'Add New Portfolio Project' : 'Edit Project Details'}
                                </h3>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                                    Configure core project info and the 5 live display tabs (Overview, Features, Tech Stack, License, FAQ)
                                </p>
                            </div>
                            <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tab Bar matching the Project Info tabs */}
                        <div className="admin-project-tabs-nav-wrapper">
                            <div className="admin-project-tabs-nav">
                                <button
                                    type="button"
                                    className={`admin-project-tab-btn ${modalTab === 'general' ? 'active' : ''}`}
                                    onClick={() => setModalTab('general')}
                                >
                                    <Sparkles size={16} />
                                    <span>General</span>
                                </button>
                                <button
                                    type="button"
                                    className={`admin-project-tab-btn ${modalTab === 'overview' ? 'active' : ''}`}
                                    onClick={() => setModalTab('overview')}
                                >
                                    <Globe size={16} />
                                    <span>Overview</span>
                                </button>
                                <button
                                    type="button"
                                    className={`admin-project-tab-btn ${modalTab === 'features' ? 'active' : ''}`}
                                    onClick={() => setModalTab('features')}
                                >
                                    <Zap size={16} />
                                    <span>Features</span>
                                </button>
                                <button
                                    type="button"
                                    className={`admin-project-tab-btn ${modalTab === 'tech' ? 'active' : ''}`}
                                    onClick={() => setModalTab('tech')}
                                >
                                    <Code2 size={16} />
                                    <span>Tech Stack</span>
                                </button>
                                <button
                                    type="button"
                                    className={`admin-project-tab-btn ${modalTab === 'license' ? 'active' : ''}`}
                                    onClick={() => setModalTab('license')}
                                >
                                    <Shield size={16} />
                                    <span>License & Rights</span>
                                </button>
                                <button
                                    type="button"
                                    className={`admin-project-tab-btn ${modalTab === 'faq' ? 'active' : ''}`}
                                    onClick={() => setModalTab('faq')}
                                >
                                    <MessageCircle size={16} />
                                    <span>FAQ</span>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className="admin-project-modal-form">
                            <div className="admin-project-modal-body">
                                {/* TAB 1: General */}
                                {modalTab === 'general' && (
                                    <div className="admin-form-grid">
                                        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                            <label className="admin-label">Project Title</label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. MyITRDesk.com | Fullstack Web App"
                                            />
                                        </div>

                                        <div className="admin-field">
                                            <label className="admin-label">Author / Organization</label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                value={formData.author}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                placeholder="e.g. Namustutam"
                                            />
                                        </div>

                                        <div className="admin-field">
                                            <label className="admin-label">Category</label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                placeholder="e.g. E-Commerce, SaaS, Mobile, Fintech"
                                            />
                                        </div>

                                        <div className="admin-field">
                                            <label className="admin-label">Filter Tab (Showcase Filter)</label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                value={formData.filter}
                                                onChange={(e) => setFormData({ ...formData, filter: e.target.value })}
                                                placeholder="e.g. Web Application, Mobile App"
                                            />
                                        </div>

                                        <div className="admin-field">
                                            <label className="admin-label">Price / Budget Badge</label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="e.g. $99 USD or Enterprise"
                                            />
                                        </div>

                                        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                            <label className="admin-label">Image URL / Path</label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                required
                                                value={formData.img}
                                                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                                                placeholder="/dashboard1.png or https://images.unsplash.com/..."
                                            />

                                            {/* Preset image selector */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                                <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>Presets:</span>
                                                {PRESET_IMAGES.map((preset, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, img: preset.url })}
                                                        style={{
                                                            background: formData.img === preset.url ? '#ff620b' : 'rgba(255,255,255,0.06)',
                                                            border: 'none',
                                                            color: '#fff',
                                                            fontSize: '11px',
                                                            padding: '4px 9px',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {preset.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="admin-field">
                                            <label className="admin-label">Live Preview URL</label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                value={formData.liveLink}
                                                onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>

                                        <div className="admin-field">
                                            <label className="admin-label">GitHub URL (Optional)</label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                value={formData.githubLink}
                                                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                                placeholder="https://github.com/..."
                                            />
                                        </div>

                                        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#e2e8f0', fontSize: '13px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.featured}
                                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                    style={{ width: '16px', height: '16px', accentColor: '#ff620b', cursor: 'pointer' }}
                                                />
                                                Mark as Featured in Showcase Header
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: Overview */}
                                {modalTab === 'overview' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div className="admin-field">
                                            <label className="admin-label">
                                                Short Pitch / Tagline
                                                <span className="admin-label-hint">Shown in card previews & top summary</span>
                                            </label>
                                            <textarea
                                                className="admin-control-textarea"
                                                rows={2}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Brief pitch of what makes this project stand out..."
                                            />
                                        </div>

                                        <div className="admin-field">
                                            <label className="admin-label">
                                                Architecture & Purpose Description
                                                <span className="admin-label-hint">Detailed breakdown displayed on the Overview tab</span>
                                            </label>
                                            <textarea
                                                className="admin-control-textarea"
                                                rows={4}
                                                value={formData.architectureDescription}
                                                onChange={(e) => setFormData({ ...formData, architectureDescription: e.target.value })}
                                                placeholder="Describe system architecture, problem solved, deployment setup, etc..."
                                            />
                                        </div>

                                        <div className="admin-field">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <label className="admin-label" style={{ margin: 0 }}>
                                                    What's Included Checklist
                                                    <span className="admin-label-hint">Bullet items displayed in the Overview card</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, whatsIncluded: [...DEFAULT_WHATS_INCLUDED] })}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#ff620b',
                                                        fontSize: '11.5px',
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline'
                                                    }}
                                                >
                                                    Reset to Defaults
                                                </button>
                                            </div>

                                            <div className="admin-dynamic-list">
                                                {formData.whatsIncluded.map((item, idx) => (
                                                    <div key={idx} className="admin-dynamic-item-row">
                                                        <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                                                        <input
                                                            type="text"
                                                            className="admin-control-input"
                                                            value={item}
                                                            onChange={(e) => handleWhatsIncludedChange(idx, e.target.value)}
                                                            placeholder={`Included item #${idx + 1}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="admin-item-delete-btn"
                                                            onClick={() => handleRemoveWhatsIncluded(idx)}
                                                            title="Remove item"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                className="admin-add-item-btn"
                                                onClick={handleAddWhatsIncluded}
                                            >
                                                <Plus size={14} />
                                                <span>Add Included Item</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: Features */}
                                {modalTab === 'features' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '14px', color: '#f8fafc', fontWeight: '700' }}>
                                                    Project Core Capabilities & Highlights
                                                </h4>
                                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                                                    Rendered dynamically as highlight items under the Features tab
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, features: [...DEFAULT_PROJECT_FEATURES] })}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#ff620b',
                                                    fontSize: '11.5px',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                Reset to Defaults
                                            </button>
                                        </div>

                                        <div className="admin-dynamic-list">
                                            {formData.features.map((feat, idx) => (
                                                <div key={idx} className="admin-dynamic-item-row">
                                                    <Zap size={16} color="#ff620b" style={{ flexShrink: 0 }} />
                                                    <input
                                                        type="text"
                                                        className="admin-control-input"
                                                        value={feat}
                                                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                                        placeholder={`Feature #${idx + 1} (e.g. Real-time updates with websockets)`}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="admin-item-delete-btn"
                                                        onClick={() => handleRemoveFeature(idx)}
                                                        title="Remove feature"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="admin-add-item-btn"
                                            onClick={handleAddFeature}
                                        >
                                            <Plus size={14} />
                                            <span>Add Feature</span>
                                        </button>
                                    </div>
                                )}

                                {/* TAB 4: Tech Stack */}
                                {modalTab === 'tech' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div className="admin-field">
                                            <label className="admin-label">
                                                Tech Stack Tags
                                                <span className="admin-label-hint">Comma-separated technologies used in this project</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                value={formData.techStack}
                                                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                                placeholder="React, Node.js, Spring Boot, PostgreSQL"
                                            />
                                        </div>

                                        <div>
                                            <label className="admin-control-label" style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                                                Quick-Add Popular Technologies (click to toggle):
                                            </label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {POPULAR_TECHS.map((tech, idx) => {
                                                    const isAdded = (formData.techStack || '').split(',').map(s => s.trim().toLowerCase()).includes(tech.toLowerCase());
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => toggleTech(tech)}
                                                            style={{
                                                                background: isAdded ? 'rgba(255, 98, 11, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                                                                border: isAdded ? '1px solid rgba(255, 98, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                                                color: isAdded ? '#ff620b' : '#cbd5e1',
                                                                padding: '6px 13px',
                                                                borderRadius: '8px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px'
                                                            }}
                                                        >
                                                            {isAdded && <Check size={12} />}
                                                            <span>{tech}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Preview badges with delete button */}
                                        <div style={{
                                            marginTop: '10px',
                                            padding: '16px',
                                            background: 'rgba(15, 23, 42, 0.5)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '12px'
                                        }}>
                                            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                                                Active Tech Stack Preview (click ✕ to remove):
                                            </span>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {formData.techStack.split(',').map(s => s.trim()).filter(Boolean).map((t, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            background: 'rgba(255, 98, 11, 0.15)',
                                                            color: '#ff620b',
                                                            border: '1px solid rgba(255, 98, 11, 0.3)',
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        <span>{t}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTechTag(i)}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                color: '#ff620b',
                                                                cursor: 'pointer',
                                                                padding: 0,
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            title="Remove technology"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                                {formData.techStack.trim() === '' && (
                                                    <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                                                        No technologies specified yet.
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 5: License & Rights */}
                                {modalTab === 'license' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div className="admin-field">
                                            <label className="admin-label">
                                                License Tier / Model
                                                <span className="admin-label-hint">Shown in the License & Rights header</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="admin-control-input"
                                                value={formData.licenseTier}
                                                onChange={(e) => setFormData({ ...formData, licenseTier: e.target.value })}
                                                placeholder="e.g. Single End Product, Commercial, MIT, Enterprise"
                                            />
                                        </div>

                                        <div className="admin-field">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <label className="admin-label" style={{ margin: 0 }}>
                                                    Included Terms & Entitlements
                                                    <span className="admin-label-hint">Checklist items under License & Rights</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, licenseTerms: [...DEFAULT_LICENSE_TERMS] })}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#ff620b',
                                                        fontSize: '11.5px',
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline'
                                                    }}
                                                >
                                                    Reset to Defaults
                                                </button>
                                            </div>

                                            <div className="admin-dynamic-list">
                                                {formData.licenseTerms.map((term, idx) => (
                                                    <div key={idx} className="admin-dynamic-item-row">
                                                        <Shield size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
                                                        <input
                                                            type="text"
                                                            className="admin-control-input"
                                                            value={term}
                                                            onChange={(e) => handleLicenseTermChange(idx, e.target.value)}
                                                            placeholder={`Term #${idx + 1} (e.g. 1 production domain)`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="admin-item-delete-btn"
                                                            onClick={() => handleRemoveLicenseTerm(idx)}
                                                            title="Remove term"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                className="admin-add-item-btn"
                                                onClick={handleAddLicenseTerm}
                                            >
                                                <Plus size={14} />
                                                <span>Add License Term</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 6: FAQ */}
                                {modalTab === 'faq' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '14px', color: '#f8fafc', fontWeight: '700' }}>
                                                    Frequently Asked Questions (FAQ)
                                                </h4>
                                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                                                    Questions & answers displayed under the project's FAQ tab
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, faqs: [...DEFAULT_PROJECT_FAQS] })}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#ff620b',
                                                    fontSize: '11.5px',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                Reset to Defaults
                                            </button>
                                        </div>

                                        <div className="admin-faq-cards-list">
                                            {formData.faqs.map((faq, idx) => (
                                                <div key={idx} className="admin-faq-edit-card">
                                                    <div className="admin-faq-card-header">
                                                        <span className="admin-faq-num-pill">Question #{idx + 1}</span>
                                                        <button
                                                            type="button"
                                                            className="admin-item-delete-btn"
                                                            onClick={() => handleRemoveFaq(idx)}
                                                            title="Remove FAQ"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    <input
                                                        type="text"
                                                        className="admin-control-input"
                                                        value={faq.q}
                                                        onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                                                        placeholder="Enter question, e.g. What is the tech stack?"
                                                    />

                                                    <textarea
                                                        className="admin-control-textarea"
                                                        rows={2}
                                                        value={faq.a}
                                                        onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                                                        placeholder="Enter answer..."
                                                    />
                                                </div>
                                            ))}

                                            {formData.faqs.length === 0 && (
                                                <div style={{
                                                    textAlign: 'center',
                                                    padding: '24px',
                                                    color: '#64748b',
                                                    fontSize: '13px',
                                                    border: '1px dashed rgba(255,255,255,0.1)',
                                                    borderRadius: '10px'
                                                }}>
                                                    No FAQ questions added yet. Click "+ Add Question" below.
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="admin-add-item-btn"
                                            onClick={handleAddFaq}
                                        >
                                            <Plus size={14} />
                                            <span>Add Question</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setModalMode(null)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {modalMode === 'create' ? 'Create Project' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
