import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../BlogPage.css';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const CATEGORIES = ['Software', 'Development', 'Business', 'Updates', 'Tutorial'];
const COVER_EMOJIS = ['📦','🏗️','🛒','🚀','🏷️','📉','📊','🔒','👥','💡','🌐','⚙️','📱','🎯','💰','📝','🔥','✨'];
const COVER_COLORS = [
    'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
    'linear-gradient(135deg,#10b981 0%,#06b6d4 100%)',
    'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)',
    'linear-gradient(135deg,#ff902f 0%,#ff5f1f 100%)',
    'linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)',
    'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)',
    'linear-gradient(135deg,#84cc16 0%,#10b981 100%)',
    'linear-gradient(135deg,#f43f5e 0%,#f97316 100%)',
];

const CATEGORY_COLORS = {
    Software:    { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
    Development: { bg: 'rgba(16,185,129,0.10)', color: '#059669' },
    Business:    { bg: 'rgba(245,158,11,0.10)', color: '#d97706' },
    Updates:     { bg: 'rgba(255,144,47,0.10)', color: '#ff6b1a' },
    Tutorial:    { bg: 'rgba(236,72,153,0.10)', color: '#db2777' },
};

function genId() { return 'b' + Date.now() + Math.random().toString(36).slice(2, 7); }
function genSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function loadBlogs() {
    try { return JSON.parse(localStorage.getItem('namastute_blogs') || '[]'); }
    catch { return []; }
}
function saveBlogs(blogs) {
    localStorage.setItem('namastute_blogs', JSON.stringify(blogs));
}

/* ── Initial Form State ──────────────────────────────────────────────────── */
const EMPTY_FORM = {
    title: '',
    excerpt: '',
    content: '',
    category: 'Software',
    author: '',
    authorRole: '',
    readTime: '5 min',
    tags: '',
    coverEmoji: '📦',
    coverColor: COVER_COLORS[0],
};

/* ── Blog Form Modal ─────────────────────────────────────────────────────── */
function BlogFormModal({ initial, onSave, onClose }) {
    const [form, setForm] = useState(initial || EMPTY_FORM);
    const [tab, setTab] = useState('write'); // 'write' | 'preview'
    const [errors, setErrors] = useState({});

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const validate = () => {
        const e = {};
        if (!form.title.trim())    e.title   = 'Title is required';
        if (!form.excerpt.trim())  e.excerpt  = 'Excerpt is required';
        if (!form.content.trim())  e.content  = 'Content is required';
        if (!form.author.trim())   e.author   = 'Author is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const slug = genSlug(form.title);
        const tags = form.tags ? form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];
        const id = initial?.id || genId();
        const date = initial?.date || new Date().toISOString().slice(0, 10);
        onSave({ ...form, id, slug, tags, date });
    };

    /* Simple markdown preview */
    const preview = (form.content || '')
        .replace(/^## (.+)$/gm, '<h2 style="font-weight:700;margin:16px 0 8px;font-size:18px">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 style="font-weight:600;margin:12px 0 6px;font-size:15px">$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code style="background:rgba(255,144,47,0.1);padding:1px 6px;border-radius:4px;font-size:13px">$1</code>')
        .replace(/^- (.+)$/gm, '<li style="margin-bottom:4px">$1</li>')
        .replace(/\n\n/g, '<br/><br/>');

    return (
        <div className="blog-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="blog-modal">
                <div className="blog-modal-header">
                    <div>
                        <div className="blog-modal-title">{initial ? 'Edit Article' : 'New Article'}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                            {initial ? 'Update the blog post details below.' : 'Fill in the details to create a new blog post.'}
                        </div>
                    </div>
                    <button className="blog-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="blog-modal-body">
                    {/* Title */}
                    <div style={{ marginBottom: 14 }}>
                        <div className="blog-form-group">
                            <label className="blog-form-label">Title *</label>
                            <input
                                id="blog-form-title"
                                className="blog-form-input"
                                value={form.title}
                                onChange={e => set('title', e.target.value)}
                                placeholder="e.g. How to Set Up Your First POS System"
                            />
                            {errors.title && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.title}</span>}
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div style={{ marginBottom: 14 }}>
                        <div className="blog-form-group">
                            <label className="blog-form-label">Excerpt / Summary *</label>
                            <textarea
                                id="blog-form-excerpt"
                                className="blog-form-textarea"
                                style={{ minHeight: 72 }}
                                value={form.excerpt}
                                onChange={e => set('excerpt', e.target.value)}
                                placeholder="A short 1–2 sentence summary shown on the blog listing page."
                            />
                            {errors.excerpt && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.excerpt}</span>}
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ marginBottom: 14 }}>
                        <div className="blog-preview-tab-row">
                            <button className={`blog-preview-tab ${tab === 'write' ? 'active' : ''}`} onClick={() => setTab('write')}>✍️ Write</button>
                            <button className={`blog-preview-tab ${tab === 'preview' ? 'active' : ''}`} onClick={() => setTab('preview')}>👁 Preview</button>
                        </div>
                        {tab === 'write' ? (
                            <div className="blog-form-group">
                                <textarea
                                    id="blog-form-content"
                                    className="blog-form-textarea"
                                    value={form.content}
                                    onChange={e => set('content', e.target.value)}
                                    placeholder={`Write your article in Markdown.\n\n## Introduction\n\nStart your article here...\n\n## Main Section\n\n- Point one\n- Point two\n\n## Conclusion\n\nWrap up your thoughts.`}
                                />
                                <span className="blog-form-hint">Supports Markdown: ## Heading, **bold**, `code`, - list items</span>
                            </div>
                        ) : (
                            <div className="blog-preview-box" dangerouslySetInnerHTML={{ __html: preview || '<em style="color:#94a3b8">Nothing to preview yet…</em>' }} />
                        )}
                        {errors.content && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.content}</span>}
                    </div>

                    {/* Author + Category row */}
                    <div className="blog-form-grid" style={{ marginBottom: 14 }}>
                        <div className="blog-form-group">
                            <label className="blog-form-label">Author Name *</label>
                            <input id="blog-form-author" className="blog-form-input" value={form.author} onChange={e => set('author', e.target.value)} placeholder="e.g. Akshay Patil" />
                            {errors.author && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.author}</span>}
                        </div>
                        <div className="blog-form-group">
                            <label className="blog-form-label">Author Role</label>
                            <input id="blog-form-role" className="blog-form-input" value={form.authorRole} onChange={e => set('authorRole', e.target.value)} placeholder="e.g. Founder & CTO" />
                        </div>
                        <div className="blog-form-group">
                            <label className="blog-form-label">Category</label>
                            <select id="blog-form-category" className="blog-form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="blog-form-group">
                            <label className="blog-form-label">Read Time</label>
                            <input id="blog-form-readtime" className="blog-form-input" value={form.readTime} onChange={e => set('readTime', e.target.value)} placeholder="e.g. 5 min" />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="blog-form-group" style={{ marginBottom: 20 }}>
                        <label className="blog-form-label">Tags (comma separated)</label>
                        <input id="blog-form-tags" className="blog-form-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. inventory, saas, retail" />
                    </div>

                    {/* Emoji + Color */}
                    <div className="blog-form-grid" style={{ marginBottom: 4 }}>
                        <div className="blog-form-group">
                            <label className="blog-form-label">Cover Emoji</label>
                            <div className="blog-form-emoji-grid">
                                {COVER_EMOJIS.map(em => (
                                    <button key={em} className={`blog-form-emoji-btn ${form.coverEmoji === em ? 'selected' : ''}`} onClick={() => set('coverEmoji', em)} title={em} type="button">{em}</button>
                                ))}
                            </div>
                        </div>
                        <div className="blog-form-group">
                            <label className="blog-form-label">Cover Color</label>
                            <div className="blog-form-color-grid">
                                {COVER_COLORS.map((c, i) => (
                                    <button
                                        key={i}
                                        className={`blog-form-color-btn ${form.coverColor === c ? 'selected' : ''}`}
                                        style={{ background: c }}
                                        onClick={() => set('coverColor', c)}
                                        title={`Color ${i + 1}`}
                                        type="button"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="blog-modal-footer">
                    <button className="lp-btn-ghost" onClick={onClose}>Cancel</button>
                    <button id="blog-form-save" className="lp-btn-primary" onClick={handleSave}>
                        {initial ? 'Save Changes' : '✓ Publish Article'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Delete Confirm ──────────────────────────────────────────────────────── */
function DeleteConfirm({ blog, onConfirm, onClose }) {
    return (
        <div className="blog-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="blog-modal" style={{ maxWidth: 420 }}>
                <div className="blog-modal-header">
                    <div className="blog-modal-title" style={{ color: '#ef4444' }}>🗑 Delete Article</div>
                    <button className="blog-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="blog-modal-body">
                    <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.65 }}>
                        Are you sure you want to delete <strong>"{blog.title}"</strong>? This action cannot be undone.
                    </p>
                </div>
                <div className="blog-modal-footer">
                    <button className="lp-btn-ghost" onClick={onClose}>Cancel</button>
                    <button id="blog-delete-confirm-btn" className="admin-blog-action-btn delete" style={{ padding: '9px 20px', fontSize: 14 }} onClick={onConfirm}>
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Main Admin Blog Page ─────────────────────────────────────────────────── */
export default function AdminBlog() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState(loadBlogs);
    const [showModal, setShowModal] = useState(false);
    const [editBlog, setEditBlog] = useState(null);
    const [deleteBlog, setDeleteBlog] = useState(null);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = (blog) => {
        setBlogs(prev => {
            const existing = prev.findIndex(b => b.id === blog.id);
            let updated;
            if (existing >= 0) {
                updated = [...prev];
                updated[existing] = blog;
                showToast('Article updated successfully!');
            } else {
                updated = [blog, ...prev];
                showToast('Article published successfully!');
            }
            saveBlogs(updated);
            return updated;
        });
        setShowModal(false);
        setEditBlog(null);
    };

    const handleDelete = () => {
        if (!deleteBlog) return;
        setBlogs(prev => {
            const updated = prev.filter(b => b.id !== deleteBlog.id);
            saveBlogs(updated);
            return updated;
        });
        showToast('Article deleted.', 'error');
        setDeleteBlog(null);
    };

    const openEdit = (blog) => { setEditBlog(blog); setShowModal(true); };
    const openNew  = () => { setEditBlog(null); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditBlog(null); };

    // Filter
    const filtered = blogs.filter(b => {
        const matchCat = catFilter === 'All' || b.category === catFilter;
        const q = search.toLowerCase();
        const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    // Stats
    const totalBlogs = blogs.length;
    const catCounts = CATEGORIES.reduce((acc, c) => { acc[c] = blogs.filter(b => b.category === c).length; return acc; }, {});
    const latestDate = blogs.length > 0
        ? new Date(Math.max(...blogs.map(b => new Date(b.date || 0)))).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';

    return (
        <div className="admin-blog-root">
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 80, right: 24, zIndex: 9999,
                    background: toast.type === 'error' ? '#ef4444' : 'var(--gradient)',
                    color: 'white', padding: '12px 24px', borderRadius: 12,
                    fontWeight: 700, fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    animation: 'blog-modal-in 0.3s ease both',
                }}>
                    {toast.type === 'error' ? '🗑 ' : '✓ '}{toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="admin-blog-header">
                <div>
                    <div className="admin-blog-title">📝 Blog Manager</div>
                    <div className="admin-blog-sub">Create and manage your blog articles visible on the public landing page.</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                        id="admin-blog-view-live"
                        className="lp-btn-ghost"
                        onClick={() => navigate('/blog')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        🌐 View Live Blog
                    </button>
                    <button
                        id="admin-blog-new"
                        className="lp-btn-primary"
                        onClick={openNew}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        + New Article
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="admin-blog-stats">
                <div className="admin-blog-stat">
                    <div className="admin-blog-stat-num">{totalBlogs}<span>✍</span></div>
                    <div className="admin-blog-stat-label">Total Articles</div>
                </div>
                {CATEGORIES.slice(0, 4).map(cat => (
                    <div key={cat} className="admin-blog-stat">
                        <div className="admin-blog-stat-num" style={{ color: CATEGORY_COLORS[cat]?.color }}>{catCounts[cat] || 0}</div>
                        <div className="admin-blog-stat-label">{cat}</div>
                    </div>
                ))}
                <div className="admin-blog-stat">
                    <div className="admin-blog-stat-num" style={{ fontSize: 18, fontWeight: 700 }}>{latestDate}</div>
                    <div className="admin-blog-stat-label">Last Published</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="admin-blog-toolbar">
                <div className="admin-blog-search-wrap">
                    <span className="admin-blog-search-icon">🔍</span>
                    <input
                        id="admin-blog-search"
                        type="text"
                        className="admin-blog-search"
                        placeholder="Search articles…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    id="admin-blog-cat-filter"
                    className="admin-blog-filter-select"
                    value={catFilter}
                    onChange={e => setCatFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                    {filtered.length} article{filtered.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Table */}
            <div className="admin-blog-table-wrap">
                {filtered.length === 0 ? (
                    <div className="admin-blog-empty">
                        <div className="admin-blog-empty-icon">📭</div>
                        <p>{blogs.length === 0 ? 'No articles yet. Create your first one!' : 'No articles match your search.'}</p>
                        {blogs.length === 0 && (
                            <button id="admin-blog-empty-new" className="lp-btn-primary" onClick={openNew}>+ Write First Article</button>
                        )}
                    </div>
                ) : (
                    <table className="admin-blog-table">
                        <thead>
                            <tr>
                                <th style={{ width: 56 }}></th>
                                <th>Article</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Read Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(blog => {
                                const cat = CATEGORY_COLORS[blog.category];
                                return (
                                    <tr key={blog.id}>
                                        <td>
                                            <div className="admin-blog-row-cover" style={{ background: blog.coverColor }}>
                                                {blog.coverEmoji}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-blog-row-title">{blog.title}</div>
                                            <div className="admin-blog-row-excerpt">{blog.excerpt}</div>
                                        </td>
                                        <td>
                                            <span className="blog-card-cat" style={{ background: cat?.bg, color: cat?.color }}>
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{blog.author}</td>
                                        <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                            {blog.date ? new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{blog.readTime}</td>
                                        <td>
                                            <div className="admin-blog-actions">
                                                <button
                                                    id={`blog-view-${blog.id}`}
                                                    className="admin-blog-action-btn view"
                                                    onClick={() => navigate(`/blog/${blog.slug}`, { state: { blog } })}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    id={`blog-edit-${blog.id}`}
                                                    className="admin-blog-action-btn edit"
                                                    onClick={() => openEdit(blog)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    id={`blog-delete-${blog.id}`}
                                                    className="admin-blog-action-btn delete"
                                                    onClick={() => setDeleteBlog(blog)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            {showModal && (
                <BlogFormModal
                    initial={editBlog ? { ...editBlog, tags: (editBlog.tags || []).join(', ') } : null}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}
            {deleteBlog && (
                <DeleteConfirm
                    blog={deleteBlog}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteBlog(null)}
                />
            )}
        </div>
    );
}
