import React, { useState, useEffect, useMemo } from 'react';
import { 
    PhoneCall, Mail, MapPin, Clock, Globe, Shield, Send, 
    MessageSquare, Eye, Trash2, Search, Filter, RefreshCw, 
    Download, CheckCircle2, AlertCircle, Sparkles, User, 
    ArrowUpRight, Copy, Check, MoreVertical, X, HelpCircle, Phone
} from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import AdminPagination from '../components/AdminPagination';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';
import apiClient, { ENV } from '../../../../api/config';

export default function ContactTab() {
    const { landingData, updateSection } = useLandingPage();
    const contact = landingData.contact || {};
    const socials = contact.socials || {};

    // Sub-tab selection: 'inquiries' | 'settings'
    const [subTab, setSubTab] = useState('inquiries');

    // Inquiries State
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        newCount: 0,
        readCount: 0,
        inProgressCount: 0,
        repliedCount: 0,
        resolvedCount: 0
    });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    // Selected Submission for Detail View / Modal
    const [activeInquiry, setActiveInquiry] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    // Delete Confirmation Modal
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Feedback Toast
    const [feedback, setFeedback] = useState(null);

    // ── Fetch Inquiries from Backend ──────────────────────────────────────────
    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage - 1, // backend 0-indexed
                size: pageSize
            };
            if (selectedStatus && selectedStatus !== 'ALL') {
                params.status = selectedStatus;
            }
            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            const res = await apiClient.get('/contact-submissions', { params });
            if (res.data?.success) {
                setSubmissions(res.data.content || []);
                setTotalElements(res.data.totalElements || 0);
                if (res.data.stats) {
                    setStats(res.data.stats);
                }
            }
        } catch (err) {
            console.error('[ContactTab] Error fetching submissions:', err);
            // Fallback retry to /contacts
            try {
                const res = await apiClient.get('/contacts');
                if (res.data?.success) {
                    setSubmissions(res.data.content || []);
                    setTotalElements(res.data.totalElements || 0);
                    if (res.data.stats) setStats(res.data.stats);
                }
            } catch (fallbackErr) {
                console.error('[ContactTab] Fallback error:', fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (subTab === 'inquiries') {
            fetchSubmissions();
        }
    }, [currentPage, pageSize, selectedStatus, subTab]);

    // Handle search on submit or debounce
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchSubmissions();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    // ── Status Update ─────────────────────────────────────────────────────────
    const handleStatusChange = async (id, newStatus, notesToSave) => {
        setIsUpdatingStatus(true);
        try {
            const payload = { status: newStatus };
            if (notesToSave !== undefined) {
                payload.adminNotes = notesToSave;
            }

            const res = await apiClient.patch(`/contact-submissions/${id}/status`, payload);
            if (res.data?.success) {
                setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus, adminNotes: notesToSave !== undefined ? notesToSave : s.adminNotes } : s));
                if (activeInquiry && activeInquiry.id === id) {
                    setActiveInquiry(prev => ({ ...prev, status: newStatus, adminNotes: notesToSave !== undefined ? notesToSave : prev.adminNotes }));
                }
                showFeedback('success', `Status updated to ${newStatus}`);
                // Refresh summary stats in background
                fetchSubmissions();
            }
        } catch (err) {
            console.error('[ContactTab] Error updating status:', err);
            showFeedback('error', 'Failed to update status');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // ── Delete Submission ─────────────────────────────────────────────────────
    const handleDeleteSubmission = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await apiClient.delete(`/contact-submissions/${deleteId}`);
            if (res.data?.success) {
                setSubmissions(prev => prev.filter(s => s.id !== deleteId));
                setTotalElements(prev => Math.max(0, prev - 1));
                if (activeInquiry?.id === deleteId) {
                    setActiveInquiry(null);
                }
                setDeleteId(null);
                showFeedback('success', 'Inquiry deleted successfully');
                fetchSubmissions();
            }
        } catch (err) {
            console.error('[ContactTab] Error deleting inquiry:', err);
            showFeedback('error', 'Failed to delete inquiry');
        } finally {
            setIsDeleting(false);
        }
    };

    // ── Export to CSV ─────────────────────────────────────────────────────────
    const handleExportCsv = () => {
        if (submissions.length === 0) {
            showFeedback('info', 'No inquiries to export');
            return;
        }

        const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Service', 'Subject', 'Message', 'Status', 'IP Address', 'Admin Notes'];
        const rows = submissions.map(s => [
            s.id,
            `"${s.createdAt ? new Date(s.createdAt).toLocaleString('en-IN') : ''}"`,
            `"${(s.name || '').replace(/"/g, '""')}"`,
            `"${(s.email || '').replace(/"/g, '""')}"`,
            `"${(s.phone || '').replace(/"/g, '""')}"`,
            `"${(s.service || '').replace(/"/g, '""')}"`,
            `"${(s.subject || '').replace(/"/g, '""')}"`,
            `"${(s.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
            s.status || 'NEW',
            `"${s.ipAddress || ''}"`,
            `"${(s.adminNotes || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `namustutam_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showFeedback('success', `Exported ${submissions.length} inquiries to CSV`);
    };

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 4000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    // Format Relative Time
    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return 'Recent';
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 2) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    // Color mapper for statuses
    const getStatusBadge = (status) => {
        const s = (status || 'NEW').toUpperCase();
        switch (s) {
            case 'NEW':
                return { bg: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', border: 'rgba(234, 88, 12, 0.35)', label: 'New Lead' };
            case 'READ':
                return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.35)', label: 'Read' };
            case 'IN_PROGRESS':
                return { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.35)', label: 'In Discussion' };
            case 'REPLIED':
                return { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', border: 'rgba(99, 102, 241, 0.35)', label: 'Replied' };
            case 'RESOLVED':
                return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.35)', label: 'Resolved' };
            default:
                return { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.35)', label: s };
        }
    };

    // Settings Tab Handlers
    const handleFieldChange = (field, value) => {
        updateSection('contact', { [field]: value });
    };

    const handleSocialChange = (network, value) => {
        updateSection('contact', {
            socials: {
                ...socials,
                [network]: value
            }
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SectionVisibilityBanner 
                sectionKey="contact" 
                sectionName="Footer & Contact Channels" 
                description="Controls whether the website footer, company info, and global contact touchpoints are visible on the landing page."
            />

            {/* ── Top Sub-Tab Switcher ─────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                padding: '8px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        type="button"
                        onClick={() => setSubTab('inquiries')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: '13.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            background: subTab === 'inquiries' ? 'linear-gradient(135deg, #ff620b 0%, #c2410c 100%)' : 'transparent',
                            color: subTab === 'inquiries' ? '#ffffff' : '#94a3b8',
                            boxShadow: subTab === 'inquiries' ? '0 4px 14px rgba(234, 88, 12, 0.35)' : 'none'
                        }}
                    >
                        <MessageSquare size={16} />
                        <span>Inquiries & Form Submissions</span>
                        {stats.newCount > 0 && (
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: '20px',
                                background: '#ffffff',
                                color: '#c2410c',
                                fontSize: '11px',
                                fontWeight: 800
                            }}>
                                {stats.newCount} NEW
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSubTab('settings')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: '13.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            background: subTab === 'settings' ? 'linear-gradient(135deg, #ff620b 0%, #c2410c 100%)' : 'transparent',
                            color: subTab === 'settings' ? '#ffffff' : '#94a3b8',
                            boxShadow: subTab === 'settings' ? '0 4px 14px rgba(234, 88, 12, 0.35)' : 'none'
                        }}
                    >
                        <PhoneCall size={16} />
                        <span>Contact Info & Channels</span>
                    </button>
                </div>

                {subTab === 'inquiries' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '8px' }}>
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            className="admin-btn admin-btn-secondary"
                            style={{ fontSize: '12px', padding: '7px 14px' }}
                            title="Export all inquiries to CSV format"
                        >
                            <Download size={13} />
                            <span>Export CSV</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setCurrentPage(1); fetchSubmissions(); }}
                            className="admin-btn admin-btn-secondary"
                            style={{ fontSize: '12px', padding: '7px 14px' }}
                            title="Refresh table"
                        >
                            <RefreshCw size={13} className={loading ? 'spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Feedback notification */}
            {feedback && (
                <div style={{
                    padding: '12px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: feedback.type === 'success' ? '#064e3b' : feedback.type === 'error' ? '#7f1d1d' : '#1e1b4b',
                    color: feedback.type === 'success' ? '#a7f3d0' : feedback.type === 'error' ? '#fecaca' : '#c7d2fe',
                    border: `1px solid ${feedback.type === 'success' ? '#059669' : feedback.type === 'error' ? '#dc2626' : '#4f46e5'}`,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{feedback.message}</span>
                </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {/* SUBTAB 1: INQUIRIES & SUBMISSIONS TABLE                       */}
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {subTab === 'inquiries' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Live Metric KPI Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                        gap: '16px'
                    }}>
                        <div className="admin-card" style={{ padding: '18px 20px', background: 'rgba(15, 23, 42, 0.65)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: 600 }}>Total Inquiries</span>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={16} color="#6366f1" />
                                </div>
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                                {stats.total}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                                Stored in PostgreSQL DB
                            </div>
                        </div>

                        <div className="admin-card" style={{ padding: '18px 20px', background: 'rgba(15, 23, 42, 0.65)', borderLeft: '3px solid #ea580c' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12.5px', color: '#ea580c', fontWeight: 700 }}>New & Unread</span>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={16} color="#ea580c" />
                                </div>
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                                {stats.newCount}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#ea580c', marginTop: '4px' }}>
                                Requires team response
                            </div>
                        </div>

                        <div className="admin-card" style={{ padding: '18px 20px', background: 'rgba(15, 23, 42, 0.65)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12.5px', color: '#a855f7', fontWeight: 600 }}>In Discussion / Read</span>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Clock size={16} color="#a855f7" />
                                </div>
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                                {(stats.readCount || 0) + (stats.inProgressCount || 0)}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                                Reviewed by sales/tech
                            </div>
                        </div>

                        <div className="admin-card" style={{ padding: '18px 20px', background: 'rgba(15, 23, 42, 0.65)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12.5px', color: '#10b981', fontWeight: 600 }}>Replied & Resolved</span>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle2 size={16} color="#10b981" />
                                </div>
                            </div>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                                {(stats.repliedCount || 0) + (stats.resolvedCount || 0)}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                                Closed inquiries
                            </div>
                        </div>
                    </div>

                    {/* Filter & Search Controls */}
                    <div className="admin-card" style={{ padding: '16px 20px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '14px'
                        }}>
                            {/* Search Bar */}
                            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '260px' }}>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, phone, subject, or keyword…"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="admin-control-input"
                                        style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: '#94a3b8',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <button type="submit" className="admin-btn admin-btn-secondary" style={{ height: '38px', padding: '0 16px' }}>
                                    Search
                                </button>
                            </form>

                            {/* Status Pills */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                {['ALL', 'NEW', 'READ', 'IN_PROGRESS', 'REPLIED', 'RESOLVED'].map(st => {
                                    const active = selectedStatus === st;
                                    const label = st === 'ALL' ? 'All' : st === 'NEW' ? 'New' : st === 'READ' ? 'Read' : st === 'IN_PROGRESS' ? 'In Progress' : st === 'REPLIED' ? 'Replied' : 'Resolved';
                                    return (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => { setSelectedStatus(st); setCurrentPage(1); }}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                border: active ? '1px solid #ea580c' : '1px solid rgba(255, 255, 255, 0.1)',
                                                background: active ? 'rgba(234, 88, 12, 0.18)' : 'rgba(15, 23, 42, 0.5)',
                                                color: active ? '#ffffff' : '#94a3b8',
                                                fontSize: '12px',
                                                fontWeight: active ? 700 : 500,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Submissions Table */}
                    <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(15, 23, 42, 0.85)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                        <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', width: '140px' }}>DATE / TIME</th>
                                        <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', width: '220px' }}>SENDER</th>
                                        <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', width: '200px' }}>TOPIC / SERVICE</th>
                                        <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>MESSAGE PREVIEW</th>
                                        <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', width: '130px' }}>STATUS</th>
                                        <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', width: '110px', textAlign: 'right' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '50px 20px', textAlign: 'center', color: '#94a3b8' }}>
                                                <RefreshCw size={24} className="spin" style={{ margin: '0 auto 10px', display: 'block', color: '#ea580c' }} />
                                                <span>Loading inquiries from database…</span>
                                            </td>
                                        </tr>
                                    ) : submissions.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '60px 20px', textAlign: 'center' }}>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                                    <Mail size={28} />
                                                </div>
                                                <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                                                    No Contact Inquiries Found
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '0 auto' }}>
                                                    {searchQuery ? `No results matching "${searchQuery}". Try a different search keyword.` : 'When visitors submit the contact form on your website, their messages will appear here in real-time.'}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.map((item) => {
                                            const badge = getStatusBadge(item.status);
                                            const formattedDate = item.createdAt 
                                                ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : 'Recent';
                                            const timeAgo = formatTimeAgo(item.createdAt);
                                            const isUnread = (item.status || 'NEW').toUpperCase() === 'NEW';
                                            const initial = (item.name || 'N').charAt(0).toUpperCase();

                                            return (
                                                <tr 
                                                    key={item.id}
                                                    style={{
                                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                        background: isUnread ? 'rgba(234, 88, 12, 0.03)' : 'transparent',
                                                        transition: 'background 0.15s ease'
                                                    }}
                                                    className="admin-table-row"
                                                >
                                                    {/* Date & Time */}
                                                    <td style={{ padding: '16px 18px', verticalAlign: 'middle' }}>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
                                                            {formattedDate}
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: isUnread ? '#ea580c' : '#64748b', fontWeight: isUnread ? 700 : 400, marginTop: '2px' }}>
                                                            {timeAgo}
                                                        </div>
                                                    </td>

                                                    {/* Sender Details */}
                                                    <td style={{ padding: '16px 18px', verticalAlign: 'middle' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{
                                                                width: '34px',
                                                                height: '34px',
                                                                borderRadius: '50%',
                                                                background: 'linear-gradient(135deg, #ff620b 0%, #c2410c 100%)',
                                                                color: '#ffffff',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '13px',
                                                                fontWeight: 700,
                                                                flexShrink: 0
                                                            }}>
                                                                {initial}
                                                            </div>
                                                            <div style={{ minWidth: 0 }}>
                                                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {item.name}
                                                                </div>
                                                                <div style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    <a 
                                                                        href={`mailto:${item.email}`}
                                                                        style={{ color: '#94a3b8', textDecoration: 'none' }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        title="Click to email"
                                                                    >
                                                                        {item.email}
                                                                    </a>
                                                                </div>
                                                                {item.phone && (
                                                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                                                        {item.phone}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Topic & Service */}
                                                    <td style={{ padding: '16px 18px', verticalAlign: 'middle' }}>
                                                        <div style={{
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            borderRadius: '6px',
                                                            background: 'rgba(99, 102, 241, 0.12)',
                                                            color: '#818cf8',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            marginBottom: '4px'
                                                        }}>
                                                            {item.service || 'General Inquiry'}
                                                        </div>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                                            {item.subject || 'No Subject'}
                                                        </div>
                                                    </td>

                                                    {/* Message Excerpt */}
                                                    <td 
                                                        style={{ padding: '16px 18px', verticalAlign: 'middle', cursor: 'pointer' }}
                                                        onClick={() => { setActiveInquiry(item); setAdminNotes(item.adminNotes || ''); }}
                                                        title="Click to view full message"
                                                    >
                                                        <div style={{
                                                            fontSize: '12.5px',
                                                            color: '#94a3b8',
                                                            lineHeight: 1.5,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {item.message}
                                                        </div>
                                                    </td>

                                                    {/* Status Badge & Dropdown */}
                                                    <td style={{ padding: '16px 18px', verticalAlign: 'middle' }}>
                                                        <select
                                                            value={item.status || 'NEW'}
                                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                            style={{
                                                                padding: '4px 10px',
                                                                borderRadius: '20px',
                                                                border: `1px solid ${badge.border}`,
                                                                background: badge.bg,
                                                                color: badge.color,
                                                                fontSize: '11px',
                                                                fontWeight: 700,
                                                                outline: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <option value="NEW" style={{ background: '#0f172a', color: '#ea580c' }}>NEW</option>
                                                            <option value="READ" style={{ background: '#0f172a', color: '#3b82f6' }}>READ</option>
                                                            <option value="IN_PROGRESS" style={{ background: '#0f172a', color: '#a855f7' }}>IN PROGRESS</option>
                                                            <option value="REPLIED" style={{ background: '#0f172a', color: '#6366f1' }}>REPLIED</option>
                                                            <option value="RESOLVED" style={{ background: '#0f172a', color: '#10b981' }}>RESOLVED</option>
                                                        </select>
                                                    </td>

                                                    {/* Actions */}
                                                    <td style={{ padding: '16px 18px', verticalAlign: 'middle', textAlign: 'right' }}>
                                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                            {/* View Details */}
                                                            <button
                                                                type="button"
                                                                onClick={() => { setActiveInquiry(item); setAdminNotes(item.adminNotes || ''); }}
                                                                className="admin-table-action-btn"
                                                                title="View full inquiry"
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                                    color: '#cbd5e1',
                                                                    cursor: 'pointer',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                <Eye size={14} />
                                                            </button>

                                                            {/* Direct Mailto */}
                                                            <a
                                                                href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || 'Your Inquiry to Namustutam')}`}
                                                                className="admin-table-action-btn"
                                                                title="Reply via Email"
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(234, 88, 12, 0.2)',
                                                                    background: 'rgba(234, 88, 12, 0.1)',
                                                                    color: '#ea580c',
                                                                    cursor: 'pointer',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    textDecoration: 'none'
                                                                }}
                                                            >
                                                                <Send size={13} />
                                                            </a>

                                                            {/* Delete */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteId(item.id)}
                                                                className="admin-table-action-btn"
                                                                title="Delete inquiry"
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                                    background: 'rgba(239, 68, 68, 0.08)',
                                                                    color: '#ef4444',
                                                                    cursor: 'pointer',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
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

                        {/* Pagination Bar */}
                        {totalElements > 0 && (
                            <AdminPagination
                                currentPage={currentPage}
                                totalItems={totalElements}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={setPageSize}
                                pageSizeOptions={[5, 10, 20, 50]}
                                itemLabel="inquiries"
                                theme="dark"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {/* SUBTAB 2: CONTACT SETTINGS & CHANNELS                         */}
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {subTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {/* Brand & Footer Identity */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div>
                                <h3 className="admin-card-title">
                                    <Shield size={18} color="#6366f1" />
                                    Brand Identity & Footer Summary
                                </h3>
                                <div className="admin-card-subtitle">
                                    Corporate info displayed in the footer and contact sections
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-grid">
                            <div className="admin-field">
                                <label className="admin-label">Brand Name</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={contact.brandName || 'Namustutam'}
                                    onChange={(e) => handleFieldChange('brandName', e.target.value)}
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-label">Copyright Notice</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={contact.copyright || '© 2026 Namustutam. All rights reserved.'}
                                    onChange={(e) => handleFieldChange('copyright', e.target.value)}
                                />
                            </div>

                            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                <label className="admin-label">Brand Story / Footer Description</label>
                                <textarea
                                    className="admin-control-textarea"
                                    rows={3}
                                    value={contact.brandDescription || ''}
                                    onChange={(e) => handleFieldChange('brandDescription', e.target.value)}
                                    placeholder="Namustutam empowers businesses to scale and innovate with premium Web Development, SaaS Applications, AI Automation, and cutting-edge UI/UX Design tailored to your specific needs."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Direct Channels */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div>
                                <h3 className="admin-card-title">
                                    <PhoneCall size={18} color="#ea580c" />
                                    Direct Contact Channels
                                </h3>
                                <div className="admin-card-subtitle">
                                    Email, phone, physical/remote location, and availability shown on /contact
                                </div>
                            </div>
                        </div>

                        {/* Notice for auto-hide */}
                        <div style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(234, 88, 12, 0.08)',
                            border: '1px solid rgba(234, 88, 12, 0.25)',
                            fontSize: '12.5px',
                            color: '#fdba74',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>💡</span>
                            <span><strong>Dynamic Auto-Hide Rule:</strong> If any channel is left empty or set to "Hide", its section will automatically disappear from the public Contact page and Website Footer.</span>
                        </div>

                        <div className="admin-form-grid">
                            {/* Email */}
                            <div className="admin-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label className="admin-label" style={{ margin: 0 }}>Official Contact Email</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: contact.showEmail !== false ? '#34d399' : '#94a3b8', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={contact.showEmail !== false}
                                            onChange={(e) => handleFieldChange('showEmail', e.target.checked)}
                                            style={{ accentColor: '#ea580c' }}
                                        />
                                        <span>{contact.showEmail !== false ? 'Show' : 'Hide'}</span>
                                    </label>
                                </div>
                                <input
                                    type="email"
                                    className="admin-control-input"
                                    value={contact.email || ''}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    placeholder="namustutam@gmail.com (Leave blank to hide)"
                                />
                            </div>

                            {/* Phone */}
                            <div className="admin-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label className="admin-label" style={{ margin: 0 }}>Phone / Calling Number</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: contact.showPhone !== false ? '#34d399' : '#94a3b8', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={contact.showPhone !== false}
                                            onChange={(e) => handleFieldChange('showPhone', e.target.checked)}
                                            style={{ accentColor: '#ea580c' }}
                                        />
                                        <span>{contact.showPhone !== false ? 'Show' : 'Hide'}</span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={contact.phone || ''}
                                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    placeholder="+91 82375 12742 (Leave blank to hide)"
                                />
                            </div>

                            {/* WhatsApp */}
                            <div className="admin-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label className="admin-label" style={{ margin: 0 }}>WhatsApp Direct Link / Number</label>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>Used for 1-click chat</span>
                                </div>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={contact.whatsapp || ''}
                                    onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                                    placeholder="+91 82375 12742 (Leave blank to hide)"
                                />
                            </div>

                            {/* Location */}
                            <div className="admin-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label className="admin-label" style={{ margin: 0 }}>Location / Office Presence</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: contact.showLocation !== false ? '#34d399' : '#94a3b8', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={contact.showLocation !== false}
                                            onChange={(e) => handleFieldChange('showLocation', e.target.checked)}
                                            style={{ accentColor: '#ea580c' }}
                                        />
                                        <span>{contact.showLocation !== false ? 'Show' : 'Hide'}</span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={contact.location || ''}
                                    onChange={(e) => handleFieldChange('location', e.target.value)}
                                    placeholder="Remote / Online Only (Leave blank to hide)"
                                />
                            </div>

                            {/* Hours */}
                            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label className="admin-label" style={{ margin: 0 }}>Support Hours / Availability</label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: contact.showHours !== false ? '#34d399' : '#94a3b8', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={contact.showHours !== false}
                                            onChange={(e) => handleFieldChange('showHours', e.target.checked)}
                                            style={{ accentColor: '#ea580c' }}
                                        />
                                        <span>{contact.showHours !== false ? 'Show' : 'Hide'}</span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={contact.supportHours || ''}
                                    onChange={(e) => handleFieldChange('supportHours', e.target.value)}
                                    placeholder="Available 24/7 for Global Inquiries (Leave blank to hide)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div>
                                <h3 className="admin-card-title">
                                    <Globe size={18} color="#10b981" />
                                    Official Social Media Links
                                </h3>
                                <div className="admin-card-subtitle">
                                    Profiles linked in navbar, footer, and contact touchpoints
                                </div>
                            </div>
                        </div>

                        <div className="admin-form-grid">
                            <div className="admin-field">
                                <label className="admin-label">LinkedIn Profile URL</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={socials.linkedin || ''}
                                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                    placeholder="https://linkedin.com/company/namustute/"
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-label">GitHub Organization / Profile</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={socials.github || ''}
                                    onChange={(e) => handleSocialChange('github', e.target.value)}
                                    placeholder="https://github.com/..."
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-label">Twitter / X Handle</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={socials.twitter || ''}
                                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                    placeholder="https://twitter.com/..."
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-label">Instagram Profile</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={socials.instagram || ''}
                                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                    placeholder="https://instagram.com/namustute/"
                                />
                            </div>

                            <div className="admin-field">
                                <label className="admin-label">Discord Community URL</label>
                                <input
                                    type="text"
                                    className="admin-control-input"
                                    value={socials.discord || ''}
                                    onChange={(e) => handleSocialChange('discord', e.target.value)}
                                    placeholder="https://discord.gg/..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {/* VIEW INQUIRY DETAILS MODAL                                    */}
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {activeInquiry && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '680px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '28px',
                        position: 'relative',
                        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                                        Inquiry #{activeInquiry.id}
                                    </h3>
                                    <span style={{
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        ...getStatusBadge(activeInquiry.status)
                                    }}>
                                        {activeInquiry.status || 'NEW'}
                                    </span>
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px' }}>
                                    Received on {new Date(activeInquiry.createdAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveInquiry(null)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: '#cbd5e1',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Sender Grid Card */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '14px',
                            padding: '16px 20px',
                            marginBottom: '20px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '14px'
                        }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>NAME</div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                                    {activeInquiry.name}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>EMAIL</div>
                                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ea580c', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{activeInquiry.email}</span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(activeInquiry.email)}
                                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                                        title="Copy email"
                                    >
                                        {copiedEmail ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                                    </button>
                                </div>
                            </div>

                            {activeInquiry.phone && (
                                <div>
                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PHONE / WHATSAPP</div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#38bdf8', marginTop: '2px' }}>
                                        {activeInquiry.phone}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>INTERESTED SERVICE</div>
                                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#cbd5e1', marginTop: '2px' }}>
                                    {activeInquiry.service || 'General Consultation'}
                                </div>
                            </div>

                            {activeInquiry.ipAddress && (
                                <div>
                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>IP ADDRESS</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>
                                        {activeInquiry.ipAddress}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Subject */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                                SUBJECT
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                                {activeInquiry.subject || 'Website Inquiry'}
                            </div>
                        </div>

                        {/* Full Message */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
                                MESSAGE CONTENT
                            </div>
                            <div style={{
                                background: 'rgba(15, 23, 42, 0.75)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '16px 20px',
                                fontSize: '14px',
                                color: '#e2e8f0',
                                lineHeight: 1.7,
                                whiteSpace: 'pre-wrap'
                            }}>
                                {activeInquiry.message}
                            </div>
                        </div>

                        {/* Internal Admin Notes */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                                INTERNAL ADMIN NOTES
                            </div>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add private notes about this client (e.g. called on Monday, scheduled demo call for next week, sent proposal #402)…"
                                rows={3}
                                className="admin-control-textarea"
                                style={{ fontSize: '13px' }}
                            />
                        </div>

                        {/* Modal Footer Actions */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            paddingTop: '16px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                        }}>
                            {/* Update Status Dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Update Status:</span>
                                <select
                                    value={activeInquiry.status || 'NEW'}
                                    onChange={(e) => handleStatusChange(activeInquiry.id, e.target.value, adminNotes)}
                                    className="admin-control-select"
                                    style={{ height: '34px', fontSize: '12px', width: '140px' }}
                                >
                                    <option value="NEW">NEW</option>
                                    <option value="READ">READ</option>
                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                    <option value="REPLIED">REPLIED</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange(activeInquiry.id, activeInquiry.status || 'NEW', adminNotes)}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ fontSize: '12.5px', padding: '7px 14px' }}
                                    disabled={isUpdatingStatus}
                                >
                                    Save Notes
                                </button>

                                <a
                                    href={`mailto:${activeInquiry.email}?subject=Re: ${encodeURIComponent(activeInquiry.subject || 'Your Inquiry to Namustutam')}`}
                                    className="admin-btn admin-btn-orange"
                                    style={{ fontSize: '12.5px', padding: '7px 16px', textDecoration: 'none' }}
                                    onClick={() => {
                                        if (activeInquiry.status === 'NEW') {
                                            handleStatusChange(activeInquiry.id, 'REPLIED');
                                        }
                                    }}
                                >
                                    <Send size={14} />
                                    <span>Reply via Email</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {/* DELETE CONFIRMATION MODAL                                     */}
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {deleteId && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '440px',
                        padding: '24px',
                        textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
                    }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <Trash2 size={24} />
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                            Delete Contact Inquiry?
                        </h3>
                        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                            Are you sure you want to delete inquiry #{deleteId}? This action permanently removes the record from the database and cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                type="button"
                                onClick={() => setDeleteId(null)}
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '8px 18px', fontSize: '13px' }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteSubmission}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '10px',
                                    background: '#ef4444',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting…' : 'Delete Inquiry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
