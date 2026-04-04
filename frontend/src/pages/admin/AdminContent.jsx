import React, { useState } from 'react';
import {
    FileText,
    Image,
    Video,
    Music,
    File,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Grid,
    List,
    Edit3,
    Trash2,
    Eye,
    Download
} from 'lucide-react';

const contentTypes = [
    { id: 'all', label: 'All Files', icon: File, count: 234 },
    { id: 'images', label: 'Images', icon: Image, count: 89 },
    { id: 'documents', label: 'Documents', icon: FileText, count: 67 },
    { id: 'videos', label: 'Videos', icon: Video, count: 23 },
    { id: 'audio', label: 'Audio', icon: Music, count: 12 },
];

const recentFiles = [
    { id: 1, name: 'Company Overview.pdf', type: 'document', size: '2.4 MB', updated: '2 hours ago', author: 'John Doe' },
    { id: 2, name: 'Banner-2024.png', type: 'image', size: '1.8 MB', updated: '5 hours ago', author: 'Jane Smith' },
    { id: 3, name: 'Product Demo.mp4', type: 'video', size: '45.2 MB', updated: '1 day ago', author: 'Bob Johnson' },
    { id: 4, name: 'Meeting Recording.mp3', type: 'audio', size: '12.5 MB', updated: '2 days ago', author: 'Alice Williams' },
    { id: 5, name: 'User Guide.pdf', type: 'document', size: '5.6 MB', updated: '3 days ago', author: 'Charlie Brown' },
    { id: 6, name: 'Logo.svg', type: 'image', size: '0.5 MB', updated: '4 days ago', author: 'Diana Prince' },
];

export default function AdminContent() {
    const [activeType, setActiveType] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const getFileIcon = (type) => {
        switch (type) {
            case 'image': return <Image size={32} className="text-success" />;
            case 'document': return <FileText size={32} className="text-primary" />;
            case 'video': return <Video size={32} className="text-danger" />;
            case 'audio': return <Music size={32} className="text-warning" />;
            default: return <File size={32} className="text-secondary" />;
        }
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Content Management</h1>
                    <p className="text-muted mb-0">Manage your files, media, and documents</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2">
                    <Plus size={18} />
                    Upload File
                </button>
            </div>

            {/* Storage Stats */}
            <div className="content-card mb-4">
                <div className="content-card-body">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <p className="text-muted mb-1">Storage Used</p>
                            <div className="d-flex align-items-baseline gap-2">
                                <h3 className="fw-bold mb-0">45.2 GB</h3>
                                <span className="text-muted">of 100 GB</span>
                            </div>
                        </div>
                        <div className="flex-grow-1 max-w-500">
                            <div className="progress" style={{height: '10px'}}>
                                <div className="progress-bar bg-primary" style={{width: '35%'}} />
                                <div className="progress-bar bg-success" style={{width: '25%'}} />
                                <div className="progress-bar bg-warning" style={{width: '20%'}} />
                                <div className="progress-bar bg-danger" style={{width: '15%'}} />
                            </div>
                            <div className="d-flex justify-content-between mt-2 small text-muted">
                                <span>Images 35%</span>
                                <span>Videos 25%</span>
                                <span>Documents 20%</span>
                                <span>Other 15%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Type Filter */}
            <div className="d-flex flex-wrap gap-2 mb-4">
                {contentTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = activeType === type.id;
                    return (
                        <button
                            key={type.id}
                            onClick={() => setActiveType(type.id)}
                            className={`btn d-flex align-items-center gap-2 ${
                                isActive ? 'btn-primary' : 'btn-light border'
                            }`}
                        >
                            <Icon size={16} />
                            {type.label}
                            <span className={`badge ${isActive ? 'bg-white text-primary' : 'bg-secondary'}`}>
                                {type.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search and View Toggle */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                <div className="flex-grow-1">
                    <div className="search-box">
                        <Search className="search-box-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control form-control-custom ps-5"
                        />
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-light border">
                        <Filter size={18} className="text-secondary" />
                    </button>
                    <div className="btn-group">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-light border'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-light border'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Files Display */}
            {viewMode === 'grid' ? (
                <div className="row g-3">
                    {recentFiles.map((file) => (
                        <div key={file.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                            <div className="content-card h-100 position-group">
                                <div className="p-3">
                                    <div className="bg-light rounded-3 d-flex align-items-center justify-content-center mb-3" style={{height: '120px'}}>
                                        {getFileIcon(file.type)}
                                    </div>
                                    <p className="fw-semibold mb-1 text-truncate small" title={file.name}>{file.name}</p>
                                    <p className="text-muted small mb-0">{file.size}</p>

                                    <div className="d-flex gap-1 mt-3 opacity-0 group-hover-opacity">
                                        <button className="btn btn-light btn-sm p-1">
                                            <Eye size={14} />
                                        </button>
                                        <button className="btn btn-light btn-sm p-1">
                                            <Edit3 size={14} />
                                        </button>
                                        <button className="btn btn-light btn-sm p-1">
                                            <Trash2 size={14} className="text-danger" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="content-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>File</th>
                                    <th>Type</th>
                                    <th className="text-end">Size</th>
                                    <th className="d-none d-md-table-cell">Author</th>
                                    <th className="d-none d-lg-table-cell">Updated</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFiles.map((file) => (
                                    <tr key={file.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <span className="fw-medium">{file.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-capitalize text-muted">{file.type}</span>
                                        </td>
                                        <td className="text-end">
                                            <span className="text-muted">{file.size}</span>
                                        </td>
                                        <td className="d-none d-md-table-cell">
                                            <span className="text-muted">{file.author}</span>
                                        </td>
                                        <td className="d-none d-lg-table-cell">
                                            <span className="text-muted">{file.updated}</span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <button className="btn btn-light btn-sm p-1">
                                                    <Eye size={16} className="text-secondary" />
                                                </button>
                                                <button className="btn btn-light btn-sm p-1">
                                                    <Edit3 size={16} className="text-primary" />
                                                </button>
                                                <button className="btn btn-light btn-sm p-1">
                                                    <Trash2 size={16} className="text-danger" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
