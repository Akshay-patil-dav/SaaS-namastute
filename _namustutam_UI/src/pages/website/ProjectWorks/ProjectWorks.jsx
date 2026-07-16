import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../../../data/projectsData';
import { Eye, Info, X, ChevronLeft, ChevronRight, ShoppingCart, Briefcase, Cloud, Layers, ArrowRight } from 'lucide-react';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import { SiMongodb, SiTypescript, SiExpress, SiPostgresql } from 'react-icons/si';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import '../ITPortfolio/ITPortfolio.css';
import './ProjectWorks.css';

export default function ProjectWorks() {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Namustutam | Project Works";
    }, []);

    const [activeFilter, setActiveFilter] = useState('All Projects');
    const [currentPage, setCurrentPage] = useState(1);
    const filteredProjects = activeFilter === 'All Projects' 
        ? projectsData 
        : projectsData.filter(p => p.filter === activeFilter);

    const ITEMS_PER_PAGE = 9;
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const displayedProjects = filteredProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
    );

    // Generate array of page numbers
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const filterCategories = ['All Projects', ...new Set(projectsData.map(p => p.filter).filter(Boolean))];

    const navigate = useNavigate();

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
                    {displayedProjects.map((project, i) => (
                        <div key={`project-${i}`} className="pw-project-card animate-fade-in-up" style={{ animationDelay: `${0.2 + (i % 9) * 0.1}s` }} onClick={() => navigate('/project-info/' + project.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''))}>
                            <div className="pw-project-img-wrapper">
                                <span className="pw-project-category-badge">{project.category}</span>
                                <img src={project.img} alt={project.title} className="pw-project-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                                <div className="pw-project-hover-overlay">
                                    <span className="pw-glass-action-btn">
                                        View Case Study <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                            <div className="pw-project-info">
                                <div className="pw-project-header">
                                    <h3 className="pw-project-title">{project.title}</h3>
                                    <div className="pw-project-tech">
                                        <div className="tech-dot"></div>
                                        <div className="tech-dot"></div>
                                        <div className="tech-dot"></div>
                                    </div>
                                </div>
                                <p className="pw-project-desc">{project.author}</p>
                            </div>
                        </div>
                    ))}
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
