import React, { useState, useEffect } from 'react';
import apiClient from '@/api/config';
import { Users, Mail, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const MODULES = [
    { id: 'products', name: 'Products' },
    { id: 'inventory', name: 'Inventory & Stock' },
    { id: 'sales', name: 'Sales & Invoices' },
    { id: 'pos', name: 'POS Terminal' },
    { id: 'purchases', name: 'Purchases' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'settings', name: 'Settings' }
];

const ACTIONS = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'MANAGE'];

export default function TeamManagement() {
    const [members, setMembers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [membersRes, invitesRes] = await Promise.all([
                apiClient.get('/project/members'),
                apiClient.get('/project/invitations')
            ]);
            setMembers(membersRes.data);
            setInvitations(invitesRes.data);
        } catch (error) {
            console.error("Failed to fetch team data", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionToggle = (mod, action) => {
        setSelectedPermissions(prev => {
            const currentModPerms = prev[mod] || [];
            const newModPerms = currentModPerms.includes(action)
                ? currentModPerms.filter(a => a !== action)
                : [...currentModPerms, action];
            
            return {
                ...prev,
                [mod]: newModPerms
            };
        });
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/project/invite', {
                email: inviteEmail,
                permissions: JSON.stringify(selectedPermissions)
            });
            setShowInviteModal(false);
            setInviteEmail('');
            setSelectedPermissions({});
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to invite user");
        }
    };

    const handleCancelInvitation = async (id) => {
        try {
            await apiClient.delete(`/project/invitations/${id}`);
            fetchData();
        } catch (error) {
            console.error("Failed to cancel invitation", error);
        }
    };

    const handleRemoveMember = async (id) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        try {
            await apiClient.delete(`/project/members/${id}`);
            fetchData();
        } catch (error) {
            console.error("Failed to remove member", error);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading team data...</div>;

    return (
        <>
            <div className="settings-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>Team Management</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Invite and manage user access to your workspace.</p>
                </div>
                <button 
                    className="btn-action orange d-flex align-items-center gap-2"
                    onClick={() => setShowInviteModal(true)}
                >
                    <Plus size={16} /> Invite User
                </button>
            </div>

            <div className="settings-content-body">
                {/* Active Members */}
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: '#1e293b' }}>
                    <Users size={18} /> Active Members
                </h5>
                <div className="table-responsive mb-5 border rounded-3 overflow-hidden">
                    <table className="table table-hover mb-0">
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Name</th>
                                <th style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Email</th>
                                <th style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Permissions</th>
                                <th style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">No active members.</td>
                                </tr>
                            ) : members.map(m => {
                                let parsedPerms = {};
                                try {
                                    if (m.permissions) parsedPerms = JSON.parse(m.permissions);
                                } catch(e) {}
                                return (
                                <tr key={m.id}>
                                    <td className="align-middle fw-medium" style={{ color: '#334155' }}>{m.memberName}</td>
                                    <td className="align-middle text-secondary">{m.memberEmail}</td>
                                    <td className="align-middle">
                                        <div className="d-flex flex-wrap gap-1">
                                            {Object.keys(parsedPerms).map(mod => (
                                                <span key={mod} className="badge bg-light text-dark border" style={{ fontSize: '11px' }}>
                                                    {mod} ({parsedPerms[mod].length})
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="align-middle text-end">
                                        <button className="btn btn-sm text-danger" onClick={() => handleRemoveMember(m.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>

                {/* Pending Invitations */}
                <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: '#1e293b' }}>
                    <Mail size={18} /> Pending Invitations
                </h5>
                <div className="table-responsive border rounded-3 overflow-hidden">
                    <table className="table table-hover mb-0">
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Email</th>
                                <th style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Status</th>
                                <th style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invitations.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-muted">No pending invitations.</td>
                                </tr>
                            ) : invitations.map(inv => (
                                <tr key={inv.id}>
                                    <td className="align-middle text-secondary">{inv.inviteeEmail}</td>
                                    <td className="align-middle">
                                        <span className="badge bg-warning text-dark">Pending</span>
                                    </td>
                                    <td className="align-middle text-end">
                                        <button className="btn btn-sm text-danger" onClick={() => handleCancelInvitation(inv.id)}>
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="bg-white rounded-3 shadow p-4" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h4 className="mb-0">Invite User</h4>
                            <button className="btn-close" onClick={() => setShowInviteModal(false)}></button>
                        </div>
                        <form onSubmit={handleInvite}>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    required 
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold mb-3">Permissions</label>
                                {MODULES.map(mod => (
                                    <div key={mod.id} className="mb-3 pb-3 border-bottom">
                                        <div className="fw-medium mb-2">{mod.name}</div>
                                        <div className="d-flex flex-wrap gap-3">
                                            {ACTIONS.map(action => (
                                                <label key={action} className="d-flex align-items-center gap-2 cursor-pointer" style={{ fontSize: '13px' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-check-input mt-0"
                                                        checked={(selectedPermissions[mod.id] || []).includes(action)}
                                                        onChange={() => handlePermissionToggle(mod.id, action)}
                                                    />
                                                    {action}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                <button type="button" className="btn btn-light" onClick={() => setShowInviteModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ background: 'var(--primary-color)', border: 'none' }}>Send Invitation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
