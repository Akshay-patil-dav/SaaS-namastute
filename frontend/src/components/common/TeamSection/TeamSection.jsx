import React, { useState, useEffect } from 'react';
import './TeamSection.css';

const teamMembers = [
    { name: 'Floyd Miles', role: 'Head Assistant', image: '/team/wade.png' },
    { name: 'Cody Fisher', role: 'UI Designer', image: '/team/wade.png' },
    { name: 'Arlene McCoy', role: 'Developer', image: '/team/wade.png' },
    { name: 'Robert Fox', role: 'Marketing Specialist', image: '/team/wade.png' },
];

import { Facebook, Twitter, Linkedin, Instagram, MoveLeft, MoveRight } from 'lucide-react';

const TeamCard = ({ member }) => (
    <div className="team-card">
        <div className="team-card-inner">
            <div className="team-card-front">
                <div className="card-decoration"></div>
                <div className="team-image-container">
                    <img src={member.image} alt={member.name} className="team-image" />
                </div>
                <div className="team-info-label">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-role">{member.role}</div>
                </div>
            </div>
            <div className="team-card-back">
                <div className="card-decoration"></div>
                <div className="team-info-back">
                    <h3 className="member-name-back">{member.name}</h3>
                    <div className="member-role-back">{member.role}</div>
                    <p className="member-bio">Passionate professional dedicated to delivering excellence and driving innovation.</p>
                    <div className="social-links">
                        <a href="#" className="social-icon"><Facebook size={18} /></a>
                        <a href="#" className="social-icon"><Twitter size={18} /></a>
                        <a href="#" className="social-icon"><Linkedin size={18} /></a>
                        <a href="#" className="social-icon"><Instagram size={18} /></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TeamSection = () => {
    const [isAutoSlide, setIsAutoSlide] = useState(teamMembers.length > 4);

    useEffect(() => {
        const handleResize = () => {
            setIsAutoSlide(teamMembers.length > 4 || window.innerWidth <= 1200);
        };
        
        handleResize(); // Initial check
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section className="team-section" id="team">
            <div className="team-container">
                <div className="team-header">
                    <div className="team-badge-wrapper">
                        <MoveLeft className="badge-icon badge-icon-left" size={16} />
                        <span className="team-badge-text">OUR EXPERT</span>
                        <MoveRight className="badge-icon badge-icon-right" size={16} />
                    </div>
                    <h2 className="team-title">See Our Skilled Expert Team</h2>
                </div>

                <div className={`team-slider-container ${isAutoSlide ? 'is-sliding' : ''}`}>
                    {isAutoSlide ? (
                        <div className="team-slider-marquee">
                            <div className="team-track">
                                {teamMembers.map((member, index) => (
                                    <div key={`first-${index}`} className="team-flip-wrapper">
                                        <TeamCard member={member} />
                                    </div>
                                ))}
                            </div>
                            <div className="team-track" aria-hidden="true">
                                {teamMembers.map((member, index) => (
                                    <div key={`second-${index}`} className="team-flip-wrapper">
                                        <TeamCard member={member} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="team-static-grid">
                            {teamMembers.map((member, index) => (
                                <div key={`static-${index}`} className="team-flip-wrapper">
                                    <TeamCard member={member} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
