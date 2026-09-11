import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, ChevronDown, Check } from 'lucide-react';
import apiClient from '../../../api/config';
import { useAuth } from '../../../context/AuthContext';

export default function ProjectSwitcher() {
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const switcherRef = useRef(null);
    const { user, fetchSession } = useAuth();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await apiClient.get('/invitations/accepted');
                setProjects(res.data);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        };
        if (user) {
            fetchProjects();
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = async (projectId) => {
        try {
            await apiClient.post(`/invitations/switch-project/${projectId}`);
            await fetchSession(); // Refresh context
            setOpen(false);
            // Optionally reload page to ensure all state is fresh
            window.location.reload();
        } catch (err) {
            console.error("Failed to switch project", err);
        }
    };

    // Determine current active project name
    let currentProjectName = "My Workspace";
    if (user?.activeProjectId && user.activeProjectId !== 0) {
        const active = projects.find(p => p.projectId === user.activeProjectId);
        if (active) {
            currentProjectName = active.ownerName + "'s Workspace";
        }
    }

    return (
        <div className="d-none d-md-flex align-items-center ms-2" ref={switcherRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill border-0"
                style={{
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    backgroundColor: open ? 'rgba(99, 102, 241, 0.12)' : '#f4f5f9',
                    color: open ? '#6366f1' : '#4b5563',
                    transition: 'all 0.2s ease'
                }}
            >
                <Briefcase size={16} style={{ color: open ? '#6366f1' : '#6b7280' }} />
                <span>{currentProjectName}</span>
                <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {open && (
                <div
                    className="shadow-lg border rounded-3 bg-white py-2"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '8px',
                        width: '240px',
                        zIndex: 1050,
                        animation: 'fadeIn 0.15s ease-out'
                    }}
                >
                    <div className="px-3 py-1.5 text-muted small fw-bold border-bottom" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                        WORKSPACES
                    </div>

                    <button
                        className="d-flex align-items-center justify-content-between gap-2.5 px-3 py-2 text-decoration-none text-dark w-100 text-start border-0 bg-transparent"
                        style={{ fontSize: '13px', fontWeight: '500', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => handleSwitch(0)} // 0 switches back to own
                    >
                        <div className="d-flex align-items-center gap-2">
                            <div className="p-1.5 rounded" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
                                <Briefcase size={15} />
                            </div>
                            <div>
                                <div className="fw-semibold" style={{ fontSize: '13px', color: '#1f2937' }}>My Workspace</div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>Personal account</div>
                            </div>
                        </div>
                        {(!user?.activeProjectId || user?.activeProjectId === 0) && <Check size={16} color="#10b981" />}
                    </button>

                    {projects.map(p => (
                        <button
                            key={p.projectId}
                            className="d-flex align-items-center justify-content-between gap-2.5 px-3 py-2 text-decoration-none text-dark w-100 text-start border-0 bg-transparent"
                            style={{ fontSize: '13px', fontWeight: '500', transition: 'background 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={() => handleSwitch(p.projectId)}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <div className="p-1.5 rounded" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                                    <Briefcase size={15} />
                                </div>
                                <div>
                                    <div className="fw-semibold" style={{ fontSize: '13px', color: '#1f2937' }}>{p.ownerName}'s Workspace</div>
                                    <div className="text-muted" style={{ fontSize: '11px' }}>{p.ownerEmail}</div>
                                </div>
                            </div>
                            {user?.activeProjectId === p.projectId && <Check size={16} color="#10b981" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
