import React, { useState } from 'react';
import AppHeader from './AppHeader';

export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <AppHeader />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
