import React from 'react';
import { Trash2 } from 'lucide-react';
import './delete-confirm-modal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="global-delete-overlay">
            <div className="global-delete-modal">
                <div className="global-delete-icon-wrapper">
                    <Trash2 size={32} />
                </div>
                <h4>{title || "Delete Product"}</h4>
                <p>{message || "Are you sure you want to delete product?"}</p>
                <div className="global-delete-actions">
                    <button className="btn-cancel-global" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-confirm-global" onClick={onConfirm}>
                        Yes Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
