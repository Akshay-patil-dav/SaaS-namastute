import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../../../data/projectsData';
import { useLandingPage } from '../../../context/LandingPageContext';
import { Eye, Info, X, ChevronLeft, ChevronRight, ShoppingCart, Briefcase, Cloud, Layers, ArrowRight, Code2 } from 'lucide-react';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import { SiMongodb, SiTypescript, SiExpress, SiPostgresql } from 'react-icons/si';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import '../ITPortfolio/ITPortfolio.css';
import './ProjectWorks.css';

export default function ProjectWorks() {
    const { landingData } = useLandingPage();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Namustutam | Project Works";
    }, []);

    const allProjects = useMemo(() => {
        const adminProjs = (landingData?.projects || []).map(p => ({
            ...p,
            author: p.author || 'Namustutam'
        }));
        const seen = new Set(adminProjs.map(p => (p.title || '').toLowerCase().trim()));
        const staticFiltered = projectsData.filter(p => !seen.has((p.title || '').toLowerCase().trim()));
        return [...adminProjs, ...staticFiltered];
    }, [landingData?.projects]);

    const filterCategories = useMemo(
        () => ['All Projects', ...new Set(allProjects.map(p => p.filter || p.category).filter(Boolean))],
        [allProjects]
    );

    const [activeFilter, setActiveFilter] = useState('All Projects');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'All Projects') return allProjects;
        return allProjects.filter(p => p.filter === activeFilter || p.category === activeFilter);
    }, [allProjects, activeFilter]);

    const ITEMS_PER_PAGE = 9;
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const displayedProjects = filteredProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
    );

    // Generate array of page numbers
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="lp-root project-works-root">
            <WebsiteNavbar />
            
            <section className="project-works-hero relative overflow-hidden">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="pw-hero-video-bg"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-white-abstract-waves-loop-moving-in-the-background-22634-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="pw-hero-overlay"></div>
                
                <div className="project-works-hero-content relative">
                    <div className="lp-section-label animate-fade-in-up" style={{ margin: '0 auto', animationDelay: '0.1s' }}>Our Portfolio</div>
                    <h1 className="project-works-hero-title animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Crafting Digital <br/> <span className="portfolio-gradient-text">Masterpieces</span>
                    </h1>
                    <p className="project-works-hero-sub animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Explore our selected works, innovative custom solutions, and enterprise applications engineered for success by our top-tier development team.
                    </p>
                </div>
            </section>

            <main className="project-works-main">
                {/* Filters */}
                <div className="pw-filters-container animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="project-filters-wrap">
                        {filterCategories.map(f => (
                            <button 
                                key={f}
                                className={`filter-btn-glass ${activeFilter === f ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveFilter(f);
                                    setCurrentPage(1);
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="pw-projects-grid">
                    {displayedProjects.map((project, i) => {
                        const slug = (project.title || 'project').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                        const techList = Array.isArray(project.techStack)
                            ? project.techStack.slice(0, 3).map(t => (typeof t === 'string' ? t : t?.name)).filter(Boolean)
                            : [];

                        return (
                            <div
                                key={project.id || `project-${i}`}
                                className="portfolio-project-card animate-fade-in-up"
                                style={{ animationDelay: `${0.1 + (i % 9) * 0.08}s` }}
                                onClick={() => navigate(`/project-info/${slug}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/project-info/${slug}`); }}
                            >
                                {/* Media Container */}
                                <div className="project-card-media">
                                    {project.img ? (
                                        <img
                                            src={project.img}
                                            alt={project.title}
                                            className="project-card-img"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.add('no-img');
                                            }}
                                        />
                                    ) : (
                                        <div className="project-card-no-img">
                                            <Code2 size={36} color="#ff5b00" />
                                            <span>Interactive Demo</span>
                                        </div>
                                    )}

                                    {/* Top Badges */}
                                    <div className="project-media-badges">
                                        <span className="project-category-pill">
                                            {project.filter || project.category || 'Web App'}
                                        </span>
                                        {project.liveLink && project.liveLink !== '#' && (
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="project-live-btn"
                                                onClick={e => e.stopPropagation()}
                                                title={`Visit live: ${project.title}`}
                                            >
                                                <span className="project-live-dot" />
                                                <span>Live ↗</span>
                                            </a>
                                        )}
                                    </div>

                                    {/* Quick View Hover Mask */}
                                    <div className="project-card-hover-mask">
                                        <span className="project-hover-cta">Explore Details →</span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="project-card-body">
                                    <div className="project-card-top-row">
                                        <h3 className="project-card-title">{project.title}</h3>
                                        {project.price && <span className="project-card-price">{project.price}</span>}
                                    </div>

                                    {project.description && (
                                        <p className="project-card-desc">{project.description}</p>
                                    )}

                                    <div className="project-card-footer">
                                        <div className="project-card-tech-tags">
                                            {techList.map((t, ti) => (
                                                <span key={ti} className="project-card-tech-tag">{t}</span>
                                            ))}
                                        </div>
                                        <div className="project-card-arrow-icon" title="View Project Details">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pw-pagination-wrapper animate-fade-in-up">
                        <div className="project-pagination">
                            <button 
                                className="pagination-btn prev-next" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <div className="pw-page-numbers">
                                {pageNumbers.map(page => (
                                    <button 
                                        key={page} 
                                        className={`pagination-btn page-num ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button 
                                className="pagination-btn prev-next"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Call to Action Section */}
                <section className="pw-cta-section animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="pw-cta-card">
                        <div className="pw-cta-content">
                            <h2>Have a project in mind?</h2>
                            <p>Let's turn your ideas into a digital reality. Our experts are ready to build your next big thing.</p>
                        </div>
                        <button className="pw-cta-btn" onClick={() => navigate('/contact')}>
                            Start a Project <ArrowRight size={18} />
                        </button>
                    </div>
                </section>
            </main>

            <WebsiteFooter />
        </div>
    );
}
