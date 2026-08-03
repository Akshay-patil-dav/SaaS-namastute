import React, { useState, useEffect } from 'react';
import apiClient, { API } from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import { FileText, ArrowRight, Loader2, Users, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotesWidget() {
    const { isAdmin } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const endpoint = isAdmin() ? `${API.NOTES}/all` : `${API.NOTES}/my-notes`;
                const res = await apiClient.get(endpoint);
                setNotes(res.data.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch recent notes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
        const interval = setInterval(fetchNotes, 60000);
        return () => clearInterval(interval);
    }, [isAdmin]);

    return (
        <div className="dash-card h-100 d-flex flex-column" style={{ minHeight: '320px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-2" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                        <FileText size={18} />
                    </div>
                    <h5 className="dash-title mb-0">Recent Notes</h5>
                </div>
                <Link 
                    to={isAdmin() ? "/dashboard/admin-notes" : "/dashboard/my-notes"} 
                    className="text-primary text-decoration-none small fw-semibold d-flex align-items-center gap-1"
                >
                    View All <ArrowRight size={14} />
                </Link>
            </div>

            <div className="flex-grow-1 overflow-auto pe-2 custom-scrollbar d-flex flex-column gap-3">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-primary" role="status" style={{width:24,height:24}} />
                    </div>
                ) : notes.length === 0 ? (
                    <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                        <FileText size={32} className="mb-2 opacity-50" />
                        <p className="small mb-0">No recent notes found.</p>
                    </div>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="p-3 bg-light border rounded-3 transition-colors" 
                             style={{ transition: 'background-color 0.2s' }}
                             onMouseEnter={(e) => e.currentTarget.classList.add('bg-white')}
                             onMouseLeave={(e) => e.currentTarget.classList.remove('bg-white')}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                {note.forAll ? (
                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                                        <Users size={10} /> Everyone
                                    </span>
                                ) : (
                                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                                        <User size={10} /> {isAdmin() ? note.targetUserName : 'For You'}
                                    </span>
                                )}
                                <span className="text-muted fw-medium" style={{ fontSize: '10px' }}>
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-secondary mb-0 small line-clamp-3" style={{ lineHeight: '1.5' }}>
                                {note.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
            
            <style jsx>{`
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
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
