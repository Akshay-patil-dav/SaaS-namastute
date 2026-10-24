import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Star, MessageSquare, X, Search } from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import AdminPagination from '../components/AdminPagination';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';

export default function TestimonialsTab() {
    const { landingData, addTestimonial, updateTestimonial, deleteTestimonial } = useLandingPage();
    const testimonials = landingData.testimonials || [];

    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        rating: 5,
        review: '',
        avatar: 'A'
    });

    const openCreate = () => {
        setFormData({
            name: '',
            role: 'Founder & CEO',
            rating: 5,
            review: 'Exceptional software quality, timely delivery, and clear communication throughout the build.',
            avatar: 'N'
        });
        setModalMode('create');
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name || '',
            role: item.role || '',
            rating: item.rating || 5,
            review: item.review || '',
            avatar: item.avatar || (item.name ? item.name[0] : 'U')
        });
        setModalMode('edit');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            avatar: formData.avatar || (formData.name ? formData.name[0] : 'U')
        };
        if (modalMode === 'create') {
            addTestimonial(payload);
        } else if (modalMode === 'edit' && editingItem) {
            updateTestimonial(editingItem.id, payload);
        }
        setModalMode(null);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete review from "${name}"?`)) {
            deleteTestimonial(id);
        }
    };

    const filteredTestimonials = useMemo(() => {
        return testimonials.filter(item => {
            const matchesSearch = !searchTerm.trim() ||
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.review?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRating = ratingFilter === 'all' || Number(item.rating) === Number(ratingFilter);

            return matchesSearch && matchesRating;
        });
    }, [testimonials, searchTerm, ratingFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedTestimonials = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return filteredTestimonials.slice(start, start + pageSize);
    }, [filteredTestimonials, safeCurrentPage, pageSize]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SectionVisibilityBanner 
                sectionKey="testimonials" 
                sectionName="Client Reviews & Testimonials" 
                description="Controls whether customer feedback, star ratings, and review cards are rendered on the public website."
            />

            <div className="admin-card" style={{ padding: '18px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h3 className="admin-card-title">
                            <Star size={18} color="#f59e0b" />
                            Client Testimonials & Social Proof
                        </h3>
                        <div className="admin-card-subtitle">
                            Customer feedback, enterprise quotes, and ratings
                        </div>
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                        <Plus size={16} />
                        <span>Add Testimonial</span>
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '11px', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search client reviews by name, role, or text…"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="admin-control-input"
                            style={{ paddingLeft: '34px', fontSize: '13px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                            className="admin-control-select"
                            value={ratingFilter}
                            onChange={(e) => {
                                setRatingFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{ padding: '8px 12px', fontSize: '12px', width: 'auto' }}
                        >
                            <option value="all">All Ratings ({testimonials.length})</option>
                            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                            <option value="3">⭐⭐⭐ (3 Stars)</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredTestimonials.length === 0 ? (
                <div className="admin-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>⭐</div>
                    <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>No reviews found</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 16px' }}>
                        {searchTerm ? `No results for "${searchTerm}".` : 'No reviews match your selected rating filter.'}
                    </p>
                    <button className="admin-btn admin-btn-secondary" onClick={() => { setSearchTerm(''); setRatingFilter('all'); setCurrentPage(1); }}>
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px'
                }}>
                    {paginatedTestimonials.map((item) => (
                        <div
                            key={item.id}
                            className="admin-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #ff620b 100%)',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '800',
                                        fontSize: '15px'
                                    }}>
                                        {item.avatar || item.name[0]}
                                    </div>

                                    <div>
                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                                            {item.name}
                                        </h4>
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                            {item.role}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', color: '#f59e0b', gap: '2px' }}>
                                    {Array(item.rating || 5).fill(0).map((_, i) => (
                                        <Star key={i} size={14} fill="#f59e0b" />
                                    ))}
                                </div>
                            </div>

                            <p style={{
                                fontSize: '13px',
                                color: '#cbd5e1',
                                margin: 0,
                                lineHeight: 1.6,
                                fontStyle: 'italic',
                                flex: 1
                            }}>
                                "{item.review}"
                            </p>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '8px',
                                paddingTop: '12px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                            }}>
                                <button
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '6px 10px', fontSize: '12px' }}
                                    onClick={() => openEdit(item)}
                                >
                                    <Edit2 size={13} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    className="admin-btn admin-btn-danger"
                                    style={{ padding: '6px 10px', fontSize: '12px' }}
                                    onClick={() => handleDelete(item.id, item.name)}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredTestimonials.length > 0 && (
                <AdminPagination
                    currentPage={safeCurrentPage}
                    totalItems={filteredTestimonials.length}
                    pageSize={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                    }}
                    pageSizeOptions={[6, 12, 24, 48]}
                    itemLabel="testimonials"
                    theme="dark"
                />
            )}

            {/* Modal */}
            {modalMode && (
                <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
                    <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">
                                {modalMode === 'create' ? 'Add Client Testimonial' : 'Edit Testimonial'}
                            </h3>
                            <button className="admin-modal-close" onClick={() => setModalMode(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div className="admin-form-grid">
                                <div className="admin-field">
                                    <label className="admin-label">Client Name</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Priya Sharma"
                                    />
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">Role / Company</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Owner, StyleHub Boutique"
                                    />
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">Star Rating (1 - 5)</label>
                                    <select
                                        className="admin-control-select"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                    >
                                        <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                        <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                        <option value={3}>⭐⭐⭐ (3 Stars)</option>
                                    </select>
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">Avatar Initial</label>
                                    <input
                                        type="text"
                                        maxLength={2}
                                        className="admin-control-input"
                                        value={formData.avatar}
                                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                        placeholder="P"
                                    />
                                </div>

                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Review Quote</label>
                                    <textarea
                                        className="admin-control-textarea"
                                        rows={3}
                                        required
                                        value={formData.review}
                                        onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                        placeholder="Namustutam transformed our retail operations..."
                                    />
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalMode(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {modalMode === 'create' ? 'Add Review' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
