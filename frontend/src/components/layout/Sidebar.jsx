import React, { useState, useEffect, useRef } from 'react';
import {
    FolderGit2, ChevronDown, ChevronRight, Plus, Folder, File as FileIcon, Loader2, UserPlus, Trash2, GripVertical, Image as ImageIcon, MoreHorizontal
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import axios from 'axios';
import ContextMenu from '../ContextMenu';
import IconPicker, { getIconByName } from '../IconPicker';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const isClientOrAdmin = user?.roles?.some(role => ['CLIENT', 'OTHER', 'ROLE_CLIENT'].includes(role.toUpperCase()));
    const { refreshKey, triggerRefresh } = useWorkspace() || {};

    // Notion-style workspace state
    const [folders, setFolders] = useState([]);
    const [pages, setPages] = useState([]);
    const [loadingWorkspace, setLoadingWorkspace] = useState(false);

    // Drag-and-drop state
    const [draggedPageId, setDraggedPageId] = useState(null);
    const [dragOverFolderId, setDragOverFolderId] = useState(null);

    // Global Modals State
    const [modal, setModal] = useState({ isOpen: false, type: null, targetId: null });
    const [modalInput, setModalInput] = useState('');

    // Context Menu State
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, target: null });
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconPickerTarget, setIconPickerTarget] = useState(null);

    // Fetch user workspace files for the sidebar tree
    const fetchWorkspace = () => {
        if (!isClientOrAdmin || !token) return;
        setLoadingWorkspace(true);
        axios.get('http://localhost:3000/api/builder/data', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const incoming = res.data.folders || [];
                setFolders(prev => incoming.map(f => {
                    const existing = prev.find(p => p.id === f.id);
                    return { ...f, open: existing ? existing.open : true };
                }));
                setPages(res.data.pages || []);
            })
            .catch(err => console.error("Failed to load workspace nav", err))
            .finally(() => setLoadingWorkspace(false));
    };

    useEffect(() => { fetchWorkspace(); }, [token, isClientOrAdmin, refreshKey]);

    // Listen for real-time workspace changes from OTHER users via SSE
    useEffect(() => {
        if (!token || !isClientOrAdmin) return;
        const url = `http://localhost:3000/api/builder/notifications/stream?token=${token}`;
        const es = new EventSource(url);
        es.addEventListener('workspace_change', () => {
            fetchWorkspace();
        });
        return () => es.close();
    }, [token, isClientOrAdmin]);

    const toggleFolder = (folderId) => {
        setFolders(folders.map(f => f.id === folderId ? { ...f, open: !f.open } : f));
    };

    // Modal Handlers
    const openFolderModal = (e) => {
        if (e) e.preventDefault();
        setModal({ isOpen: true, type: 'FOLDER', targetId: null });
        setModalInput('');
    };

    const openPageModal = (e, folderId) => {
        e.preventDefault();
        e.stopPropagation();
        setModal({ isOpen: true, type: 'PAGE', targetId: folderId });
        setModalInput('');
    };

    const openInviteModal = (e, folderId) => {
        e.preventDefault();
        e.stopPropagation();
        setModal({ isOpen: true, type: 'INVITE', targetId: folderId });
        setModalInput('');
    };

    // DELETE handlers
    const handleDeleteFolder = (folder) => {
        if (!window.confirm(`Delete folder "${folder.name}" and ALL its pages? This cannot be undone.`)) return;
        const numericId = folder.id.replace('f', '');
        axios.delete(`http://localhost:3000/api/builder/folders/${numericId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
            setFolders(prev => prev.filter(f => f.id !== folder.id));
            setPages(prev => prev.filter(p => p.folderId !== folder.id));
        }).catch(err => alert('Failed to delete folder: ' + (err.response?.data?.error || 'Unknown error')));
    };

    const handleDeletePage = (page) => {
        if (!window.confirm(`Delete page "${page.name}"? This cannot be undone.`)) return;
        const numericId = page.id.replace('p', '');
        axios.delete(`http://localhost:3000/api/builder/pages/${numericId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
            setPages(prev => prev.filter(p => p.id !== page.id));
        }).catch(err => alert('Failed to delete page: ' + (err.response?.data?.error || 'Unknown error')));
    };

    // ICON UPDATE handlers
    const handleUpdateFolderIcon = (folder, iconName) => {
        const numericId = folder.id.replace('f', '');
        axios.put(`http://localhost:3000/api/builder/folders/${numericId}/icon`,
            { icon: iconName },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(() => {
            setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, icon: iconName } : f));
        }).catch(err => alert('Failed to update folder icon: ' + (err.response?.data?.error || 'Unknown error')));
    };

    const handleUpdatePageIcon = (page, iconName) => {
        const numericId = page.id.replace('p', '');
        axios.put(`http://localhost:3000/api/builder/pages/${numericId}/icon`,
            { icon: iconName },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(() => {
            setPages(prev => prev.map(p => p.id === page.id ? { ...p, icon: iconName } : p));
        }).catch(err => alert('Failed to update page icon: ' + (err.response?.data?.error || 'Unknown error')));
    };

    // --- DRAG AND DROP handlers ---
    const handleDragStart = (e, pageId) => {
        setDraggedPageId(pageId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', pageId);
    };

    const handleDragOver = (e, folderId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverFolderId(folderId);
    };

    const handleDrop = (e, targetFolderId) => {
        e.preventDefault();
        setDragOverFolderId(null);
        if (!draggedPageId || draggedPageId === targetFolderId) return;
        const page = pages.find(p => p.id === draggedPageId);
        if (!page || page.folderId === targetFolderId) return;

        const numericPageId = draggedPageId.replace('p', '');
        const numericFolderId = targetFolderId.replace('f', '');

        setPages(prev => prev.map(p => p.id === draggedPageId ? { ...p, folderId: targetFolderId } : p));

        axios.put(`http://localhost:3000/api/builder/pages/${numericPageId}/move`,
            { folderId: `f${numericFolderId}` },
            { headers: { Authorization: `Bearer ${token}` } }
        ).catch(err => {
            setPages(prev => prev.map(p => p.id === draggedPageId ? { ...p, folderId: page.folderId } : p));
            alert('Failed to move page');
        });

        setDraggedPageId(null);
    };

    const handleDragEnd = () => {
        setDraggedPageId(null);
        setDragOverFolderId(null);
    };

    const confirmModal = () => {
        if (!modalInput.trim()) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };

        if (modal.type === 'FOLDER') {
            axios.post('http://localhost:3000/api/builder/folders', { name: modalInput }, config)
                .then(res => setFolders([...folders, { ...res.data, open: true }]))
                .catch(err => alert("Failed to create folder"))
                .finally(() => setModal({ isOpen: false }));
        } else if (modal.type === 'PAGE') {
            axios.post('http://localhost:3000/api/builder/pages', { name: modalInput, folderId: modal.targetId }, config)
                .then(res => {
                    const newPage = res.data;
                    setPages([...pages, newPage]);
                    if (!folders.find(f => f.id === modal.targetId)?.open) {
                        toggleFolder(modal.targetId);
                    }
                    navigate(`/page-builder/${newPage.id}`);
                })
                .catch(err => alert("Failed to auto-create page"))
                .finally(() => setModal({ isOpen: false }));
        } else if (modal.type === 'INVITE') {
            axios.post(`http://localhost:3000/api/builder/folders/${modal.targetId}/invite`, { email: modalInput }, config)
                .then(res => {
                    alert(`== INVITATION SECURE LINK GENERATED ==\nCopy and send this link to your teammate:\n\nhttp://localhost:3000/invite/accept/${res.data.token}`);
                })
                .catch(err => alert("Failed to generate invite. You must be the original folder owner."))
                .finally(() => setModal({ isOpen: false }));
        }
    };

    // Context Menu Handlers
    const handleContextMenu = (e, type, target) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            type,
            target
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, type: null, target: null });
    };

    const handleIconSelect = (iconName) => {
        if (iconPickerTarget) {
            if (iconPickerTarget.type === 'folder') {
                handleUpdateFolderIcon(iconPickerTarget.data, iconName);
            } else {
                handleUpdatePageIcon(iconPickerTarget.data, iconName);
            }
        }
        setShowIconPicker(false);
        setIconPickerTarget(null);
        closeContextMenu();
    };

    const openIconPicker = (type, data) => {
        setIconPickerTarget({ type, data });
        setShowIconPicker(true);
    };

    return (
        <div className="w-[260px] bg-white border-r border-gray-100 flex flex-col h-full shrink-0 relative">
            {/* Logo Area */}
            <div className="h-[70px] flex items-center justify-between px-6 border-b border-gray-100 border-opacity-50">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M4 12V20H8V12H4Z" fill="#6366f1"/>
                         <path d="M10 8V20H14V8H10Z" fill="#a855f7"/>
                         <path d="M16 16V20H20V16H16Z" fill="#ec4899"/>
                    </svg>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">Paces</span>
                </div>
                <div className="p-1 border text-black border-black/20 rounded-full cursor-pointer hover:bg-gray-50">
                    <div className="w-2.5 h-2.5 rounded-full bg-black/80" />
                </div>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent py-4 px-3 space-y-6">

                {/* YOUR WORKSPACE SECTION (DYNAMIC) */}
                {isClientOrAdmin && (
                    <div>
                        <div className="px-4 text-[10px] font-bold text-gray-400 mb-2 tracking-widest flex justify-between items-center group">
                            <span>YOUR WORKSPACE</span>
                            <button
                                onClick={openFolderModal}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-100 rounded transition-opacity"
                                title="New Folder"
                            >
                                <Plus size={14} className="text-gray-400 hover:text-indigo-500" />
                            </button>
                        </div>

                        {loadingWorkspace && folders.length === 0 ? (
                            <div className="px-5 py-4 flex items-center justify-center">
                                <Loader2 size={16} className="text-gray-300 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-[1px] mt-2">
                                {folders.map(folder => {
                                    const FolderIcon = getIconByName(folder.icon) || Folder;
                                    return (
                                        <div key={folder.id} className="mb-1">
                                            <div
                                                className={`flex items-center justify-between group px-3 py-2 rounded-md cursor-pointer transition-colors ${
                                                    dragOverFolderId === folder.id
                                                        ? 'bg-indigo-100 ring-2 ring-indigo-300 ring-inset'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                                onClick={() => toggleFolder(folder.id)}
                                                onContextMenu={(e) => handleContextMenu(e, 'folder', folder)}
                                                onDragOver={(e) => handleDragOver(e, folder.id)}
                                                onDragLeave={() => setDragOverFolderId(null)}
                                                onDrop={(e) => handleDrop(e, folder.id)}
                                            >
                                                <div className="flex items-center gap-2 items-center">
                                                    {folder.open === false ? <ChevronRight size={12} className="text-gray-400"/> : <ChevronDown size={12} className="text-gray-400"/>}
                                                    <FolderIcon size={14} className={`${dragOverFolderId === folder.id ? 'text-indigo-600' : 'text-indigo-400 fill-indigo-50/50'}`} />
                                                    <span className="text-[13px] font-medium text-gray-700 truncate w-[110px]">{folder.name}</span>
                                                    {dragOverFolderId === folder.id && <span className="text-[10px] text-indigo-500 font-semibold">Drop here</span>}
                                                </div>
                                                <div className="flex items-center">
                                                    {folder.ownedByMe !== false && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openInviteModal(e, folder.id); }}
                                                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-indigo-50 rounded text-indigo-400 hover:text-indigo-600 transition-opacity flex items-center justify-center mr-0.5"
                                                            title={`Share ${folder.name} with team`}
                                                        >
                                                            <UserPlus size={13} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openPageModal(e, folder.id); }}
                                                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded text-gray-500 transition-opacity flex items-center justify-center mr-0.5"
                                                        title={`Add page inside ${folder.name}`}
                                                    >
                                                        <Plus size={13} />
                                                    </button>
                                                    {folder.ownedByMe !== false && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder); }}
                                                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-opacity flex items-center justify-center"
                                                            title={`Delete folder ${folder.name}`}
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Nested Pages array */}
                                            {folder.open !== false && (
                                                <div className="mt-[2px] space-y-[2px]">
                                                    {pages.filter(p => p.folderId === folder.id).map(page => {
                                                        const pageUrl = `/page-builder/${page.id}`;
                                                        const isActivePage = location.pathname === pageUrl;
                                                        const PageIcon = getIconByName(page.icon) || FileIcon;
                                                        return (
                                                            <div
                                                                key={page.id}
                                                                className={`group flex items-center justify-between rounded-r-md border-l-2 transition-all ${
                                                                    draggedPageId === page.id ? 'opacity-40 scale-95' : ''
                                                                } ${isActivePage ? 'bg-indigo-50 border-indigo-500' : 'border-transparent hover:bg-gray-50'}`}
                                                                draggable
                                                                onDragStart={(e) => handleDragStart(e, page.id)}
                                                                onDragEnd={handleDragEnd}
                                                                onContextMenu={(e) => handleContextMenu(e, 'page', page)}
                                                            >
                                                                <GripVertical size={12} className="ml-2 text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
                                                                <Link
                                                                    to={pageUrl}
                                                                    className={`flex items-center gap-2 pl-2 pr-1 py-1.5 flex-1 min-w-0 text-[13px] ${isActivePage ? 'text-indigo-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                                                                >
                                                                    <PageIcon size={12} className={isActivePage ? 'text-indigo-500 shrink-0' : 'text-gray-400 shrink-0'} />
                                                                    <span className="truncate">{page.name}</span>
                                                                </Link>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDeletePage(page); }}
                                                                    className="opacity-0 group-hover:opacity-100 p-1 mr-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-opacity shrink-0"
                                                                    title={`Delete page ${page.name}`}
                                                                >
                                                                    <Trash2 size={11} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                    {pages.filter(p => p.folderId === folder.id).length === 0 && (
                                                        <div className="pl-10 pr-4 py-1.5 text-[11px] text-gray-400 italic">No pages inside</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {folders.length === 0 && (
                                    <div className="px-4 py-3 text-xs text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-2 text-center">
                                        Your workspace is empty.<br/>
                                        <button onClick={openFolderModal} className="text-indigo-500 font-semibold hover:underline mt-2 inline-flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded">
                                            <FolderGit2 size={12}/> Create Folder
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* MODALS OVERLAY */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex flex-col items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                {modal.type === 'FOLDER' ? 'Create Workspace Folder' : modal.type === 'PAGE' ? 'Create New Page' : 'Invite Team Member'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {modal.type === 'INVITE' ? 'Enter their email address to generate a secure invitation link.' : `Enter a name for your new ${modal.type === 'FOLDER' ? 'folder' : 'document'}.`}
                            </p>
                            <input
                                autoFocus
                                type={modal.type === 'INVITE' ? 'email' : 'text'}
                                value={modalInput}
                                onChange={(e) => setModalInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && confirmModal()}
                                placeholder={modal.type === 'FOLDER' ? "E.g. Marketing Projects" : modal.type === 'PAGE' ? "E.g. About Us Page" : "teammate@example.com"}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex items-center gap-3 justify-end border-t border-gray-100">
                            <button
                                onClick={() => setModal({ isOpen: false })}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmModal}
                                disabled={!modalInput.trim()}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                            >
                                {modal.type === 'INVITE' ? 'Send Invite' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Context Menu */}
            <ContextMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={closeContextMenu}
            >
                <div className="py-1">
                    <button
                        onClick={() => {
                            openIconPicker(contextMenu.type, contextMenu.target);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <ImageIcon size={14} className="text-gray-500" />
                        <span>Change Icon</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                        onClick={() => {
                            if (contextMenu.type === 'folder') {
                                handleDeleteFolder(contextMenu.target);
                            } else {
                                handleDeletePage(contextMenu.target);
                            }
                            closeContextMenu();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <Trash2 size={14} />
                        <span>Delete {contextMenu.type === 'folder' ? 'Folder' : 'Page'}</span>
                    </button>
                </div>
            </ContextMenu>

            {/* Icon Picker Modal */}
            {showIconPicker && (
                <IconPicker
                    onSelect={handleIconSelect}
                    onClose={() => {
                        setShowIconPicker(false);
                        setIconPickerTarget(null);
                    }}
                    selectedIcon={iconPickerTarget?.data?.icon}
                />
            )}
        </div>
    );
}
