import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
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
    Trash2
} from 'lucide-react';

export const SystemSettings = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

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
                    <div className="settings-form-group">
                        <label><ImageIcon size={14} style={{ marginRight: '6px' }} /> Website Logo URL</label>
                        <input 
                            type="text" 
                            value={settings.websiteLogo || ''}
                            placeholder="https://example.com/logo.png"
                            onChange={(e) => handleChange('websiteLogo', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="profile-upload-section">
                    <div className="profile-upload-box">
                        {settings.websiteLogo ? (
                            <img src={settings.websiteLogo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                            <span>No Logo</span>
                        )}
                    </div>
                    <div className="profile-upload-actions">
                        <p>Logo Preview</p>
                        <p className="text-muted small">Recommended size: 150x50px</p>
                    </div>
                </div>

                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label><ImageIcon size={14} style={{ marginRight: '6px' }} /> Website Favicon URL</label>
                        <input 
                            type="text" 
                            value={settings.websiteFavicon || ''}
                            placeholder="https://example.com/favicon.ico"
                            onChange={(e) => handleChange('websiteFavicon', e.target.value)}
                        />
                    </div>
                </div>

                <div className="profile-upload-section">
                    <div className="profile-upload-box" style={{ width: '64px', height: '64px' }}>
                        {settings.websiteFavicon ? (
                            <img src={settings.websiteFavicon} alt="Favicon" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                            <span>No Icon</span>
                        )}
                    </div>
                    <div className="profile-upload-actions">
                        <p>Favicon Preview</p>
                        <p className="text-muted small">Recommended: 32x32px</p>
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

export const CompanySettings = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [currentCompany, setCurrentCompany] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);
    const [viewCompany, setViewCompany] = useState(null); // for view modal
    const [viewIndex, setViewIndex] = useState(null);

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
                companyName:    settings.companyName    || '',
                companyEmail:   settings.companyEmail   || '',
                companyPhone:   settings.companyPhone   || '',
                companyMobile:  settings.companyMobile  || '',
                companyFax:     settings.companyFax     || '',
                companyWebsite: settings.companyWebsite || '',
                companyAddress1: settings.companyAddress1 || settings.companyAddress || '',
                companyAddress2: settings.companyAddress2 || '',
                companyCity:    settings.companyCity    || '',
                companyState:   settings.companyState   || '',
                companyZipCode: settings.companyZipCode || '',
                companyCountry: settings.companyCountry || '',
                companyTaxId:   settings.companyTaxId   || '',
                companyRegNumber: settings.companyRegNumber || '',
                companyLogo:    settings.companyLogo    || '',
                companyFavicon: settings.companyFavicon || ''
            }];
            setCompanies(migrated);
        } else {
            setCompanies([]);
        }
    }, [loading, settings.companies_list]);

    const handleOpenModal = (company = null, index = null) => {
        if (company) {
            setCurrentCompany(company);
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
                companyCountry: '',
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

    const persistCompanies = (updatedCompanies) => {
        const jsonValue = JSON.stringify(updatedCompanies);
        setCompanies(updatedCompanies);
        // Pass data directly to avoid React's async state race condition
        saveSettings(null, { companies_list: jsonValue });
    };

    const handleSaveCompany = () => {
        if (!currentCompany.companyName?.trim()) {
            alert('Company Name is required.');
            return;
        }
        let updatedCompanies;
        if (editingIndex !== null) {
            updatedCompanies = companies.map((c, i) => i === editingIndex ? currentCompany : c);
        } else {
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
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff6b35, #f7931e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building size={18} color="#fff" />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Company Settings</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>View and manage your registered company profiles</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', borderRadius: '20px', padding: '4px 12px' }}>
                            {companies.length} {companies.length === 1 ? 'Company' : 'Companies'}
                        </span>
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
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6b35'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.12)'; }}
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
                                        <div style={{ height: '100%', width: `${Math.round((filledCount(c) / totalFields) * 100)}%`, background: 'linear-gradient(90deg, #ff6b35, #f7931e)', borderRadius: '99px' }} />
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
                                                    : <Building size={20} color="#ff6b35" />}
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
                                                <Building size={32} color="#ff6b35" />
                                            </div>
                                            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '600', color: '#374151' }}>No company profiles yet</p>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Add your company information using the settings form</p>
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

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '12px', width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div className="modal-header d-flex justify-content-between align-items-center" style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            <div className="d-flex align-items-center">
                                <Building size={20} className="text-orange me-2" />
                                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                                    {editingIndex !== null ? 'Edit Company' : 'Add New Company'}
                                </h4>
                            </div>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }} onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '24px' }}>
                            {/* Basic Information */}
                            <div className="settings-section-title">
                                <Building size={18} />
                                <span>Basic Information</span>
                            </div>
                            
                            <div className="settings-form-row">
                                <div className="settings-form-group">
                                    <label><Building size={14} className="me-2" /> Company Name <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyName || ''}
                                        placeholder="Dreamguys Technologies"
                                        onChange={(e) => handleFormChange('companyName', e.target.value)}
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label><Mail size={14} className="me-2" /> Company Email <span className="required">*</span></label>
                                    <input 
                                        type="email" 
                                        value={currentCompany.companyEmail || ''}
                                        placeholder="info@dreamguys.co.in"
                                        onChange={(e) => handleFormChange('companyEmail', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="settings-form-row">
                                <div className="settings-form-group">
                                    <label><Phone size={14} className="me-2" /> Company Phone <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyPhone || ''}
                                        placeholder="+1 234 567 890"
                                        onChange={(e) => handleFormChange('companyPhone', e.target.value)}
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label><Smartphone size={14} className="me-2" /> Company Mobile</label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyMobile || ''}
                                        placeholder="+1 987 654 321"
                                        onChange={(e) => handleFormChange('companyMobile', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="settings-form-row">
                                <div className="settings-form-group">
                                    <label><Hash size={14} className="me-2" /> Company Fax</label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyFax || ''}
                                        placeholder="+1 234 567 891"
                                        onChange={(e) => handleFormChange('companyFax', e.target.value)}
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label><Globe size={14} className="me-2" /> Website <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyWebsite || ''}
                                        placeholder="www.example.com"
                                        onChange={(e) => handleFormChange('companyWebsite', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="settings-divider"></div>

                            {/* Address Information */}
                            <div className="settings-section-title">
                                <MapPin size={18} />
                                <span>Address Information</span>
                            </div>

                            <div className="settings-form-row">
                                <div className="settings-form-group">
                                    <label><MapPin size={14} className="me-2" /> Address Line 1 <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyAddress1 || ''}
                                        placeholder="123 Street Name"
                                        onChange={(e) => handleFormChange('companyAddress1', e.target.value)}
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label><MapPin size={14} className="me-2" /> Address Line 2</label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyAddress2 || ''}
                                        placeholder="Suite, Apartment, etc."
                                        onChange={(e) => handleFormChange('companyAddress2', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="settings-form-row">
                                <div className="settings-form-group">
                                    <label><Globe size={14} className="me-2" /> City <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyCity || ''}
                                        placeholder="City"
                                        onChange={(e) => handleFormChange('companyCity', e.target.value)}
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label><Globe size={14} className="me-2" /> State / Province <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyState || ''}
                                        placeholder="State / Province"
                                        onChange={(e) => handleFormChange('companyState', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="settings-form-row">
                                <div className="settings-form-group">
                                    <label><Hash size={14} className="me-2" /> Zip / Postal Code <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyZipCode || ''}
                                        placeholder="Zip / Postal Code"
                                        onChange={(e) => handleFormChange('companyZipCode', e.target.value)}
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label><Globe size={14} className="me-2" /> Country <span className="required">*</span></label>
                                    <select
                                        value={currentCompany.companyCountry || ''}
                                        onChange={(e) => handleFormChange('companyCountry', e.target.value)}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="India">India</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="settings-divider"></div>

                            {/* Legal & Tax Information */}
                            <div className="settings-section-title">
                                <FileText size={18} />
                                <span>Legal & Tax Information</span>
                            </div>

                            <div className="settings-form-row">
                                <div className="settings-form-group">
                                    <label><Hash size={14} className="me-2" /> Tax ID / VAT Number</label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyTaxId || ''}
                                        placeholder="TAX-123456"
                                        onChange={(e) => handleFormChange('companyTaxId', e.target.value)}
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label><FileText size={14} className="me-2" /> Registration Number</label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyRegNumber || ''}
                                        placeholder="REG-789012"
                                        onChange={(e) => handleFormChange('companyRegNumber', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="settings-divider"></div>

                            {/* Branding Information */}
                            <div className="settings-section-title">
                                <ImageIcon size={18} />
                                <span>Branding Information</span>
                            </div>

                            <div className="settings-form-row">
                                <div className="settings-form-group">
                                    <label><ImageIcon size={14} className="me-2" /> Company Logo URL</label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyLogo || ''}
                                        placeholder="https://example.com/logo.png"
                                        onChange={(e) => handleFormChange('companyLogo', e.target.value)}
                                    />
                                </div>
                                <div className="settings-form-group">
                                    <label><ImageIcon size={14} className="me-2" /> Company Favicon URL</label>
                                    <input 
                                        type="text" 
                                        value={currentCompany.companyFavicon || ''}
                                        placeholder="https://example.com/favicon.ico"
                                        onChange={(e) => handleFormChange('companyFavicon', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="settings-form-row mt-3">
                                <div className="settings-form-group">
                                    <div className="profile-upload-box" style={{ width: '150px', height: '50px', background: '#f8fafc' }}>
                                        {currentCompany.companyLogo ? (
                                            <img src={currentCompany.companyLogo} alt="Company Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <span className="text-muted small">No Logo</span>
                                        )}
                                    </div>
                                </div>
                                <div className="settings-form-group">
                                    <div className="profile-upload-box" style={{ width: '50px', height: '50px', background: '#f8fafc' }}>
                                        {currentCompany.companyFavicon ? (
                                            <img src={currentCompany.companyFavicon} alt="Favicon" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <span className="text-muted small">No Icon</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', position: 'sticky', bottom: 0, backgroundColor: '#fff' }}>
                            <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button 
                                className="btn-save" 
                                onClick={handleSaveCompany}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : (editingIndex !== null ? 'Update Company' : 'Add Company')}
                            </button>
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

export const Appearance = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Appearance</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-group">
                    <label>Theme Layout</label>
                    <select
                        value={settings.themeLayout || ''}
                        onChange={(e) => handleChange('themeLayout', e.target.value)}
                    >
                        <option value="">Select Layout</option>
                        <option value="Light">Light</option>
                        <option value="Dark">Dark</option>
                    </select>
                </div>
                <div className="settings-form-group">
                    <label>Primary Color</label>
                    <input 
                        type="color" 
                        value={settings.primaryColor || '#ff9f43'}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                    />
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save" 
                        onClick={() => saveSettings(['themeLayout', 'primaryColor'])}
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
