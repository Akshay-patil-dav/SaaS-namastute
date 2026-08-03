import React, { useState, useEffect } from 'react';
import apiClient, { API } from '../../../api/config';
import { Loader2, Plus, Users, User, Trash2 } from 'lucide-react';
import './AdminNotes.css';

export default function AdminNotes() {
    const [notes, setNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [content, setContent] = useState('');
    const [forAll, setForAll] = useState(true);
    const [targetUserId, setTargetUserId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchNotes();
        fetchUsers();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await apiClient.get(`${API.NOTES}/all`);
            setNotes(res.data);
        } catch (error) {
            console.error('Failed to fetch notes', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get(API.USERS);
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiClient.post(API.NOTES, {
                content,
                forAll,
                targetUserId: forAll ? null : targetUserId
            });
            setContent('');
            setForAll(true);
            setTargetUserId('');
            setShowForm(false);
            fetchNotes();
        } catch (error) {
            console.error('Failed to create note', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await apiClient.delete(`${API.NOTES}/${id}`);
            fetchNotes();
        } catch (error) {
            console.error('Failed to delete note', error);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100 py-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h3 className="fw-bold mb-1" style={{color: '#1e293b'}}>Notes Management</h3>
                    <p className="text-muted small mb-0">Manage and assign notes to users</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary d-flex align-items-center gap-2"
                >
                    <Plus size={18} />
                    {showForm ? 'Close Form' : 'New Note'}
                </button>
            </div>

            {showForm && (
                <div className="card shadow-sm border-0 mb-4 form-slide-down">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4 text-dark">Create a Note</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-medium">Content</label>
                                <textarea
                                    required
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="form-control bg-light"
                                    rows="4"
                                    placeholder="Enter note content here..."
                                ></textarea>
                            </div>
                            
                            <div className="mb-3 d-flex gap-4">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="visibility" 
                                        id="forAll"
                                        checked={forAll}
                                        onChange={() => setForAll(true)}
                                    />
                                    <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer" htmlFor="forAll">
                                        <Users size={16} /> All Users
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="visibility" 
                                        id="forUser"
                                        checked={!forAll}
                                        onChange={() => setForAll(false)}
                                    />
                                    <label className="form-check-label d-flex align-items-center gap-1 cursor-pointer" htmlFor="forUser">
                                        <User size={16} /> Specific User
                                    </label>
                                </div>
                            </div>
                            
                            {!forAll && (
                                <div className="mb-4 fade-in">
                                    <label className="form-label fw-medium">Select User</label>
                                    <select
                                        required={!forAll}
                                        value={targetUserId}
                                        onChange={(e) => setTargetUserId(e.target.value)}
                                        className="form-select bg-light"
                                    >
                                        <option value="">-- Choose a user --</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            <div className="d-flex justify-content-end">
                                <button type="submit" disabled={submitting} className="btn btn-dark px-4 py-2">
                                    {submitting ? 'Saving...' : 'Save Note'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {notes.length === 0 ? (
                    <div className="col-12">
                        <div className="card shadow-sm border-0 text-center py-5">
                            <p className="text-muted mb-0">No notes found.</p>
                        </div>
                    </div>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card shadow-sm border-0 h-100 note-card position-relative">
                                <button 
                                    className="btn btn-sm text-danger position-absolute top-0 end-0 m-2 delete-btn"
                                    onClick={() => handleDelete(note.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="card-body">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        {note.forAll ? (
                                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 d-flex align-items-center gap-1">
                                                <Users size={12} /> Everyone
                                            </span>
                                        ) : (
                                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 d-flex align-items-center gap-1">
                                                <User size={12} /> {note.targetUserName || 'Specific User'}
                                            </span>
                                        )}
                                        <small className="text-muted">{new Date(note.createdAt).toLocaleDateString()}</small>
                                    </div>
                                    <p className="card-text text-secondary mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                                        {note.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
