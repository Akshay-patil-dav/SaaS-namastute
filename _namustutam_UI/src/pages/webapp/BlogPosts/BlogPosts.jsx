import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, FileEdit, MessageSquare, Settings, ArrowUpDown, Trash2, Loader, Eye, EyeOff } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import '../../inventory/Brands/Products.css';
import '../../inventory/Brands/inventory-pages-custom.css';

export default function BlogPosts() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(`${ENV.API_BASE_URL}/blog-posts`);
            if (Array.isArray(res.data)) {
                setPosts(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch blog posts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) return;
        try {
            await apiClient.delete(`${ENV.API_BASE_URL}/blog-posts/${id}`);
            fetchPosts();
        } catch (err) {
            console.error('Failed to delete post', err);
            alert('Failed to delete the post.');
        }
    };

    const handleToggleVisibility = async (post) => {
        const newVisibility = post.visibility === 'Hidden' ? 'Visible' : 'Hidden';
        try {
            await apiClient.put(`${ENV.API_BASE_URL}/blog-posts/${post.id}`, { ...post, visibility: newVisibility });
            fetchPosts();
        } catch (err) {
            console.error('Failed to update visibility', err);
            alert('Failed to update visibility.');
        }
    };

    const handleDeleteSelected = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} blog posts?`)) return;

        try {
            for (let id of selectedIds) {
                await apiClient.delete(`${ENV.API_BASE_URL}/blog-posts/${id}`);
            }
            setSelectedIds([]);
            fetchPosts();
        } catch (err) {
            console.error('Failed to delete posts', err);
            alert('Failed to delete some posts.');
        }
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedIds(posts.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id, isChecked) => {
        if (isChecked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        } catch (e) {
            return dateString;
        }
    };

    const formatPublishDate = (dateString) => {
        if (!dateString) return '';
        try {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="product-page-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
            {/* Header */}
            <div className="ss-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div className="ss-page-title-area" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileEdit size={22} color="#334155" />
                    <h2 className="ss-page-title" style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>Blog posts</h2>
                </div>
                <div className="ss-header-actions" style={{ display: 'flex', gap: '12px' }}>
                    {selectedIds.length > 0 && (
                        <button onClick={handleDeleteSelected} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
                            <Trash2 size={16} /> Delete Selected
                        </button>
                    )}
                    <button style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <FileEdit size={16} /> Manage blogs
                    </button>
                    <button style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <MessageSquare size={16} /> Manage comments
                    </button>
                    <button onClick={() => navigate('/dashboard/add-blog-post')} style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}>
                        Add blog post
                    </button>
                </div>
            </div>

            {/* Main Panel */}
            <div className="ss-main-panel" style={{ background: '#fff', borderRadius: '12px', padding: '0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {/* Tabs & Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button style={{ background: '#f1f5f9', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', color: '#334155', cursor: 'pointer' }}>All</button>
                        <button style={{ background: 'transparent', border: 'none', padding: '6px', fontSize: '18px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                           <button style={{ background: '#fff', border: 'none', borderRight: '1px solid #e2e8f0', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <Search size={16} />
                            </button>
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ border: 'none', padding: '6px 10px', fontSize: '14px', outline: 'none' }}
                            />
                        </div>
                        <button style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <ArrowUpDown size={16} />
                        </button>
                    </div>
                </div>

                <div className="ss-table-wrapper" style={{ margin: 0 }}>
                    <table className="ss-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#475569', background: '#f8fafc' }}>
                                <th style={{ padding: '14px 16px', width: '40px' }}>
                                    <input 
                                        type="checkbox" 
                                        className="ss-checkbox" 
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                        checked={posts.length > 0 && selectedIds.length === posts.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Title</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Visibility</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Author</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600' }}>Blog</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Updated <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th style={{ padding: '14px 16px', fontWeight: '600', textAlign: 'right' }}>Published</th>
                                <th style={{ padding: '14px 16px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px' }}>
                                        <Loader className="spin" size={24} color="#64748b" style={{ margin: '0 auto' }} />
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                                        No blog posts found. Click "Add blog post" to create one.
                                    </td>
                                </tr>
                            ) : (
                                posts.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((post) => (
                                    <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <input 
                                                type="checkbox" 
                                                className="ss-checkbox" 
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                checked={selectedIds.includes(post.id)}
                                                onChange={(e) => handleSelectItem(post.id, e.target.checked)}
                                            />
                                        </td>
                                        <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '48px', height: '32px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                                {post.imageUrl ? (
                                                    <img src={`${ENV.API_BASE_URL.replace('/api', '')}${post.imageUrl}`} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8', fontSize: '10px' }}>No Img</div>
                                                )}
                                            </div>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{post.title}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ background: post.visibility === 'Visible' ? '#86efac' : '#e2e8f0', color: post.visibility === 'Visible' ? '#14532d' : '#475569', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>
                                                {post.visibility || 'Hidden'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: '#475569' }}>{post.author}</td>
                                        <td style={{ padding: '14px 16px', color: '#475569' }}>{post.blogCategory}</td>
                                        <td style={{ padding: '14px 16px', color: '#475569' }}>{formatDate(post.updatedAt)}</td>
                                        <td style={{ padding: '14px 16px', color: '#475569', textAlign: 'right' }}>{formatPublishDate(post.createdAt)}</td>
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => navigate(`/dashboard/edit-blog-post/${post.id}`)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#64748b', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Edit">
                                                    <FileEdit size={16} />
                                                </button>
                                                <button onClick={() => handleToggleVisibility(post)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#64748b', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title={post.visibility === 'Hidden' ? 'Show' : 'Hide'}>
                                                    {post.visibility === 'Hidden' ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                                <button onClick={() => handleDelete(post.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <a href="#" style={{ color: '#475569', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s', ':hover': { color: '#1e293b' } }}>Learn more about blog posts</a>
            </div>
        </div>
    );
}
