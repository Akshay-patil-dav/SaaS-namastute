import { ENV, resolveImageUrl, uploadImageFile } from '@/api/config';
import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import { useCompany } from '../../../context/CompanyContext';
import {
    Building,
    Mail,
    Phone,
    Smartphone,
    Globe,
    MapPin,
    Hash,
    FileText,
    Image as ImageIcon,
    X,
    Eye,
    Edit,
    Trash2,
    Upload,
    Check,
    ChevronRight,
    ChevronLeft,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    Loader2
} from 'lucide-react';

export const SystemSettings = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const absoluteUrl = await uploadImageFile(file);
            if (absoluteUrl) {
                handleChange(field, absoluteUrl);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        }
    };

    const systemFields = ['websiteName', 'websiteLogo', 'websiteFavicon'];

    return (
        <>
            <div className="settings-content-header">
                <h3>System Settings</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Website Name <span className="required">*</span></label>
                        <input
                            type="text"
                            value={settings.websiteName || ''}
                            placeholder="Preadmin POS"
                            onChange={(e) => handleChange('websiteName', e.target.value)}
                        />
                    </div>
                </div>

                <div className="settings-form-row">
                    {/* Logo Upload */}
                    <div className="settings-form-group">
                        <label><ImageIcon size={14} className="me-2" /> Website Logo</label>
                        <div
                            className="image-upload-wrapper"
                            style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                overflow: 'hidden',
                                marginBottom: '20px'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                            onClick={() => document.getElementById('website-logo-upload').click()}
                        >
                            <input
                                id="website-logo-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageUpload(e, 'websiteLogo')}
                            />

                            {settings.websiteLogo ? (
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={settings.websiteLogo}
                                        alt="Logo Preview"
                                        style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }}
                                    />
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={(e) => { e.stopPropagation(); handleChange('websiteLogo', ''); }}>
                                        <X size={14} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted">
                                    <Upload size={24} className="mb-2 opacity-40" />
                                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Click to upload Website Logo</p>
                                    <p style={{ margin: 0, fontSize: '11px', opacity: 0.6 }}>Recommended size: 150x50px</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Favicon Upload */}
                    <div className="settings-form-group">
                        <label><ImageIcon size={14} className="me-2" /> Website Favicon</label>
                        <div
                            className="image-upload-wrapper"
                            style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '144px'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                            onClick={() => document.getElementById('website-favicon-upload').click()}
                        >
                            <input
                                id="website-favicon-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageUpload(e, 'websiteFavicon')}
                            />

                            {settings.websiteFavicon ? (
                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '64px', height: '64px', background: '#fff', borderRadius: '12px', padding: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
                                        <img
                                            src={settings.websiteFavicon}
                                            alt="Favicon Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={(e) => { e.stopPropagation(); handleChange('websiteFavicon', ''); }}>
                                        <X size={12} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted">
                                    <Upload size={24} className="mb-2 opacity-40" />
                                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Upload Favicon</p>
                                    <p style={{ margin: 0, fontSize: '11px', opacity: 0.6 }}>Best size: 32x32px</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="settings-actions">
                    <button
                        className="btn-save"
                        onClick={() => saveSettings(systemFields)}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

const COUNTRIES_LIST = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'United Arab Emirates', 'Saudi Arabia', 'Singapore', 'Germany', 'France',
    'Netherlands', 'Japan', 'South Africa', 'New Zealand', 'Brazil',
    'Mexico', 'Italy', 'Spain', 'Switzerland', 'Ireland', 'Sweden',
    'Norway', 'Denmark', 'Malaysia', 'Philippines', 'Indonesia',
    'Thailand', 'Vietnam', 'Turkey', 'Egypt', 'Nigeria', 'Kenya', 'Other'
];

export const CompanySettings = () => {
    const { settings, loading, saving, handleChange: _handleChange, saveSettings } = useSettings();
    const { refreshCompany } = useCompany();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [currentCompany, setCurrentCompany] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);
    const [viewCompany, setViewCompany] = useState(null); // for view modal
    const [viewIndex, setViewIndex] = useState(null);
    const [activeModalTab, setActiveModalTab] = useState('general');
    const [formError, setFormError] = useState('');
    const [uploadingField, setUploadingField] = useState(null);
    const [logoDragOver, setLogoDragOver] = useState(false);
    const [faviconDragOver, setFaviconDragOver] = useState(false);

    // Escape key listener for clean closing
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isModalOpen) setIsModalOpen(false);
                if (viewCompany) setViewCompany(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, viewCompany]);

    // Sync companies list from DB settings whenever settings loads or updates
    useEffect(() => {
        if (loading) return;

        if (settings.companies_list) {
            try {
                const parsed = JSON.parse(settings.companies_list);
                setCompanies(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                console.error('Failed to parse companies_list from DB:', e);
                setCompanies([]);
            }
        } else if (settings.companyName) {
            // One-time migration: seed the list from legacy flat fields
            const migrated = [{
                id: Date.now(),
                companyName: settings.companyName || '',
                companyEmail: settings.companyEmail || '',
                companyPhone: settings.companyPhone || '',
                companyMobile: settings.companyMobile || '',
                companyFax: settings.companyFax || '',
                companyWebsite: settings.companyWebsite || '',
                companyAddress1: settings.companyAddress1 || settings.companyAddress || '',
                companyAddress2: settings.companyAddress2 || '',
                companyCity: settings.companyCity || '',
                companyState: settings.companyState || '',
                companyZipCode: settings.companyZipCode || '',
                companyCountry: settings.companyCountry || '',
                companyTaxId: settings.companyTaxId || '',
                companyRegNumber: settings.companyRegNumber || '',
                companyLogo: settings.companyLogo || '',
                companyFavicon: settings.companyFavicon || ''
            }];
            setCompanies(migrated);
        } else {
            setCompanies([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, settings.companies_list]);

    const handleOpenModal = (company = null, index = null) => {
        setFormError('');
        setActiveModalTab('general');
        setUploadingField(null);
        if (company) {
            setCurrentCompany({ ...company });
            setEditingIndex(index);
        } else {
            setCurrentCompany({
                id: Date.now(),
                companyName: '',
                companyEmail: '',
                companyPhone: '',
                companyMobile: '',
                companyFax: '',
                companyWebsite: '',
                companyAddress1: '',
                companyAddress2: '',
                companyCity: '',
                companyState: '',
                companyZipCode: '',
                companyCountry: 'India',
                companyTaxId: '',
                companyRegNumber: '',
                companyLogo: '',
                companyFavicon: ''
            });
            setEditingIndex(null);
        }
        setIsModalOpen(true);
    };

    const handleOpenView = (company, index) => {
        setViewCompany(company);
        setViewIndex(index);
    };

    const handleViewToEdit = () => {
        handleOpenModal(viewCompany, viewIndex);
        setViewCompany(null);
    };

    const handleFormChange = (field, value) => {
        setCurrentCompany(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (fileOrEvent, field) => {
        let file = null;
        if (fileOrEvent?.target?.files?.[0]) {
            file = fileOrEvent.target.files[0];
        } else if (fileOrEvent instanceof File) {
            file = fileOrEvent;
        }
        if (!file) return;

        setUploadingField(field);
        try {
            const absoluteUrl = await uploadImageFile(file);
            if (absoluteUrl) {
                handleFormChange(field, absoluteUrl);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingField(null);
        }
    };

    const persistCompanies = async (updatedCompanies) => {
        const jsonValue = JSON.stringify(updatedCompanies);
        setCompanies(updatedCompanies);
        // Pass data directly to avoid React's async state race condition
        const res = await saveSettings(null, { companies_list: jsonValue });
        // Refresh the shared CompanyContext so sidebar/header/AI update instantly
        refreshCompany();
        if (res?.success) {
            window.location.reload();
        }
    };

    const handleSaveCompany = () => {
        if (!currentCompany.companyName?.trim()) {
            setFormError('Company Name is required to save.');
            setActiveModalTab('general');
            return;
        }
        setFormError('');
        let updatedCompanies;
        if (editingIndex !== null) {
            updatedCompanies = companies.map((c, i) => i === editingIndex ? currentCompany : c);
        } else {
            if (companies.length >= 1) {
                alert('You are only allowed to add one company profile.');
                return;
            }
            updatedCompanies = [...companies, { ...currentCompany, id: Date.now() }];
        }
        persistCompanies(updatedCompanies);
        setIsModalOpen(false);
    };

    const handleDeleteCompany = (index) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            const updatedCompanies = companies.filter((_, i) => i !== index);
            persistCompanies(updatedCompanies);
        }
    };

    if (loading) return (
        <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#94a3b8' }}>
            <Building size={20} style={{ animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: '14px' }}>Loading company settings...</span>
        </div>
    );

    const totalFields = 16;
    const filledCount = (c) => Object.values(c).filter(v => v && String(v).trim()).length;

    return (
        <>
            {/* ── Page Header ── */}
            <div style={{ padding: '24px 28px 0', borderBottom: '1px solid #f1f5f9', marginBottom: '0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary-color), #f7931e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building size={18} color="#fff" />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Company Settings</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>View and manage your registered company profiles</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', borderRadius: '20px', padding: '4px 12px' }}>
                            {companies.length} / 1 Company
                        </span>
                        {companies.length === 0 && (
                            <button
                                onClick={() => handleOpenModal()}
                                className="btn-save"
                                style={{ padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                + Add Company
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Summary Strip ── */}
                {companies.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', paddingBottom: '20px', overflowX: 'auto' }}>
                        {companies.map((c, i) => (
                            <div
                                key={c.id || i}
                                onClick={() => handleOpenView(c, i)}
                                style={{ minWidth: '200px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                        {c.companyLogo
                                            ? <img src={c.companyLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            : <Building size={16} color="#94a3b8" />}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.companyName || 'Unnamed'}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.companyCountry || 'No country'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ flex: 1, height: '4px', borderRadius: '99px', background: '#f1f5f9', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.round((filledCount(c) / totalFields) * 100)}%`, background: 'linear-gradient(90deg, var(--primary-color), #f7931e)', borderRadius: '99px' }} />
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748b' }}>{Math.round((filledCount(c) / totalFields) * 100)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Table ── */}
            <div style={{ padding: '0' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '13px 24px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>Company</th>
                                <th style={{ padding: '13px 16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>Contact</th>
                                <th style={{ padding: '13px 16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>Location</th>
                                <th style={{ padding: '13px 16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>Legal</th>
                                <th style={{ padding: '13px 16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.length > 0 ? companies.map((company, index) => (
                                <tr
                                    key={company.id || index}
                                    style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {/* Company Col */}
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #fff7f0, #ffe8d6)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #ffdcc4', flexShrink: 0 }}>
                                                {company.companyLogo
                                                    ? <img src={company.companyLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    : <Building size={20} color="var(--primary-color)" />}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>{company.companyName || 'Unnamed Company'}</div>
                                                {company.companyWebsite && (
                                                    <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <Globe size={10} /> {company.companyWebsite}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact Col */}
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <Mail size={12} color="#94a3b8" />
                                            {company.companyEmail || <span style={{ color: '#cbd5e1' }}>—</span>}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Phone size={12} color="#94a3b8" />
                                            {company.companyPhone || <span style={{ color: '#cbd5e1' }}>—</span>}
                                        </div>
                                    </td>

                                    {/* Location Col */}
                                    <td style={{ padding: '16px' }}>
                                        {company.companyAddress1 ? (
                                            <div>
                                                <div style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <MapPin size={12} color="#94a3b8" />
                                                    <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company.companyAddress1}</span>
                                                </div>
                                                {(company.companyCity || company.companyCountry) && (
                                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px', paddingLeft: '18px' }}>
                                                        {[company.companyCity, company.companyState, company.companyCountry].filter(Boolean).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#cbd5e1', fontSize: '13px' }}>—</span>
                                        )}
                                    </td>

                                    {/* Legal Col */}
                                    <td style={{ padding: '16px' }}>
                                        {company.companyTaxId && (
                                            <div style={{ fontSize: '12px', color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                                <Hash size={10} /> TAX: {company.companyTaxId}
                                            </div>
                                        )}
                                        {company.companyRegNumber && (
                                            <div style={{ fontSize: '12px', color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <FileText size={10} /> REG: {company.companyRegNumber}
                                            </div>
                                        )}
                                        {!company.companyTaxId && !company.companyRegNumber && (
                                            <span style={{ color: '#cbd5e1', fontSize: '13px' }}>—</span>
                                        )}
                                    </td>

                                    {/* Actions Col */}
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                            <button
                                                onClick={() => handleOpenView(company, index)}
                                                title="View Details"
                                                style={{ width: '32px', height: '32px', border: '1px solid #dcfce7', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', color: '#16a34a' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#16a34a'; }}
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(company, index)}
                                                title="Edit"
                                                style={{ width: '32px', height: '32px', border: '1px solid #dbeafe', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', color: '#2563eb' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCompany(index)}
                                                title="Delete"
                                                style={{ width: '32px', height: '32px', border: '1px solid #fee2e2', background: '#fff5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', color: '#dc2626' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#dc2626'; }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5">
                                        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                                            <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: 'linear-gradient(135deg, #fff7f0, #ffe8d6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                                <Building size={32} color="var(--primary-color)" />
                                            </div>
                                            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '600', color: '#374151' }}>No company profiles yet</p>
                                            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#94a3b8' }}>Add your company information using the settings form</p>
                                            <button
                                                onClick={() => handleOpenModal()}
                                                className="btn-save"
                                                style={{ padding: '8px 20px' }}
                                            >
                                                + Add Company Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {viewCompany && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '12px', width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    {viewCompany.companyLogo
                                        ? <img src={viewCompany.companyLogo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <Building size={24} color="#94a3b8" />}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>{viewCompany.companyName || 'Company Details'}</h4>
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{viewCompany.companyWebsite || ''}</span>
                                </div>
                            </div>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setViewCompany(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '24px' }}>
                            {/* Basic Info Section */}
                            <div className="settings-section-title"><Building size={16} /><span>Basic Information</span></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                {[['Company Name', viewCompany.companyName, <Building size={14} />],
                                ['Email', viewCompany.companyEmail, <Mail size={14} />],
                                ['Phone', viewCompany.companyPhone, <Phone size={14} />],
                                ['Mobile', viewCompany.companyMobile, <Smartphone size={14} />],
                                ['Fax', viewCompany.companyFax, <Hash size={14} />],
                                ['Website', viewCompany.companyWebsite, <Globe size={14} />],
                                ].map(([label, value, icon]) => (
                                    <div key={label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                                            {icon} {label}
                                        </div>
                                        <div style={{ color: value ? '#1e293b' : '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>{value || '—'}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="settings-divider"></div>

                            {/* Address Section */}
                            <div className="settings-section-title"><MapPin size={16} /><span>Address</span></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                {[['Address Line 1', viewCompany.companyAddress1, <MapPin size={14} />],
                                ['Address Line 2', viewCompany.companyAddress2, <MapPin size={14} />],
                                ['City', viewCompany.companyCity, <Globe size={14} />],
                                ['State / Province', viewCompany.companyState, <Globe size={14} />],
                                ['Zip / Postal Code', viewCompany.companyZipCode, <Hash size={14} />],
                                ['Country', viewCompany.companyCountry, <Globe size={14} />],
                                ].map(([label, value, icon]) => (
                                    <div key={label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                                            {icon} {label}
                                        </div>
                                        <div style={{ color: value ? '#1e293b' : '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>{value || '—'}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="settings-divider"></div>

                            {/* Legal Section */}
                            <div className="settings-section-title"><FileText size={16} /><span>Legal & Tax</span></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                {[['Tax ID / VAT', viewCompany.companyTaxId, <Hash size={14} />],
                                ['Registration No.', viewCompany.companyRegNumber, <FileText size={14} />],
                                ].map(([label, value, icon]) => (
                                    <div key={label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                                            {icon} {label}
                                        </div>
                                        <div style={{ color: value ? '#1e293b' : '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>{value || '—'}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="settings-divider"></div>

                            {/* Branding Section */}
                            <div className="settings-section-title"><ImageIcon size={16} /><span>Branding</span></div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Company Logo</div>
                                    <div style={{ width: '160px', height: '60px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {viewCompany.companyLogo
                                            ? <img src={viewCompany.companyLogo} alt="logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                            : <span style={{ color: '#cbd5e1', fontSize: '12px' }}>No Logo</span>}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Favicon</div>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {viewCompany.companyFavicon
                                            ? <img src={viewCompany.companyFavicon} alt="favicon" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                            : <span style={{ color: '#cbd5e1', fontSize: '10px' }}>None</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', position: 'sticky', bottom: 0, backgroundColor: '#fff' }}>
                            <button className="btn-cancel" onClick={() => setViewCompany(null)}>Close</button>
                            <button className="btn-save" onClick={handleViewToEdit}>
                                <Edit size={14} style={{ marginRight: '6px' }} /> Edit Company
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit / Add Modal */}
            {isModalOpen && (
                <div className="company-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
                    <div className="company-modal-dialog">
                        {/* Modal Header */}
                        <div className="company-modal-header">
                            <div className="company-modal-header-left">
                                <div className="company-modal-icon-badge">
                                    <Building size={22} />
                                </div>
                                <div className="company-modal-title-wrap">
                                    <div className="company-modal-title-row">
                                        <h4 className="company-modal-title">
                                            {editingIndex !== null ? 'Edit Company Profile' : 'Add New Company'}
                                        </h4>
                                        <span className={`company-modal-status-pill ${editingIndex !== null ? 'edit' : 'new'}`}>
                                            {editingIndex !== null ? 'Editing Profile' : 'New Profile'}
                                        </span>
                                    </div>
                                    <p className="company-modal-subtitle">
                                        Configure official business credentials, address, compliance, and branding.
                                    </p>
                                </div>
                            </div>
                            <button className="company-modal-close-btn" onClick={() => setIsModalOpen(false)} title="Close (Esc)">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Tabs Navigation */}
                        <div className="company-modal-tabs">
                            {[
                                { id: 'general', label: 'General Info', icon: <Building size={14} />, isComplete: !!currentCompany.companyName },
                                { id: 'address', label: 'Address & Location', icon: <MapPin size={14} />, isComplete: !!(currentCompany.companyAddress1 || currentCompany.companyCity) },
                                { id: 'legal', label: 'Legal & Tax', icon: <FileText size={14} />, isComplete: !!(currentCompany.companyTaxId || currentCompany.companyRegNumber) },
                                { id: 'branding', label: 'Branding Assets', icon: <ImageIcon size={14} />, isComplete: !!(currentCompany.companyLogo || currentCompany.companyFavicon) },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`company-modal-tab-btn ${activeModalTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveModalTab(tab.id)}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    {tab.isComplete && (
                                        <span className="company-tab-check">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Modal Body */}
                        <div className="company-modal-body">
                            {/* Validation error banner if any */}
                            {formError && (
                                <div className="company-modal-error-banner">
                                    <AlertCircle size={16} />
                                    <span>{formError}</span>
                                    <button type="button" onClick={() => setFormError('')} title="Dismiss">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            {/* TAB 1: General Info */}
                            {activeModalTab === 'general' && (
                                <div>
                                    <div className="company-section-banner">
                                        <div className="company-section-title">
                                            <Building size={16} color="#f97316" />
                                            <span>Basic Business Information</span>
                                        </div>
                                        <span className="company-section-subtitle">Official entity & communication channels</span>
                                    </div>

                                    <div className="company-form-grid">
                                        <div className="company-field">
                                            <label className="company-label">
                                                <Building size={13} color="#f97316" />
                                                <span>Company Name</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyName || ''}
                                                    placeholder="e.g. Dreamguys Technologies Pvt Ltd"
                                                    onChange={(e) => {
                                                        handleFormChange('companyName', e.target.value);
                                                        if (formError) setFormError('');
                                                    }}
                                                />
                                            </div>
                                            <span className="company-field-hint">Primary trade name appearing on invoices and reports.</span>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Mail size={13} color="#f97316" />
                                                <span>Company Email</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="email"
                                                    className="company-input"
                                                    value={currentCompany.companyEmail || ''}
                                                    placeholder="info@dreamguys.co.in"
                                                    onChange={(e) => handleFormChange('companyEmail', e.target.value)}
                                                />
                                            </div>
                                            <span className="company-field-hint">Used for system alerts, notices, and customer contact.</span>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Phone size={13} color="#f97316" />
                                                <span>Company Phone</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyPhone || ''}
                                                    placeholder="+1 234 567 890"
                                                    onChange={(e) => handleFormChange('companyPhone', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Smartphone size={13} color="#f97316" />
                                                <span>Company Mobile</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyMobile || ''}
                                                    placeholder="+1 987 654 321"
                                                    onChange={(e) => handleFormChange('companyMobile', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Globe size={13} color="#f97316" />
                                                <span>Website URL</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyWebsite || ''}
                                                    placeholder="https://www.example.com"
                                                    onChange={(e) => handleFormChange('companyWebsite', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Hash size={13} color="#f97316" />
                                                <span>Fax Number</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyFax || ''}
                                                    placeholder="+1 234 567 891"
                                                    onChange={(e) => handleFormChange('companyFax', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Address */}
                            {activeModalTab === 'address' && (
                                <div>
                                    <div className="company-section-banner">
                                        <div className="company-section-title">
                                            <MapPin size={16} color="#f97316" />
                                            <span>Registered Address & Location</span>
                                        </div>
                                        <span className="company-section-subtitle">Corporate headquarters for invoices and tax filing</span>
                                    </div>

                                    <div className="company-form-grid">
                                        <div className="company-field full-width">
                                            <label className="company-label">
                                                <MapPin size={13} color="#f97316" />
                                                <span>Address Line 1</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyAddress1 || ''}
                                                    placeholder="Building 4, Business Park, Tech Avenue"
                                                    onChange={(e) => handleFormChange('companyAddress1', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="company-field full-width">
                                            <label className="company-label">
                                                <MapPin size={13} color="#f97316" />
                                                <span>Address Line 2 (Optional)</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyAddress2 || ''}
                                                    placeholder="Suite, Floor, Landmark"
                                                    onChange={(e) => handleFormChange('companyAddress2', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Globe size={13} color="#f97316" />
                                                <span>City</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyCity || ''}
                                                    placeholder="e.g. Mumbai, New York"
                                                    onChange={(e) => handleFormChange('companyCity', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Globe size={13} color="#f97316" />
                                                <span>State / Province</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyState || ''}
                                                    placeholder="e.g. Maharashtra, NY"
                                                    onChange={(e) => handleFormChange('companyState', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Hash size={13} color="#f97316" />
                                                <span>Zip / Postal Code</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyZipCode || ''}
                                                    placeholder="e.g. 400001 or 10001"
                                                    onChange={(e) => handleFormChange('companyZipCode', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <Globe size={13} color="#f97316" />
                                                <span>Country</span>
                                                <span className="required-star">*</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <select
                                                    className="company-select"
                                                    value={currentCompany.companyCountry || ''}
                                                    onChange={(e) => handleFormChange('companyCountry', e.target.value)}
                                                >
                                                    <option value="">Select Country</option>
                                                    {COUNTRIES_LIST.map(country => (
                                                        <option key={country} value={country}>{country}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: Legal & Tax */}
                            {activeModalTab === 'legal' && (
                                <div>
                                    <div className="company-section-banner">
                                        <div className="company-section-title">
                                            <FileText size={16} color="#f97316" />
                                            <span>Corporate Legal & Tax Information</span>
                                        </div>
                                        <span className="company-section-subtitle">Tax compliance codes shown on statutory invoices</span>
                                    </div>

                                    <div className="company-form-grid">
                                        <div className="company-field">
                                            <label className="company-label">
                                                <Hash size={13} color="#f97316" />
                                                <span>Tax ID / VAT / GSTIN Number</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyTaxId || ''}
                                                    placeholder="e.g. 27AADCB2230M1ZT or VAT-987654"
                                                    onChange={(e) => handleFormChange('companyTaxId', e.target.value)}
                                                />
                                            </div>
                                            <span className="company-field-hint">Prints on commercial invoices & tax receipts.</span>
                                        </div>

                                        <div className="company-field">
                                            <label className="company-label">
                                                <FileText size={13} color="#f97316" />
                                                <span>Company Registration Number</span>
                                            </label>
                                            <div className="company-input-wrap">
                                                <input
                                                    type="text"
                                                    className="company-input"
                                                    value={currentCompany.companyRegNumber || ''}
                                                    placeholder="e.g. CIN: U72200MH2020PTC123456"
                                                    onChange={(e) => handleFormChange('companyRegNumber', e.target.value)}
                                                />
                                            </div>
                                            <span className="company-field-hint">Official government business certificate identifier.</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: Branding */}
                            {activeModalTab === 'branding' && (
                                <div>
                                    <div className="company-section-banner">
                                        <div className="company-section-title">
                                            <ImageIcon size={16} color="#f97316" />
                                            <span>Brand Assets & Visual Identity</span>
                                        </div>
                                        <span className="company-section-subtitle">Logos used in navigation, receipts, and print templates</span>
                                    </div>

                                    <div className="company-form-grid">
                                        {/* Company Logo Card */}
                                        <div className="company-field">
                                            <label className="company-label">
                                                <ImageIcon size={13} color="#f97316" />
                                                <span>Company Logo</span>
                                            </label>
                                            
                                            <input
                                                id="cmp-logo-file-input"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleImageUpload(e, 'companyLogo')}
                                            />

                                            {currentCompany.companyLogo ? (
                                                <div className="company-preview-box">
                                                    <div className="company-preview-img-wrap">
                                                        <img src={currentCompany.companyLogo} alt="Logo preview" />
                                                    </div>
                                                    <div className="company-preview-actions">
                                                        <button
                                                            type="button"
                                                            className="btn-company-sub"
                                                            onClick={() => document.getElementById('cmp-logo-file-input').click()}
                                                            disabled={uploadingField === 'companyLogo'}
                                                        >
                                                            {uploadingField === 'companyLogo' ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                            Change Logo
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn-company-sub danger"
                                                            onClick={() => handleFormChange('companyLogo', '')}
                                                        >
                                                            <Trash2 size={12} /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`company-upload-card ${logoDragOver ? 'dragover' : ''}`}
                                                    onDragOver={(e) => { e.preventDefault(); setLogoDragOver(true); }}
                                                    onDragLeave={() => setLogoDragOver(false)}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setLogoDragOver(false);
                                                        if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0], 'companyLogo');
                                                    }}
                                                    onClick={() => document.getElementById('cmp-logo-file-input').click()}
                                                >
                                                    <div className="company-upload-icon-circle">
                                                        {uploadingField === 'companyLogo' ? (
                                                            <Loader2 size={22} className="animate-spin" />
                                                        ) : (
                                                            <Upload size={22} />
                                                        )}
                                                    </div>
                                                    <h5 className="company-upload-title">Upload Company Logo</h5>
                                                    <p className="company-upload-desc">Drag & drop or click to browse</p>
                                                    <p className="company-field-hint" style={{ marginTop: '6px' }}>PNG, JPG, SVG, WebP up to 5MB</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Company Favicon Card */}
                                        <div className="company-field">
                                            <label className="company-label">
                                                <Globe size={13} color="#f97316" />
                                                <span>Company Favicon & Tab Preview</span>
                                            </label>

                                            <input
                                                id="cmp-favicon-file-input"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleImageUpload(e, 'companyFavicon')}
                                            />

                                            {currentCompany.companyFavicon ? (
                                                <div className="company-preview-box">
                                                    {/* Realistic Browser Tab Mockup */}
                                                    <div className="browser-tab-preview">
                                                        <div className="browser-tab-bar">
                                                            <div className="browser-dots">
                                                                <div className="browser-dot" style={{ backgroundColor: '#ef4444' }} />
                                                                <div className="browser-dot" style={{ backgroundColor: '#f59e0b' }} />
                                                                <div className="browser-dot" style={{ backgroundColor: '#10b981' }} />
                                                            </div>
                                                            <div className="browser-tab">
                                                                <img
                                                                    src={currentCompany.companyFavicon}
                                                                    alt="Favicon"
                                                                    className="browser-tab-icon"
                                                                />
                                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {currentCompany.companyName || 'My Company'} - POS
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="browser-body-dummy">
                                                            <span>🌐 https://{currentCompany.companyWebsite?.replace(/^https?:\/\//, '') || 'app.namustutam.com'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="company-preview-actions">
                                                        <button
                                                            type="button"
                                                            className="btn-company-sub"
                                                            onClick={() => document.getElementById('cmp-favicon-file-input').click()}
                                                            disabled={uploadingField === 'companyFavicon'}
                                                        >
                                                            {uploadingField === 'companyFavicon' ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                            Change Favicon
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn-company-sub danger"
                                                            onClick={() => handleFormChange('companyFavicon', '')}
                                                        >
                                                            <Trash2 size={12} /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`company-upload-card ${faviconDragOver ? 'dragover' : ''}`}
                                                    onDragOver={(e) => { e.preventDefault(); setFaviconDragOver(true); }}
                                                    onDragLeave={() => setFaviconDragOver(false)}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setFaviconDragOver(false);
                                                        if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0], 'companyFavicon');
                                                    }}
                                                    onClick={() => document.getElementById('cmp-favicon-file-input').click()}
                                                >
                                                    <div className="company-upload-icon-circle">
                                                        {uploadingField === 'companyFavicon' ? (
                                                            <Loader2 size={22} className="animate-spin" />
                                                        ) : (
                                                            <Globe size={22} />
                                                        )}
                                                    </div>
                                                    <h5 className="company-upload-title">Upload Browser Favicon</h5>
                                                    <p className="company-upload-desc">Drag & drop or click to browse</p>
                                                    <p className="company-field-hint" style={{ marginTop: '6px' }}>Recommended: 32x32px or 64x64px ICO/PNG</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="company-modal-footer">
                            <div className="company-modal-footer-left">
                                <button
                                    type="button"
                                    className="btn-cmp-secondary"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                {activeModalTab !== 'general' && (
                                    <button
                                        type="button"
                                        className="btn-cmp-secondary"
                                        onClick={() => {
                                            const tabOrder = ['general', 'address', 'legal', 'branding'];
                                            const currentIndex = tabOrder.indexOf(activeModalTab);
                                            if (currentIndex > 0) setActiveModalTab(tabOrder[currentIndex - 1]);
                                        }}
                                    >
                                        <ChevronLeft size={15} /> Previous
                                    </button>
                                )}
                            </div>

                            <div className="company-modal-footer-right">
                                {activeModalTab !== 'branding' && (
                                    <button
                                        type="button"
                                        className="btn-cmp-step"
                                        onClick={() => {
                                            const tabOrder = ['general', 'address', 'legal', 'branding'];
                                            const currentIndex = tabOrder.indexOf(activeModalTab);
                                            if (currentIndex < tabOrder.length - 1) setActiveModalTab(tabOrder[currentIndex + 1]);
                                        }}
                                    >
                                        Next Step <ChevronRight size={15} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn-cmp-primary"
                                    onClick={handleSaveCompany}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            {editingIndex !== null ? 'Update Company Profile' : 'Add Company'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const Localization = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Localization</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Timezone</label>
                        <select
                            value={settings.timezone || ''}
                            onChange={(e) => handleChange('timezone', e.target.value)}
                        >
                            <option value="">Select Timezone</option>
                            <option value="(UTC -5:00) Eastern Time">(UTC -5:00) Eastern Time</option>
                            <option value="(UTC +5:30) Indian Standard Time">(UTC +5:30) Indian Standard Time</option>
                        </select>
                    </div>
                    <div className="settings-form-group">
                        <label>Date Format</label>
                        <select
                            value={settings.dateFormat || ''}
                            onChange={(e) => handleChange('dateFormat', e.target.value)}
                        >
                            <option value="">Select Format</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Time Format</label>
                        <select
                            value={settings.timeFormat || ''}
                            onChange={(e) => handleChange('timeFormat', e.target.value)}
                        >
                            <option value="">Select Format</option>
                            <option value="12 Hours">12 Hours</option>
                            <option value="24 Hours">24 Hours</option>
                        </select>
                    </div>
                    <div className="settings-form-group">
                        <label>Financial Year Start Month</label>
                        <select
                            value={settings.financialYearStart || ''}
                            onChange={(e) => handleChange('financialYearStart', e.target.value)}
                        >
                            <option value="">Select Month</option>
                            <option value="January">January</option>
                            <option value="April">April</option>
                        </select>
                    </div>
                </div>
                <div className="settings-actions">
                    <button
                        className="btn-save"
                        onClick={() => saveSettings(['timezone', 'dateFormat', 'timeFormat', 'financialYearStart'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const Prefixes = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Prefixes</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Product Prefix</label>
                        <input
                            type="text"
                            value={settings.productPrefix || ''}
                            placeholder="PROD-"
                            onChange={(e) => handleChange('productPrefix', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>Purchase Prefix</label>
                        <input
                            type="text"
                            value={settings.purchasePrefix || ''}
                            placeholder="PUR-"
                            onChange={(e) => handleChange('purchasePrefix', e.target.value)}
                        />
                    </div>
                </div>
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Sale Prefix</label>
                        <input
                            type="text"
                            value={settings.salePrefix || ''}
                            placeholder="SALE-"
                            onChange={(e) => handleChange('salePrefix', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>Expense Prefix</label>
                        <input
                            type="text"
                            value={settings.expensePrefix || ''}
                            placeholder="EXP-"
                            onChange={(e) => handleChange('expensePrefix', e.target.value)}
                        />
                    </div>
                </div>
                <div className="settings-actions">
                    <button
                        className="btn-save"
                        onClick={() => saveSettings(['productPrefix', 'purchasePrefix', 'salePrefix', 'expensePrefix'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const Preference = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Preference</h3>
            </div>
            <div className="settings-content-body">
                <div className="security-item">
                    <div className="security-item-content">
                        <h4>Maintenance Mode</h4>
                        <p>Enable maintenance mode to disable user access</p>
                    </div>
                    <div className="security-item-action">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode === 'true'}
                                onChange={(e) => handleChange('maintenanceMode', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="security-item">
                    <div className="security-item-content">
                        <h4>Enable Registration</h4>
                        <p>Allow new users to register</p>
                    </div>
                    <div className="security-item-action">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.enableRegistration !== 'false'}
                                onChange={(e) => handleChange('enableRegistration', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="settings-actions">
                    <button
                        className="btn-save"
                        onClick={() => saveSettings(['maintenanceMode', 'enableRegistration'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};


export const SocialAuthentication = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Social Authentication</h3>
            </div>
            <div className="settings-content-body">
                <div className="security-item">
                    <div className="security-item-content">
                        <h4>Google Login</h4>
                        <p>Enable login with Google</p>
                    </div>
                    <div className="security-item-action">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.enableGoogleLogin !== 'false'}
                                onChange={(e) => handleChange('enableGoogleLogin', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="security-item">
                    <div className="security-item-content">
                        <h4>Facebook Login</h4>
                        <p>Enable login with Facebook</p>
                    </div>
                    <div className="security-item-action">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.enableFacebookLogin === 'true'}
                                onChange={(e) => handleChange('enableFacebookLogin', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="settings-actions">
                    <button
                        className="btn-save"
                        onClick={() => saveSettings(['enableGoogleLogin', 'enableFacebookLogin'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const Language = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Language</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-group">
                    <label>Default Language</label>
                    <select
                        value={settings.defaultLanguage || ''}
                        onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                    >
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="Arabic">Arabic</option>
                    </select>
                </div>
                <div className="settings-actions">
                    <button
                        className="btn-save"
                        onClick={() => saveSettings(['defaultLanguage'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};
