import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Users, Linkedin, Github, Twitter, Instagram, X, Search } from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import AdminPagination from '../components/AdminPagination';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';

const TEAM_AVATAR_PRESETS = [
    { label: 'Akshay', url: '/team/Akshay.png' },
    { label: 'Santosh', url: '/team/sp.png' },
    { label: 'Amol', url: '/team/wagh.png' },
    { label: 'Chetan', url: '/team/cp.png' }
];

export default function TeamTab() {
    const { landingData, addTeamMember, updateTeamMember, deleteTeamMember } = useLandingPage();
    const team = landingData.team || [];

    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
    const [editingMember, setEditingMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        badge: 'Freelancer',
        image: '/team/Akshay.png',
        bio: '',
        socials: {
            linkedin: 'https://linkedin.com',
            github: 'https://github.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com'
        }
    });

    const openCreate = () => {
        setFormData({
            name: '',
            role: 'Software Developer',
            badge: 'Core Contributor',
            image: '/team/Akshay.png',
            bio: 'Passionate professional dedicated to delivering excellence and driving innovation.',
            socials: {
                linkedin: 'https://linkedin.com',
                github: 'https://github.com',
                twitter: 'https://twitter.com',
                instagram: 'https://instagram.com'
            }
        });
        setModalMode('create');
    };

    const openEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name || '',
            role: member.role || '',
            badge: member.badge || 'Freelancer',
            image: member.image || '/team/Akshay.png',
            bio: member.bio || '',
            socials: {
                linkedin: member.socials?.linkedin || '',
                github: member.socials?.github || '',
                twitter: member.socials?.twitter || '',
                instagram: member.socials?.instagram || ''
            }
        });
        setModalMode('edit');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            addTeamMember(formData);
        } else if (modalMode === 'edit' && editingMember) {
            updateTeamMember(editingMember.id, formData);
        }
        setModalMode(null);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete team member "${name}"?`)) {
            deleteTeamMember(id);
        }
    };

    const filteredTeam = useMemo(() => {
        if (!searchTerm.trim()) return team;
        const q = searchTerm.toLowerCase();
        return team.filter(m =>
            m.name?.toLowerCase().includes(q) ||
            m.role?.toLowerCase().includes(q) ||
            m.badge?.toLowerCase().includes(q) ||
            m.bio?.toLowerCase().includes(q)
        );
    }, [team, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredTeam.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedTeam = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return filteredTeam.slice(start, start + pageSize);
    }, [filteredTeam, safeCurrentPage, pageSize]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SectionVisibilityBanner 
                sectionKey="team" 
                sectionName="Engineering Team & Leadership" 
                description="Controls whether the Team & Leadership roster section is rendered on the public website."
            />

            <div className="admin-card" style={{ padding: '18px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h3 className="admin-card-title">
                            <Users size={18} color="#ff620b" />
                            Team & Leadership
                        </h3>
                        <div className="admin-card-subtitle">Manage engineers and leaders displayed in the Team Section</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                            <Plus size={16} />
                            <span>Add Team Member</span>
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: '16px', position: 'relative', maxWidth: '420px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '11px', color: '#64748b' }} />
                    <input
                        type="text"
                        placeholder="Search team by name, role, badge, or bio…"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="admin-control-input"
                        style={{ paddingLeft: '34px', fontSize: '13px' }}
                    />
                </div>
            </div>

            {filteredTeam.length === 0 ? (
                <div className="admin-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
                    <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>No team members found</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 16px' }}>
                        {searchTerm ? `No results for "${searchTerm}".` : 'No team members added yet.'}
                    </p>
                    {searchTerm && (
                        <button className="admin-btn admin-btn-secondary" onClick={() => { setSearchTerm(''); setCurrentPage(1); }}>
                            Reset Search
                        </button>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {paginatedTeam.map((member) => (
                    <div
                        key={member.id}
                        className="admin-card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                background: `url(${member.image}) center/cover no-repeat #1e293b`,
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                flexShrink: 0
                            }} />

                            <div style={{ overflow: 'hidden' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '0 0 2px' }}>
                                    {member.name}
                                </h4>
                                <div style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: '500' }}>
                                    {member.role}
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    color: '#ff8c42',
                                    fontWeight: '600',
                                    background: 'rgba(255, 140, 66, 0.12)',
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    display: 'inline-block',
                                    marginTop: '4px'
                                }}>
                                    {member.badge || 'Freelancer'}
                                </span>
                            </div>
                        </div>

                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5, flex: 1 }}>
                            {member.bio}
                        </p>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                            <div style={{ display: 'flex', gap: '8px', color: '#64748b' }}>
                                {member.socials?.linkedin && <Linkedin size={15} />}
                                {member.socials?.github && <Github size={15} />}
                                {member.socials?.twitter && <Twitter size={15} />}
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '6px 10px', fontSize: '12px' }}
                                    onClick={() => openEdit(member)}
                                >
                                    <Edit2 size={13} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    className="admin-btn admin-btn-danger"
                                    style={{ padding: '6px 10px', fontSize: '12px' }}
                                    onClick={() => handleDelete(member.id, member.name)}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}

            {filteredTeam.length > 0 && (
                <AdminPagination
                    currentPage={safeCurrentPage}
                    totalItems={filteredTeam.length}
                    pageSize={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                    }}
                    pageSizeOptions={[6, 12, 24, 48]}
                    itemLabel="team members"
                    theme="dark"
                />
            )}

            {/* Modal */}
            {modalMode && (
                <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
                    <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">
                                {modalMode === 'create' ? 'Add Team Member' : 'Edit Member'}
                            </h3>
                            <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div className="admin-form-grid">
                                <div className="admin-field">
                                    <label className="admin-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Akshay Patil"
                                    />
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">Role / Specialization</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Full-Stack / AI Engineer"
                                    />
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">Pill Badge</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        placeholder="e.g. Freelancer, Partner, Contributor"
                                    />
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">Avatar Photo URL</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="/team/Akshay.png or https://..."
                                    />
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                        {TEAM_AVATAR_PRESETS.map((preset, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: preset.url })}
                                                style={{
                                                    background: formData.image === preset.url ? '#ff620b' : 'rgba(255,255,255,0.06)',
                                                    border: 'none',
                                                    color: '#fff',
                                                    fontSize: '11px',
                                                    padding: '3px 8px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Short Bio</label>
                                    <textarea
                                        className="admin-control-textarea"
                                        rows={3}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Passionate engineer dedicated to crafting high-performance digital products..."
                                    />
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">LinkedIn URL</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        value={formData.socials.linkedin}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socials: { ...formData.socials, linkedin: e.target.value }
                                        })}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">GitHub URL</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        value={formData.socials.github}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socials: { ...formData.socials, github: e.target.value }
                                        })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalMode(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {modalMode === 'create' ? 'Add Member' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
