import React, { useState, useEffect } from 'react';
import './TeamSection.css';

const teamMembers = [
    { name: 'Wade Warren', role: 'Medical Assistant', image: '/team/wade.png' },
    { name: 'Masirul Islam', role: 'Manager Assistant', image: '/team/masirul.png' },
    { name: 'Jenny Wilson', role: 'Web Designer', image: '/team/jenny.png' },
    { name: 'Floyd Miles', role: 'Head Assistant', image: '/team/floyd.png' },
    { name: 'Cody Fisher', role: 'UI Designer', image: '/team/cody.png' },
    { name: 'Arlene McCoy', role: 'Developer', image: '/team/arlene.png' },
    { name: 'Robert Fox', role: 'Marketing Specialist', image: '/team/robert.png' },
    { name: 'Esther Howard', role: 'Support Lead', image: '/team/esther.png' },
];

const TeamSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const displayCount = 4;

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setIsFlipping(true);
            setTimeout(() => {
                setActiveIndex((prev) => (prev + displayCount) % teamMembers.length);
                setIsFlipping(false);
            }, 600); 
        }, 5000);

        return () => clearInterval(interval);
    }, [activeIndex, isPaused]);

    const visibleMembers = teamMembers.slice(activeIndex, activeIndex + displayCount);
    if (visibleMembers.length < displayCount) {
        visibleMembers.push(...teamMembers.slice(0, displayCount - visibleMembers.length));
    }

    return (
        <section className="team-section" id="team">
            <div className="team-container">
                <div className="team-header">
                    <div className="team-badge-wrapper">
                        <span className="arrow">←</span>
                        <span className="team-badge-text">OUR EXPERT</span>
                        <span className="arrow">→</span>
                    </div>
                    <h2 className="team-title">See Our Skilled Expert Team</h2>
                </div>

                <div 
                    className="team-flip-grid"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {visibleMembers.map((member, index) => (
                        <div key={`${activeIndex}-${index}`} className={`team-flip-wrapper ${isFlipping ? 'flipping' : ''}`}>
                            <div className="team-card">
                                <div className="card-decoration"></div>
                                <div className="team-image-container">
                                    <img src={member.image} alt={member.name} className="team-image" />
                                </div>
                                <div className="team-info-label">
                                    <h3 className="member-name">{member.name}</h3>
                                    <div className="member-role">{member.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
