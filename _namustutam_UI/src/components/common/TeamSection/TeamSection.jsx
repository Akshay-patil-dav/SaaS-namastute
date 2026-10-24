import React, { useState, useEffect } from 'react';
import './TeamSection.css';
import { Facebook, Twitter, Linkedin, Instagram, Github, MoveLeft, MoveRight } from 'lucide-react';
import { useLandingPage } from '../../../context/LandingPageContext';

const DEFAULT_MEMBERS = [
    { name: 'Akshay Patil', role: 'Vibe Coder / AI Engineer', image: '/team/Akshay.png', badge: 'Freelancer', bio: 'Passionate professional dedicated to delivering excellence and driving innovation.' }
];

const TeamCard = ({ member }) => (
    <div className="team-card">
        <div className="team-card-inner">
            <div className="team-card-front">
                <div className="card-decoration"></div>
                <div className="team-image-container">
                    <img 
                        src={member.image || '/team/Akshay.png'} 
                        alt={member.name} 
                        className="team-image"
                        onError={(e) => { e.target.src = '/team/Akshay.png'; }}
                    />
                </div>
                <div className="team-info-label">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-role">{member.role}</div>
                    <div className="member-role-back">{member.badge || 'Freelancer'}</div>
                </div>
            </div>
            <div className="team-card-back">
                <div className="card-decoration"></div>
                <div className="team-info-back">
                    <h3 className="member-name-back">{member.name}</h3>
                    <div className="member-role-back">{member.role}</div>
                    <div className="member-role-back">{member.badge || 'Freelancer'}</div>
                    <p className="member-bio">
                        {member.bio || 'Passionate professional dedicated to delivering excellence and driving innovation.'}
                    </p>
                    <div className="social-links">
                        {member.socials?.linkedin && (
                            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Linkedin size={18} />
                            </a>
                        )}
                        {member.socials?.github && (
                            <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Github size={18} />
                            </a>
                        )}
                        {member.socials?.twitter && (
                            <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Twitter size={18} />
                            </a>
                        )}
                        {member.socials?.instagram && (
                            <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Instagram size={18} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TeamSection = () => {
    const { landingData } = useLandingPage();
    const teamMembers = (landingData?.team && landingData.team.length > 0)
        ? landingData.team
        : DEFAULT_MEMBERS;

    const [isAutoSlide, setIsAutoSlide] = useState(teamMembers.length > 4);

    useEffect(() => {
        const handleResize = () => {
            setIsAutoSlide(teamMembers.length > 4 || window.innerWidth <= 1200);
        };

        handleResize(); // Initial check

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [teamMembers]);

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
                                    <div key={`first-${member.id || index}`} className="team-flip-wrapper">
                                        <TeamCard member={member} />
                                    </div>
                                ))}
                            </div>
                            <div className="team-track" aria-hidden="true">
                                {teamMembers.map((member, index) => (
                                    <div key={`second-${member.id || index}`} className="team-flip-wrapper">
                                        <TeamCard member={member} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="team-static-grid">
                            {teamMembers.map((member, index) => (
                                <div key={`static-${member.id || index}`} className="team-flip-wrapper">
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
