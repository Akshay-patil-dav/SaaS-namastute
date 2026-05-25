import React from 'react';
import { Trash2, Loader } from 'lucide-react';
import './delete-confirm-modal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="global-delete-overlay" onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onClose(); }}>
            <div className="global-delete-modal">
                <div className="global-delete-icon-wrapper">
                    <Trash2 size={30} strokeWidth={2} />
                </div>
                <h4>{title || 'Delete Item'}</h4>
                <p>{message || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>
                <div className="global-delete-actions">
                    <button 
                        className="btn-cancel-global" 
                        onClick={onClose} 
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn-confirm-global" 
                        onClick={onConfirm} 
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <><Loader size={14} className="spin" /> Deleting...</>
                        ) : (
                            'Yes, Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
