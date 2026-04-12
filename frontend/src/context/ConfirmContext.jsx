import React, { createContext, useState, useContext } from 'react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        resolve: null
    });

    const confirm = (options) => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                title: options?.title || 'Delete Product',
                message: options?.message || 'Are you sure you want to delete product?',
                resolve: resolve
            });
        });
    };

    const handleConfirm = () => {
        if (confirmState.resolve) {
            confirmState.resolve(true);
        }
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleCancel = () => {
        if (confirmState.resolve) {
            confirmState.resolve(false);
        }
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <DeleteConfirmModal 
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={handleConfirm}
                onClose={handleCancel}
            />
        </ConfirmContext.Provider>
    );
};
