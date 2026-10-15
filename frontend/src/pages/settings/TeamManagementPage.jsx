import React from 'react';
import TeamManagement from '../../components/settings/GeneralSettings/TeamManagement';

export default function TeamManagementPage() {
    return (
        <div className="page-wrapper" style={{ padding: '24px 28px', minHeight: '100vh', background: '#f8fafc' }}>
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                <TeamManagement />
            </div>
        </div>
    );
}
