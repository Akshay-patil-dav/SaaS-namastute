import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome, {user?.identifier?.split('@')[0] || 'User'}!
                </h1>
                <p className="text-gray-500">
                    Use the sidebar to navigate your workspace.
                </p>
            </div>
        </div>
    );
}
