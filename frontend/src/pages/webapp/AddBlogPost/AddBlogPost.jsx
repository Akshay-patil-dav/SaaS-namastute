import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, FileEdit, Sparkles, Image as ImageIcon, Link as LinkIcon, Bold, Italic, Underline, List, Type, Video, LayoutList, ChevronDown, Eye, Calendar, Loader } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import '../../inventory/Brands/Products.css';
import '../../inventory/Brands/inventory-pages-custom.css';

export default function AddBlogPost() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [visibility, setVisibility] = useState('Visible');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState('Akshay Patil');
    const [blogCategory, setBlogCategory] = useState('News');
    const [tags, setTags] = useState('');
    const [themeTemplate, setThemeTemplate] = useState('');

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingImage(true);
        try {
            const res = await apiClient.post(`${ENV.API_BASE_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data && res.data.url) {
                // Prepend API base URL or handle relative path if needed based on backend logic
                setImageUrl(res.data.url);
            }
        } catch (err) {
            console.error('Image upload failed', err);
            alert('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title,
                content,
                excerpt,
                seoTitle,
                seoDescription,
                visibility,
                imageUrl,
                author,
                blogCategory,
                tags,
                themeTemplate
            };
            await apiClient.post(`${ENV.API_BASE_URL}/blog-posts`, payload);
            navigate('/dashboard/blog-posts');
        } catch (err) {
            console.error('Failed to save blog post', err);
            alert('Failed to save blog post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-page-container" style={{ background: '#f1f5f9', minHeight: '100vh', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569', padding: 0 }}>
                    <ArrowLeft size={18} />
                </button>
                <FileEdit size={18} color="#475569" />
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Add blog post</h2>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Left Column */}
                <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Main Content Card */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Title</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Blog about your latest products or deals" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outlineColor: '#3b82f6' }}
                                />
                                <Sparkles size={16} color="#94a3b8" style={{ position: 'absolute', right: '14px', top: '12px' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Content</label>
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                                {/* Toolbar */}
                                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #cbd5e1', background: '#f8fafc', gap: '12px', flexWrap: 'wrap' }}>
                                    <Sparkles size={16} color="#64748b" />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#475569', fontSize: '13px', fontWeight: '500' }}>
                                        Paragraph <ChevronDown size={14} />
                                    </div>
                                    <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }}></div>
                                    <div style={{ display: 'flex', gap: '10px', color: '#475569' }}>
                                        <Bold size={16} style={{ cursor: 'pointer' }} />
                                        <Italic size={16} style={{ cursor: 'pointer' }} />
                                        <Underline size={16} style={{ cursor: 'pointer' }} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
                                            <Type size={16} /><ChevronDown size={14} />
                                        </div>
                                    </div>
                                    <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }}></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#475569', cursor: 'pointer' }}>
                                        <LayoutList size={16} /><ChevronDown size={14} />
                                    </div>
                                    <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }}></div>
                                    <div style={{ display: 'flex', gap: '10px', color: '#475569' }}>
                                        <LinkIcon size={16} style={{ cursor: 'pointer' }} />
                                        <ImageIcon size={16} style={{ cursor: 'pointer' }} />
                                        <Video size={16} style={{ cursor: 'pointer' }} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
                                            <List size={16} /><ChevronDown size={14} />
                                        </div>
                                        <span style={{ fontSize: '14px', letterSpacing: '2px', fontWeight: 'bold', cursor: 'pointer' }}>...</span>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: '#475569', cursor: 'pointer' }}>
                                        <span style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '600' }}>&lt;/&gt;</span>
                                    </div>
                                </div>
                                {/* Editor Area */}
                                <textarea 
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    style={{ width: '100%', height: '250px', border: 'none', padding: '16px', fontSize: '14px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Excerpt Card */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Excerpt</h3>
                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Add a summary of the post to appear on your home page or blog.</p>
                            </div>
                            <Edit2 size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
                        </div>
                        <textarea 
                            value={excerpt}
                            onChange={e => setExcerpt(e.target.value)}
                            placeholder="Write excerpt here..."
                            style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outlineColor: '#3b82f6', resize: 'vertical' }}
                        ></textarea>
                    </div>

                    {/* Search engine listing Card */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Search engine listing</h3>
                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Add a title and description to see how this blog post might appear in a search engine listing</p>
                            </div>
                            <Edit2 size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input 
                                type="text"
                                value={seoTitle}
                                onChange={e => setSeoTitle(e.target.value)}
                                placeholder="SEO Title"
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outlineColor: '#3b82f6' }}
                            />
                            <textarea 
                                value={seoDescription}
                                onChange={e => setSeoDescription(e.target.value)}
                                placeholder="SEO Description..."
                                style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outlineColor: '#3b82f6', resize: 'vertical' }}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Visibility */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Visibility</h3>
                            <Calendar size={16} color="#64748b" style={{ cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
                                <input type="radio" name="visibility" value="Visible" checked={visibility === 'Visible'} onChange={e => setVisibility(e.target.value)} style={{ width: '16px', height: '16px', accentColor: '#1e293b', cursor: 'pointer' }} />
                                Visible
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
                                <input type="radio" name="visibility" value="Hidden" checked={visibility === 'Hidden'} onChange={e => setVisibility(e.target.value)} style={{ width: '16px', height: '16px', accentColor: '#1e293b', cursor: 'pointer' }} />
                                Hidden
                            </label>
                        </div>
                    </div>

                    {/* Image */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Image</h3>
                        {imageUrl ? (
                            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                <img src={`${ENV.API_BASE_URL.replace('/api', '')}${imageUrl}`} alt="Blog feature" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                                <button onClick={() => setImageUrl('')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                            </div>
                        ) : (
                            <label style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '32px 16px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'border-color 0.2s', display: 'block' }}>
                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                {uploadingImage ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#334155' }}>
                                        <Loader className="spin" size={16} /> Uploading...
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#334155', display: 'inline-block', marginBottom: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Add image</div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>or drop an image to upload</p>
                                    </>
                                )}
                            </label>
                        )}
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
                    </div>

                    {/* Organization */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Organization</h3>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Author</label>
                            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outlineColor: '#3b82f6' }} />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Blog</label>
                            <div style={{ position: 'relative' }}>
                                <select value={blogCategory} onChange={e => setBlogCategory(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', appearance: 'none', background: '#fff', outlineColor: '#3b82f6', cursor: 'pointer' }}>
                                    <option value="News">News</option>
                                    <option value="Tutorial">Tutorial</option>
                                    <option value="Announcement">Announcement</option>
                                </select>
                                <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '10px', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Tags</label>
                            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Comma separated..." style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outlineColor: '#3b82f6' }} />
                        </div>
                    </div>

                    {/* Theme template */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Theme template</h3>
                            <Eye size={16} color="#64748b" style={{ cursor: 'pointer' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select value={themeTemplate} onChange={e => setThemeTemplate(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', appearance: 'none', background: '#fff', outlineColor: '#3b82f6', cursor: 'pointer' }}>
                                <option value="">Default</option>
                                <option value="Full Width">Full Width</option>
                            </select>
                            <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '10px', pointerEvents: 'none' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button 
                    onClick={handleSave} 
                    disabled={loading || uploadingImage} 
                    style={{ background: (loading || uploadingImage) ? '#94a3b8' : '#334155', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {loading && <Loader className="spin" size={14} />}
                    Save
                </button>
            </div>
        </div>
    );
}
