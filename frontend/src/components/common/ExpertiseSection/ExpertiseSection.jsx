import React, { useEffect, useRef, useState } from 'react';
import { 
    Search,
    PenTool,
    Code2,
    ShieldCheck,
    CloudUpload,
    Activity
} from 'lucide-react';
import './ExpertiseSection.css';

export default function ExpertiseSection() {
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        // Handle scroll progress for the central line drawing
        const handleScroll = () => {
            if (!timelineRef.current) return;
            
            const rect = timelineRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate how far the timeline is from the center of the viewport
            // Start drawing when the top of the timeline is midway down the screen
            const startPoint = windowHeight * 0.75;
            
            if (rect.top <= startPoint) {
                // The total scrollable distance is the height of the timeline container
                const scrolled = startPoint - rect.top;
                const totalHeight = rect.height;
                const progress = Math.min(Math.max(scrolled / totalHeight, 0), 1);
                setScrollProgress(progress);
            } else {
                setScrollProgress(0);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        handleScroll();

        // Intersection Observer for the nodes to fade in & pop
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Specific logic for timeline nodes
                    if (entry.target.classList.contains('timeline-node')) {
                        entry.target.classList.add('active');
                    }
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: "0px 0px -10% 0px"
        });

        const elements = document.querySelectorAll('.journey-reveal, .timeline-node');
        elements.forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            elements.forEach(el => observer.unobserve(el));
            observer.disconnect();
        };
    }, []);

    const sdlcStages = [
        { icon: <Search size={28} />, title: "Discovery", desc: "Requirements & scope definition." },
        { icon: <PenTool size={28} />, title: "Design", desc: "UX/UI and architecture planning." },
        { icon: <Code2 size={28} />, title: "Development", desc: "Agile engineering sprints." },
        { icon: <ShieldCheck size={28} />, title: "Testing", desc: "QA and security audits." },
        { icon: <CloudUpload size={28} />, title: "Deployment", desc: "CI/CD and cloud launch." },
        { icon: <Activity size={28} />, title: "Maintenance", desc: "24/7 monitoring and scaling." },
    ];



    return (
        <section className="journey-section" id="expertise" ref={sectionRef}>
            <div className="journey-container">
                
                {/* ── HEADER ── */}
                {/* <div className="journey-header journey-reveal">
                    <div className="portfolio-section-label">
                        <span className="journey-badge-dot"></span>
                        Methodology & Architecture
                    </div>
                    <h2 className="portfolio-section-title">
                        Engineered for <span className="portfolio-gradient-text">Scale</span>
                    </h2>
                    <p className="portfolio-section-subtitle">
                        Our battle-tested software development lifecycle and modern tech stack ensure your enterprise applications are secure, performant, and future-proof.
                    </p>
                </div> */}

                {/* ── THE JOURNEY (SDLC) ── */}
                <div className="journey-timeline-wrapper">
                    <div className="journey-timeline-header journey-reveal">
                        <h3>The Development Journey</h3>
                        <p>A proven, agile approach to delivering reliable software.</p>
                    </div>

                    <div 
                        className="timeline-container" 
                        ref={timelineRef}
                        style={{ '--scroll-progress': scrollProgress }}
                    >
                        {/* The animated central line */}
                        <div className="timeline-center-line">
                            <div className="timeline-progress-line"></div>
                        </div>

                        {sdlcStages.map((stage, index) => {
                            const isLeft = index % 2 === 0;
                            return (
                                <div 
                                    key={index} 
                                    className={`timeline-node ${isLeft ? 'node-left' : 'node-right'}`}
                                >
                                    <div className="timeline-content">
                                        <div className="timeline-step-number">0{index + 1}</div>
                                        <h4>{stage.title}</h4>
                                        <p>{stage.desc}</p>
                                    </div>
                                    <div className="timeline-icon-container">
                                        <div className="timeline-icon-glow"></div>
                                        <div className="timeline-icon">
                                            {stage.icon}
                                        </div>
                                    </div>
                                    <div className="timeline-connector"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>


            </div>
        </section>
    );
}
