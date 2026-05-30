import React from 'react';
import './NodeFeatures.css';

export default function NodeFeatures({ badgeTitle = "Features", title, subtitle, features, centerNode }) {
    const leftFeatures = features.slice(0, 3);
    const rightFeatures = features.slice(3, 6);

    return (
        <div className="node-features-container">
            <div className="node-features-header">
                <div className="portfolio-section-label">
                    <span className="node-red-dot"></span> {badgeTitle}
                </div>
                <h2 className="portfolio-section-title">{title}</h2>
                {subtitle && <p className="portfolio-section-subtitle">{subtitle}</p>}
            </div>

            <div className="node-graph-wrapper">
                {/* LEFT COLUMN */}
                <div className="node-col">
                    {leftFeatures.map((f, i) => (
                        <div key={i} className={`node-card left-card ${i === 0 ? 'top' : i === 1 ? 'mid' : 'bot'}`}>
                            <div className="node-card-icon">{f.icon}</div>
                            <h3 className="node-card-title">{f.title}</h3>
                            <p className="node-card-desc">{f.desc}</p>
                            
                            {/* CSS Connector Lines attached to the card */}
                            <div className={`node-line left-line line-${i}`}></div>
                        </div>
                    ))}
                </div>

                {/* CENTER COLUMN */}
                <div className="node-center-col">
                    <div className="node-center-block">
                        {centerNode.icon}
                        <div className="node-center-text">{centerNode.title}</div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="node-col">
                    {rightFeatures.map((f, i) => (
                        <div key={i} className={`node-card right-card ${i === 0 ? 'top' : i === 1 ? 'mid' : 'bot'}`}>
                            <div className="node-card-icon">{f.icon}</div>
                            <h3 className="node-card-title">{f.title}</h3>
                            <p className="node-card-desc">{f.desc}</p>
                            
                            {/* CSS Connector Lines attached to the card */}
                            <div className={`node-line right-line line-${i}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
