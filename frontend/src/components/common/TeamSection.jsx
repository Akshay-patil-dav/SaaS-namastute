import React from 'react';
import './TeamSection.css';

const teamMembers = [
    {
        name: 'Arjun Patil',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        description: 'Visionary leader with 10+ years of experience in SaaS and enterprise solutions.'
    },
    {
        name: 'Sarah Chen',
        role: 'Head of Design',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        description: 'Award-winning UI/UX designer focused on creating intuitive and beautiful digital experiences.'
    },
    {
        name: 'David Miller',
        role: 'Technical Lead',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        description: 'Full-stack expert specializing in scalable cloud architectures and multi-tenant systems.'
    },
    {
        name: 'Elena Rodriguez',
        role: 'E-commerce Specialist',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
        description: 'Dedicated to building high-converting Shopify and custom e-commerce platforms.'
    }
];

const TeamSection = () => {
    return (
        <section className="team-section" id="team">
            <div className="team-container">
                <div className="team-header">
                    <div className="team-badge">OUR EXPERTS</div>
                    <h2 className="team-title">The Brilliant Minds Behind <span className="gradient-text">Namastute</span></h2>
                    <p className="team-subtitle">
                        Meet our dedicated team of designers, developers, and strategists working together to build your digital future.
                    </p>
                </div>

                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="team-image-wrapper">
                                <img src={member.image} alt={member.name} className="team-image" />
                                <div className="team-socials">
                                    <span className="social-icon">𝕏</span>
                                    <span className="social-icon">in</span>
                                    <span className="social-icon">🌐</span>
                                </div>
                            </div>
                            <div className="team-info">
                                <h3 className="member-name">{member.name}</h3>
                                <div className="member-role">{member.role}</div>
                                <p className="member-desc">{member.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
