import React from 'react';
import './CustomizeWebsite.css';

export default function CustomizeWebsite() {
    return (
        <div className="customize-website-container">
            <div className="customize-website-header">
                <h2>Customize Website</h2>
                <p>Configure and customize your website appearance and settings here.</p>
            </div>
            
            <div className="customize-website-content">
                <div className="customize-card">
                    <h3>Theme Settings</h3>
                    <p>Change your primary colors, fonts, and layout options.</p>
                    <button className="btn btn-primary mt-3">Coming Soon</button>
                </div>
            </div>
        </div>
    );
}
