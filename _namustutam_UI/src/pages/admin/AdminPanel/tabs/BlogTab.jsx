import React, { useState, useEffect } from 'react';
import { 
    BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, Search, 
    Upload, ExternalLink, X, Check, Clock, Heart, RefreshCw, Sparkles,
    Bold, Italic, List, Code, Quote, Link2, FileText, Palette,
    Settings, Image as ImageIcon, ChevronRight, Hash, Send, Wand2, ArrowRight, Copy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import apiClient, { ENV } from '../../../../api/config';
import AdminPagination from '../components/AdminPagination';

const renderMarkdownImage = ({ node, src, alt, ...props }) => {
    const resolvedSrc = src?.startsWith('/') && !src.startsWith('//')
        ? `${ENV.BACKEND_BASE_URL || ''}${src}`
        : src;
    return (
        <figure style={{ margin: '20px 0', textAlign: 'center' }}>
            <img
                src={resolvedSrc}
                alt={alt || 'Blog illustration'}
                loading="lazy"
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
                    margin: '0 auto',
                    display: 'block'
                }}
                {...props}
            />
            {alt && (
                <figcaption style={{ marginTop: '6px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                    {alt}
                </figcaption>
            )}
        </figure>
    );
};

const renderMarkdownLink = ({ node, href, children, ...props }) => {
    const isDirectImage = typeof href === 'string' && (
        /\.(jpeg|jpg|gif|png|webp|svg|avif|bmp)($|\?)/i.test(href) ||
        href.includes('images.unsplash.com') ||
        href.includes('res.cloudinary.com') ||
        href.includes('imgur.com') ||
        href.includes('images.pexels.com') ||
        href.startsWith('/uploads/')
    );
    const childStr = Array.isArray(children) ? children.join('') : (children?.toString() || '');
    if (isDirectImage && (!childStr || childStr === href || childStr.startsWith('http') || childStr.startsWith('/uploads/'))) {
        return renderMarkdownImage({ node, src: href, alt: 'Blog Visual' });
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#ff620b', textDecoration: 'underline' }} {...props}>
            {children}
        </a>
    );
};

const formatBlogContentForDisplay = (content) => {
    if (!content) return '';
    // Automatically turn any standalone image URL line into an embedded markdown image
    return content.replace(
        /(^|\n)(https?:\/\/[^\s]+?\.(?:png|jpe?g|webp|gif|svg|avif|bmp)(?:\?[^\s]*)?|\/uploads\/[^\s]+?\.(?:png|jpe?g|webp|gif|svg|avif)|https?:\/\/(?:images\.unsplash\.com|res\.cloudinary\.com|images\.pexels\.com|imgur\.com)[^\s]+)(\n|$)/gi,
        (match, p1, url, p3) => `${p1}![Blog Visual](${url})${p3}`
    );
};

const GRADIENT_PRESETS = [
    { name: 'Indigo Tech', value: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', cat: 'Software' },
    { name: 'Emerald Code', value: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', cat: 'Development' },
    { name: 'Flame Sunset', value: 'linear-gradient(135deg, #ff5b00 0%, #f59e0b 100%)', cat: 'Updates' },
    { name: 'Royal Violet', value: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', cat: 'Business' },
    { name: 'Cyber Neon', value: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', cat: 'Software' },
    { name: 'Amber Gold', value: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', cat: 'Business' },
    { name: 'Midnight Dark', value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', cat: 'Software' },
    { name: 'Rose Blossom', value: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', cat: 'Updates' },
];

const EMOJI_PRESETS = [
    '📦', '💻', '⚡', '📈', '🚀', '📚', '📰', '🛡️', '🌐', '🛒', '💡', '🔥', '⚙️', '🏗️'
];

const SUGGESTED_TAGS = [
    'spring boot', 'react', 'saas', 'architecture', 'cloud', 'devops', 'microservices', 'pos', 'api', 'fullstack'
];

const READ_TIME_PRESETS = ['3 min', '5 min', '8 min', '12 min', '15 min'];

const generateSlug = (text) => {
    return (text || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

function resolveCoverEmoji(b) {
    if (b?.coverEmoji && !b.coverEmoji.includes('?')) {
        return b.coverEmoji;
    }
    const cat = (b?.category || '').toLowerCase();
    switch (cat) {
        case 'software': return '💻';
        case 'development': return '⚡';
        case 'business': return '📈';
        case 'updates': return '🚀';
        case 'tutorial': return '📚';
        case 'news': return '📰';
        default: return '✨';
    }
}

export default function BlogTab() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // Modal state
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
    const [editingItem, setEditingItem] = useState(null);
    const [modalTab, setModalTab] = useState('editor'); // 'editor' | 'visuals' | 'meta' | 'preview'
    const [editorMode, setEditorMode] = useState('write'); // 'write' | 'preview'
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Media & Image Gallery state
    const [articleImages, setArticleImages] = useState([]);
    const [showMediaManager, setShowMediaManager] = useState(true);
    const [mediaTab, setMediaTab] = useState('upload'); // 'upload' | 'link'
    const [inputImageUrl, setInputImageUrl] = useState('');
    const [inputImageCaption, setInputImageCaption] = useState('');
    const [showQuickUrlBar, setShowQuickUrlBar] = useState(false);
    const [quickImageUrl, setQuickImageUrl] = useState('');
    const [quickImageCaption, setQuickImageCaption] = useState('');
    const [uploadProgress, setUploadProgress] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // Form fields
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Software',
        author: 'Akshay Patil',
        authorRole: 'Founder & CTO',
        imageUrl: '',
        coverColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        coverEmoji: '📦',
        readTime: '5 min',
        tags: '',
        visibility: 'Visible',
        seoTitle: '',
        seoDescription: ''
    });

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/blog-posts');
            if (Array.isArray(res.data)) {
                setPosts(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch posts in BlogTab', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const openCreate = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '## Overview\n\nWrite your article here using Markdown formatting.\n\n## Key Architecture\n\nExplain technical or business decisions here.\n\n- Key Point 1\n- Key Point 2\n\n## Conclusion\n\nFinal thoughts and takeaways.',
            category: 'Software',
            author: 'Akshay Patil',
            authorRole: 'Founder & CTO',
            imageUrl: '',
            coverColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            coverEmoji: '📦',
            readTime: '5 min',
            tags: 'software, architecture, pos',
            visibility: 'Visible',
            seoTitle: '',
            seoDescription: ''
        });
        setArticleImages([]);
        setInputImageUrl('');
        setInputImageCaption('');
        setShowQuickUrlBar(false);
        setQuickImageUrl('');
        setQuickImageCaption('');
        setShowMediaManager(true);
        setModalTab('editor');
        setEditorMode('write');
        setModalMode('create');
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            slug: item.slug || '',
            excerpt: item.excerpt || '',
            content: item.content || '',
            category: item.category || 'Software',
            author: item.author || 'Akshay Patil',
            authorRole: item.authorRole || 'Founder & CTO',
            imageUrl: item.imageUrl || '',
            coverColor: item.coverColor || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            coverEmoji: item.coverEmoji || '📦',
            readTime: item.readTime || '5 min',
            tags: item.tags || '',
            visibility: item.visibility || 'Visible',
            seoTitle: item.seoTitle || '',
            seoDescription: item.seoDescription || ''
        });

        // Scan for existing images in content or cover
        const matches = [...(item.content || '').matchAll(/!\[(.*?)\]\((.*?)\)/g)];
        const initialImages = matches.map((m, i) => ({
            id: 'img_' + i + '_' + Date.now(),
            url: m[2],
            caption: m[1] || 'Blog Image',
            source: 'content'
        }));
        if (item.imageUrl && !initialImages.some(img => img.url === item.imageUrl)) {
            initialImages.unshift({
                id: 'cover_' + Date.now(),
                url: item.imageUrl,
                caption: 'Cover Image',
                source: 'cover'
            });
        }
        setArticleImages(initialImages);
        setInputImageUrl('');
        setInputImageCaption('');
        setShowQuickUrlBar(false);
        setQuickImageUrl('');
        setQuickImageCaption('');
        setShowMediaManager(initialImages.length > 0);
        setModalTab('editor');
        setEditorMode('write');
        setModalMode('edit');
    };

    const handleAutoSlug = () => {
        if (!formData.title) return;
        setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }));
    };

    const handleQuickTag = (tag) => {
        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        if (currentTags.includes(tag)) {
            const nextTags = currentTags.filter(t => t !== tag).join(', ');
            setFormData(prev => ({ ...prev, tags: nextTags }));
        } else {
            const nextTags = [...currentTags, tag].join(', ');
            setFormData(prev => ({ ...prev, tags: nextTags }));
        }
    };

    const insertMarkdown = (before, after = '') => {
        const textarea = document.getElementById('blog-modal-content-editor');
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousContent = formData.content || '';
        const selectedText = previousContent.substring(start, end);
        const replacement = `${before}${selectedText || 'text'}${after}`;
        const nextContent = previousContent.substring(0, start) + replacement + previousContent.substring(end);
        setFormData(prev => ({ ...prev, content: nextContent }));
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + (selectedText.length || 4));
        }, 10);
    };

    // Single Cover Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        setUploading(true);
        try {
            const res = await apiClient.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.url) {
                const url = res.data.url;
                setFormData(prev => ({ ...prev, imageUrl: url }));
                // Also add to article gallery
                setArticleImages(prev => [
                    { id: 'cover_' + Date.now(), url, caption: file.name, source: 'upload' },
                    ...prev.filter(img => img.url !== url)
                ]);
            }
        } catch (err) {
            console.error('Image upload failed', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Multiple Images Upload
    const handleMultiImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        const uploadedItems = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadData = new FormData();
            uploadData.append('file', file);
            setUploadProgress(`Uploading ${i + 1} of ${files.length} (${file.name})…`);
            try {
                const res = await apiClient.post('/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data?.url) {
                    uploadedItems.push({
                        id: 'up_' + Date.now() + '_' + i,
                        url: res.data.url,
                        caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                        source: 'upload'
                    });
                }
            } catch (err) {
                console.error('Failed to upload ' + file.name, err);
            }
        }

        if (uploadedItems.length > 0) {
            setArticleImages(prev => [...uploadedItems, ...prev]);
            // If user hasn't set a cover image yet, set the first uploaded one as cover
            setFormData(prev => (!prev.imageUrl ? { ...prev, imageUrl: uploadedItems[0].url } : prev));
        }

        setUploading(false);
        setUploadProgress('');
        e.target.value = '';
    };

    // Add Image by Link/URL
    const handleAddImageByUrl = (insertImmediately = true) => {
        if (!inputImageUrl.trim()) {
            alert('Please enter an image URL');
            return;
        }
        const cleanUrl = inputImageUrl.trim();
        const caption = inputImageCaption.trim() || 'Blog Illustration';
        const newImg = {
            id: 'link_' + Date.now(),
            url: cleanUrl,
            caption: caption,
            source: 'link'
        };
        setArticleImages(prev => [newImg, ...prev]);
        if (insertImmediately) {
            insertImageToContent(cleanUrl, caption);
        }
        setFormData(prev => (!prev.imageUrl ? { ...prev, imageUrl: cleanUrl } : prev));
        setInputImageUrl('');
        setInputImageCaption('');
    };

    // Insert Image Markdown into Editor
    const insertImageToContent = (url, caption = 'Blog Illustration') => {
        const markdownTag = `\n\n![${caption}](${url})\n\n`;
        const textarea = document.getElementById('blog-modal-content-editor');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const prevContent = formData.content || '';
            const nextContent = prevContent.substring(0, start) + markdownTag + prevContent.substring(end);
            setFormData(prev => ({ ...prev, content: nextContent }));
            setTimeout(() => {
                textarea.focus();
                const newPos = start + markdownTag.length;
                textarea.setSelectionRange(newPos, newPos);
            }, 10);
        } else {
            setFormData(prev => ({
                ...prev,
                content: (prev.content ? prev.content.trimEnd() : '') + markdownTag
            }));
        }
    };

    // Bulk Insert All Images into Editor
    const insertAllImagesToContent = () => {
        if (articleImages.length === 0) return;
        const allTags = articleImages.map(img => `![${img.caption || 'Illustration'}](${img.url})`).join('\n\n');
        setFormData(prev => ({
            ...prev,
            content: (prev.content ? prev.content.trimEnd() + '\n\n' : '') + allTags + '\n\n'
        }));
    };

    // Quick Insert Image URL into Editor at Cursor
    const handleInsertQuickUrl = () => {
        const url = quickImageUrl.trim();
        if (!url) {
            alert('Please paste or type an image URL first');
            return;
        }
        const caption = quickImageCaption.trim() || 'Blog Visual';
        insertImageToContent(url, caption);
        setArticleImages(prev => {
            if (prev.some(img => img.url === url)) return prev;
            return [{
                id: 'url_' + Date.now(),
                url: url,
                caption: caption,
                source: 'quick-url'
            }, ...prev];
        });
        setQuickImageUrl('');
        setQuickImageCaption('');
        setShowQuickUrlBar(false);
    };

    // Automatic Smart Paste (Ctrl+V) of Image URLs into Editor
    const handleContentPaste = (e) => {
        const text = e.clipboardData?.getData('text/plain')?.trim();
        if (!text) return;

        // Detect if pasted string is a direct image URL
        const isDirectImage = (
            /^(https?:\/\/|\/uploads\/)[^\s]+$/i.test(text) &&
            (
                /\.(jpeg|jpg|gif|png|webp|svg|avif|bmp)($|\?)/i.test(text) ||
                text.includes('images.unsplash.com') ||
                text.includes('res.cloudinary.com') ||
                text.includes('imgur.com') ||
                text.includes('images.pexels.com') ||
                text.includes('postimg.cc') ||
                text.startsWith('/uploads/')
            )
        );

        if (isDirectImage) {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart ?? (formData.content || '').length;
            const end = textarea.selectionEnd ?? start;
            const prev = formData.content || '';

            // Derive meaningful caption from filename or url
            let autoCaption = 'Blog Visual';
            try {
                const parsedUrl = new URL(text, window.location.origin);
                const segments = parsedUrl.pathname.split('/').filter(Boolean);
                const lastSeg = segments[segments.length - 1];
                if (lastSeg && !lastSeg.startsWith('photo-')) {
                    autoCaption = decodeURIComponent(lastSeg.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                } else if (text.includes('unsplash.com')) {
                    autoCaption = 'Photo from Unsplash';
                }
            } catch (_) {
                autoCaption = 'Blog Visual';
            }

            const before = prev.substring(0, start);
            const after = prev.substring(end);
            const padBefore = before.length === 0 || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
            const padAfter = after.length === 0 || after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';

            const mdTag = `${padBefore}![${autoCaption}](${text})${padAfter}`;
            const newContent = before + mdTag + after;

            setFormData(prevData => ({ ...prevData, content: newContent }));

            // Register in gallery
            setArticleImages(prevImgs => {
                if (prevImgs.some(img => img.url === text)) return prevImgs;
                return [{
                    id: 'pasted_' + Date.now(),
                    url: text,
                    caption: autoCaption,
                    source: 'pasted-url'
                }, ...prevImgs];
            });

            setTimeout(() => {
                textarea.focus();
                const targetPos = start + mdTag.length;
                textarea.setSelectionRange(targetPos, targetPos);
            }, 15);
        }
    };

    // Copy Markdown Tag to Clipboard
    const handleCopyMarkdown = (url, caption, id) => {
        const tag = `![${caption || 'Illustration'}](${url})`;
        navigator.clipboard?.writeText(tag);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Remove Image from Gallery
    const handleRemoveArticleImage = (id) => {
        setArticleImages(prev => prev.filter(img => img.id !== id));
    };

    // Set as Article Cover Image
    const setAsCoverImage = (url) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Article Title is required');
            setModalTab('editor');
            return;
        }

        const payload = {
            ...formData,
            slug: formData.slug.trim() || generateSlug(formData.title)
        };

        setSubmitting(true);
        try {
            if (modalMode === 'create') {
                await apiClient.post('/blog-posts', payload);
            } else if (modalMode === 'edit' && editingItem) {
                await apiClient.put(`/blog-posts/${editingItem.id}`, payload);
            }
            setModalMode(null);
            fetchPosts();
        } catch (err) {
            console.error('Failed to save post', err);
            alert('Failed to save blog post: ' + (err.response?.data?.error || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleVisibility = async (post) => {
        const nextVis = post.visibility === 'Visible' ? 'Hidden' : 'Visible';
        try {
            await apiClient.put(`/blog-posts/${post.id}`, { ...post, visibility: nextVis });
            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, visibility: nextVis } : p));
        } catch (err) {
            console.error('Failed to toggle visibility', err);
            alert('Failed to update visibility');
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
        try {
            await apiClient.delete(`/blog-posts/${id}`);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to delete post', err);
            alert('Failed to delete post');
        }
    };

    // Filtered posts
    const filtered = posts.filter(p => {
        const matchCat = categoryFilter === 'All' || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
        const q = searchTerm.toLowerCase();
        const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q) || p.tags?.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedPosts = filtered.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

    const totalViews = posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0);
    const visibleCount = posts.filter(p => p.visibility === 'Visible').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Metrics Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
            }}>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total Articles
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', marginTop: '4px' }}>
                        {posts.length}
                    </div>
                </div>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Publicly Visible
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                        {visibleCount}
                    </div>
                </div>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total Reads
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#6366f1', marginTop: '4px' }}>
                        {totalViews}
                    </div>
                </div>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total Likes
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#f43f5e', marginTop: '4px' }}>
                        {totalLikes}
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="admin-card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h3 className="admin-card-title">
                            <BookOpen size={18} color="var(--primary)" />
                            Blog Articles & Publications CMS
                        </h3>
                        <div className="admin-card-subtitle">
                            Publish architectural insights, tutorials, and business articles directly to the website
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <button className="admin-btn admin-btn-secondary" onClick={fetchPosts} title="Refresh from server">
                            <RefreshCw size={14} className={loading ? 'spin' : ''} />
                            <span>Refresh</span>
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                            <Plus size={16} />
                            <span>Create Article</span>
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Filter by title, content, or tag…"
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="admin-input"
                            style={{ paddingLeft: '34px', fontSize: '13px' }}
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                        className="admin-select"
                        style={{ width: '160px', fontSize: '13px' }}
                    >
                        <option value="All">All Categories</option>
                        <option value="Software">Software</option>
                        <option value="Development">Development</option>
                        <option value="Business">Business</option>
                        <option value="Updates">Updates</option>
                        <option value="Tutorial">Tutorial</option>
                    </select>
                </div>
            </div>

            {/* Table / Cards List */}
            <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-soft)', background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Article</th>
                                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Category</th>
                                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Author</th>
                                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Reads</th>
                                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Likes</th>
                                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                                        Loading articles from server…
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                                        No articles found. Click "Create Article" to publish your first post!
                                    </td>
                                </tr>
                            ) : (
                                paginatedPosts.map(post => {
                                    const isVisible = post.visibility === 'Visible';
                                    return (
                                        <tr key={post.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                                            <td style={{ padding: '14px 20px', maxWidth: '320px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ 
                                                        width: '40px', 
                                                        height: '40px', 
                                                        borderRadius: '8px', 
                                                        background: post.coverColor || 'var(--primary-pale)', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        fontSize: '18px',
                                                        overflow: 'hidden',
                                                        flexShrink: 0
                                                    }}>
                                                        {post.imageUrl ? (
                                                            <img 
                                                                src={post.imageUrl.startsWith('/') ? `${ENV.BACKEND_BASE_URL || ''}${post.imageUrl}` : post.imageUrl} 
                                                                alt="thumb" 
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            resolveCoverEmoji(post)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
                                                            {post.title}
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                                                            /blog/{post.slug} · {post.readTime || '5 min'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ 
                                                    background: 'var(--surface-sunken)', 
                                                    border: '1px solid var(--border-soft)',
                                                    padding: '3px 10px', 
                                                    borderRadius: '12px', 
                                                    fontSize: '11px', 
                                                    fontWeight: 600,
                                                    color: 'var(--text-2)'
                                                }}>
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-2)' }}>
                                                {post.author || 'Akshay Patil'}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ 
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '3px 10px', 
                                                    borderRadius: '12px', 
                                                    fontSize: '11px', 
                                                    fontWeight: 600,
                                                    background: isVisible ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                                                    color: isVisible ? '#10b981' : '#94a3b8'
                                                }}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isVisible ? '#10b981' : '#94a3b8' }} />
                                                    {isVisible ? 'Visible' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                                                {post.viewsCount || 0}
                                            </td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                                                {post.likesCount || 0}
                                            </td>
                                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                    <a 
                                                        href={`/blog/${post.slug}`} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="admin-btn admin-btn-secondary" 
                                                        style={{ padding: '6px 10px', fontSize: '11px' }}
                                                        title="Preview on live site"
                                                    >
                                                        <ExternalLink size={13} />
                                                    </a>
                                                    <button 
                                                        onClick={() => handleToggleVisibility(post)} 
                                                        className="admin-btn admin-btn-secondary"
                                                        style={{ padding: '6px 10px', fontSize: '11px' }}
                                                        title={isVisible ? 'Hide from public blog' : 'Show on public blog'}
                                                    >
                                                        {isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => openEdit(post)} 
                                                        className="admin-btn admin-btn-secondary"
                                                        style={{ padding: '6px 10px', fontSize: '11px' }}
                                                        title="Edit article"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(post.id, post.title)} 
                                                        className="admin-btn admin-btn-danger"
                                                        style={{ padding: '6px 10px', fontSize: '11px' }}
                                                        title="Delete article"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {filtered.length > 0 && (
                    <AdminPagination
                        currentPage={safeCurrentPage}
                        totalItems={filtered.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                        pageSizeOptions={[5, 10, 20, 50]}
                        itemLabel="articles"
                        theme="dark"
                    />
                )}
            </div>

            {/* Upgraded Premium Blog Publishing Modal */}
            {modalMode && (
                <div className="admin-modal-overlay" onClick={() => setModalMode(null)}>
                    <div 
                        className="admin-modal-content blog-modal-wide" 
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="blog-modal-header">
                            <div className="blog-modal-title-wrap">
                                <div className="blog-modal-icon-badge">
                                    <BookOpen size={22} />
                                </div>
                                <div>
                                    <h3 className="blog-modal-title">
                                        {modalMode === 'create' ? 'Publish New Blog Article' : `Edit Article: ${formData.title || 'Untitled'}`}
                                    </h3>
                                    <div className="blog-modal-subtitle">
                                        Dynamic CMS publishing with real-time markdown editor, live card preview, and SEO controls
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '4px 10px',
                                    borderRadius: '9999px',
                                    background: formData.visibility === 'Visible' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                    color: formData.visibility === 'Visible' ? '#34d399' : '#fbbf24',
                                    border: formData.visibility === 'Visible' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                                }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: formData.visibility === 'Visible' ? '#10b981' : '#f59e0b' }} />
                                    {formData.visibility === 'Visible' ? 'Public' : 'Draft'}
                                </span>
                                <button 
                                    type="button" 
                                    className="admin-modal-close"
                                    onClick={() => setModalMode(null)}
                                    title="Close dialog"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Tabs Navigation */}
                        <div className="blog-modal-tabs-nav">
                            <button
                                type="button"
                                className={`blog-modal-tab-btn ${modalTab === 'editor' ? 'active' : ''}`}
                                onClick={() => setModalTab('editor')}
                            >
                                <FileText size={15} />
                                <span>1. Content & Editor</span>
                            </button>
                            <button
                                type="button"
                                className={`blog-modal-tab-btn ${modalTab === 'visuals' ? 'active' : ''}`}
                                onClick={() => setModalTab('visuals')}
                            >
                                <Palette size={15} />
                                <span>2. Cover & Visuals</span>
                            </button>
                            <button
                                type="button"
                                className={`blog-modal-tab-btn ${modalTab === 'meta' ? 'active' : ''}`}
                                onClick={() => setModalTab('meta')}
                            >
                                <Settings size={15} />
                                <span>3. Publishing & SEO</span>
                            </button>
                            <button
                                type="button"
                                className={`blog-modal-tab-btn ${modalTab === 'preview' ? 'active' : ''}`}
                                onClick={() => setModalTab('preview')}
                            >
                                <Eye size={15} />
                                <span>4. Full Article Preview</span>
                            </button>
                        </div>

                        {/* Modal Body & Forms */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                            <div className="blog-modal-body">
                                {/* TAB 1: CONTENT & MARKDOWN */}
                                {modalTab === 'editor' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        {/* Article Title */}
                                        <div className="admin-field">
                                            <label className="admin-label">
                                                <span>Article Title <span style={{ color: '#ef4444' }}>*</span></span>
                                                <span className="admin-label-hint">Shown as the primary headline on website & search</span>
                                            </label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Scaling Multi-Tenant Spring Boot Architecture for High-Volume SaaS"
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    className="admin-control-input"
                                                    style={{ fontSize: '15px', fontWeight: 600 }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAutoSlug}
                                                    className="admin-btn admin-btn-secondary"
                                                    title="Auto-sync URL slug from this title"
                                                    style={{ whiteSpace: 'nowrap', padding: '0 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                >
                                                    <Wand2 size={13} color="#818cf8" />
                                                    <span>Sync Slug</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Brief Excerpt */}
                                        <div className="admin-field">
                                            <label className="admin-label">
                                                <span>Brief Excerpt / Summary</span>
                                                <span className="admin-label-hint">
                                                    {(formData.excerpt || '').length} characters · Recommended: 120-200 chars
                                                </span>
                                            </label>
                                            <textarea
                                                rows={2}
                                                placeholder="One or two sentences summarizing the post for cards, social shares, and search engine previews…"
                                                value={formData.excerpt}
                                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                                className="admin-control-textarea"
                                            />
                                        </div>

                                        {/* Markdown Full Content */}
                                        <div className="admin-field">
                                            <label className="admin-label">
                                                <span>Full Article Content (Markdown Supported)</span>
                                                <span className="admin-label-hint">
                                                    {(formData.content || '').split(/\s+/).filter(Boolean).length} words
                                                </span>
                                            </label>

                                            {/* Markdown Toolbar */}
                                            <div className="blog-md-toolbar">
                                                <div className="blog-md-actions-group">
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('## ')} title="Heading 2">
                                                        <span style={{ fontWeight: 800 }}>H2</span>
                                                    </button>
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('### ')} title="Heading 3">
                                                        <span style={{ fontWeight: 800 }}>H3</span>
                                                    </button>
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('**', '**')} title="Bold">
                                                        <Bold size={13} />
                                                    </button>
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('*', '*')} title="Italic">
                                                        <Italic size={13} />
                                                    </button>
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('> ')} title="Blockquote">
                                                        <Quote size={13} />
                                                    </button>
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('`', '`')} title="Inline Code">
                                                        <Code size={13} />
                                                    </button>
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('\n```javascript\n', '\n```\n')} title="Code Block">
                                                        <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{`</>`}</span>
                                                    </button>
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('- ')} title="Bullet List">
                                                        <List size={13} />
                                                    </button>
                                                    <button type="button" className="blog-md-btn" onClick={() => insertMarkdown('[', '](https://)')} title="Hyperlink">
                                                        <Link2 size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`blog-md-btn ${showQuickUrlBar ? 'blog-md-btn-active' : ''}`}
                                                        onClick={() => setShowQuickUrlBar(!showQuickUrlBar)}
                                                        title="Insert Image by URL directly at cursor in the middle of blog"
                                                        style={{
                                                            background: showQuickUrlBar ? '#ff620b' : 'rgba(255, 98, 11, 0.15)',
                                                            color: showQuickUrlBar ? '#ffffff' : '#fdba74',
                                                            border: '1px solid rgba(255, 98, 11, 0.4)',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        <Link2 size={13} />
                                                        <span>+ Image URL</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`blog-md-btn ${showMediaManager ? 'blog-md-btn-active' : ''}`}
                                                        onClick={() => setShowMediaManager(!showMediaManager)}
                                                        title="Toggle Image Upload & Gallery Manager"
                                                        style={{
                                                            background: showMediaManager ? '#6366f1' : 'rgba(99, 102, 241, 0.15)',
                                                            color: showMediaManager ? '#ffffff' : '#c7d2fe',
                                                            border: '1px solid rgba(99, 102, 241, 0.4)',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        <ImageIcon size={13} />
                                                        <span>Gallery ({articleImages.length})</span>
                                                    </button>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <button
                                                        type="button"
                                                        className={`blog-md-btn ${editorMode === 'write' ? 'blog-md-btn-active' : ''}`}
                                                        onClick={() => setEditorMode('write')}
                                                    >
                                                        <span>Write</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`blog-md-btn ${editorMode === 'preview' ? 'blog-md-btn-active' : ''}`}
                                                        onClick={() => setEditorMode('preview')}
                                                    >
                                                        <Eye size={12} style={{ marginRight: '4px' }} />
                                                        <span>Formatted Preview</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Media Manager Panel */}
                                            {showMediaManager && (
                                                <div className="blog-media-manager-card">
                                                    <div className="blog-media-manager-header">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <ImageIcon size={17} color="#818cf8" />
                                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                                                                Blog Images & Media Manager
                                                            </span>
                                                            <span style={{
                                                                fontSize: '11px',
                                                                background: 'rgba(99, 102, 241, 0.2)',
                                                                color: '#c7d2fe',
                                                                padding: '2px 8px',
                                                                borderRadius: '9999px',
                                                                fontWeight: 600
                                                            }}>
                                                                {articleImages.length} attached
                                                            </span>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                            <div className="blog-media-mode-toggle">
                                                                <button
                                                                    type="button"
                                                                    className={`blog-media-mode-btn ${mediaTab === 'upload' ? 'active' : ''}`}
                                                                    onClick={() => setMediaTab('upload')}
                                                                >
                                                                    <Upload size={12} />
                                                                    <span>Upload Multiple Files</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`blog-media-mode-btn ${mediaTab === 'link' ? 'active' : ''}`}
                                                                    onClick={() => setMediaTab('link')}
                                                                >
                                                                    <Link2 size={12} />
                                                                    <span>Add by Image Link</span>
                                                                </button>
                                                            </div>

                                                            {articleImages.length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={insertAllImagesToContent}
                                                                    className="blog-media-action-btn primary"
                                                                    style={{ padding: '6px 12px', fontSize: '11.5px' }}
                                                                    title="Insert all images sequentially into the markdown content"
                                                                >
                                                                    <Sparkles size={12} />
                                                                    <span>Insert All ({articleImages.length})</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Mode 1: Upload Multiple Files */}
                                                    {mediaTab === 'upload' && (
                                                        <div>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={handleMultiImageUpload}
                                                                id="blog-multi-upload-input"
                                                                style={{ display: 'none' }}
                                                            />
                                                            <label htmlFor="blog-multi-upload-input" className="blog-multi-drop-box">
                                                                <Upload size={24} color="#818cf8" />
                                                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#f8fafc' }}>
                                                                    {uploading ? uploadProgress : 'Click to select multiple images or drag & drop files here'}
                                                                </div>
                                                                <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                                                                    Select 1 or multiple PNG, JPG, WebP, GIF, SVG files. Uploads directly to server.
                                                                </div>
                                                            </label>
                                                        </div>
                                                    )}

                                                    {/* Mode 2: Add by Link/URL */}
                                                    {mediaTab === 'link' && (
                                                        <div style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr) auto',
                                                            gap: '10px',
                                                            alignItems: 'flex-end',
                                                            background: 'rgba(10, 15, 28, 0.5)',
                                                            padding: '12px',
                                                            borderRadius: '10px',
                                                            border: '1px solid rgba(255, 255, 255, 0.08)'
                                                        }}>
                                                            <div className="admin-field">
                                                                <label className="admin-label" style={{ fontSize: '11.5px' }}>
                                                                    Image URL (HTTPS link or /uploads/...)
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="https://images.unsplash.com/... or /uploads/..."
                                                                    value={inputImageUrl}
                                                                    onChange={e => setInputImageUrl(e.target.value)}
                                                                    className="admin-control-input"
                                                                    style={{ fontSize: '12.5px' }}
                                                                />
                                                            </div>
                                                            <div className="admin-field">
                                                                <label className="admin-label" style={{ fontSize: '11.5px' }}>
                                                                    Caption / Alt Text
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="e.g. System Microservices Architecture"
                                                                    value={inputImageCaption}
                                                                    onChange={e => setInputImageCaption(e.target.value)}
                                                                    className="admin-control-input"
                                                                    style={{ fontSize: '12.5px' }}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAddImageByUrl(true)}
                                                                className="admin-btn admin-btn-primary"
                                                                style={{ padding: '10px 16px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
                                                            >
                                                                <Plus size={14} />
                                                                <span>Add & Insert</span>
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Image Gallery */}
                                                    {articleImages.length > 0 && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#cbd5e1' }}>
                                                                <span style={{ fontWeight: 600 }}>
                                                                    Article Images ({articleImages.length}) — Click 'Insert' to place image into text:
                                                                </span>
                                                            </div>
                                                            <div className="blog-media-gallery-grid">
                                                                {articleImages.map(img => {
                                                                    const resolvedSrc = img.url.startsWith('/') && !img.url.startsWith('//')
                                                                        ? `${ENV.BACKEND_BASE_URL || ''}${img.url}`
                                                                        : img.url;
                                                                    const isCover = formData.imageUrl === img.url;
                                                                    return (
                                                                        <div key={img.id} className="blog-media-gallery-item">
                                                                            <div className="blog-media-thumb-wrap">
                                                                                <img
                                                                                    src={resolvedSrc}
                                                                                    alt={img.caption || 'thumb'}
                                                                                    className="blog-media-thumb"
                                                                                    onError={e => { e.target.style.opacity = '0.4'; }}
                                                                                />
                                                                                {isCover && (
                                                                                    <span style={{
                                                                                        position: 'absolute',
                                                                                        top: '6px',
                                                                                        left: '6px',
                                                                                        background: '#10b981',
                                                                                        color: '#ffffff',
                                                                                        fontSize: '9.5px',
                                                                                        fontWeight: 700,
                                                                                        padding: '2px 6px',
                                                                                        borderRadius: '4px',
                                                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                                                                                    }}>
                                                                                        Cover Image
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <div className="blog-media-item-info">
                                                                                <div className="blog-media-caption-text" title={img.caption || img.url}>
                                                                                    {img.caption || 'Untitled Image'}
                                                                                </div>
                                                                                <div className="blog-media-item-actions">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="blog-media-action-btn primary"
                                                                                        onClick={() => insertImageToContent(img.url, img.caption)}
                                                                                        title="Insert markdown tag into article at cursor"
                                                                                    >
                                                                                        <Plus size={11} />
                                                                                        <span>Insert</span>
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="blog-media-action-btn"
                                                                                        onClick={() => handleCopyMarkdown(img.url, img.caption, img.id)}
                                                                                        title="Copy Markdown tag"
                                                                                    >
                                                                                        {copiedId === img.id ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                                                                                        <span>{copiedId === img.id ? 'Copied' : 'MD'}</span>
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="blog-media-action-btn"
                                                                                        onClick={() => setAsCoverImage(img.url)}
                                                                                        title="Set as blog cover image"
                                                                                        style={{
                                                                                            background: isCover ? 'rgba(16, 185, 129, 0.2)' : undefined,
                                                                                            color: isCover ? '#34d399' : undefined
                                                                                        }}
                                                                                    >
                                                                                        {isCover ? 'Cover ✓' : 'Cover'}
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="blog-media-action-btn danger"
                                                                                        onClick={() => handleRemoveArticleImage(img.id)}
                                                                                        title="Remove image from gallery"
                                                                                        style={{ marginLeft: 'auto' }}
                                                                                    >
                                                                                        <Trash2 size={11} />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Quick URL Insert Bar */}
                                            {showQuickUrlBar && (
                                                <div className="blog-quick-url-bar">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                                                            <ImageIcon size={14} color="#ff620b" />
                                                            <span>Insert Image by URL into Middle of Blog (at Cursor)</span>
                                                        </div>
                                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                                            Paste link & press Enter
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        <input
                                                            type="url"
                                                            placeholder="Paste Image URL here (e.g. https://images.unsplash.com/... or /uploads/...)"
                                                            value={quickImageUrl}
                                                            onChange={e => setQuickImageUrl(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleInsertQuickUrl(); } }}
                                                            className="admin-control-input"
                                                            style={{ flex: '1', minWidth: '220px', fontSize: '12.5px' }}
                                                            autoFocus
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Caption / description (optional)"
                                                            value={quickImageCaption}
                                                            onChange={e => setQuickImageCaption(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleInsertQuickUrl(); } }}
                                                            className="admin-control-input"
                                                            style={{ width: '180px', fontSize: '12.5px' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleInsertQuickUrl}
                                                            className="admin-btn"
                                                            style={{ background: '#ff620b', color: '#ffffff', padding: '0 16px', fontSize: '12px', whiteSpace: 'nowrap', border: 'none', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                                                        >
                                                            <Plus size={14} />
                                                            <span>Insert at Cursor</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowQuickUrlBar(false)}
                                                            className="admin-btn admin-btn-secondary"
                                                            style={{ padding: '0 10px', fontSize: '12px' }}
                                                            title="Close"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    </div>
                                                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Sparkles size={11} color="#ff620b" />
                                                        <span>Pro-tip: You can also <strong>copy any image link and press Ctrl+V directly</strong> into the text area below!</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Editor Write vs Live Preview */}
                                            {editorMode === 'write' ? (
                                                <textarea
                                                    id="blog-modal-content-editor"
                                                    rows={13}
                                                    required
                                                    value={formData.content}
                                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                                    onPaste={handleContentPaste}
                                                    className="admin-control-textarea blog-md-editor-textarea"
                                                    placeholder="Write your article content here using standard Markdown (## Heading, **bold**, - bullet list, ```code```, ![caption](url))... Tip: Copy & paste (Ctrl+V) any image link directly into your text to embed it!"
                                                />
                                            ) : (
                                                <div className="blog-md-preview-box">
                                                    <ReactMarkdown components={{ img: renderMarkdownImage, a: renderMarkdownLink }}>
                                                        {formatBlogContentForDisplay(formData.content) || '_No markdown content written yet._'}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: COVER & VISUALS */}
                                {modalTab === 'visuals' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '24px' }}>
                                        {/* Left Column: Visual Controls */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                            {/* Gradient Swatches */}
                                            <div className="admin-field">
                                                <label className="admin-label">
                                                    <span>Cover Gradient Palette</span>
                                                    <span className="admin-label-hint">Click a curated gradient swatch</span>
                                                </label>
                                                <div className="blog-gradient-swatches">
                                                    {GRADIENT_PRESETS.map((p, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className={`blog-gradient-btn ${formData.coverColor === p.value ? 'active' : ''}`}
                                                            style={{ background: p.value }}
                                                            onClick={() => setFormData({ ...formData, coverColor: p.value })}
                                                            title={`${p.name} (${p.cat})`}
                                                        >
                                                            {formData.coverColor === p.value && <Check size={16} />}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '8px',
                                                        background: formData.coverColor,
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        flexShrink: 0
                                                    }} />
                                                    <input
                                                        type="text"
                                                        value={formData.coverColor}
                                                        onChange={e => setFormData({ ...formData, coverColor: e.target.value })}
                                                        className="admin-control-input"
                                                        style={{ fontSize: '12px', fontFamily: 'monospace' }}
                                                        placeholder="Custom linear-gradient(...)"
                                                    />
                                                </div>
                                            </div>

                                            {/* Emoji Picker */}
                                            <div className="admin-field">
                                                <label className="admin-label">
                                                    <span>Cover Emoji Badge</span>
                                                    <span className="admin-label-hint">Icon displayed on post banner & card</span>
                                                </label>
                                                <div className="blog-emoji-chips">
                                                    {EMOJI_PRESETS.map((emoji, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className={`blog-emoji-chip ${formData.coverEmoji === emoji ? 'active' : ''}`}
                                                            onClick={() => setFormData({ ...formData, coverEmoji: emoji })}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                                    <input
                                                        type="text"
                                                        value={formData.coverEmoji}
                                                        onChange={e => setFormData({ ...formData, coverEmoji: e.target.value })}
                                                        className="admin-control-input"
                                                        style={{ width: '60px', textAlign: 'center', fontSize: '18px' }}
                                                        placeholder="📦"
                                                    />
                                                    <span style={{ fontSize: '12px', color: 'var(--admin-text-dim)' }}>
                                                        Custom emoji or symbol
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Cover Image Upload / URL / Gallery Select */}
                                            <div className="admin-field">
                                                <label className="admin-label">
                                                    <span>Custom Cover Image (Optional)</span>
                                                    <span className="admin-label-hint">Upload file, paste image URL, or pick from gallery</span>
                                                </label>

                                                {formData.imageUrl ? (
                                                    <div style={{
                                                        background: 'rgba(15, 23, 42, 0.8)',
                                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                                        borderRadius: '12px',
                                                        padding: '12px 14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: '12px'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                                            <img
                                                                src={formData.imageUrl.startsWith('/') ? `${ENV.BACKEND_BASE_URL || ''}${formData.imageUrl}` : formData.imageUrl}
                                                                alt="Cover Preview"
                                                                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                                                            />
                                                            <div style={{ overflow: 'hidden' }}>
                                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#10b981' }}>
                                                                    Cover Image Attached
                                                                </div>
                                                                <div style={{ fontSize: '11px', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                                    {formData.imageUrl}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                            className="admin-btn admin-btn-danger"
                                                            style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <label className="blog-upload-dropzone">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                style={{ display: 'none' }}
                                                            />
                                                            <Upload size={22} color="#818cf8" />
                                                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
                                                                {uploading ? 'Uploading image to server…' : 'Click to browse & upload cover image'}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                                                                PNG, JPG, WebP up to 5MB (Replaces gradient banner)
                                                            </div>
                                                        </label>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                                            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                                                                OR DIRECT IMAGE LINK
                                                            </span>
                                                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="Paste direct image link: https://images.unsplash.com/... or /uploads/..."
                                                                value={formData.imageUrl || ''}
                                                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                                className="admin-control-input"
                                                                style={{ fontSize: '12px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Quick Pick from Article Gallery */}
                                                {articleImages && articleImages.length > 0 && (
                                                    <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
                                                        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <ImageIcon size={13} color="#818cf8" />
                                                            <span>Quick-pick from images in this article:</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                            {articleImages.map(img => (
                                                                <button
                                                                    key={img.id}
                                                                    type="button"
                                                                    onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '6px',
                                                                        background: formData.imageUrl === img.url ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                                                        border: formData.imageUrl === img.url ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                                                                        borderRadius: '8px',
                                                                        padding: '4px 8px',
                                                                        cursor: 'pointer',
                                                                        color: '#e2e8f0',
                                                                        fontSize: '11px',
                                                                        transition: 'all 0.15s ease'
                                                                    }}
                                                                    title="Set as Cover Image"
                                                                >
                                                                    <img
                                                                        src={img.url.startsWith('/') ? `${ENV.BACKEND_BASE_URL || ''}${img.url}` : img.url}
                                                                        alt=""
                                                                        style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }}
                                                                    />
                                                                    <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        {img.caption || 'Article image'}
                                                                    </span>
                                                                    {formData.imageUrl === img.url && <Check size={12} color="#10b981" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column: Live Card Preview */}
                                        <div className="blog-live-card-preview">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#ff620b' }}>
                                                <Sparkles size={14} />
                                                <span>Live Card Preview (On Website Listing)</span>
                                            </div>

                                            <div className="blog-live-card-item">
                                                <div 
                                                    className="blog-live-card-banner"
                                                    style={{
                                                        background: formData.coverColor,
                                                        backgroundImage: formData.imageUrl ? `url(${formData.imageUrl.startsWith('/') ? `${ENV.BACKEND_BASE_URL || ''}${formData.imageUrl}` : formData.imageUrl})` : undefined,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                >
                                                    {!formData.imageUrl && (
                                                        <span style={{ fontSize: '38px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}>
                                                            {formData.coverEmoji || '📦'}
                                                        </span>
                                                    )}
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        left: '12px',
                                                        background: 'rgba(15, 23, 42, 0.75)',
                                                        backdropFilter: 'blur(8px)',
                                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                                        color: '#f8fafc',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        padding: '3px 10px',
                                                        borderRadius: '9999px'
                                                    }}>
                                                        {formData.category}
                                                    </span>
                                                </div>

                                                <div className="blog-live-card-content">
                                                    <div className="blog-live-card-title">
                                                        {formData.title || 'Untitled Article Headline'}
                                                    </div>
                                                    <div className="blog-live-card-excerpt">
                                                        {formData.excerpt || 'One or two sentences summarizing the post for cards, social shares, and search engine previews…'}
                                                    </div>
                                                    <div className="blog-live-card-meta">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                background: '#4f46e5',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '11px',
                                                                fontWeight: 700,
                                                                color: '#ffffff'
                                                            }}>
                                                                {(formData.author || 'A').charAt(0)}
                                                            </div>
                                                            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{formData.author || 'Akshay Patil'}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                                                            <Clock size={12} />
                                                            <span>{formData.readTime || '5 min'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: PUBLISHING & METADATA */}
                                {modalTab === 'meta' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div className="admin-form-grid">
                                            {/* Slug */}
                                            <div className="admin-field">
                                                <label className="admin-label">
                                                    <span>URL Slug</span>
                                                    <span className="admin-label-hint">Route path (/blog/...)</span>
                                                </label>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. scaling-multi-tenant-saas"
                                                        value={formData.slug}
                                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                        className="admin-control-input"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAutoSlug}
                                                        className="admin-btn admin-btn-secondary"
                                                        title="Regenerate slug from current article title"
                                                        style={{ padding: '0 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
                                                    >
                                                        Auto
                                                    </button>
                                                </div>
                                                <span style={{ fontSize: '11px', color: 'var(--admin-text-dim)', marginTop: '2px' }}>
                                                    Final path: /blog/{formData.slug || generateSlug(formData.title) || 'your-slug'}
                                                </span>
                                            </div>

                                            {/* Category */}
                                            <div className="admin-field">
                                                <label className="admin-label">
                                                    <span>Category</span>
                                                    <span className="admin-label-hint">Topic classification</span>
                                                </label>
                                                <select
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    className="admin-control-select"
                                                >
                                                    <option value="Software">💻 Software</option>
                                                    <option value="Development">⚡ Development</option>
                                                    <option value="Business">📈 Business</option>
                                                    <option value="Updates">🚀 Updates</option>
                                                    <option value="Tutorial">📚 Tutorial</option>
                                                    <option value="News">📰 News</option>
                                                </select>
                                            </div>

                                            {/* Author Name */}
                                            <div className="admin-field">
                                                <label className="admin-label">Author Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.author}
                                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                                    className="admin-control-input"
                                                />
                                            </div>

                                            {/* Author Role */}
                                            <div className="admin-field">
                                                <label className="admin-label">Author Role / Title</label>
                                                <input
                                                    type="text"
                                                    value={formData.authorRole}
                                                    onChange={e => setFormData({ ...formData, authorRole: e.target.value })}
                                                    className="admin-control-input"
                                                />
                                            </div>

                                            {/* Read Time */}
                                            <div className="admin-field">
                                                <label className="admin-label">
                                                    <span>Read Time</span>
                                                    <span className="admin-label-hint">Estimated duration</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="5 min"
                                                    value={formData.readTime}
                                                    onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                                                    className="admin-control-input"
                                                />
                                                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                                                    {READ_TIME_PRESETS.map((rt, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, readTime: rt })}
                                                            style={{
                                                                background: formData.readTime === rt ? '#6366f1' : 'rgba(255,255,255,0.06)',
                                                                border: '1px solid rgba(255,255,255,0.1)',
                                                                borderRadius: '6px',
                                                                padding: '2px 8px',
                                                                fontSize: '11px',
                                                                color: '#ffffff',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {rt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Visibility */}
                                            <div className="admin-field">
                                                <label className="admin-label">
                                                    <span>Visibility & Publishing</span>
                                                    <span className="admin-label-hint">Access control</span>
                                                </label>
                                                <select
                                                    value={formData.visibility}
                                                    onChange={e => setFormData({ ...formData, visibility: e.target.value })}
                                                    className="admin-control-select"
                                                >
                                                    <option value="Visible">🟢 Visible (Published on Website)</option>
                                                    <option value="Hidden">🟡 Hidden (Draft / Unlisted)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Tags with Suggestions */}
                                        <div className="admin-field">
                                            <label className="admin-label">
                                                <span>Article Tags (comma-separated)</span>
                                                <span className="admin-label-hint">Used for search & related posts</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="spring boot, react, saas, devops"
                                                value={formData.tags}
                                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                                className="admin-control-input"
                                            />
                                            <div className="blog-tag-chips">
                                                <span style={{ fontSize: '11px', color: 'var(--admin-text-dim)', alignSelf: 'center', marginRight: '4px' }}>
                                                    Quick tags:
                                                </span>
                                                {SUGGESTED_TAGS.map((tag, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => handleQuickTag(tag)}
                                                        className="blog-tag-chip"
                                                    >
                                                        + {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* SEO Fields */}
                                        <div style={{
                                            background: 'rgba(15, 23, 42, 0.4)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '14px'
                                        }}>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Sparkles size={14} color="#6366f1" />
                                                <span>SEO Meta Overrides (Optional)</span>
                                            </div>
                                            <div className="admin-form-grid">
                                                <div className="admin-field">
                                                    <label className="admin-label">Custom SEO Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Defaults to article title if empty"
                                                        value={formData.seoTitle}
                                                        onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                                        className="admin-control-input"
                                                    />
                                                </div>
                                                <div className="admin-field">
                                                    <label className="admin-label">Custom SEO Description</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Defaults to excerpt if empty"
                                                        value={formData.seoDescription}
                                                        onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                                                        className="admin-control-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 4: FULL PREVIEW */}
                                {modalTab === 'preview' && (
                                    <div style={{
                                        background: 'rgba(11, 17, 32, 0.95)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Preview Article Banner */}
                                        <div style={{
                                            background: formData.coverColor,
                                            backgroundImage: formData.imageUrl ? `url(${formData.imageUrl.startsWith('/') ? `${ENV.BACKEND_BASE_URL || ''}${formData.imageUrl}` : formData.imageUrl})` : undefined,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            padding: '40px 32px',
                                            position: 'relative'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                                <span style={{
                                                    background: 'rgba(15, 23, 42, 0.85)',
                                                    backdropFilter: 'blur(8px)',
                                                    color: '#f8fafc',
                                                    fontSize: '12px',
                                                    fontWeight: 700,
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    border: '1px solid rgba(255,255,255,0.15)'
                                                }}>
                                                    {formData.category}
                                                </span>
                                                <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>
                                                    · {formData.readTime || '5 min'} read
                                                </span>
                                            </div>
                                            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, margin: '0 0 16px' }}>
                                                {formData.title || 'Untitled Article'}
                                            </h1>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    background: '#4f46e5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                    color: '#ffffff'
                                                }}>
                                                    {(formData.author || 'A').charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '14px' }}>
                                                        {formData.author || 'Akshay Patil'}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                                        {formData.authorRole || 'Founder & CTO'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preview Body */}
                                        <div style={{ padding: '28px 32px' }}>
                                            {formData.excerpt && (
                                                <blockquote style={{
                                                    borderLeft: '4px solid #ff620b',
                                                    paddingLeft: '16px',
                                                    fontStyle: 'italic',
                                                    color: '#cbd5e1',
                                                    fontSize: '15px',
                                                    margin: '0 0 24px'
                                                }}>
                                                    {formData.excerpt}
                                                </blockquote>
                                            )}

                                            <div className="blog-md-preview-box" style={{ background: 'transparent', border: 'none', padding: 0, maxHeight: 'none' }}>
                                                <ReactMarkdown components={{ img: renderMarkdownImage, a: renderMarkdownLink }}>
                                                    {formatBlogContentForDisplay(formData.content) || '_No markdown content._'}
                                                </ReactMarkdown>
                                            </div>

                                            {formData.tags && (
                                                <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {formData.tags.split(',').map((t, i) => (
                                                        <span key={i} style={{
                                                            fontSize: '12px',
                                                            background: 'rgba(99, 102, 241, 0.15)',
                                                            color: '#c7d2fe',
                                                            padding: '4px 10px',
                                                            borderRadius: '6px'
                                                        }}>
                                                            #{t.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="admin-modal-footer" style={{
                                padding: '16px 28px',
                                background: 'rgba(15, 23, 42, 0.85)',
                                backdropFilter: 'blur(10px)',
                                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                        Step {modalTab === 'editor' ? '1/3: Content' : modalTab === 'visuals' ? '2/3: Visuals' : modalTab === 'meta' ? '3/3: Publishing' : 'Preview'}
                                    </span>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>·</span>
                                    <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 600 }}>
                                        {formData.category}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-secondary"
                                        onClick={() => setModalMode(null)}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>

                                    {modalTab === 'editor' && (
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-secondary"
                                            onClick={() => setModalTab('visuals')}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <span>Next: Cover & Visuals</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    )}

                                    {modalTab === 'visuals' && (
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-secondary"
                                            onClick={() => setModalTab('meta')}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <span>Next: Publishing & SEO</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        className="admin-btn admin-btn-primary"
                                        disabled={submitting}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                                    >
                                        <Send size={15} />
                                        <span>
                                            {submitting ? 'Saving…' : modalMode === 'create' ? 'Publish Article' : 'Save Changes'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
