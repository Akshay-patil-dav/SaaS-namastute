import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsData } from '../../../data/projectsData';
import { Eye, Info, X, ChevronLeft, ChevronRight, ShoppingCart, Briefcase, Cloud, Layers } from 'lucide-react';
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

    const ITEMS_PER_PAGE = 8;
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
            
            <section className="project-works-hero">
                <div className="project-works-hero-content">
                    <div className="lp-section-label" style={{ margin: '0 auto' }}>Our Projects</div>
                    <h1 className="project-works-hero-title">
                        Selected <span className="portfolio-gradient-text">Project Works</span>
                    </h1>
                    <p className="project-works-hero-sub">
                        Explore our recent implementations, custom web solutions, and robust enterprise applications built by our talented engineers.
                    </p>
                </div>
            </section>

            <main className="project-works-main" style={{ padding: '0 2% 80px', width: '100%', margin: '0' }}>

                {/* Filters */}
                <div className="project-filters-horizontal">
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

                {/* Projects Grid */}
                <div className="projects-grid">
                    {displayedProjects.map((project, i) => (
                        <div key={`project-${i}`} className="project-card" onClick={() => navigate('/project-info/' + project.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''))}>
                            <div className="project-img-wrapper">
                                <span className="project-category-badge">+ {project.category}</span>
                                <img src={project.img} alt={project.title} className="project-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-img'); }} />
                                <div className="project-hover-overlay">
                                    <span className="glass-action-btn">View Details</span>
                                </div>
                            </div>
                            <div className="project-footer">
                                <div className="project-footer-left">
                                    <div className="project-author-icon">
                                        {project.title.charAt(0)}
                                    </div>
                                    <div className="project-footer-text">
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-author">{project.author}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="project-pagination">
                        <button 
                            className="pagination-btn prev-next" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        {pageNumbers.map(page => (
                            <button 
                                key={page} 
                                className={`pagination-btn page-num ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button 
                            className="pagination-btn prev-next"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </main>

            <WebsiteFooter />
        </div>
    );
}
