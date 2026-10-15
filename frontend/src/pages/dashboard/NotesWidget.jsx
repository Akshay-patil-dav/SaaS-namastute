import React, { useState, useEffect } from 'react';
import apiClient, { API } from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import { FileText, Plus, Trash2, Users, User, CheckCircle2 } from 'lucide-react';

export default function NotesWidget() {
    const { isAdmin, user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNoteText, setNewNoteText] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchNotes = async () => {
        try {
            const endpoint = (typeof isAdmin === 'function' && isAdmin()) ? `${API.NOTES}/all` : `${API.NOTES}/my-notes`;
            const res = await apiClient.get(endpoint);
            if (Array.isArray(res.data)) {
                setNotes(res.data.slice(0, 5));
                return;
            }
        } catch {
            // Fallback to localStorage memo notes if API is not reachable
            try {
                const local = localStorage.getItem('namustutam_dashboard_notes');
                if (local) {
                    setNotes(JSON.parse(local).slice(0, 5));
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
        const interval = setInterval(fetchNotes, 45000);
        return () => clearInterval(interval);
    }, []);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNoteText.trim() || submitting) return;

        setSubmitting(true);
        const notePayload = {
            content: newNoteText.trim(),
            forAll: true,
            createdAt: new Date().toISOString()
        };

        try {
            const res = await apiClient.post(`${API.NOTES}`, notePayload);
            if (res.data) {
                setNotes(prev => [res.data, ...prev].slice(0, 5));
            }
        } catch {
            // Local fallback
            const localNote = {
                id: Date.now(),
                content: newNoteText.trim(),
                forAll: true,
                createdAt: new Date().toISOString()
            };
            const updated = [localNote, ...notes].slice(0, 5);
            setNotes(updated);
            try {
                localStorage.setItem('namustutam_dashboard_notes', JSON.stringify(updated));
            } catch (err) {
                console.error(err);
            }
        } finally {
            setNewNoteText('');
            setIsAdding(false);
            setSubmitting(false);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await apiClient.delete(`${API.NOTES}/${id}`);
        } catch {
            // Ignore API delete error for local fallback
        }
        setNotes(prev => {
            const updated = prev.filter(n => n.id !== id);
            try {
                localStorage.setItem('namustutam_dashboard_notes', JSON.stringify(updated));
            } catch (err) {
                console.error(err);
            }
            return updated;
        });
    };

    const formatNoteDate = (dStr) => {
        if (!dStr) return 'Just now';
        try {
            const d = new Date(dStr);
            const now = new Date();
            const isToday = d.toDateString() === now.toDateString();
            if (isToday) {
                return 'Today, ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        } catch {
            return 'Recently';
        }
    };

    return (
        <div className="dash-card h-100 d-flex flex-column" style={{ minHeight: '340px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-2" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                        <FileText size={18} />
                    </div>
                    <div>
                        <h5 className="dash-title mb-0" style={{ fontSize: '1.05rem' }}>Workspace Notes</h5>
                        <p className="text-muted small mb-0" style={{ fontSize: '11px' }}>Quick memos &amp; reminders</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-pill px-2.5 py-1"
                    style={{ fontSize: '11.5px', fontWeight: 600 }}
                    type="button"
                >
                    <Plus size={13} /> {isAdding ? 'Cancel' : 'New Note'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddNote} className="mb-3 p-2 bg-light rounded-3 border">
                    <textarea 
                        className="form-control form-control-sm mb-2"
                        rows="2"
                        placeholder="Write a reminder, task, or team memo..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        autoFocus
                        style={{ fontSize: '12px', resize: 'none' }}
                    />
                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light border py-0.5 px-2 text-secondary" 
                            style={{ fontSize: '11.5px' }}
                            onClick={() => { setIsAdding(false); setNewNoteText(''); }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!newNoteText.trim() || submitting}
                            className="btn btn-sm btn-primary py-0.5 px-2.5" 
                            style={{ fontSize: '11.5px', backgroundColor: '#ea580c', borderColor: '#ea580c' }}
                        >
                            {submitting ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </form>
            )}

            <div className="flex-grow-1 overflow-auto pe-1 custom-scrollbar d-flex flex-column gap-2.5" style={{ maxHeight: '250px' }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100 py-4">
                        <div className="spinner-border text-primary" role="status" style={{ width: 22, height: 22 }} />
                    </div>
                ) : notes.length === 0 ? (
                    <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted py-4">
                        <FileText size={28} className="mb-2 opacity-40 text-secondary" />
                        <p className="small mb-1 fw-medium">No notes created yet</p>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="btn btn-sm btn-link text-decoration-none p-0 text-primary small"
                            style={{ fontSize: '11.5px' }}
                        >
                            + Add your first note
                        </button>
                    </div>
                ) : (
                    notes.map(note => (
                        <div 
                            key={note.id} 
                            className="p-2.5 bg-light border rounded-3 position-relative group-note"
                            style={{ transition: 'all 0.2s', fontSize: '12px' }}
                        >
                            <div className="d-flex justify-content-between align-items-start mb-1.5">
                                <span className="badge bg-white text-secondary border d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                                    <Users size={10} color="#64748b" /> {note.forAll ? 'Team Memo' : 'Private'}
                                </span>
                                <div className="d-flex align-items-center gap-1.5">
                                    <span className="text-muted" style={{ fontSize: '10px' }}>
                                        {formatNoteDate(note.createdAt)}
                                    </span>
                                    <button 
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="btn btn-sm p-0 text-muted hover-text-danger border-0 bg-transparent ms-1"
                                        title="Delete note"
                                        type="button"
                                    >
                                        <Trash2 size={12} className="opacity-60 hover-opacity-100" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-dark mb-0" style={{ lineHeight: '1.45', wordBreak: 'break-word' }}>
                                {note.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="pt-2 mt-auto border-top text-center">
                <span className="text-muted small" style={{ fontSize: '10.5px' }}>
                    💡 Notes are synced across active team members in this workspace
                </span>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: #94a3b8;
                }
                .group-note:hover {
                    background: #ffffff !important;
                    border-color: #cbd5e1 !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .hover-text-danger:hover {
                    color: #ef4444 !important;
                }
            `}</style>
        </div>
    );
}
